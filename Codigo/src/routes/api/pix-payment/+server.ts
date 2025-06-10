import { json } from '@sveltejs/kit';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { env } from '$env/dynamic/private';

const client = new MercadoPagoConfig({
  accessToken: env.MERCADO_PAGO_ACCESS_TOKEN!,
  options: { timeout: 10000 } // Increased timeout
});

export async function GET() {
  try {
    const payment = new Payment(client);
    // Simple API test
    await payment.get({ id: '123' }); // This will fail but verify connection
    return json({ success: true });
  } catch (error) {
    console.error('Mercado Pago Connection Test Failed:', error);
    return json({
      error: 'Connection to Mercado Pago failed',
      details: error.message
    }, { status: 500 });
  }
}

export async function POST({ request, locals }) {
  try {
    const { amount, description, contratoId } = await request.json();
    
    console.log('Creating PIX payment for:', { amount, contratoId });

    const payment = new Payment(client);
    const result = await payment.create({
      body: {
        transaction_amount: parseFloat(amount),
        description,
        payment_method_id: 'pix',
        payer: {
          email: locals.user?.email || 'customer@example.com',
          first_name: locals.user?.name?.split(' ')[0] || 'Customer',
          identification: {
            type: 'CPF',
            number: locals.user?.cpf || '12345678909'
          }
        },
        date_of_expiration: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 min expiry
      }
    });

    console.log('Mercado Pago response:', JSON.stringify(result, null, 2));

    if (!result.point_of_interaction?.transaction_data) {
      console.error('QR code data missing in response');
      return json({ error: 'Failed to generate PIX QR code' }, { status: 400 });
    }

    return json({
      success: true,
      data: {
        qrCode: result.point_of_interaction.transaction_data.qr_code,
        qrBase64: result.point_of_interaction.transaction_data.qr_code_base64,
        paymentId: result.id.toString(),
        contratoId
      }
    });

  } catch (error) {
    console.error('PIX Payment Error:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });
    
    return json({ 
      error: 'Payment processing failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}