# Personas — Definição e Detalhamento

## O que são Personas?

Personas são representações fictícias, porém realistas, de usuários típicos do sistema. Elas são criadas com base em pesquisa (entrevistas, observação, dados demográficos) e servem para guiar decisões de design, garantindo que o produto atenda às necessidades reais dos usuários.

---

## Por que usar Personas?

- Humanizam os dados de pesquisa.
- Ajudam a equipe a tomar decisões de design com foco no usuário real.
- Evitam o "design para todo mundo" (que não atende ninguém bem).
- Permitem priorizar funcionalidades com base em perfis concretos.
- Facilitam a comunicação entre membros da equipe sobre "para quem estamos projetando".

---

## Estrutura de uma Persona

| Campo | Descrição |
|---|---|
| Nome | Nome fictício, mas realista |
| Idade | Faixa etária do público representado |
| Ocupação | Profissão ou papel no contexto do sistema |
| Nível educacional | Grau de escolaridade |
| Acesso à internet | Tipo de conexão disponível |
| Acesso a smartphone | Se possui e qual tipo |
| Deficiência | Se possui alguma deficiência e qual |
| Cores favoritas | Preferências visuais (influenciam paleta) |
| Perfil de acesso | Papel no sistema (ex.: aluno, administrador) |
| Motivação | Por que essa pessoa usaria o sistema |

---

## Personas do Projeto

### Persona 1 — Ana (Aluna)

Ana representa o perfil majoritário de usuários: estudantes de graduação que perderam algo no campus e querem resolver isso rapidamente pelo celular. Ela é nativa digital, impaciente com interfaces confusas e espera resolver tudo em poucos toques.

**Implicações para o design:**
- Interface mobile-first
- Fluxos curtos (buscar → encontrar → solicitar)
- Linguagem jovem e direta
- Feedback imediato após ações

### Persona 2 — Carlos (Funcionário Administrativo)

Carlos representa o perfil de quem opera o sistema pelo lado administrativo. Ele recebe objetos encontrados, cadastra no sistema, valida solicitações e controla o fluxo de retiradas. Tem menos familiaridade com tecnologia, mas usa computador diariamente no trabalho.

**Implicações para o design:**
- Interface desktop-friendly com painel de controle
- Campos claros e organizados para cadastro
- Listas e tabelas para gestão de objetos
- Ações com confirmação para evitar erros
- Linguagem formal e objetiva

### Persona 3 — Beatriz (PCD Auditiva)

Beatriz é surda e representa o requisito obrigatório de acessibilidade. Ela se comunica por Libras e português escrito. Precisa que toda informação seja visual/textual, sem dependência de áudio.

**Implicações para o design:**
- Nenhuma informação transmitida apenas por áudio
- Alertas e notificações visuais (badges, banners, cores)
- Status com texto + cor + ícone (redundância de canais)
- Textos curtos e objetivos
- Alto contraste para facilitar leitura rápida

---

## Requisitos Obrigatórios Atendidos

- [x] Pelo menos 2 perfis de acesso distintos (aluno e funcionário)
- [x] Uma persona PCD (Beatriz — deficiência auditiva)
- [x] Personas conectadas com o problema da Seção 2
