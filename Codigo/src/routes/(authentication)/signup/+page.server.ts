import { lucia } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import { generateIdFromEntropySize } from 'lucia';
import { hash } from '@node-rs/argon2';
import type { Actions } from './$types';
import {
    clienteController,
    representanteController,
    gerenteController,
    userController
} from '$lib/server/db/controllers';

const ADMIN_VALIDATION_PASSWORD = "$argon2id$v=19$m=19456,t=2,p=1$aicG6lISXA962alqaFMUGg$CQyJIcwNVTTx1ihq6ZcX2+T0Nt/kXZdfcksjLTr5hbs";

export const actions: Actions = {
    default: async (event) => {
        const formData = await event.request.formData();
        const username = formData.get('username');
        const password = formData.get('password');
        const email = formData.get('email');
        const cpf = String(formData.get('cpf'));
        const isCliente = formData.get('isCliente') === 'true';
        const isGerente = formData.get('isGerente') === 'true';
        const cep = formData.get('cep');
        const street = formData.get('street');
        const city = formData.get('city');
        const state = formData.get('state');
        const number = formData.get('number');
        const bairro = formData.get('bairro');
        const estado = formData.get('estado');
        const adminPassword = formData.get('adminPassword');

        if (
            typeof username !== 'string' ||
            username.length < 3 ||
            username.length > 31 ||
            !/^[a-z0-9_-]+$/.test(username)
        ) {
            return fail(400, { message: 'Nome de usuário inválido' });
        }
        if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
            return fail(400, { message: 'Senha inválida' });
        }
        if (
            typeof email !== 'string' ||
            email.length < 3 ||
            email.length > 255 ||
            !email.includes('@')
        ) {
            return fail(400, { message: 'Email inválido' });
        }

        if (isCliente && (typeof cep !== 'string' || cep.length !== 8)) {
            return fail(400, { message: 'CEP deve conter 8 dígitos' });
        }
        if (isGerente && (typeof estado !== 'string' || estado.length < 2)) {
            return fail(400, { message: 'Estado inválido (ex: SP)' });
        }
        if (isGerente) {
            if (typeof adminPassword !== 'string' || adminPassword !== ADMIN_VALIDATION_PASSWORD) {
                return fail(400, { message: 'Senha de validação incorreta' });
            }
        }

        const userId = generateIdFromEntropySize(10);
        const passwordHash = await hash(password, {
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1
        });

        const [existingUser] = await userController.getUserByEmail(email);
        if (existingUser) {
            return fail(400, { message: 'Email já cadastrado' });
        }

        let tipo: 'cliente' | 'representante' | 'gerente' = isCliente ? 'cliente' : isGerente ? 'gerente' : 'representante';

        if (!isCliente && !isGerente) {
            const existingRepresentante = await representanteController.getRepresentanteByCPF(cpf);
            if (!existingRepresentante) {
                return fail(400, { message: 'Nenhum representante com esse CPF' });
            }
        }

        await userController.insertUser({
            id: userId,
            username,
            password_hash: passwordHash,
            email,
            tipo
        });

        if (isCliente) {
            await clienteController.insertCliente({
                name: username,
                email,
                endereco: `${cep}, ${bairro}, ${city}, ${street}, ${number}, ${state}`,
                cnpj: cpf
            });
        } else if (isGerente) {
            await gerenteController.insertGerente({
                userId,
                name: username,
                estado
            });
        } else {
            const existingRepresentante = await representanteController.getRepresentanteByCPF(cpf);
            if (existingRepresentante) {
                await representanteController.updateRepresentante(existingRepresentante.id, {
                    name: username,
                    email
                });
            }
        }

        // Criar sessão
        const session = await lucia.createSession(userId, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        event.cookies.set(sessionCookie.name, sessionCookie.value, {
            path: '.',
            ...sessionCookie.attributes
        });

        redirect(302, '/');
    }
    
};