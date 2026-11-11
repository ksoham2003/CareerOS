import Link from "next/link";
import { connection } from "next/server";
import { ArrowLeft, Download } from "lucide-react";
import { notFound, redirect } from "next/navigation";

const platforms = {
  windows: {
    title: "Windows",
    environmentVariable: "WINDOWS_DESKTOP_DOWNLOAD_URL",
    artifact: "CareerOS-win-x64.exe",
  },
  macos: {
    title: "macOS",
    environmentVariable: "MACOS_DESKTOP_DOWNLOAD_URL",
    artifact: "CareerOS-mac-universal.dmg",
  },
  linux: {
    title: "Linux",
    environmentVariable: "LINUX_DESKTOP_DOWNLOAD_URL",
    artifact: "CareerOS-linux-x64.AppImage",
  },
} as const;

export default async function DesktopDownloadPage({ params }: { params: Promise<{ platform: string }> }) {
  await connection();
  const { platform } = await params;
  if (!Object.prototype.hasOwnProperty.call(platforms, platform)) notFound();
  const download = platforms[platform as keyof typeof platforms];
  const configuredUrl = process.env[download.environmentVariable];
  let releaseUrl: string | null = null;

  if (configuredUrl) {
    try {
      const parsedUrl = new URL(configuredUrl);
      if (
        parsedUrl.protocol === "https:"
        && parsedUrl.hostname === "github.com"
        && !parsedUrl.username
        && !parsedUrl.password
        && parsedUrl.pathname.endsWith(download.artifact)
      ) {
        releaseUrl = parsedUrl.toString();
      }
    } catch {
      // Show the unavailable state for an invalid release URL.
    }
  }
  if (releaseUrl) redirect(releaseUrl);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#090b0b] px-4 text-[#e7e9e8]">
      <section className="w-full max-w-lg rounded-xl border border-white/[0.08] bg-[#0d1010] p-6 sm:p-8">
        <Download size={20} className="text-[#8ad6aa]" />
        <h1 className="mt-4 text-xl font-semibold text-[#edf0ee]">CareerOS for {download.title}</h1>
        <p className="mt-2 text-sm leading-6 text-[#98a29d]">The installer will be available here after the desktop app is built and published.</p>
        <Link href="/" className="mt-6 inline-flex items-center gap-2 text-xs text-[#9bd9b7] hover:text-white"><ArrowLeft size={14} />Back to CareerOS</Link>
      </section>
    </main>
  );
}