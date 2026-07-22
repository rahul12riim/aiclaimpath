'use client';
import { useState, FormEvent } from 'react';

const ACCESS_KEY = '1536df75-9f23-4842-b4d9-8db2a824eb15';

export default function FeedbackPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus('sending');
    const formData = new FormData(form);
    formData.append('access_key', ACCESS_KEY);
    formData.append('subject', 'New feedback from AIClaimPath');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setStatus(data.success ? 'success' : 'error');
      if (data.success) form.reset();
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <p className="text-lg font-semibold">Thanks for your feedback! ✅</p>
        <button onClick={() => setStatus('idle')} className="mt-3 text-sm underline">Send another</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-4">
      <h2 className="text-xl font-bold">Share your feedback</h2>

      <input name="name" required placeholder="Your name"
        className="w-full border rounded-lg px-3 py-2" />

      <input name="email" type="email" required placeholder="Your email"
        className="w-full border rounded-lg px-3 py-2" />

      <select name="department" required className="w-full border rounded-lg px-3 py-2">
        <option value="">Select department</option>
        <option>Product</option>
        <option>Support</option>
        <option>Billing</option>
        <option>General</option>
      </select>

      <input name="product" placeholder="Product / site (e.g. hotel.com)"
        className="w-full border rounded-lg px-3 py-2" />

      <textarea name="message" required rows={4} placeholder="Your feedback..."
        className="w-full border rounded-lg px-3 py-2" />

      <input type="checkbox" name="botcheck" style={{ display: 'none' }} />

      <button type="submit" disabled={status === 'sending'}
        className="w-full bg-black text-white rounded-lg py-2 font-medium disabled:opacity-60">
        {status === 'sending' ? 'Sending...' : 'Send feedback'}
      </button>

      {status === 'error' && (
        <p className="text-red-600 text-sm">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}
