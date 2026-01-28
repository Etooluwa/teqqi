import { Resend } from 'resend';

export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const resend = new Resend(env.RESEND_API_KEY);
        const body = await request.json();
        const { name, email, company, service, message } = body;

        const { data, error } = await resend.emails.send({
            from: 'Teqqi Website <info@contact.theteqqi.com>',
            to: ['info@theteqqi.com'],
            subject: `New Contact Form Submission from ${name}`,
            html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || 'Not provided'}</p>
        <p><strong>Service Interest:</strong> ${service}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
            reply_to: email,
        });

        if (error) {
            console.error('Resend Error:', error);
            return new Response(JSON.stringify({ error: error.message }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({ message: 'Email sent successfully!', data }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        console.error('Server Error:', err);
        return new Response(JSON.stringify({ error: 'Internal server error: ' + err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
