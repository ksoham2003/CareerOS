"use server";

import { hash, verify } from "argon2";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession, deleteCurrentSession, requireUser } from "@/lib/auth";
import { allowLoginAttempt } from "@/lib/login-rate-limit";
import { prisma } from "@/lib/prisma";

const credentialsSchema = z.object({ email: z.string().email().max(254), password: z.string().min(1).max(1024) });
const optionalStudyText = z.string().trim().max(40).transform((value) => value || null);
const profileSchema = z.object({
  fullName: z.string().trim().max(100).optional(),
  education: z.string().trim().min(1).max(160),
  currentEmployer: z.string().trim().min(1).max(120),
  experienceMonths: z.coerce.number().int().min(0).max(600),
  previousExperience: z.string().trim().max(500),
  skills: z.string().max(1000),
  aiExperience: z.string().trim().max(500),
  primaryLanguage: optionalStudyText,
  secondaryLanguage: optionalStudyText,
  aiLanguage: optionalStudyText,
  dsaLevel: optionalStudyText,
  dailyMinutes: z.preprocess(
    (value) => value === "" || value === undefined ? null : value,
    z.coerce.number().int().min(0).max(720).nullable(),
  ),
  journeyStart: z.preprocess(
    (value) => value === "" || value === undefined ? null : value,
    z.string().date().transform((value) => new Date(`${value}T00:00:00.000Z`)).nullable(),
  ),
  careerObjective: z.string().trim().min(1).max(160),
  targetSalaryLpa: z.coerce.number().int().min(1).max(10000),
  targetCompanies: z.string().trim().max(500),
});
const studySessionSchema = z.object({
  title: z.string().trim().min(3).max(120),
  category: z.string().trim().min(1).max(40),
  durationMinutes: z.coerce.number().int().min(5).max(720),
  notes: z.string().trim().max(1000).optional(),
  studyPlanItemId: z.string().max(40).transform((value) => value || null),
});
const studyPlanItemSchema = z.object({
  title: z.string().trim().min(1).max(120),
  category: z.string().trim().min(1).max(80),
  plannedMinutes: z.coerce.number().int().min(1).max(720),
});

function safeRedirect(value: FormDataEntryValue | null) {
  const path = typeof value === "string" ? value : "/dashboard";
  return path.startsWith("/dashboard") && !path.startsWith("//") ? path : "/dashboard";
}

export async function loginAction(formData: FormData) {
  const parsed = credentialsSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) redirect("/login?error=credentials");

  const headerStore = await headers();
  // Trust these gateway-provided headers only when deployment ingress overwrites them.
  const address = headerStore.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
    ?? headerStore.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? "unknown";
  if (!(await allowLoginAttempt(address))) redirect("/login?error=throttled");

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (!user || !(await verify(user.passwordHash, parsed.data.password))) redirect("/login?error=credentials");
  await createSession(user.id);
  redirect(safeRedirect(formData.get("next")));
}

export async function logoutAction() {
  await deleteCurrentSession();
  redirect("/login");
}

export async function changePasswordAction(formData: FormData) {
  const user = await requireUser();
  const parsed = z.object({ currentPassword: z.string().min(1).max(1024), newPassword: z.string().min(12).max(1024), confirmation: z.string().min(12).max(1024) })
    .safeParse({ currentPassword: formData.get("currentPassword"), newPassword: formData.get("newPassword"), confirmation: formData.get("confirmation") });
  if (!parsed.success || parsed.data.newPassword !== parsed.data.confirmation) redirect("/dashboard/settings?passwordError=invalid");

  const account = await prisma.user.findUnique({ where: { id: user.id }, select: { passwordHash: true } });
  if (!account || !(await verify(account.passwordHash, parsed.data.currentPassword))) redirect("/dashboard/settings?passwordError=current");
  const passwordHash = await hash(parsed.data.newPassword, { type: 2, memoryCost: 65536, timeCost: 3, parallelism: 1 });
  await prisma.$transaction([
    prisma.user.update({ where: { id: user.id }, data: { passwordHash } }),
    prisma.session.deleteMany({ where: { userId: user.id } }),
  ]);
  await createSession(user.id);
  redirect("/dashboard/settings?passwordChanged=1");
}

export async function updateProfileAction(formData: FormData) {
  const user = await requireUser();
  const parsed = profileSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) redirect("/dashboard/profile?error=invalid");

  const data = parsed.data;
  await prisma.userProfile.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      ...data,
      skills: data.skills.split(",").map((skill) => skill.trim()).filter(Boolean).slice(0, 40),
    },
    update: {
      ...data,
      skills: data.skills.split(",").map((skill) => skill.trim()).filter(Boolean).slice(0, 40),
    },
  });
  redirect("/dashboard/profile?saved=1");
}

export async function logStudySessionAction(formData: FormData) {
  const user = await requireUser();
  const parsed = studySessionSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    durationMinutes: formData.get("durationMinutes"),
    notes: formData.get("notes"),
    studyPlanItemId: formData.get("studyPlanItemId") ?? "",
  });
  if (!parsed.success) redirect("/dashboard/planner?error=invalid");

  if (parsed.data.studyPlanItemId) {
    const planItem = await prisma.studyPlanItem.findFirst({
      where: { id: parsed.data.studyPlanItemId, userId: user.id },
      select: { id: true },
    });
    if (!planItem) redirect("/dashboard/planner?error=invalid");
  }

  await prisma.studySession.create({
    data: {
      userId: user.id,
      ...parsed.data,
      studyPlanItemId: parsed.data.studyPlanItemId,
      notes: parsed.data.notes || null,
    },
  });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/planner");
  revalidatePath("/dashboard/productivity");
  redirect("/dashboard/planner?saved=1");
}

export async function createStudyPlanItemAction(formData: FormData) {
  const user = await requireUser();
  const parsed = studyPlanItemSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) redirect("/dashboard/planner?error=plan");

  const lastItem = await prisma.studyPlanItem.findFirst({
    where: { userId: user.id },
    orderBy: { position: "desc" },
    select: { position: true },
  });
  await prisma.studyPlanItem.create({
    data: { userId: user.id, ...parsed.data, position: (lastItem?.position ?? -1) + 1 },
  });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/planner");
  revalidatePath("/dashboard/learning");
  redirect("/dashboard/planner?saved=plan");
}

export async function deleteStudyPlanItemAction(formData: FormData) {
  const user = await requireUser();
  const itemId = z.string().min(1).max(40).safeParse(formData.get("itemId"));
  if (!itemId.success) redirect("/dashboard/planner?error=plan");

  await prisma.studyPlanItem.deleteMany({ where: { id: itemId.data, userId: user.id } });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/planner");
  revalidatePath("/dashboard/learning");
  redirect("/dashboard/planner?saved=deleted");
}
