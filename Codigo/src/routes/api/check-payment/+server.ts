import { MercadoPagoConfig, Payment } from 'mercadopago';
import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';

const client = new MercadoPagoConfig({
  accessToken: env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export async function POST({ request }) {
  const { paymentId } = await request.json();
  const payment = new Payment(client);
  const result = await payment.get({ id: paymentId });
  
  return json({ status: result.status });
}