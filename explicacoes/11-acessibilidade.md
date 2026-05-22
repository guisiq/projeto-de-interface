# Acessibilidade em IHC — Definição e Aplicação

## O que é Acessibilidade Digital?

Acessibilidade digital é a prática de tornar sistemas, websites e aplicativos utilizáveis por todas as pessoas, independentemente de suas capacidades físicas, sensoriais ou cognitivas. Em IHC, é um princípio fundamental que garante inclusão e equidade no acesso à tecnologia.

---

## Por que é obrigatória neste projeto?

1. **Requisito acadêmico** — O template exige uma persona PCD.
2. **Requisito legal** — A Lei Brasileira de Inclusão (13.146/2015) exige acessibilidade digital.
3. **Requisito ético** — Design excludente é design ruim.
4. **Requisito técnico** — WCAG 2.1 define padrões internacionais.

---

## WCAG 2.1 — Resumo dos Princípios

### 1. Perceptível
A informação deve ser apresentada de forma que o usuário possa percebê-la.

- Alternativas textuais para conteúdo não-textual (alt text em imagens)
- Legendas para conteúdo em áudio/vídeo
- Contraste adequado (mínimo 4.5:1 para texto normal)
- Informação não depende apenas de cor

### 2. Operável
Os componentes de interface devem ser operáveis por todos.

- Navegação por teclado
- Tempo suficiente para interações
- Nenhum conteúdo que cause convulsões
- Mecanismos de navegação claros

### 3. Compreensível
A informação e a operação da interface devem ser compreensíveis.

- Textos legíveis e compreensíveis
- Comportamento previsível
- Ajuda para evitar e corrigir erros

### 4. Robusto
O conteúdo deve ser interpretável por diversas tecnologias assistivas.

- HTML semântico
- ARIA labels quando necessário
- Compatibilidade com leitores de tela

---

## Aplicação para PCD Auditiva (Persona Beatriz)

### O que NÃO fazer:
- Usar apenas áudio para transmitir informação
- Alertas sonoros sem equivalente visual
- Vídeos sem legenda
- Instruções que dependem de "ouvir"

### O que FAZER:
- Toda notificação é visual (badge, banner, toast)
- Status com texto + cor + ícone (redundância)
- Feedback de ações sempre textual
- Linguagem clara e direta (português simples)
- Animações sutis para chamar atenção (sem som)
- Vibração no mobile como alternativa ao som

---

## Checklist de Acessibilidade para o Projeto

| Critério | Status | Onde verificar |
|---|---|---|
| Contraste texto/fundo ≥ 4.5:1 | ☐ | Todas as telas |
| Informação não depende só de cor | ☐ | Badges de status |
| Áreas de toque ≥ 44x44px | ☐ | Botões e links |
| Labels visíveis em campos | ☐ | Formulários |
| Alt text em imagens | ☐ | Fotos de objetos |
| Feedback visual após ações | ☐ | Cadastro, solicitação |
| Navegação por teclado | ☐ | Todo o sistema |
| Hierarquia de headings | ☐ | Estrutura HTML |
| Textos claros e curtos | ☐ | Todas as telas |
| Sem dependência de áudio | ☐ | Notificações, alertas |

---

## Ferramentas de Validação

| Ferramenta | O que valida |
|---|---|
| WebAIM Contrast Checker | Ratio de contraste entre cores |
| axe DevTools | Erros de acessibilidade no código |
| WAVE | Análise visual de acessibilidade |
| Lighthouse (Chrome) | Pontuação geral de acessibilidade |
| Figma A11y Plugin | Contraste e hierarquia no protótipo |

---

## Referências

- W3C. **Web Content Accessibility Guidelines (WCAG) 2.1**. Disponível em: https://www.w3.org/TR/WCAG21/
- BRASIL. **Lei nº 13.146/2015** — Estatuto da Pessoa com Deficiência.
- WebAIM. **Contrast Checker**. Disponível em: https://webaim.org/resources/contrastchecker/
