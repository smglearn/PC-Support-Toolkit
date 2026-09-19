import Link from 'next/link';

export default function DiagnosticsPage() {
  const diagnosticChecks = [
    { title: "Network Connectivity", command: "ping 1.1.1.1 -c 4", desc: "Verifies gateway and DNS reachability." },
    { title: "Disk Health & Space", command: "df -h", desc: "Checks available storage across mounted drives." },
    { title: "Memory Utilization", command: "vm_stat", desc: "Inspects active, wired, and free memory blocks." },
  ];

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-xs text-neutral-400 hover:text-white mb-6 inline-block">
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold tracking-tight mb-2">Diagnostics Engine</h1>
        <p className="text-neutral-400 text-sm mb-6">Quick-run diagnostic workflows for triage and inspection.</p>

        <div className="space-y-4">
          {diagnosticChecks.map((check) => (
            <div key={check.title} className="p-4 rounded-lg border border-neutral-800 bg-neutral-900/50">
              <h2 className="text-base font-semibold">{check.title}</h2>
              <p className="text-xs text-neutral-400 mt-1 mb-2">{check.desc}</p>
              <code className="text-xs font-mono bg-black/60 px-2.5 py-1 rounded text-emerald-400 block w-fit">
                {check.command}
              </code>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
