'use client';

import { useState } from 'react';
import { GlassCard } from './ui';

type Result = { title: string; state: 'pass' | 'fail' | 'info'; message: string; details?: string };

const endpointOptions = [
  { label: 'Protected resolver', value: 'https://dns.secretchip.net/dns-query' },
  { label: 'Open resolver option', value: 'https://nofilter.dns.secretchip.net/dns-query' }
];

function ResultCard({ result }: { result: Result }) {
  const tone = result.state === 'pass' ? 'border-emerald-500/40 text-emerald-300' : result.state === 'fail' ? 'border-rose-500/40 text-rose-300' : 'border-sky-500/40 text-sky-300';
  return (
    <div className={`rounded-xl border p-4 ${tone}`}>
      <h4 className="font-semibold text-white">{result.title}</h4>
      <p className="mt-1 text-sm">{result.message}</p>
      {result.details ? <pre className="mt-2 overflow-auto rounded bg-slate-950/60 p-2 text-xs text-slate-300">{result.details}</pre> : null}
    </div>
  );
}

export function DnsTester() {
  const [endpoint, setEndpoint] = useState(endpointOptions[0].value);
  const [results, setResults] = useState<Result[]>([]);

  // TODO: wire this to production DNS validation service for deep protocol checks.
  const runReachability = async () => {
    try {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 4000);
      const res = await fetch(endpoint, { method: 'OPTIONS', signal: controller.signal });
      setResults((prev) => [...prev, { title: 'Reachability', state: res.ok ? 'pass' : 'info', message: res.ok ? 'Endpoint responded from browser context.' : 'Endpoint responded but browser-origin checks may limit interpretation.', details: `HTTP ${res.status}` }]);
    } catch (err) {
      setResults((prev) => [...prev, { title: 'Reachability', state: 'info', message: 'Browser could not complete this request directly. This does not automatically mean the resolver is offline.', details: String(err) }]);
    }
  };

  const runDoh = async () => {
    setResults((prev) => [...prev, { title: 'DoH Query', state: 'info', message: 'Live DoH query from browser is constrained by CORS and response format requirements.', details: 'Client UI is ready for integration with a dedicated test API endpoint.' }]);
  };

  const runBlock = async () => {
    setResults((prev) => [...prev, { title: 'Block Behavior', state: 'info', message: 'Block-list verification requires controlled test domains and server-side verification.', details: 'Placeholder result. No success is asserted by default.' }]);
  };

  return (
    <GlassCard className="space-y-6">
      <div>
        <label className="mb-2 block text-sm text-slate-300">Endpoint selector</label>
        <select value={endpoint} onChange={(e) => setEndpoint(e.target.value)} className="w-full rounded-lg border border-white/20 bg-slate-900 p-3 text-white">
          {endpointOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}: {opt.value}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap gap-3">
        <button onClick={async () => { setResults([]); await runReachability(); await runDoh(); await runBlock(); }} className="rounded-lg bg-brandBlue px-4 py-2 font-medium text-slate-950">Run all checks</button>
        <button onClick={runReachability} className="rounded-lg border border-white/20 px-4 py-2 text-white">Test reachability</button>
        <button onClick={runDoh} className="rounded-lg border border-white/20 px-4 py-2 text-white">Test DoH query</button>
        <button onClick={runBlock} className="rounded-lg border border-white/20 px-4 py-2 text-white">Test block behavior</button>
      </div>
      <div className="space-y-3">
        {results.length === 0 ? <p className="text-slate-400">No test results yet. Run a check to populate this panel.</p> : results.map((r, idx) => <ResultCard key={`${r.title}-${idx}`} result={r} />)}
      </div>
    </GlassCard>
  );
}
