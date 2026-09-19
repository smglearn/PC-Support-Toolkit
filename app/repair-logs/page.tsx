'use client';

import { useState, useSyncExternalStore, FormEvent } from 'react';
import Link from 'next/link';

interface RepairRecord {
  id: string;
  date: string;
  device: string;
  issue: string;
  status: 'In Progress' | 'Resolved' | 'Waiting on Parts';
  notes: string;
}

const defaultLogs: RepairRecord[] = [
  {
    id: "LOG-101",
    date: "2026-09-18",
    device: "Dell XPS 15",
    issue: "Thermal throttling & high fan noise",
    status: "Resolved",
    notes: "Repasted heatsink, cleaned intake vents. Idle temp dropped to 42°C."
  },
  {
    id: "LOG-102",
    date: "2026-09-19",
    device: "MacBook Air M2",
    issue: "Kernel panic during heavy compile",
    status: "In Progress",
    notes: "Collecting crash reports via Console. Running hardware diagnostics."
  },
];

// External Store subscription for localStorage
let memoryLogs: RepairRecord[] | null = null;
const listeners = new Set<() => void>();

function getLogsSnapshot(): RepairRecord[] {
  if (memoryLogs) return memoryLogs;
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('pc_repair_logs');
    if (saved) {
      try {
        memoryLogs = JSON.parse(saved);
        return memoryLogs!;
      } catch {
        // Fallback to default logs if JSON is corrupted
      }
    }
  }
  memoryLogs = defaultLogs;
  return memoryLogs;
}

function subscribeLogs(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function saveLogs(newLogs: RepairRecord[]) {
  memoryLogs = newLogs;
  if (typeof window !== 'undefined') {
    localStorage.setItem('pc_repair_logs', JSON.stringify(newLogs));
  }
  listeners.forEach((listener) => listener());
}

// Hydration-safe client check
const emptySubscribe = () => () => { };
function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function RepairLogsPage() {
  const isMounted = useIsMounted();
  const logs = useSyncExternalStore(subscribeLogs, getLogsSnapshot, () => defaultLogs);

  // Form input state
  const [device, setDevice] = useState('');
  const [issue, setIssue] = useState('');
  const [status, setStatus] = useState<RepairRecord['status']>('In Progress');
  const [notes, setNotes] = useState('');

  const handleAddRecord = (e: FormEvent) => {
    e.preventDefault();
    if (!device.trim() || !issue.trim()) return;

    const newRecord: RepairRecord = {
      id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0],
      device,
      issue,
      status,
      notes: notes.trim() || 'No additional notes provided.',
    };

    saveLogs([newRecord, ...logs]);
    setDevice('');
    setIssue('');
    setNotes('');
    setStatus('In Progress');
  };

  const handleDeleteRecord = (id: string) => {
    saveLogs(logs.filter((log) => log.id !== id));
  };

  const statusColors: Record<RepairRecord['status'], string> = {
    'Resolved': 'text-emerald-400 border-emerald-900/50 bg-emerald-950/40',
    'In Progress': 'text-amber-400 border-amber-900/50 bg-amber-950/40',
    'Waiting on Parts': 'text-rose-400 border-rose-900/50 bg-rose-950/40',
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-xs text-neutral-400 hover:text-white mb-6 inline-block">
          ← Back to Dashboard
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Repair Logs</h1>
            <p className="text-neutral-400 text-sm mt-1">Client machine triage records and maintenance history.</p>
          </div>
          <span className="text-xs font-mono bg-neutral-800 text-neutral-300 px-3 py-1 rounded">
            {isMounted ? logs.length : 0} Records
          </span>
        </div>

        {/* New Record Form */}
        <form onSubmit={handleAddRecord} className="mb-8 p-5 rounded-lg border border-neutral-800 bg-neutral-900/50 space-y-4">
          <h2 className="text-sm font-semibold text-neutral-200">Log New Service Ticket</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Device model (e.g. ThinkPad T14, Desktop Build)"
              value={device}
              onChange={(e) => setDevice(e.target.value)}
              className="bg-black/60 border border-neutral-800 rounded px-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
              required
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as RepairRecord['status'])}
              className="bg-black/60 border border-neutral-800 rounded px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-neutral-600"
            >
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Waiting on Parts">Waiting on Parts</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Reported issue / diagnostic findings"
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            className="w-full bg-black/60 border border-neutral-800 rounded px-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
            required
          />

          <textarea
            placeholder="Technician actions taken & resolution steps"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full bg-black/60 border border-neutral-800 rounded px-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
          />

          <button
            type="submit"
            className="px-4 py-2 bg-neutral-100 text-neutral-950 hover:bg-white text-xs font-semibold rounded transition"
          >
            + Add Service Record
          </button>
        </form>

        {/* Records Display */}
        <div className="space-y-4">
          {!isMounted ? (
            <p className="text-xs text-neutral-500 font-mono">Loading records...</p>
          ) : logs.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-neutral-800 rounded-lg">
              <p className="text-sm text-neutral-400">No active maintenance records logged.</p>
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="p-5 rounded-lg border border-neutral-800 bg-neutral-900/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-neutral-400">{log.id}</span>
                    <span className={`text-[11px] px-2 py-0.5 rounded border ${statusColors[log.status]}`}>
                      {log.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-neutral-500">{log.date}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteRecord(log.id)}
                      className="text-xs text-neutral-500 hover:text-rose-400 transition"
                      title="Delete record"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <h2 className="text-base font-semibold text-neutral-200">{log.device}</h2>
                <p className="text-sm text-neutral-300 mt-1"><span className="text-neutral-500">Issue:</span> {log.issue}</p>
                <p className="text-xs text-neutral-400 mt-2 bg-black/40 p-2.5 rounded border border-neutral-800/80">
                  <span className="text-neutral-500">Action:</span> {log.notes}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
