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

### Paleta Escolhida para o Projeto

| Cor | Código HEX | Nome | Uso na interface |
|---|---|---|---|
| Primária | #1565C0 | Azul Institucional | Botões principais, links, header |
| Secundária | #26A69A | Verde-água | Ações secundárias, destaques positivos |
| Fundo | #FAFAFA | Cinza muito claro | Background geral |
| Superfície | #FFFFFF | Branco | Cards, modais, formulários |
| Texto principal | #212121 | Cinza escuro | Corpo de texto |
| Texto secundário | #757575 | Cinza médio | Labels, informações auxiliares |
| Alerta/Erro | #E53935 | Vermelho | Erros, status "Perdido" |
| Aviso | #FB8C00 | Laranja/Amarelo | Status "Em análise" |
| Sucesso | #43A047 | Verde | Status "Finalizado", confirmações |
| Status neutro | #1E88E5 | Azul claro | Status "Aguardando retirada" |

---

### Lógica Cromática

**Esquema:** Complementar dividida (azul como base + verde-água como complementar próximo).

**Justificativa:**
- **Azul** transmite confiança, seriedade e organização — adequado para ambiente acadêmico/institucional.
- **Verde-água** transmite acessibilidade, modernidade e calma.
- **Fundo claro** reduz fadiga visual e aumenta legibilidade.
- **Cores de status** seguem convenções universais (vermelho = problema, verde = ok, amarelo = atenção).

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
