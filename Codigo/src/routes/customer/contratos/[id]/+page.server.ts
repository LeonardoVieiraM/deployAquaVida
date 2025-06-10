import { contratoController, clienteController } from '$lib/server/db/controllers';
import { fail, redirect } from '@sveltejs/kit';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { env } from '$env/dynamic/private';
import type { PageServerLoad, Actions } from './$types';

const client = new MercadoPagoConfig({
	accessToken: env.MERCADO_PAGO_ACCESS_TOKEN!
});

export const load: PageServerLoad = async ({ params, locals }) => {
	const clienteId = Number(params.id);

	if (isNaN(clienteId)) {
		throw redirect(302, '/');
	}

	try {
		const contratos = await contratoController.selectContratoByClienteId(clienteId);
		const cliente = await clienteController.getClienteById(clienteId);

		if (!cliente) {
			throw redirect(302, '/');
		}

		return {
			contratos: contratos || [],
			cliente,
			user: locals.user,
			mpPublicKey: env.MERCADO_PAGO_PUBLIC_KEY
		};
	} catch (error) {
		console.error('Error loading contracts:', error);
		throw redirect(302, '/');
	}
};

export const actions: Actions = {
	createPix: async ({ request, locals }) => {
		const formData = await request.formData();
		const amount = Number(formData.get('amount'));
		const contratoId = formData.get('contratoId');

		try {
			const payment = new Payment(client);
			const result = await payment.create({
				body: {
				  transaction_amount: amount,
				  description: `Contrato #${contratoId}`,
				  payment_method_id: 'pix',
				  payer: {
					email: locals.user?.email, // Real user email
					first_name: locals.user?.name?.split(' ')[0],
					identification: {
					  type: 'CPF',
					  number: locals.user?.cpf || '12345678909' // Real CPF in production
					}
				  },
				  notification_url: `${env.BASE_URL}/api/pix-webhook` // For payment notifications
				}
			  });

			if (!result.point_of_interaction?.transaction_data) {
				return {
					type: 'error',
					error: 'QR code data missing from response'
				};
			}

			return {
				type: 'success',
				status: 200,
				data: {
					qrCode: result.point_of_interaction.transaction_data.qr_code,
					qrBase64: result.point_of_interaction.transaction_data.qr_code_base64,
					paymentId: result.id.toString(),
					contratoId: contratoId.toString()
				}
			};
		} catch (error) {
			return {
				type: 'error',
				error: 'Failed to create PIX payment'
			};
		}
	}
};
