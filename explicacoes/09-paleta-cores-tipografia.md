# Paleta de Cores e Tipografia — Definição e Escolhas

## Paleta de Cores

### O que é uma Paleta de Cores em UI Design?

A paleta de cores é o conjunto limitado de cores usado consistentemente em toda a interface. Ela comunica identidade, hierarquia, estados e emoções. Uma boa paleta é harmônica, acessível e funcional.

### Princípios para escolha de cores:

1. **Contraste adequado** — Texto sobre fundo deve ter ratio mínimo de 4.5:1 (WCAG AA).
2. **Hierarquia** — Cor primária para ações principais, secundária para elementos de apoio.
3. **Significado** — Cores devem ter significado consistente (vermelho = erro, verde = sucesso).
4. **Acessibilidade** — Informação nunca deve depender apenas de cor (usar texto + ícone também).
5. **Harmonia** — Usar lógica cromática (complementares, análogas, tríade etc.).

---

### Paleta Escolhida para o Projeto (Revisada)

> Paleta original substituída por versão mais coesa e sóbria, baseada em pesquisa no Color Hunt e Coolors.

| Cor | Código HEX | Nome | Uso na interface |
|---|---|---|---|
| Primária | #1E3A5F | Azul Naval | Botões principais, links, header |
| Secundária | #2E7D8C | Teal Médio | Ações secundárias, bordas de destaque |
| Accent | #4A90D9 | Azul Claro | Ícones ativos, chips selecionados |
| Fundo | #F5F7FA | Cinza Névoa | Background geral |
| Superfície | #FFFFFF | Branco | Cards, modais, formulários |
| Texto principal | #1E293B | Azul-Carvão | Corpo de texto, labels |
| Texto secundário | #64748B | Slate Médio | Informações auxiliares, placeholders |
| Alerta/Erro | #B91C1C | Vermelho Escuro | Erros, status "Perdido" |
| Aviso | #B45309 | Âmbar Escuro | Status "Em análise" |
| Sucesso | #15803D | Verde Escuro | Status "Finalizado", confirmações |
| Info | #1D4ED8 | Azul Profundo | Status "Aguardando retirada" |

---

### Lógica Cromática

**Esquema:** Análogo azul (azul naval → azul claro → teal) — todas as cores base ocupam o mesmo arco do círculo cromático.

**Por que mudar a paleta anterior?**
- #1565C0 (azul Material Design primário) e #26A69A (teal Material Design) têm saturações díspares e criam contraste de croma excessivo.
- As cores de status (#E53935, #FB8C00, #43A047) eram muito saturadas ("neon"), inadequadas para contexto institucional sério.
- A nova paleta usa tons escurecidos e dessaturados que harmonizam entre si.

**Justificativa da nova paleta:**
- **Azul Naval (#1E3A5F)** — autoridade, confiança, seriedade acadêmica. Pesado o suficiente para ser primária sem saturação agressiva.
- **Teal Médio (#2E7D8C)** — conecta-se ao azul por vizinhança no círculo; mais suave que o verde-água anterior.
- **Azul Claro (#4A90D9)** — versão mais clara da primária, usada para estados ativos e ícones sem criar dissonância.
- **Fundo Cinza Névoa (#F5F7FA)** — menos frio que #FAFAFA, mais agradável para uso prolongado.
- **Status escuros** (vermelho, âmbar, verde) — melhor relação de contraste sobre fundo claro, aparência mais madura.

---

### Relação com as Personas

| Persona | Cores favoritas | Como influenciou a paleta |
|---|---|---|
| Ana (19, aluna) | Azul, roxo, branco | Azul como cor primária; interface limpa |
| Carlos (45, funcionário) | Verde, cinza, azul | Verde-água como secundária; tons neutros |
| Beatriz (23, PCD) | Azul, amarelo, preto | Alto contraste; alertas amarelos visíveis |

---

### Ferramenta utilizada

- **Coolors** (coolors.co) — para gerar e testar combinações
- **WebAIM Contrast Checker** — para validar acessibilidade de contraste

---

## Tipografia

### O que considerar na escolha tipográfica?

1. **Legibilidade** — Fácil de ler em tamanhos pequenos (mobile).
2. **Acessibilidade** — Fontes sem serifa são geralmente mais legíveis em telas.
3. **Hierarquia** — Diferentes pesos (regular, medium, bold) para diferenciar títulos, corpo e labels.
4. **Disponibilidade** — Fontes do Google Fonts são gratuitas e web-safe.
5. **Neutralidade** — Em contexto acadêmico, evitar fontes "divertidas" ou muito estilizadas.

---

### Tipografia Escolhida

| Uso | Fonte | Peso | Tamanho sugerido |
|---|---|---|---|
| Títulos (H1-H2) | Inter | Bold (700) | 24-32px |
| Subtítulos (H3) | Inter | SemiBold (600) | 18-20px |
| Corpo de texto | Inter | Regular (400) | 14-16px |
| Labels e captions | Inter | Medium (500) | 12-14px |
| Botões | Inter | SemiBold (600) | 14-16px |

**Fonte principal:** Inter (Google Fonts)  
**Fonte secundária:** Não necessária (Inter cobre todos os usos com variação de peso)

**Justificativa:**
- Inter foi projetada especificamente para telas digitais.
- Excelente legibilidade em tamanhos pequenos.
- Ampla variedade de pesos.
- Gratuita e amplamente suportada.
- Estilo neutro e profissional, adequado ao contexto acadêmico.

---

## Ícones

### Biblioteca escolhida: Material Icons (Google)

**Justificativa:**
- Amplamente reconhecida e padronizada.
- Consistente com o estilo da fonte Inter.
- Disponível em múltiplos estilos (outlined, filled, rounded).
- Gratuita e com milhares de opções.
- Boa acessibilidade (ícones claros e universais).

### Ícones principais do projeto:

| Ícone | Significado | Onde aparece |
|---|---|---|
| search | Buscar | Campo de busca, barra de navegação |
| notifications | Notificações | Header, aba de notificações |
| person | Perfil/Conta | Menu, perfil |
| add_circle | Cadastrar | Botão flutuante, menu |
| place | Localização | Cards, detalhes do objeto |
| photo_camera | Foto | Upload de imagem |
| check_circle | Sucesso/Confirmação | Status finalizado, feedback |
| warning | Alerta | Status perdido, erros |
| filter_list | Filtros | Tela de busca |
| history | Histórico | Painel admin |
| inventory | Objetos | Cards, listas |
| verified | Validado | Status de retirada aprovada |
