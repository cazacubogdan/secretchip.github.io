'use client';

import { useMemo, useState } from 'react';
import { GlassCard } from './ui';

type Result = {
  title: string;
  state: 'pass' | 'fail' | 'info' | 'inconclusive';
  message: string;
  details?: string;
};

const endpointOptions = [
  {
    label: 'Protected resolver',
    value: process.env.NEXT_PUBLIC_DOH_FILTERED || 'https://dns.secretchip.net/dns-query'
  },
  {
    label: 'Open resolver option',
    value: process.env.NEXT_PUBLIC_DOH_OPEN || 'https://nofilter.dns.secretchip.net/dns-query'
  }
];

function ResultCard({ result }: { result: Result }) {
  const tone =
    result.state === 'pass'
      ? 'border-emerald-500/40 text-emerald-300'
      : result.state === 'fail'
        ? 'border-rose-500/40 text-rose-300'
        : result.state === 'inconclusive'
          ? 'border-amber-500/40 text-amber-300'
          : 'border-sky-500/40 text-sky-300';

  return (
    <div className={`rounded-xl border bg-slate-950/40 p-4 transition duration-300 ${tone}`}>
      <h4 className="font-semibold text-white">{result.title}</h4>
      <p className="mt-1 text-sm">{result.message}</p>
      {result.details ? <pre className="mt-2 overflow-auto rounded bg-slate-950/70 p-2 text-xs text-slate-300">{result.details}</pre> : null}
    </div>
  );
}

async function postCheck(path: string, endpoint: string) {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ endpoint })
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      title: data.title || 'Check',
      state: 'fail' as const,
      message: data.message || data.error || 'Check failed.',
      details: data.details
    };
  }

  return data;
}

export function DnsTester() {
  const [endpoint, setEndpoint] = useState(endpointOptions[0].value);
  const [results, setResults] = useState<Result[]>([]);
  const [running, setRunning] = useState(false);

  const selectedLabel = useMemo(
    () => endpointOptions.find((item) => item.value === endpoint)?.label ?? 'Resolver',
    [endpoint]
  );

  const runSingle = async (path: string) => {
    setRunning(true);
    const result = await postCheck(path, endpoint);
    setResults((prev) => [...prev, result]);
    setRunning(false);
  };

  const runAll = async () => {
    setRunning(true);
    setResults([]);

    const response = await fetch('/api/dns-test/all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint })
    });

    const data = await response.json();

    if (response.ok && Array.isArray(data.results)) {
      setResults(data.results);
    } else {
      setResults([
        {
          title: 'DNS test chain',
          state: 'fail',
          message: data.message || 'Could not run all checks.',
          details: data.details
        }
      ]);
    }

    setRunning(false);
  };

  return (
    <GlassCard className="space-y-6">
      <div>
        <label className="mb-2 block text-sm text-slate-300">Endpoint selector</label>
        <select
          value={endpoint}
          onChange={(event) => setEndpoint(event.target.value)}
          className="w-full rounded-lg border border-white/20 bg-slate-900 p-3 text-white"
        >
          {endpointOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}: {opt.value}
            </option>
          ))}
        </select>
        <p className="mt-2 text-xs text-slate-400">
          Running checks against: <span className="text-slate-200">{selectedLabel}</span>
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          disabled={running}
          onClick={runAll}
          className="rounded-lg bg-brandBlue px-4 py-2 font-medium text-slate-950 transition duration-200 hover:-translate-y-0.5 hover:bg-sky-400 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {running ? 'Running checks...' : 'Run all checks'}
        </button>
        <button
          disabled={running}
          onClick={() => runSingle('/api/dns-test/reachability')}
          className="rounded-lg border border-white/20 px-4 py-2 text-white transition hover:border-brandBlue/40 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Test reachability
        </button>
        <button
          disabled={running}
          onClick={() => runSingle('/api/dns-test/query')}
          className="rounded-lg border border-white/20 px-4 py-2 text-white transition hover:border-brandBlue/40 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Test DoH query
        </button>
        <button
          disabled={running}
          onClick={() => runSingle('/api/dns-test/block')}
          className="rounded-lg border border-white/20 px-4 py-2 text-white transition hover:border-brandBlue/40 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Test block behavior
        </button>
      </div>

      <div className="space-y-3">
        {results.length === 0 ? (
          <p className="text-slate-400">No test results yet. Run a check to populate this panel.</p>
        ) : (
          results.map((r, idx) => (
            <div key={`${r.title}-${idx}`} className="fade-up">
              <ResultCard result={r} />
            </div>
          ))
        )}
      </div>
    </GlassCard>
  );
}
