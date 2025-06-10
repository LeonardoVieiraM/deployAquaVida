import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { clienteTable } from '$lib/server/db/schema/cliente';
import { contratoTable } from '$lib/server/db/schema/contrato';
import { representanteTable } from '$lib/server/db/schema/representante';
import { eq, inArray } from 'drizzle-orm';

export async function GET() {
  const representantes = await db.select().from(representanteTable);
  const resultado = [];

  for (const rep of representantes) {
    const clientes = await db
      .select()
      .from(clienteTable)
      .where(eq(clienteTable.representante_id, rep.id));

    const clienteIds = clientes.map((c) => c.id);

    if (clienteIds.length === 0) {
      resultado.push({
        representante: rep.name,
        total_clientes: 0,
        total_faturamento: 0,
        historico_mensal: []
      });
      continue;
    }

    const contratos = (await db
      .select({
        id: contratoTable.id,
        cliente_id: contratoTable.cliente_id,
        valor: contratoTable.valor_pagamento,
        data: contratoTable.date_emission
      })
      .from(contratoTable)
      .where(inArray(contratoTable.cliente_id, clienteIds))) as {
        id: number;
        cliente_id: number;
        valor: number;
        data: number;
      }[];

    const totalFaturamento = contratos.reduce((sum: number, c) => sum + (c.valor || 0), 0);

    const historico: Record<string, number> = {};
    for (const contrato of contratos) {
      const data = new Date(Number(contrato.data));
      const mes: string = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
      historico[mes] = (historico[mes] || 0) + (contrato.valor || 0);
    }

    const historico_mensal = Object.entries(historico).map(([mes, valor]) => ({ mes, valor }));

    resultado.push({
      representante: rep.name,
      total_clientes: clienteIds.length,
      total_faturamento: totalFaturamento,
      historico_mensal
    });
  }
console.log(JSON.stringify(resultado, null, 2));

  return json(resultado);
  
}
