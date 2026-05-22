# Protótipo de Alta Fidelidade — Definição e Planejamento

## O que é um Protótipo de Alta Fidelidade?

É a versão visual final da interface, com todas as decisões de design aplicadas: cores, tipografia, ícones, espaçamento, imagens e interações. Diferente do wireframe, o protótipo de alta fidelidade se parece com o produto final e permite testar a experiência completa do usuário.

---

## Diferença entre Wireframe e Protótipo de Alta Fidelidade

| Aspecto | Wireframe (Baixa) | Protótipo (Alta) |
|---|---|---|
| Cores | Cinza/preto/branco | Paleta final |
| Tipografia | Genérica | Fonte definida (Inter) |
| Imagens | Placeholders | Imagens reais ou realistas |
| Interações | Nenhuma ou básica | Navegação completa |
| Ícones | Simples ou ausentes | Biblioteca definida |
| Objetivo | Testar estrutura | Testar experiência |
| Ferramenta | Papel, Balsamiq | Figma |

---

## Ferramenta: Figma

### Por que Figma?

- Gratuito para estudantes.
- Colaborativo em tempo real.
- Suporte a protótipos interativos (navegação entre telas).
- Ampla comunidade e templates.
- Suporte a componentes reutilizáveis (Design System).
- Exportação de assets para desenvolvimento.

---

## Telas Planejadas (mínimo 15, sem contar login)

| # | Tela | Perfil | Descrição resumida |
|---|---|---|---|
| 1 | Tela de boas-vindas | Público | Apresentação do app + botões Login/Cadastro |
| 2 | Home do aluno | Aluno | Objetos recentes, busca rápida, ações |
| 3 | Buscar objetos | Aluno | Campo de busca + filtros |
| 4 | Resultado da busca | Aluno | Lista de cards com resultados |
| 5 | Filtros avançados | Aluno | Modal/tela com filtros detalhados |
| 6 | Detalhes do objeto | Aluno | Foto, descrição, local, status, ação |
| 7 | Solicitar retirada | Aluno | Formulário curto + confirmação |
| 8 | Confirmação da solicitação | Aluno | Feedback de sucesso + próximos passos |
| 9 | Cadastrar objeto perdido | Aluno | Formulário de cadastro |
| 10 | Minhas solicitações | Aluno | Lista de solicitações com status |
| 11 | Notificações | Aluno | Lista de alertas e atualizações |
| 12 | Perfil do usuário | Ambos | Dados pessoais + configurações |
| 13 | Ajuda/FAQ | Ambos | Perguntas frequentes |
| 14 | Painel do funcionário | Admin | Dashboard com resumo e ações |
| 15 | Cadastrar objeto encontrado | Admin | Formulário de cadastro |
| 16 | Lista de objetos cadastrados | Admin | Tabela/lista de todos os itens |
| 17 | Validação de solicitação | Admin | Detalhes + aprovar/rejeitar |
| 18 | Encerramento do caso | Admin | Confirmação de finalização |

---

## Componentes Reutilizáveis (Design System)

### Botões
- **Primário:** Fundo azul (#1565C0), texto branco, bordas arredondadas (8px), altura 48px
- **Secundário:** Borda azul, fundo transparente, texto azul
- **Terciário:** Apenas texto azul (link style)
- **Desabilitado:** Fundo cinza claro, texto cinza

### Cards de Objeto
- Fundo branco, sombra suave, bordas arredondadas (12px)
- Miniatura da foto à esquerda
- Título (bold) + local + data
- Badge de status no canto superior direito
- Clicável (cursor pointer, hover com sombra maior)

### Badges de Status
| Status | Cor de fundo | Cor do texto | Ícone |
|---|---|---|---|
| Perdido | #FFCDD2 (vermelho claro) | #C62828 | warning |
| Encontrado | #C8E6C9 (verde claro) | #2E7D32 | inventory |
| Em análise | #FFF3E0 (laranja claro) | #E65100 | hourglass |
| Aguardando retirada | #BBDEFB (azul claro) | #1565C0 | schedule |
| Finalizado | #C8E6C9 (verde claro) | #2E7D32 | check_circle |

### Inputs/Campos
- Borda cinza (#BDBDBD), arredondamento 8px, altura 48px
- Label acima do campo (nunca apenas placeholder)
- Estado de foco: borda azul (#1565C0)
- Estado de erro: borda vermelha + mensagem abaixo
- Placeholder em cinza claro

### Filtros
- Chips horizontais com scroll
- Estado ativo: fundo azul, texto branco
- Estado inativo: fundo cinza claro, texto escuro
- Ícone "X" para remover filtro ativo

### Alertas/Feedback
- **Sucesso:** Fundo verde claro, ícone check, texto verde escuro
- **Erro:** Fundo vermelho claro, ícone error, texto vermelho escuro
- **Info:** Fundo azul claro, ícone info, texto azul escuro
- **Aviso:** Fundo amarelo claro, ícone warning, texto laranja escuro
- Posição: topo da tela (toast) ou inline no formulário

### Navegação
- **Mobile:** Barra inferior com 4-5 ícones + labels
- **Desktop:** Menu lateral colapsável
- Item ativo: cor primária + indicador visual
- Sempre visível (nunca esconder a navegação principal)

---

## Diretrizes de Acessibilidade no Protótipo

1. Todo texto sobre fundo deve ter contraste mínimo 4.5:1 (AA).
2. Botões e áreas de toque: mínimo 44x44px (mobile).
3. Informação nunca transmitida apenas por cor — sempre texto + ícone.
4. Labels visíveis em todos os campos (não apenas placeholder).
5. Hierarquia visual clara com tamanhos de fonte distintos.
6. Feedback de ações sempre visual e textual.
7. Navegação por teclado possível em todos os elementos interativos.
