export const prerender = false;

import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const name    = (data.get('name')    as string | null)?.trim();
  const email   = (data.get('email')   as string | null)?.trim();
  const message = (data.get('message') as string | null)?.trim();

  if (!name || !email || !message) {
    return new Response(JSON.stringify({ error: 'Minden mező kitöltése kötelező.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Basic email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: 'Érvénytelen e-mail cím.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) {
    // Dev/staging: log and acknowledge without sending
    console.warn('[contact] RESEND_API_KEY not set — logging only');
    console.log(`[contact] From: ${name} <${email}>\n${message}`);
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from:    'Nádor Optika weboldal <onboarding@resend.dev>',
    to:      ['nadoroptika@gmail.com'],
    replyTo: email,
    subject: `Kapcsolatfelvétel: ${name}`,
    text:    `Név: ${name}\nE-mail: ${email}\n\n${message}`,
    html:    `
      <p><strong>Név:</strong> ${name}</p>
      <p><strong>E-mail:</strong> <a href="mailto:${email}">${email}</a></p>
      <hr/>
      <p>${message.replace(/\n/g, '<br/>')}</p>
    `,
  });

  if (error) {
    console.error('[contact] Resend error:', error);
    return new Response(JSON.stringify({ error: 'Nem sikerült elküldeni az üzenetet. Kérem, hívjon minket!' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
