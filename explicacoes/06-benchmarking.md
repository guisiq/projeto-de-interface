# Benchmarking — Definição e Análise

## O que é Benchmarking em Design de Interface?

Benchmarking é o processo de pesquisar e analisar soluções já existentes no mercado que resolvem problemas similares ao do projeto. O objetivo é aprender com os acertos e erros de outros produtos para tomar decisões de design mais informadas.

---

## Por que fazer Benchmarking?

- Evitar "reinventar a roda" — aproveitar padrões que já funcionam.
- Identificar oportunidades de diferenciação.
- Validar que o problema existe e que outros já tentaram resolvê-lo.
- Encontrar padrões de interface que os usuários já conhecem.
- Justificar decisões de design com base em referências reais.

---

## O que analisar em cada referência?

1. **Funcionalidades principais** — O que o sistema faz?
2. **Fluxo de uso** — Quantos passos para completar a tarefa principal?
3. **Interface visual** — É limpa? Poluída? Moderna? Datada?
4. **Acessibilidade** — Atende PCDs? Tem alto contraste?
5. **Pontos fortes** — O que funciona bem?
6. **Pontos fracos** — O que é confuso ou problemático?
7. **Aprendizado** — O que podemos aplicar no nosso projeto?

---

## Referências Analisadas

### 1. Itens Achados — Universidade de São Paulo (USP)

**O que é:** Sistema web da USP onde a comunidade universitária pode registrar e buscar objetos perdidos no campus.

**Link:** https://portalservicos.usp.br (seção Achados e Perdidos, quando disponível)

**Pontos fortes:**
- Focado no ambiente universitário
- Permite busca por categoria e local
- Integrado ao portal de serviços da universidade

**Pontos fracos:**
- Interface antiga e pouco intuitiva
- Sem versão mobile responsiva
- Poucas informações visuais (sem fotos dos objetos)
- Processo burocrático para retirada

**Aprendizado para o projeto:**
- Incluir fotos dos objetos é essencial para identificação
- A interface precisa ser mobile-first (alunos usam celular)
- Simplificar o processo de retirada

---

### 2. TrackIF — Sistema de Chamados do IFSP

**O que é:** Sistema de abertura e acompanhamento de chamados internos, usado por institutos federais para gerenciar solicitações diversas, incluindo achados e perdidos em algumas unidades.

**Link:** Sistemas internos do IFSP (acesso restrito)

**Pontos fortes:**
- Sistema de tickets com status bem definidos
- Histórico completo de cada solicitação
- Notificações por e-mail sobre mudanças de status
- Perfis de acesso distintos (aluno, servidor)

**Pontos fracos:**
- Interface genérica (não é específica para achados e perdidos)
- Muitos campos desnecessários para itens simples
- Visual datado e pouco amigável
- Não tem busca por foto ou filtros visuais

**Aprendizado para o projeto:**
- O sistema de status (aberto → em análise → resolvido) funciona bem
- Notificações são importantes para manter o usuário informado
- A interface deve ser específica para o contexto (não genérica)

---

### 3. FoundIt (App de Achados e Perdidos)

**O que é:** Aplicativo mobile para comunidades reportarem objetos perdidos e encontrados em espaços compartilhados (universidades, condomínios, eventos).

**Link:** Disponível em lojas de aplicativos (Google Play / App Store)

**Pontos fortes:**
- Interface moderna e mobile-first
- Uso de fotos como elemento principal
- Cards visuais com informações resumidas
- Filtros por localização e data
- Chat entre quem perdeu e quem encontrou

**Pontos fracos:**
- Depende de massa crítica de usuários
- Sem validação de identidade (risco de fraude)
- Notificações excessivas
- Sem perfil administrativo (tudo peer-to-peer)

**Aprendizado para o projeto:**
- Cards com foto + título + local + data são eficazes
- A validação de identidade é necessária em ambiente institucional
- O perfil administrativo agrega segurança ao processo
- Interface mobile com filtros visuais é o padrão esperado

---

## Síntese dos Aprendizados

| Aspecto | Decisão para o projeto |
|---|---|
| Visual | Interface moderna, limpa, com cards e fotos |
| Busca | Filtros por categoria, local, data e status |
| Mobile | Design mobile-first responsivo |
| Status | Sistema de status claro e visual |
| Segurança | Validação de identidade para retirada |
| Perfis | Separar aluno (busca/solicita) e funcionário (gerencia) |
| Acessibilidade | Alto contraste, sem dependência de áudio |
| Notificações | Visuais e textuais, sem excessos |
