<script>
    export let close;
  
    let servicoData = {};
    let result = '';
  
    async function insertServico() {
      const response = await fetch('/api/servico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(servicoData)
      });
      result = await response.json();
    }
  
    async function selectAllServicos() {
      const response = await fetch('/api/servico');
      result = await response.json();
    }
  
    async function updateServico() {
      const response = await fetch(`/api/servico/${servicoData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(servicoData)
      });
      result = await response.json();
    }
  
    async function deleteServico() {
      const response = await fetch(`/api/servico/${servicoData.id}`, {
        method: 'DELETE'
      });
      result = await response.json();
    }
  </script>
  
  <div class="modal-overlay" on:click={close}></div>
  <div class="modal">
    <h2>CRUD Serviço</h2>
    <button on:click={selectAllServicos}>Buscar Todos os Serviços</button>
  
    <form on:submit|preventDefault={insertServico}>
      <input bind:value={servicoData.nome} placeholder="Nome" name="nome" id="nome-servico" />
      <input bind:value={servicoData.descricao} placeholder="Descrição" name="descricao" id="descricao-servico" />
      <button type="submit">Inserir Serviço</button>
    </form>
    
    <form on:submit|preventDefault={updateServico}>
      <input bind:value={servicoData.id} placeholder="ID" name="id" id="id-servico" />
      <input bind:value={servicoData.nome} placeholder="Novo Nome" name="nome-novo" id="nome-novo-servico" />
      <input bind:value={servicoData.descricao} placeholder="Nova Descrição" name="descricao-nova" id="descricao-nova-servico" />
      <button type="submit">Atualizar Serviço</button>
    </form>
    
    <form on:submit|preventDefault={deleteServico}>
      <input bind:value={servicoData.id} placeholder="ID" name="id" id="id-delete-servico" />
      <button type="submit">Deletar Serviço</button>
    </form>
  
    <p>Resultado: {result}</p>
    <button on:click={close}>Fechar</button>
  </div>
  