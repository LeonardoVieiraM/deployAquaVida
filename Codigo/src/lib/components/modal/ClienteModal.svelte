<script>

    let clienteData = {};
    let result = '';
  
    // Funções de interação com o backend
    // async function insertCliente() {
    //   const response = await fetch('/api/cliente', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(clienteData)
    //   });
    //   result = await response.json();
    // }
  
    // async function selectAllClientes() {
    //   const response = await fetch('/api/cliente');
    //   result = await response.json();
    // }
  
    // async function updateCliente() {
    //   const response = await fetch(`/api/cliente/${clienteData.id}`, {
    //     method: 'PUT',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(clienteData)
    //   });
    //   result = await response.json();
    // }
  
    // async function deleteCliente() {
    //   const response = await fetch(`/api/cliente/${clienteData.id}`, {
    //     method: 'DELETE'
    //   });
    //   result = await response.json();
    // }
  </script>
  
    <h2>CRUD Cliente</h2>
    <button >Buscar Todos os Clientes</button>
  
    <form >
      <input type="text" placeholder="Nome" id="cliente-nome" class="input input-bordered w-full max-w-xs" />
      <input type="text" placeholder="CNPJ" id="cliente-cnpj" class="input input-bordered w-full max-w-xs" />
      <button type="submit">Inserir Cliente</button>
    </form>
    
    <form >
      <input  id="cliente-id" name="id" placeholder="ID" />
      <input  id="cliente-novo-nome" name="nome" placeholder="Novo Nome" />
      <input  id="cliente-novo-cnpj" name="cnpj" placeholder="Novo CNPJ" />
      <button type="submit">Atualizar Cliente</button>
    </form>
    
    <form >
      <input  id="delete-cliente-id" name="id" placeholder="ID" />
      <button type="submit">Deletar Cliente</button>
    </form>
  
    <p>Resultado: {result}</p>
    <!-- <button on:click={close}>Fechar</button> -->