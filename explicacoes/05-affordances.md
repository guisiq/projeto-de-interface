# Affordances — Definição e Aplicação

## O que é Affordance?

Affordance (do inglês "afford" = proporcionar) é um conceito introduzido por James J. Gibson (1979) na psicologia ecológica e adaptado para o design por Donald Norman (1988). Em IHC, affordance refere-se às propriedades percebidas de um elemento de interface que sugerem como ele deve ser usado.

Em outras palavras: **affordance é a "pista" que um elemento visual dá ao usuário sobre o que ele pode fazer com aquele elemento.**

---

## Tipos de Affordance

### 1. Affordance Explícita (Textual)
O elemento comunica sua função diretamente por meio de texto.

**Exemplos:**
- Botão com texto "Solicitar retirada"
- Link com texto "Ver detalhes"
- Botão "Cadastrar objeto"
- Label "Buscar por nome ou categoria"

**No projeto:** Todos os botões de ação possuem texto claro descrevendo o que acontece ao clicar.

---

### 2. Affordance de Padrão (Convencional)
O elemento segue convenções amplamente conhecidas da web/mobile, então o usuário já sabe como interagir.

**Exemplos:**
- Campo de texto com borda e placeholder → "posso digitar aqui"
- Card com sombra e borda arredondada → "posso clicar para ver mais"
- Menu hambúrguer (☰) → "posso abrir o menu"
- Ícone de lixeira → "posso excluir"
- Pull-to-refresh → "posso puxar para atualizar"

**No projeto:** Cards de objetos, campos de busca, filtros dropdown e navegação inferior seguem padrões convencionais.

---

### 3. Affordance Metafórica (Icônica)
O elemento usa metáforas visuais do mundo real para comunicar sua função.

**Exemplos:**
- 🔍 Lupa → buscar
- 🔔 Sino → notificações
- 👤 Silhueta → perfil/conta
- 📍 Pin de localização → onde foi encontrado
- 📷 Câmera → tirar/enviar foto
- ✅ Check → confirmação/sucesso
- ⚠️ Triângulo com exclamação → alerta/atenção

**No projeto:** Todos os ícones da navegação e das ações seguem metáforas visuais reconhecíveis.

---

### 4. Affordance Física (Sensorial)
Propriedades visuais como tamanho, cor, elevação e contraste que sugerem interatividade.

**Exemplos:**
- Botão com cor de destaque e sombra → "sou clicável"
- Botão desabilitado (cinza, sem sombra) → "não posso ser clicado agora"
- Elemento com hover (muda de cor ao passar o mouse) → "sou interativo"
- Tamanho maior → "sou mais importante"

**No projeto:** Botões primários têm cor de destaque (azul), elevação e tamanho maior que elementos não interativos.

---

### 5. Affordance Negativa (Anti-affordance)
Propriedades que comunicam que algo NÃO pode ou NÃO deve ser feito.

**Exemplos:**
- Botão cinza claro → "estou desabilitado"
- Campo de texto somente leitura (fundo cinza) → "não posso editar"
- Cursor padrão (seta) sobre texto → "não é clicável"

**No projeto:** Botão "Enviar" fica desabilitado até o formulário estar completo; campos de status são somente leitura para o aluno.

---

## Aplicação no Projeto — Por Tela

| Tela | Tipo de affordance | Onde aparece | Função | Como ajuda o usuário |
|---|---|---|---|---|
| Home | Padrão | Cards de objetos recentes | Clicar para ver detalhes | Cards com sombra sugerem clicabilidade |
| Buscar | Metafórica | Ícone de lupa no campo | Indicar função de busca | Usuário reconhece imediatamente |
| Detalhes | Explícita | Botão "Solicitar retirada" | Iniciar processo de recuperação | Texto claro elimina dúvida |
| Cadastro | Física | Botão azul grande | Enviar formulário | Cor + tamanho comunicam ação principal |
| Painel admin | Negativa | Status "Finalizado" sem botão de ação | Indicar caso encerrado | Ausência de botão comunica fim do fluxo |

---

## Relação com Acessibilidade

Para a persona Beatriz (PCD auditiva), affordances visuais são essenciais:
- Toda informação deve ter redundância visual (texto + ícone + cor)
- Status nunca pode depender apenas de cor (daltonismo) — sempre texto + ícone
- Feedback de ações deve ser visual (toast, badge, animação) e nunca apenas sonoro

---

## Referências

- NORMAN, D. **The Design of Everyday Things**. Basic Books, 2013.
- GIBSON, J. J. **The Ecological Approach to Visual Perception**. Psychology Press, 1979.
