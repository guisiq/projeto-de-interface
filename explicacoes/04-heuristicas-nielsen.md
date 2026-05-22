# Heurísticas de Nielsen — Definição e Aplicação

## O que são as Heurísticas de Nielsen?

As 10 heurísticas de usabilidade de Jakob Nielsen (1994) são princípios gerais para o design de interfaces. Elas não são regras rígidas, mas diretrizes amplas que ajudam a identificar problemas de usabilidade e orientar boas práticas de design.

---

## As 10 Heurísticas

### 1. Visibilidade do estado do sistema
O sistema deve sempre manter os usuários informados sobre o que está acontecendo, por meio de feedback apropriado e em tempo razoável.

**Exemplos no projeto:**
- Barra de progresso ao enviar cadastro de objeto
- Status visível: "Perdido", "Encontrado", "Em análise", "Aguardando retirada", "Finalizado"
- Indicador de carregamento ao buscar objetos
- Confirmação visual após solicitar retirada

---

### 2. Correspondência entre o sistema e o mundo real
O sistema deve falar a linguagem do usuário, com palavras, frases e conceitos familiares, em vez de termos técnicos orientados ao sistema.

**Exemplos no projeto:**
- Usar "Achados e Perdidos" em vez de "Gestão de Itens Extraviados"
- Categorias como "Eletrônicos", "Documentos", "Roupas" em vez de códigos
- Ícones reconhecíveis (lupa para busca, sino para notificação)

---

### 3. Controle e liberdade do usuário
Usuários frequentemente escolhem funções por engano e precisam de uma "saída de emergência" claramente marcada.

**Exemplos no projeto:**
- Botão "Cancelar" em formulários
- Possibilidade de editar ou excluir cadastro de objeto
- Botão "Voltar" sempre visível
- Desfazer solicitação de retirada antes da validação

---

### 4. Consistência e padrões
Usuários não devem ter que se perguntar se palavras, situações ou ações diferentes significam a mesma coisa.

**Exemplos no projeto:**
- Mesmo estilo de botão em todas as telas
- Mesma posição do menu/navegação
- Cores de status consistentes (verde = finalizado, amarelo = em análise, vermelho = perdido)
- Mesma tipografia e espaçamento em toda a interface

---

### 5. Prevenção de erros
Melhor do que boas mensagens de erro é um design cuidadoso que previne que o problema ocorra.

**Exemplos no projeto:**
- Confirmação antes de encerrar caso ("Tem certeza?")
- Validação em tempo real nos formulários (campos obrigatórios)
- Desabilitar botão "Enviar" até formulário estar completo
- Dropdown para categorias em vez de campo livre (evita erros de digitação)

---

### 6. Reconhecimento em vez de memorização
Minimizar a carga de memória do usuário tornando objetos, ações e opções visíveis.

**Exemplos no projeto:**
- Filtros sempre visíveis na tela de busca
- Histórico de buscas recentes
- Cards com foto + título + local (não exige lembrar IDs)
- Status com ícone + texto + cor (múltiplos canais)

---

### 7. Flexibilidade e eficiência de uso
Aceleradores — invisíveis para o usuário novato — podem acelerar a interação para o usuário experiente.

**Exemplos no projeto:**
- Busca rápida na home para usuários frequentes
- Atalhos no painel do funcionário (cadastro rápido)
- Filtros salvos ou favoritos

---

### 8. Design estético e minimalista
Diálogos não devem conter informações irrelevantes ou raramente necessárias.

**Exemplos no projeto:**
- Cards com apenas informações essenciais (foto, título, local, data, status)
- Detalhes completos apenas na tela de detalhes
- Interface limpa, sem poluição visual
- Uso generoso de espaço em branco

---

### 9. Ajudar usuários a reconhecer, diagnosticar e recuperar erros
Mensagens de erro devem ser expressas em linguagem simples, indicar precisamente o problema e sugerir solução.

**Exemplos no projeto:**
- "Nenhum objeto encontrado. Tente outros filtros." em vez de "Erro 404"
- "Preencha o campo 'Local' para continuar" em vez de "Campo obrigatório"
- Destaque visual do campo com erro (borda vermelha + mensagem)

---

### 10. Ajuda e documentação
Mesmo que o sistema possa ser usado sem documentação, pode ser necessário fornecer ajuda. A informação deve ser fácil de buscar e focada na tarefa.

**Exemplos no projeto:**
- Seção "Ajuda/FAQ" com perguntas frequentes
- Tooltips em campos complexos
- Tutorial rápido no primeiro acesso (onboarding)

---

## Heurísticas Escolhidas para o Projeto (4 obrigatórias)

| # | Heurística | Justificativa da escolha |
|---|---|---|
| 1 | Visibilidade do estado do sistema | Essencial para que o usuário saiba o status do objeto e da solicitação |
| 2 | Consistência e padrões | Garante que a interface seja previsível e fácil de aprender |
| 3 | Prevenção de erros | Evita frustrações em formulários e ações irreversíveis |
| 4 | Reconhecimento em vez de memorização | Facilita o uso por usuários com diferentes níveis de experiência |

---

## Referência

NIELSEN, J. **10 Usability Heuristics for User Interface Design**. Nielsen Norman Group, 1994. Disponível em: https://www.nngroup.com/articles/ten-usability-heuristics/
