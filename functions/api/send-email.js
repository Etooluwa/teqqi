export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const body = await request.json();
        const { name, email, company, service, message } = body;

        // Use Resend REST API directly (no npm package needed)
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${env.RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
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
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('Resend Error:', result);
            return new Response(JSON.stringify({ error: result.message || 'Failed to send email' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({ message: 'Email sent successfully!', data: result }), {
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
