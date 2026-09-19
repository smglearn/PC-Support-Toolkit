import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-8">
      <header className="max-w-5xl mx-auto border-b border-neutral-800 pb-6 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">PC Support Toolkit</h1>
        <p className="text-neutral-400 mt-2">
          Diagnostic utilities, quick reference scripts, and system repair guides.
        </p>
      </header>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/diagnostics" className="p-6 rounded-lg border border-neutral-800 bg-neutral-900/50 hover:border-neutral-700 transition">
          <h2 className="text-xl font-semibold mb-2">Diagnostics →</h2>
          <p className="text-sm text-neutral-400">System checks and troubleshooting workflows.</p>
        </Link>

        <div className="p-6 rounded-lg border border-neutral-800 bg-neutral-900/50">
          <h2 className="text-xl font-semibold mb-2">Command Library</h2>
          <p className="text-sm text-neutral-400">PowerShell, CMD, and Terminal cheat sheets.</p>
        </div>

        <div className="p-6 rounded-lg border border-neutral-800 bg-neutral-900/50">
          <h2 className="text-xl font-semibold mb-2">Repair Logs</h2>
          <p className="text-sm text-neutral-400">Track and log client machine maintenance.</p>
        </div>
      </div>
    </main>
  );
}
