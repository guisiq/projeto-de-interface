# 8.3 Aplicação das Heurísticas de Nielsen

## Objetivo desta seção

Apresentar prints do protótipo com marcações visuais para evidenciar como as heurísticas de Nielsen aparecem na interface do UniAchados.

## Conjunto recomendado de prints

Para manter a seção clara e sem repetição excessiva, usar 8 prints principais.

### Heurística 1: Visibilidade do estado do sistema

1. assets/prints-telas/tela-04-home-aluno.png
2. assets/prints-telas/tela-09-confirmacao-solicitacao.png
3. assets/prints-telas/tela-13-painel-admin.png

Marcações sugeridas:

1. Home do aluno
- Badge de status nos cards: Encontrado, Ag. retirada.
- Indicador numérico no sino de notificações.
- Bloco Minhas solicitações com status Em análise.

2. Confirmação da solicitação
- Mensagem de sucesso Solicitação enviada.
- Linha de status Em análise.
- Etapas visuais do processo (passos 1, 2 e 3).

3. Painel admin
- Cards de métricas: Pendentes, Cadastrados, Encerrados.
- Lista de solicitações pendentes como feedback operacional.

### Heurística 2: Consistência e padrões

4. assets/prints-telas/tela-05-buscar-objetos.png
5. assets/prints-telas/tela-12-minhas-solicitacoes.png
6. assets/prints-telas/tela-21-perfil.png

Marcações sugeridas:

1. Buscar objetos
- Padrão visual dos cards (ícone, título, local, status, seta).
- Topbar e organização da estrutura da tela.

2. Minhas solicitações
- Mesmo padrão visual de cards usado em Buscar.
- Bottom navigation com padrão idêntico de ícone e texto.

3. Perfil
- Mesma tipografia e espaçamentos do restante do fluxo.
- Estrutura em blocos/cartões consistente com outras telas.

### Heurística 3: Prevenção de erros

7. assets/prints-telas/tela-03-criar-conta.png
8. assets/prints-telas/tela-08-solicitar-retirada.png

Marcações sugeridas:

1. Criar conta
- Campos obrigatórios sinalizados com asterisco.
- Campo Perfil de acesso com seleção controlada.
- Ação de Cancelar para saída segura.

2. Solicitar retirada
- Caixa informativa explicando o que preencher.
- Campos obrigatórios e anexo de documento.
- Botões Cancelar e Enviar Solicitação.

### Heurística 4: Reconhecimento em vez de memorização

Reutilizar as telas já escolhidas para evitar duplicidade de figuras:

1. assets/prints-telas/tela-05-buscar-objetos.png
2. assets/prints-telas/tela-07-detalhes-objeto.png

Marcações sugeridas:

1. Buscar objetos
- Filtros visíveis (chips e botões de filtro).
- Resultados com contexto visual direto (título, local, status).

2. Detalhes do objeto
- Rótulos explícitos dos campos: Categoria, Local encontrado, Data e hora, Onde retirar.
- Botão principal com ação clara: Solicitar Retirada.

## Padrão visual de marcação (padronizar em todas as imagens)

1. Retângulo amarelo para elemento evidenciado.
2. Círculo azul para feedback de estado/status.
3. Seta verde para fluxo da ação principal.
4. Etiqueta curta no formato Hx.y com frase breve.

Exemplos de etiquetas:

1. H1.1 Status visível no card.
2. H1.2 Confirmação imediata da ação.
3. H3.1 Campo obrigatório sinalizado.
4. H4.1 Filtros visíveis reduzem memória.

## Legenda curta para inserir abaixo das figuras

As marcações em amarelo, azul e verde destacam respectivamente elementos de evidência, feedback de estado e fluxo de ação, associando cada evidência à heurística correspondente (H1, H2, H3 e H4).
