'use client';

import { useState } from 'react';
import Link from 'next/link';

interface CommandItem {
  label: string;
  cmd: string;
}

interface CommandCategory {
  category: string;
  commands: CommandItem[];
}

const commandCategories: CommandCategory[] = [
  {
    category: "Network & DNS",
    commands: [
      { label: "Flush DNS Cache (macOS)", cmd: "sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder" },
      { label: "Active TCP Connections", cmd: "netstat -an | grep ESTABLISHED" },
      { label: "Trace Route to Host", cmd: "traceroute 1.1.1.1" },
    ],
  },
  {
    category: "System Triage",
    commands: [
      { label: "Top CPU Processes", cmd: "top -o cpu" },
      { label: "Check System Uptime", cmd: "uptime" },
      { label: "List Open Network Ports", cmd: "lsof -i -P -n | grep LISTEN" },
    ],
  },
  {
    category: "Storage & Disk",
    commands: [
      { label: "Disk Usage by Mount", cmd: "df -h" },
      { label: "Top 10 Largest Folders in Directory", cmd: "du -sh * | sort -hr | head -n 10" },
    ],
  },
];

export default function CommandsPage() {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const copyToClipboard = async (cmd: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(cmd);
      } else {
        throw new Error('Clipboard API unavailable');
      }
    } catch {
      // Fallback for Safari / Private Browsing / restricted permissions
      const textArea = document.createElement('textarea');
      textArea.value = cmd;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
      } catch (fallbackErr) {
        console.error('Fallback copy failed', fallbackErr);
      }
      textArea.remove();
    }

    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const filteredCategories = commandCategories
    .map((group) => ({
      ...group,
      commands: group.commands.filter(
        (item) =>
          item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.cmd.toLowerCase().includes(searchQuery.toLowerCase()) ||
          group.category.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((group) => group.commands.length > 0);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-xs text-neutral-400 hover:text-white mb-6 inline-block">
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold tracking-tight mb-2">Command Library</h1>
        <p className="text-neutral-400 text-sm mb-6">
          Search and copy essential IT triage commands.
        </p>

        {/* Live Search Input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search commands, labels, or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-900/70 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition"
          />
        </div>

        {/* Command Groups */}
        <div className="space-y-6">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((group) => (
              <div key={group.category} className="p-5 rounded-lg border border-neutral-800 bg-neutral-900/50">
                <h2 className="text-base font-semibold text-neutral-200 mb-3">{group.category}</h2>
                <div className="space-y-3">
                  {group.commands.map((item) => (
                    <div key={item.label} className="flex flex-col gap-1.5">
                      <span className="text-xs text-neutral-400">{item.label}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(item.cmd)}
                        className="text-left text-xs font-mono bg-black/60 hover:bg-neutral-900 border border-neutral-800 px-3 py-2 rounded text-sky-400 flex items-center justify-between transition group"
                      >
                        <span className="overflow-x-auto">{item.cmd}</span>
                        <span className="text-[10px] uppercase font-sans tracking-wider text-neutral-500 group-hover:text-neutral-300 ml-3 shrink-0">
                          {copiedCmd === item.cmd ? '✓ Copied' : 'Copy'}
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center border border-dashed border-neutral-800 rounded-lg">
              <p className="text-sm text-neutral-400">No commands match &ldquo;{searchQuery}&rdquo;</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
