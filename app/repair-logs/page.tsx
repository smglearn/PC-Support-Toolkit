import Link from 'next/link';

export default function RepairLogsPage() {
  const sampleLogs = [
    { id: "LOG-101", date: "2026-09-18", device: "Dell XPS 15", issue: "Thermal throttling & high fan noise", status: "Resolved", notes: "Repasted heatsink, cleaned intake vents. Idle temp dropped to 42°C." },
    { id: "LOG-102", date: "2026-09-19", device: "MacBook Air M2", issue: "Kernel panic during heavy compile", status: "In Progress", notes: "Collecting crash reports via Console. Running hardware diagnostics." },
  ];

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-xs text-neutral-400 hover:text-white mb-6 inline-block">
          ← Back to Dashboard
        </Link>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Repair Logs</h1>
            <p className="text-neutral-400 text-sm mt-1">Client machine triage records and maintenance history.</p>
          </div>
          <span className="text-xs font-mono bg-neutral-800 text-neutral-300 px-3 py-1 rounded">
            {sampleLogs.length} Active Records
          </span>
        </div>

        <div className="space-y-4">
          {sampleLogs.map((log) => (
            <div key={log.id} className="p-5 rounded-lg border border-neutral-800 bg-neutral-900/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-emerald-400">{log.id}</span>
                <span className="text-xs text-neutral-500">{log.date}</span>
              </div>
              <h2 className="text-base font-semibold text-neutral-200">{log.device}</h2>
              <p className="text-sm text-neutral-300 mt-1"><span className="text-neutral-500">Issue:</span> {log.issue}</p>
              <p className="text-xs text-neutral-400 mt-2 bg-black/40 p-2.5 rounded border border-neutral-800/80">
                <span className="text-neutral-500">Action:</span> {log.notes}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
