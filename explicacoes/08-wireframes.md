# Wireframes (Protótipo de Baixa Fidelidade) — Definição e Planejamento

## O que é um Wireframe?

Um wireframe é uma representação esquemática e simplificada de uma tela, mostrando a estrutura e a disposição dos elementos sem detalhes visuais como cores, fontes definitivas ou imagens reais. É como a "planta baixa" de uma interface.

---

## Características de um Wireframe

- **Sem cores** — usa tons de cinza, preto e branco.
- **Sem imagens reais** — usa placeholders (retângulos com "X").
- **Sem tipografia final** — usa fonte genérica.
- **Foco na estrutura** — posição dos elementos, hierarquia, fluxo.
- **Rápido de criar** — pode ser feito à mão ou em ferramentas simples.

---

## Por que criar Wireframes antes do Protótipo Final?

1. Permite testar a estrutura sem investir tempo em visual.
2. Facilita mudanças rápidas (é mais fácil mover blocos do que redesenhar telas completas).
3. Foca a discussão no conteúdo e na funcionalidade, não na estética.
4. Permite validar o fluxo com usuários antes de prototipar em alta fidelidade.

---

## Wireframes Planejados para o Projeto

### Wireframe 1 — Home do Aluno

**Função da tela:** Ponto de entrada principal. Mostra objetos recentes, busca rápida e acesso às principais funcionalidades.

**Elementos presentes:**
- Header com logo e ícone de notificações
- Campo de busca rápida (com ícone de lupa)
- Seção "Objetos recentes" com cards horizontais (scroll)
- Botão flutuante "Cadastrar objeto perdido"
- Barra de navegação inferior (Home, Buscar, Cadastrar, Perfil)

**Próximo passo do usuário:** Buscar um objeto, ver detalhes de um card, ou cadastrar item perdido.

---

### Wireframe 2 — Buscar Objetos

**Função da tela:** Permitir busca detalhada com filtros para encontrar objetos.

**Elementos presentes:**
- Campo de busca no topo
- Chips de filtro: Categoria, Local, Data, Status
- Lista de resultados em cards verticais
- Cada card: miniatura da foto, título, local, data, badge de status
- Mensagem "Nenhum resultado" quando vazio

**Próximo passo do usuário:** Clicar em um card para ver detalhes do objeto.

---

### Wireframe 3 — Detalhes do Objeto

**Função da tela:** Exibir todas as informações de um objeto encontrado e permitir solicitar retirada.

**Elementos presentes:**
- Foto grande do objeto (carrossel se houver múltiplas)
- Título e descrição
- Informações: categoria, local encontrado, data, status atual
- Mapa ou indicação do local
- Botão principal: "Solicitar Retirada" (se status permitir)
- Botão secundário: "Voltar"

**Próximo passo do usuário:** Solicitar retirada ou voltar à busca.

---

### Wireframe 4 — Cadastrar Objeto Perdido/Encontrado

**Função da tela:** Formulário para cadastrar um novo objeto no sistema (perdido pelo aluno ou encontrado pelo funcionário).

**Elementos presentes:**
- Título: "Cadastrar Objeto Perdido" ou "Cadastrar Objeto Encontrado"
- Campos: Nome do objeto, Categoria (dropdown), Descrição, Local (dropdown), Data, Foto (upload)
- Botão "Enviar cadastro"
- Botão "Cancelar"
- Indicador de campos obrigatórios (*)

**Próximo passo do usuário:** Preencher e enviar, recebendo confirmação.

---

### Wireframe 5 — Painel do Funcionário

**Função da tela:** Visão geral administrativa com solicitações pendentes, objetos cadastrados e ações rápidas.

**Elementos presentes:**
- Header com nome do funcionário e notificações
- Cards resumo: "Solicitações pendentes", "Objetos cadastrados", "Casos encerrados"
- Lista de solicitações recentes (com botão "Validar")
- Botão "Cadastrar objeto encontrado"
- Menu lateral ou tabs: Objetos, Solicitações, Histórico

**Próximo passo do usuário:** Validar uma solicitação, cadastrar objeto ou ver histórico.

---

## Ferramentas Sugeridas para Criar Wireframes

| Ferramenta | Tipo | Observação |
|---|---|---|
| Figma | Digital | Gratuito, colaborativo, recomendado |
| Balsamiq | Digital | Estilo "rascunho à mão" |
| Papel e caneta | Manual | Mais rápido para ideação inicial |
| Excalidraw | Digital | Gratuito, estilo sketch |
| Whimsical | Digital | Simples e bonito |

---

## Dicas para Bons Wireframes

1. Mantenha simples — se parecer bonito, você está detalhando demais.
2. Numere os elementos para facilitar referência na documentação.
3. Anote o fluxo: "De onde o usuário veio?" e "Para onde ele vai?".
4. Teste com alguém — peça para narrar o que faria em cada tela.
5. Alinhe com o mapa do site — toda tela do mapa deve ter wireframe.
