<script>
    export let close;
  
    let representanteData = {};
    let result = '';
  
    async function insertRepresentante() {
      const response = await fetch('/api/representante', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(representanteData)
      });
      result = await response.json();
    }
  
    async function selectAllRepresentantes() {
      const response = await fetch('/api/representante');
      result = await response.json();
    }
  
    async function updateRepresentante() {
      const response = await fetch(`/api/representante/${representanteData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(representanteData)
      });
      result = await response.json();
    }
  
    async function deleteRepresentante() {
      const response = await fetch(`/api/representante/${representanteData.id}`, {
        method: 'DELETE'
      });
      result = await response.json();
    }
  </script>
  
  <div class="modal-overlay" on:click={close}></div>
  <div class="modal">
    <h2>CRUD Representante</h2>
    <button on:click={selectAllRepresentantes}>Buscar Todos os Representantes</button>
  
    <form on:submit|preventDefault={insertRepresentante}>
      <input bind:value={representanteData.nome} placeholder="Nome" name="nome" id="nome-representante" />
      <button type="submit">Inserir Representante</button>
    </form>
    
    <form on:submit|preventDefault={updateRepresentante}>
      <input bind:value={representanteData.id} placeholder="ID" name="id" id="id-representante" />
      <input bind:value={representanteData.nome} placeholder="Novo Nome" name="nome-novo" id="nome-novo-representante" />
      <button type="submit">Atualizar Representante</button>
    </form>
    
    <form on:submit|preventDefault={deleteRepresentante}>
      <input bind:value={representanteData.id} placeholder="ID" name="id" id="id-delete-representante" />
      <button type="submit">Deletar Representante</button>
    </form>

    <p>Resultado: {result}</p>
    <button on:click={close}>Fechar</button>
  </div>
  