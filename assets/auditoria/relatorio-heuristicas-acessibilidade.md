# Relatório de Auditoria — UniAchados

Verificação das telas finais do protótipo HTML em relação às quatro heurísticas de Nielsen aplicadas no projeto e aos fundamentos de acessibilidade/eMAG.

## Escopo da Verificação

Foram capturadas 22 telas navegáveis do protótipo em `assets/prints-telas/`. A checagem considerou evidências visuais nas telas e uma verificação técnica básica de acessibilidade no HTML renderizado.

| # | Tela | Arquivo de evidência |
| --- | --- | --- |
| 1 | Boas-vindas | `tela-01-boas-vindas.png` |
| 2 | Login | `tela-02-login.png` |
| 3 | Criar conta | `tela-03-criar-conta.png` |
| 4 | Home do aluno | `tela-04-home-aluno.png` |
| 5 | Buscar objetos | `tela-05-buscar-objetos.png` |
| 6 | Filtros avançados | `tela-06-filtros-avancados.png` |
| 7 | Detalhes do objeto | `tela-07-detalhes-objeto.png` |
| 8 | Solicitar retirada | `tela-08-solicitar-retirada.png` |
| 9 | Confirmação da solicitação | `tela-09-confirmacao-solicitacao.png` |
| 10 | Cadastrar objeto perdido | `tela-10-cadastrar-perdido.png` |
| 11 | Confirmação de cadastro | `tela-11-confirmacao-cadastro.png` |
| 12 | Minhas solicitações | `tela-12-minhas-solicitacoes.png` |
| 13 | Painel admin | `tela-13-painel-admin.png` |
| 14 | Objetos cadastrados | `tela-14-objetos-cadastrados.png` |
| 15 | Histórico de casos | `tela-15-historico-casos.png` |
| 16 | Cadastrar objeto encontrado | `tela-16-cadastrar-encontrado.png` |
| 17 | Confirmação de encontrado | `tela-17-confirmacao-encontrado.png` |
| 18 | Validar solicitação | `tela-18-validar-solicitacao.png` |
| 19 | Encerrar caso | `tela-19-encerrar-caso.png` |
| 20 | Ajuda / FAQ | `tela-20-ajuda-faq.png` |
| 21 | Notificações | `tela-21-notificacoes.png` |
| 22 | Perfil do usuário | `tela-22-perfil-usuario.png` |

## Checagem das Heurísticas de Nielsen

| Heurística | Status | Evidências observadas |
| --- | --- | --- |
| Visibilidade do estado do sistema | Atendida | Badges de status em cards e listas; telas de confirmação após solicitação/cadastro; métricas no Painel Admin; alertas visuais em Validar solicitação e Encerrar caso. |
| Consistência e padrões | Atendida | Mesma tipografia, paleta, botões, topbar, bottom navigation, cards, formulários e badges em todo o protótipo. |
| Prevenção de erros | Parcialmente atendida | Há marcação de campos obrigatórios, uso de selects para categoria/local, botões de cancelar/voltar e checkbox de confirmação no encerramento. Como o protótipo é estático, validação em tempo real e bloqueio funcional de envio devem ser implementados na versão funcional. |
| Reconhecimento em vez de memorização | Atendida | Filtros visíveis, cards com ícone/foto + título + local + status, navegação inferior com ícone e texto, e informações detalhadas agrupadas por rótulos. |

## Checagem de Acessibilidade/eMAG

| Fundamento | Status | Resultado |
| --- | --- | --- |
| Contraste de texto e componentes | Com ressalva | Contrastes principais foram validados no Coolors. O par `#64748B` sobre `#F5F7FA` ficou em 4,43:1, ligeiramente abaixo de 4,5:1 para texto normal pequeno. As alternativas de correção estão em `sugestoes-contraste-texto-secundario.md`. |
| Uso da cor | Atendido | Status usam cor combinada com ícone e texto, evitando dependência exclusiva da cor. |
| Alternativas textuais / nomes acessíveis | Atendido após ajuste | Checagem automatizada final encontrou 0 botões sem nome acessível e 0 botões com rótulo genérico nas 22 telas. |
| Rótulos de formulários | Atendido após ajuste | Checagem automatizada final encontrou 0 controles sem rótulo programático nas 22 telas. |
| Navegação por teclado / foco visível | Atendido após ajuste | Foram adicionados estilos `:focus-visible` para botões, campos, chips, cards e FAB; a troca de tela move foco para a tela ativa. |

## Conclusão

As quatro heurísticas documentadas estão representadas visualmente nas telas finais. Em acessibilidade, o protótipo atende aos fundamentos principais após os ajustes de rótulo, nome acessível e foco visível, mantendo apenas a ressalva já documentada sobre o contraste marginal do texto secundário.