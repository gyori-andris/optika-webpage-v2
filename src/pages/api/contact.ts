export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const name = data.get('name');
  const email = data.get('email');
  const message = data.get('message');

  if (!name || !email || !message) {
    return new Response(JSON.stringify({ error: 'Minden mező kitöltése kötelező.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // TODO: wire up Resend
  // import { Resend } from 'resend';
  // const resend = new Resend(import.meta.env.RESEND_API_KEY);
  // await resend.emails.send({ from: '...', to: '...', subject: '...', text: `...` });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
