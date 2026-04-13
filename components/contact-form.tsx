'use client';

import { useState } from 'react';

type FormState = {
  name: string;
  email: string;
  topic: string;
  message: string;
};

const initialState: FormState = {
  name: '',
  email: '',
  topic: 'AEGIS PDNS',
  message: ''
};

export function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Please complete name, email, and message before submitting.');
      setSubmitted(false);
      return;
    }

    setError('');
    setSubmitted(true);
  };

  return (
    <>
      <form className="grid gap-4" onSubmit={(event) => event.preventDefault()}>
        <input
          className="rounded-lg border border-white/15 bg-slate-900 p-3"
          placeholder="Name"
          name="name"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
        />
        <input
          className="rounded-lg border border-white/15 bg-slate-900 p-3"
          placeholder="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
        />
        <select
          className="rounded-lg border border-white/15 bg-slate-900 p-3"
          name="topic"
          value={form.topic}
          onChange={(e) => setForm((prev) => ({ ...prev, topic: e.target.value }))}
        >
          {['AEGIS PDNS', 'Services', 'Partnership', 'General Inquiry'].map((t) => <option key={t}>{t}</option>)}
        </select>
        <textarea
          className="min-h-32 rounded-lg border border-white/15 bg-slate-900 p-3"
          placeholder="Message"
          name="message"
          value={form.message}
          onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
        />
        <button type="button" onClick={handleSubmit} className="rounded-lg bg-brandBlue px-4 py-2 font-medium text-slate-950 transition hover:bg-sky-400">Send inquiry</button>
      </form>
      <p className="mt-4 text-sm text-slate-400">Privacy reminder: your submission is processed per our Privacy Notice.</p>
      <p className="mt-2 text-xs text-slate-500">Form status: front-end only. Submission is not yet connected to backend processing in this release.</p>
      {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
      {submitted ? <p className="mt-3 text-sm text-emerald-300">Thanks. Your message is captured in this browser session placeholder. Please email hello@secretchip.net for immediate handling.</p> : null}
    </>
  );
}
