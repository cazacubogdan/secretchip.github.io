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
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const validateClient = () => {
    const errors: Partial<Record<keyof FormState, string>> = {};

    if (!form.name.trim()) errors.name = 'Name is required.';
    if (!form.email.trim()) errors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address.';
    if (!form.topic.trim()) errors.topic = 'Topic is required.';
    if (!form.message.trim()) errors.message = 'Message is required.';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateClient()) {
      setStatus('error');
      setStatusMessage('Please correct the highlighted fields and try again.');
      return;
    }

    setStatus('loading');
    setStatusMessage('Submitting your inquiry...');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus('error');
        if (data.fieldErrors) {
          setFieldErrors(data.fieldErrors);
        }
        setStatusMessage(data.error || 'Submission failed. Please try again.');
        return;
      }

      setStatus('success');
      setStatusMessage(data.message || 'Your inquiry was sent successfully.');
      setFieldErrors({});
      setForm(initialState);
    } catch (error) {
      setStatus('error');
      setStatusMessage(error instanceof Error ? error.message : 'Submission failed due to a network error.');
    }
  };

  return (
    <>
      <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
        <div>
          <input
            className="w-full rounded-lg border border-white/15 bg-slate-900 p-3"
            placeholder="Name"
            name="name"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          />
          {fieldErrors.name ? <p className="mt-1 text-xs text-rose-300">{fieldErrors.name}</p> : null}
        </div>
        <div>
          <input
            className="w-full rounded-lg border border-white/15 bg-slate-900 p-3"
            placeholder="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          />
          {fieldErrors.email ? <p className="mt-1 text-xs text-rose-300">{fieldErrors.email}</p> : null}
        </div>
        <div>
          <select
            className="w-full rounded-lg border border-white/15 bg-slate-900 p-3"
            name="topic"
            value={form.topic}
            onChange={(e) => setForm((prev) => ({ ...prev, topic: e.target.value }))}
          >
            {['AEGIS PDNS', 'Services', 'Partnership', 'General Inquiry'].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          {fieldErrors.topic ? <p className="mt-1 text-xs text-rose-300">{fieldErrors.topic}</p> : null}
        </div>
        <div>
          <textarea
            className="min-h-32 w-full rounded-lg border border-white/15 bg-slate-900 p-3"
            placeholder="Message"
            name="message"
            value={form.message}
            onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
          />
          {fieldErrors.message ? <p className="mt-1 text-xs text-rose-300">{fieldErrors.message}</p> : null}
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="rounded-lg bg-brandBlue px-4 py-2 font-medium text-slate-950 transition duration-200 hover:-translate-y-0.5 hover:bg-sky-400 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'loading' ? 'Sending...' : 'Send inquiry'}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-400">Privacy reminder: your submission is processed per our Privacy Notice.</p>
      {statusMessage ? (
        <p className={`mt-3 text-sm ${status === 'success' ? 'text-emerald-300' : status === 'error' ? 'text-rose-300' : 'text-slate-300'}`}>
          {statusMessage}
        </p>
      ) : null}
    </>
  );
}
