'use client';

import { useState } from 'react';
import Link from 'next/link';

type CheckStatus = 'Not started' | 'Passed' | 'Needs attention';

const diagnosticChecks = [
  {
    id: 'network',
    title: 'Network Connectivity',
    command: 'ping 1.1.1.1 -c 4',
    description: 'Tests whether the computer can reach an external IP address.',
  },
  {
    id: 'storage',
    title: 'Disk Space',
    command: 'df -h',
    description: 'Displays available and used storage for mounted drives.',
  },
  {
    id: 'memory',
    title: 'Memory Utilization',
    command: 'vm_stat',
    description: 'Displays macOS virtual-memory statistics.',
  },
];

export default function DiagnosticsPage() {
  const [statuses, setStatuses] = useState<Record<string, CheckStatus>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function copyCommand(id: string, command: string) {
    await navigator.clipboard.writeText(command);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId(null), 2000);
  }

  function updateStatus(id: string, status: CheckStatus) {
    setStatuses((current) => ({
      ...current,
      [id]: status, // Uses computed property key
    }));
  }

  return (
    <main className="min-h-screen bg-neutral-950 p-8 text-neutral-100">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="mb-6 inline-block text-xs text-neutral-400 hover:text-white"
        >
          ← Back to Dashboard
        </Link>

        <h1 className="mb-2 text-2xl font-bold tracking-tight">
          Diagnostics Engine
        </h1>

        <p className="mb-6 text-sm text-neutral-400">
          Run each command manually, review the output, and record the result.
        </p>

        <div className="space-y-4">
          {diagnosticChecks.map((check) => {
            const status = statuses[check.id] ?? 'Not started';

            const statusColors: Record<CheckStatus, string> = {
              'Not started': 'text-neutral-500',
              Passed: 'text-emerald-400',
              'Needs attention': 'text-amber-400',
            };

            return (
              <section
                key={check.id}
                className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-5"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row">
                  <div>
                    <h2 className="font-semibold">{check.title}</h2>
                    <p className="mt-1 text-xs text-neutral-400">
                      {check.description}
                    </p>
                  </div>

                  <span className={`text-xs font-medium ${statusColors[status]}`}>
                    {status}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => copyCommand(check.id, check.command)}
                  className="mt-4 flex w-full items-center justify-between rounded border border-neutral-800 bg-black/60 px-3 py-2 text-left font-mono text-xs text-emerald-400 hover:bg-neutral-900"
                >
                  <span>{check.command}</span>
                  <span className="ml-3 shrink-0 font-sans text-neutral-400">
                    {copiedId === check.id ? '✓ Copied' : 'Copy'}
                  </span>
                </button>

                <div className="mt-4 flex flex-wrap gap-2">
                  {(['Passed', 'Needs attention'] as CheckStatus[]).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => updateStatus(check.id, option)}
                      className="rounded border border-neutral-700 px-3 py-1.5 text-xs text-neutral-300 hover:border-neutral-500 hover:text-white"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
