<script lang="ts">
    import Alert from '$lib/components/Alert.svelte';
    import type { PageData } from './$types';
    import { format } from "date-fns";
    
    export let data: PageData;
    export let form;
</script>

<div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">Contratos</h1>

    <Alert message={form?.message} success={form?.success} />

    <div class="overflow-x-auto">
        <table class="table w-full">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Valor</th>
                    <th>Status Pagamento</th>
                    <th>Vencimento</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                {#each data.contratos as contrato}
                    <tr>
                        <td>{contrato.contrato.id}</td>
                        <td>{contrato.cliente?.name}</td>
                        <td>R$ {contrato.contrato.valor_pagamento?.toFixed(2) || '0,00'}</td>
                        <td>
                            {#if contrato.contrato.status_pagamento === 'pago'}
                                <span class="badge badge-success">Pago</span>
                            {:else if contrato.contrato.status_pagamento === 'processando'}
                                <span class="badge badge-warning">Processando</span>
                            {:else}
                                <span class="badge badge-error">Pendente</span>
                            {/if}
                        </td>
                        <td>{format(contrato.contrato.date_expire, 'dd/MM/yyyy')}</td>
                        <td class="flex gap-2">
                            <a
                                href="/admin/contratos/{contrato.contrato.id}"
                                class="btn btn-sm btn-primary"
                            >
                                Editar
                            </a>
                            <a
                                href="/admin/acompanhamento/{contrato.contrato.id}"
                                class="btn btn-sm btn-accent"
                            >
                                Acompanhar
                            </a>
                            <form method="POST" action="?/delete">
                                <input type="hidden" name="id" value={contrato.contrato.id} />
                                <button class="btn btn-sm btn-error">Excluir</button>
                            </form>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>

    <div class="mt-4">
        <a href="/admin/contratos/criar" class="btn btn-primary">
            Criar Novo Contrato
        </a>
    </div>
</div>