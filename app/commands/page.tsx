import Link from 'next/link';

export default function CommandsPage() {
  const commandCategories = [
    {
      category: "Network & DNS",
      commands: [
        { label: "Flush DNS Cache (macOS)", cmd: "sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder" },
        { label: "Active TCP Connections", cmd: "netstat -an | grep ESTABLISHED" },
      ],
    },
    {
      category: "System Triage",
      commands: [
        { label: "Top CPU Processes", cmd: "top -o cpu" },
        { label: "Check System Uptime", cmd: "uptime" },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-xs text-neutral-400 hover:text-white mb-6 inline-block">
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold tracking-tight mb-2">Command Library</h1>
        <p className="text-neutral-400 text-sm mb-6">Frequently used CLI triage, repair, and configuration snippets.</p>

        <div className="space-y-6">
          {commandCategories.map((group) => (
            <div key={group.category} className="p-5 rounded-lg border border-neutral-800 bg-neutral-900/50">
              <h2 className="text-base font-semibold text-neutral-200 mb-3">{group.category}</h2>
              <div className="space-y-3">
                {group.commands.map((item) => (
                  <div key={item.label} className="flex flex-col gap-1.5">
                    <span className="text-xs text-neutral-400">{item.label}</span>
                    <code className="text-xs font-mono bg-black/60 px-3 py-1.5 rounded text-sky-400 block overflow-x-auto border border-neutral-800">
                      {item.cmd}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
