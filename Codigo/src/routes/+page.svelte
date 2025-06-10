<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { DropletIcon, LeafIcon, ZapIcon, ShieldIcon } from 'lucide-svelte';
  import { getUserContext } from '$lib/stores/user';

  // Obter o estado do usuário
  const user = getUserContext();

  // Propriedades da página
  export let data;
</script>

<div class="flex flex-col min-h-screen">
  {#if !$user}
    <!-- Conteúdo para usuário deslogado -->
    <section class="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-base-100 bg-cover bg-center bg-[url('https://rockwellautomation.scene7.com/is/image/rockwellautomationstage/WaterWastewater_261344590.2400.jpg')]">
      <div class="absolute inset-0 bg-primary bg-opacity-90"></div>
      <div class="relative container px-4 md:px-6">
        <div class="flex flex-col items-center space-y-4 text-center text-primary-content">
          <div class="space-y-2">
            <h1 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Agende sua visita técnica com um de nossos representantes
            </h1>
            <p class="mx-auto max-w-[700px] md:text-xl">
              Experimente água mais limpa, segura e eficiente com nossa solução avançada de tratamento.
            </p>
          </div>
          <div class="flex gap-4">
            <a href="/login" class="btn btn-accent w-full">Crie sua conta agora!</a>
          </div>
        </div>
      </div>
    </section>
  {/if}

  {#if $user?.tipo === 'cliente' || !$user}
    <!-- Conteúdo para cliente -->
    <main class="flex-1">
      {#if !$user || $user.tipo === 'cliente'}
        <!-- Seção de características (só mostra para deslogado) -->
        <section id="caracteristicas" class="w-full py-12 md:py-24 lg:py-32 bg-base-200">
          <div class="container px-4 md:px-6">
            <h2 class="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Principais Características</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle class="flex items-center space-x-2">
                    <DropletIcon class="h-6 w-6 text-info" />
                    <span>Filtragem Avançada</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p class=" ">Processo de filtragem em várias etapas para qualidade superior</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle class="flex items-center space-x-2">
                    <LeafIcon class="h-6 w-6 text-success" />
                    <span>Ecológico</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p class=" ">Design sustentável com impacto ambiental mínimo</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle class="flex items-center space-x-2">
                    <ZapIcon class="h-6 w-6 text-warning" />
                    <span>Eficiente em Energia</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p class=" ">Baixo consumo de energia para custos operacionais reduzidos</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle class="flex items-center space-x-2">
                    <ShieldIcon class="h-6 w-6 text-error" />
                    <span>Monitoramento Inteligente</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p class=" ">Monitoramento em tempo real da qualidade da água</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      {/if}

      <!-- Seção de chamada para ação -->
      <section class="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-content">
        <div class="container px-4 md:px-6">
          <div class="flex flex-col items-center space-y-4 text-center">
            <div class="space-y-2">
              <h2 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Pronto para transformar sua água?
              </h2>
              <p class="mx-auto max-w-[600px] text-primary-content md:text-xl">
                Junte-se a milhares de clientes satisfeitos e experimente a diferença com nosso sistema de tratamento de água.
              </p>
            </div>
            <div class="w-full max-w-sm space-y-2">
              <a class="w-full btn btn-accent" href="/customer/solicitar">Solicite um serviço</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  {:else}
    <!-- Conteúdo para gerente e representante (dashboard) -->
    <main class="flex-1 container py-12">
      <h1 class="text-3xl font-bold mb-8">Bem-vindo, {$user.username}!</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#if $user.tipo === 'gerente'}
          <!-- Cards para gerente -->
          <a href="/admin/clientes">
            <Card class="hover:bg-base-200 transition-colors">
              <CardHeader>
                <CardTitle class="flex items-center gap-2">
                  <i class="fas fa-users text-blue-500"></i>
                  Clientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Gerencie todos os clientes da empresa</p>
              </CardContent>
            </Card>
          </a>
          <a href="/admin/representantes">
            <Card class="hover:bg-base-200 transition-colors">
              <CardHeader>
                <CardTitle class="flex items-center gap-2">
                  <i class="fas fa-user-tie text-green-500"></i>
                  Representantes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Gerencie os representantes da empresa</p>
              </CardContent>
            </Card>
          </a>
          <a href="/admin/servicos">
            <Card class="hover:bg-base-200 transition-colors">
              <CardHeader>
                <CardTitle class="flex items-center gap-2">
                  <i class="fas fa-cogs text-purple-500"></i>
                  Serviços
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Gerencie os serviços oferecidos</p>
              </CardContent>
            </Card>
          </a>
          <a href="/admin/pedidos">
            <Card class="hover:bg-base-200 transition-colors">
              <CardHeader>
                <CardTitle class="flex items-center gap-2">
                  <i class="fas fa-shopping-cart text-yellow-500"></i>
                  Pedidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Visualize e gerencie os pedidos</p>
              </CardContent>
            </Card>
          </a>
          <a href="/admin/template">
            <Card class="hover:bg-base-200 transition-colors">
              <CardHeader>
                <CardTitle class="flex items-center gap-2">
                  <i class="fas fa-file-contract text-red-500"></i>
                  Templates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Crie templates para contratos</p>
              </CardContent>
            </Card>
          </a>
          <a href="/admin/contratos">
            <Card class="hover:bg-base-200 transition-colors">
              <CardHeader>
                <CardTitle class="flex items-center gap-2">
                  <i class="fas fa-file-signature text-indigo-500"></i>
                  Contratos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Visualize e gerencie contratos</p>
              </CardContent>
            </Card>
          </a>
          <a href="/admin/calendar">
            <Card class="hover:bg-base-200 transition-colors">
              <CardHeader>
                <CardTitle class="flex items-center gap-2">
                  <i class="fas fa-calendar-alt text-teal-500"></i>
                  Calendário
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Visualize o calendário de reuniões</p>
              </CardContent>
            </Card>
          </a>
          <a href="/admin/relatorio">
            <Card class="hover:bg-base-200 transition-colors">
              <CardHeader>
                <CardTitle class="flex items-center gap-2">
                  <i class="fas fa-chart-bar text-orange-500"></i>
                  Relatórios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Visualize relatórios de desempenho</p>
              </CardContent>
            </Card>
          </a>
        {:else if $user.tipo === 'representante'}
          <!-- Cards para representante -->
          <a href="/representantes/clientes">
            <Card class="hover:bg-base-200 transition-colors">
              <CardHeader>
                <CardTitle class="flex items-center gap-2">
                  <i class="fas fa-users text-blue-500"></i>
                  Seus Clientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Gerencie seus clientes</p>
              </CardContent>
            </Card>
          </a>
          <a href="/representantes/calendar">
            <Card class="hover:bg-base-200 transition-colors">
              <CardHeader>
                <CardTitle class="flex items-center gap-2">
                  <i class="fas fa-calendar-alt text-teal-500"></i>
                  Calendário
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Visualize seu calendário de reuniões</p>
              </CardContent>
            </Card>
          </a>
        {/if}
      </div>
    </main>
  {/if}

  <footer class="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
    <p class="text-xs">© 2024 Aqua Vida. Todos os direitos reservados.</p>
  </footer>
</div>