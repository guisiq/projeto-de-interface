# Checklist de Conexões do Protótipo — Figma

## Como usar este checklist

Para cada conexão, selecione o **elemento de origem** (botão/ícone) no Figma, aba Prototype, e arraste o nó azul até o **frame de destino**. Configure: `On Click → Navigate to → [Destino]` com transição `Dissolve 300ms`.

---

## 🟢 FLUXO 1 — Onboarding (Boas-vindas → Login/Cadastro)

| # | Tela Origem | Elemento Clicável | Destino | ✅ |
|---|---|---|---|---|
| 1 | 01 — Boas-vindas | Botão "Entrar" | 02 — Login | ☐ |
| 2 | 01 — Boas-vindas | Botão "Criar conta" | 03 — Cadastro Usuário | ☐ |
| 3 | 02 — Login | Botão "Entrar como aluno" | 04 — Home | ☐ |
| 4 | 02 — Login | Botão "Entrar como funcionário" | 13 — Painel Admin | ☐ |
| 5 | 02 — Login | Ícone ← (arrow_back) | 01 — Boas-vindas | ☐ |
| 6 | 02 — Login | Link "Esqueci minha senha" | **VARIAÇÃO: 02E — Login Erro** | ☐ |
| 7 | 03 — Cadastro Usuário | Botão "Criar conta" | 02 — Login | ☐ |
| 8 | 03 — Cadastro Usuário | Botão "Cancelar" | 01 — Boas-vindas | ☐ |
| 9 | 03 — Cadastro Usuário | Ícone ← (arrow_back) | 01 — Boas-vindas | ☐ |

---

## 🔵 FLUXO 2 — Home do Aluno (Navegação principal)

| # | Tela Origem | Elemento Clicável | Destino | ✅ |
|---|---|---|---|---|
| 10 | 04 — Home | Ícone notificações (sino) | 21 — Notificações | ☐ |
| 11 | 04 — Home | Barra de busca (campo) | 05 — Buscar | ☐ |
| 12 | 04 — Home | Link "Ver todos" (objetos recentes) | 05 — Buscar | ☐ |
| 13 | 04 — Home | Card de objeto (qualquer) | 07 — Detalhes | ☐ |
| 14 | 04 — Home | Link "Ver todas" (solicitações) | 12 — Solicitações | ☐ |
| 15 | 04 — Home | Row "Garrafa térmica verde" | 12 — Solicitações | ☐ |
| 16 | 04 — Home | FAB (+) | 10 — Cadastrar Perdido | ☐ |
| 17 | 04 — Home | Nav: Home (ativo) | — (já está na Home) | ☐ |
| 18 | 04 — Home | Nav: Buscar | 05 — Buscar | ☐ |
| 19 | 04 — Home | Nav: Cadastrar | 10 — Cadastrar Perdido | ☐ |
| 20 | 04 — Home | Nav: Solicitações | 12 — Solicitações | ☐ |
| 21 | 04 — Home | Nav: Perfil | 22 — Perfil | ☐ |

---

## 🔍 FLUXO 3 — Busca e Filtros

| # | Tela Origem | Elemento Clicável | Destino | ✅ |
|---|---|---|---|---|
| 22 | 05 — Buscar | Ícone ← (arrow_back) | 04 — Home | ☐ |
| 23 | 05 — Buscar | Botão filtro "Local" | 06 — Filtros Avançados | ☐ |
| 24 | 05 — Buscar | Botão filtro "Data" | 06 — Filtros Avançados | ☐ |
| 25 | 05 — Buscar | Botão filtro "Status" | 06 — Filtros Avançados | ☐ |
| 26 | 05 — Buscar | Card resultado (qualquer) | 07 — Detalhes | ☐ |
| 27 | 05 — Buscar | Nav: Home | 04 — Home | ☐ |
| 28 | 05 — Buscar | Nav: Cadastrar | 10 — Cadastrar Perdido | ☐ |
| 29 | 05 — Buscar | Nav: Solicitações | 12 — Solicitações | ☐ |
| 30 | 05 — Buscar | Nav: Perfil | 22 — Perfil | ☐ |
| 31 | 06 — Filtros Avançados | Ícone ← (arrow_back) | 05 — Buscar | ☐ |
| 32 | 06 — Filtros Avançados | Botão "Limpar filtros" | 05 — Buscar | ☐ |
| 33 | 06 — Filtros Avançados | Botão "Aplicar filtros" | 05 — Buscar | ☐ |

---

## 📦 FLUXO 4 — Detalhes + Solicitar Retirada

| # | Tela Origem | Elemento Clicável | Destino | ✅ |
|---|---|---|---|---|
| 34 | 07 — Detalhes | Ícone ← (arrow_back) | 05 — Buscar | ☐ |
| 35 | 07 — Detalhes | Botão "Solicitar Retirada" | 08 — Solicitar Retirada | ☐ |
| 36 | 08 — Solicitar Retirada | Ícone ← (arrow_back) | 07 — Detalhes | ☐ |
| 37 | 08 — Solicitar Retirada | Botão "Cancelar" | 07 — Detalhes | ☐ |
| 38 | 08 — Solicitar Retirada | Botão "Enviar Solicitação" | 09 — Confirmação Solicitação | ☐ |
| 39 | 09 — Confirmação Solicitação | Botão "Ver minhas solicitações" | 12 — Solicitações | ☐ |
| 40 | 09 — Confirmação Solicitação | Link "Voltar ao início" | 04 — Home | ☐ |

---

## ✏️ FLUXO 5 — Cadastrar Objeto Perdido

| # | Tela Origem | Elemento Clicável | Destino | ✅ |
|---|---|---|---|---|
| 41 | 10 — Cadastrar Perdido | Ícone ← (arrow_back) | 04 — Home | ☐ |
| 42 | 10 — Cadastrar Perdido | Botão "Cancelar" | 04 — Home | ☐ |
| 43 | 10 — Cadastrar Perdido | Botão "Enviar Cadastro" | 11 — Confirmação Cadastro | ☐ |
| 44 | 11 — Confirmação Cadastro | Botão "Voltar ao início" | 04 — Home | ☐ |
| 45 | 11 — Confirmação Cadastro | Link "Buscar meu objeto" | 05 — Buscar | ☐ |

---

## 📋 FLUXO 6 — Solicitações do Aluno

| # | Tela Origem | Elemento Clicável | Destino | ✅ |
|---|---|---|---|---|
| 46 | 12 — Solicitações | Card (qualquer item) | 07 — Detalhes | ☐ |
| 47 | 12 — Solicitações | Nav: Home | 04 — Home | ☐ |
| 48 | 12 — Solicitações | Nav: Buscar | 05 — Buscar | ☐ |
| 49 | 12 — Solicitações | Nav: Cadastrar | 10 — Cadastrar Perdido | ☐ |
| 50 | 12 — Solicitações | Nav: Perfil | 22 — Perfil | ☐ |

---

## 🛡️ FLUXO 7 — Painel Admin (Navegação principal)

| # | Tela Origem | Elemento Clicável | Destino | ✅ |
|---|---|---|---|---|
| 51 | 13 — Painel Admin | Ícone notificações (sino) | 21 — Notificações | ☐ |
| 52 | 13 — Painel Admin | Botão "Cadastrar objeto encontrado" | 16 — Cadastrar Encontrado | ☐ |
| 53 | 13 — Painel Admin | Link "Ver todas" (solicitações) | 14 — Lista Objetos | ☐ |
| 54 | 13 — Painel Admin | Botão "Validar" (card pendente) | 18 — Validar Solicitação | ☐ |
| 55 | 13 — Painel Admin | Botão "Rejeitar" (card pendente) | **VARIAÇÃO: 13R — Rejeição Confirmada** | ☐ |
| 56 | 13 — Painel Admin | Nav: Objetos | 14 — Lista Objetos | ☐ |
| 57 | 13 — Painel Admin | Nav: Solicitações | 18 — Validar Solicitação | ☐ |
| 58 | 13 — Painel Admin | Nav: Histórico | 15 — Histórico | ☐ |
| 59 | 13 — Painel Admin | Nav: Perfil | 22 — Perfil | ☐ |

---

## 📂 FLUXO 8 — Lista Objetos + Histórico (Admin)

| # | Tela Origem | Elemento Clicável | Destino | ✅ |
|---|---|---|---|---|
| 60 | 14 — Lista Objetos | Ícone ← (arrow_back) | 13 — Painel Admin | ☐ |
| 61 | 14 — Lista Objetos | Ícone + (add) | 16 — Cadastrar Encontrado | ☐ |
| 62 | 14 — Lista Objetos | Card "Carregador USB-C" | 07 — Detalhes | ☐ |
| 63 | 14 — Lista Objetos | Card "Fone ag. retirada" | 19 — Encerramento Caso | ☐ |
| 64 | 14 — Lista Objetos | Nav: Painel | 13 — Painel Admin | ☐ |
| 65 | 14 — Lista Objetos | Nav: Solicitações | 18 — Validar Solicitação | ☐ |
| 66 | 14 — Lista Objetos | Nav: Histórico | 15 — Histórico | ☐ |
| 67 | 14 — Lista Objetos | Nav: Perfil | 22 — Perfil | ☐ |
| 68 | 15 — Histórico | Ícone ← (arrow_back) | 13 — Painel Admin | ☐ |
| 69 | 15 — Histórico | Nav: Painel | 13 — Painel Admin | ☐ |
| 70 | 15 — Histórico | Nav: Objetos | 14 — Lista Objetos | ☐ |
| 71 | 15 — Histórico | Nav: Solicitações | 18 — Validar Solicitação | ☐ |
| 72 | 15 — Histórico | Nav: Perfil | 22 — Perfil | ☐ |

---

## ➕ FLUXO 9 — Cadastrar Encontrado (Admin)

| # | Tela Origem | Elemento Clicável | Destino | ✅ |
|---|---|---|---|---|
| 73 | 16 — Cadastrar Encontrado | Ícone ← (arrow_back) | 13 — Painel Admin | ☐ |
| 74 | 16 — Cadastrar Encontrado | Botão "Cancelar" | 13 — Painel Admin | ☐ |
| 75 | 16 — Cadastrar Encontrado | Botão "Publicar Objeto" | 17 — Confirmação Encontrado | ☐ |
| 76 | 17 — Confirmação Encontrado | Botão "Ver objetos cadastrados" | 14 — Lista Objetos | ☐ |
| 77 | 17 — Confirmação Encontrado | Link "Voltar ao painel" | 13 — Painel Admin | ☐ |

---

## ✅ FLUXO 10 — Validar Solicitação + Encerramento (Admin)

| # | Tela Origem | Elemento Clicável | Destino | ✅ |
|---|---|---|---|---|
| 78 | 18 — Validar Solicitação | Ícone ← (arrow_back) | 13 — Painel Admin | ☐ |
| 79 | 18 — Validar Solicitação | Botão "Rejeitar solicitação" | **VARIAÇÃO: 18R — Rejeição** | ☐ |
| 80 | 18 — Validar Solicitação | Botão "Aprovar retirada" | 19 — Encerramento Caso | ☐ |
| 81 | 19 — Encerramento Caso | Ícone ← (arrow_back) | 18 — Validar Solicitação | ☐ |
| 82 | 19 — Encerramento Caso | Botão "Voltar" | 18 — Validar Solicitação | ☐ |
| 83 | 19 — Encerramento Caso | Botão "Encerrar caso" | 15 — Histórico | ☐ |

---

## 🔔 FLUXO 11 — Notificações, Perfil, Ajuda

| # | Tela Origem | Elemento Clicável | Destino | ✅ |
|---|---|---|---|---|
| 84 | 20 — Ajuda | Ícone ← (arrow_back) | 04 — Home | ☐ |
| 85 | 21 — Notificações | Ícone ← (arrow_back) | 04 — Home | ☐ |
| 86 | 22 — Perfil | Item "Ajuda / FAQ" | 20 — Ajuda | ☐ |
| 87 | 22 — Perfil | Item "Sair" | 01 — Boas-vindas | ☐ |
| 88 | 22 — Perfil | Nav: Home | 04 — Home | ☐ |
| 89 | 22 — Perfil | Nav: Buscar | 05 — Buscar | ☐ |
| 90 | 22 — Perfil | Nav: Cadastrar | 10 — Cadastrar Perdido | ☐ |
| 91 | 22 — Perfil | Nav: Solicitações | 12 — Solicitações | ☐ |

---

---

# 🔴 VARIAÇÕES DE TELA — Estados de Erro / Feedback

Estas telas devem ser **duplicadas** a partir da tela original e modificadas para mostrar mensagens de erro. No Figma: selecione o frame → Ctrl+D (duplicar) → renomeie → edite os campos com erro.

---

## VARIAÇÃO 1: Login — Erro de credenciais
**Nome no Figma:** `02E — Login (Erro)`  
**Baseada em:** 02 — Login  
**Alterações:**
- Campo e-mail com borda vermelha (#B91C1C)
- Campo senha com borda vermelha
- Mensagem de erro abaixo dos campos: _"E-mail ou senha incorretos. Verifique seus dados e tente novamente."_
- Ícone `error` ao lado da mensagem
- Conexões: Botão "Entrar" → permanece nesta tela (simula retry)

---

## VARIAÇÃO 2: Login — Campo vazio
**Nome no Figma:** `02V — Login (Campos vazios)`  
**Baseada em:** 02 — Login  
**Alterações:**
- Campos com valor vazio
- Borda vermelha nos campos obrigatórios
- Texto abaixo de cada campo: _"Campo obrigatório"_
- Cor do texto de erro: #B91C1C

---

## VARIAÇÃO 3: Cadastro Usuário — E-mail inválido
**Nome no Figma:** `03E — Cadastro (Erro email)`  
**Baseada em:** 03 — Cadastro Usuário  
**Alterações:**
- Campo e-mail com borda vermelha
- Texto: _"Use um e-mail institucional (@unitins.br)"_
- Valor do campo: "beatriz@gmail.com" (e-mail não-institucional)

---

## VARIAÇÃO 4: Cadastro Usuário — Senha fraca
**Nome no Figma:** `03S — Cadastro (Senha fraca)`  
**Baseada em:** 03 — Cadastro Usuário  
**Alterações:**
- Campo senha com borda amarela (#B45309)
- Texto: _"A senha deve ter no mínimo 8 caracteres, incluindo letra e número."_
- Indicador visual de força da senha (barra vermelha "Fraca")

---

## VARIAÇÃO 5: Cadastrar Perdido — Campos obrigatórios
**Nome no Figma:** `10E — Cadastrar Perdido (Erro)`  
**Baseada em:** 10 — Cadastrar Perdido  
**Alterações:**
- Campos "Nome do objeto", "Categoria" e "Local" com borda vermelha
- Texto abaixo de cada: _"Campo obrigatório"_
- Campos estão vazios (sem valor preenchido)
- Toast/banner no topo: _"Preencha todos os campos obrigatórios"_

---

## VARIAÇÃO 6: Solicitar Retirada — Sem documento
**Nome no Figma:** `08E — Solicitar Retirada (Erro)`  
**Baseada em:** 08 — Solicitar Retirada  
**Alterações:**
- Área de upload com borda vermelha tracejada
- Texto: _"Anexe um documento para comprovar sua identidade"_
- Campo "Descreva características" vazio com borda vermelha
- Botão "Enviar" desabilitado (opacidade 50%)

---

## VARIAÇÃO 7: Cadastrar Encontrado — Sem foto
**Nome no Figma:** `16E — Cadastrar Encontrado (Erro)`  
**Baseada em:** 16 — Cadastrar Encontrado  
**Alterações:**
- Área de foto com borda vermelha
- Texto: _"A foto do objeto é obrigatória para publicação"_
- Campos de texto vazios com borda vermelha

---

## VARIAÇÃO 8: Buscar — Nenhum resultado
**Nome no Figma:** `05V — Buscar (Sem resultados)`  
**Baseada em:** 05 — Buscar  
**Alterações:**
- Remover todos os cards de resultado
- Ilustração central: ícone `search_off` grande (48px)
- Texto: _"Nenhum objeto encontrado"_
- Subtexto: _"Tente outros termos ou ajuste os filtros"_
- Valor da busca: "notebook rosa" (algo sem resultados)

---

## VARIAÇÃO 9: Solicitação Rejeitada (Aluno)
**Nome no Figma:** `09R — Solicitação Rejeitada`  
**Baseada em:** 09 — Confirmação Solicitação  
**Alterações:**
- Ícone `cancel` vermelho ao invés de `check_circle` verde
- Título: _"Solicitação não aprovada"_
- Descrição: _"O responsável não conseguiu confirmar que o objeto é seu. Verifique os dados e tente novamente."_
- Badge: "Rejeitada" (vermelho)
- Botão: "Tentar novamente" → 08 — Solicitar Retirada
- Link: "Voltar ao início" → 04 — Home

---

## VARIAÇÃO 10: Rejeição pelo Admin
**Nome no Figma:** `18R — Validar (Rejeição confirmada)`  
**Baseada em:** 18 — Validar Solicitação  
**Alterações:**
- Overlay/modal com fundo escuro semi-transparente
- Card central: _"Deseja rejeitar esta solicitação?"_
- Campo: _"Motivo da rejeição (obrigatório)"_
- Botão vermelho: "Confirmar rejeição"
- Botão cinza: "Cancelar"

---

## VARIAÇÃO 11: Conexão/Erro de rede
**Nome no Figma:** `00E — Erro de Conexão`  
**Baseada em:** qualquer tela (criar genérica)  
**Alterações:**
- Tela centralizada
- Ícone `wifi_off` grande (64px) com cor #64748B
- Título: _"Sem conexão com a internet"_
- Subtexto: _"Verifique sua conexão e tente novamente"_
- Botão: "Tentar novamente"

---

---

# 📊 RESUMO

| Categoria | Quantidade |
|-----------|-----------|
| Conexões totais a criar | **91** |
| Variações de erro a criar | **11 telas** |
| Total de telas no Figma (com variações) | **33 frames** |

---

## ⚡ Dica de produtividade no Figma

1. **Duplicar rapidamente:** Selecione o frame → `Ctrl+D` → renomeie
2. **Copiar conexões similares:** Se a bottom nav é igual entre telas, duplique um frame já conectado
3. **Agrupar por seção:** Use Sections no Figma (Shift+S) para organizar visualmente os fluxos
4. **Testar:** Pressione `▶ Play` e navegue pelo protótipo para validar cada conexão
