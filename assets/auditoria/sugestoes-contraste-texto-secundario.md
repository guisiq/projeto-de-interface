# Sugestões de Substituição — Texto Secundário

## Problema Identificado

Na validação de contraste pelo Coolors Contrast Checker, o par atual de texto secundário apresentou o seguinte resultado:

| Uso | Texto atual | Fundo | Ratio atual | Resultado WCAG AA |
| --- | --- | --- | --- | --- |
| Texto secundário sobre fundo geral | `#64748B` | `#F5F7FA` | **4,43:1** | Reprova por pouco para texto normal pequeno |

O critério WCAG 2.1 AA exige contraste mínimo de **4,5:1** para texto normal. Como o valor atual ficou apenas 0,07 abaixo do mínimo, o problema pode ser resolvido com uma pequena mudança no tom do texto secundário, sem alterar a identidade visual do projeto.

## Alternativas Testadas

| Opção | Nova cor sugerida | Ratio em `#F5F7FA` | Ratio em `#FFFFFF` | Impacto visual | Recomendação |
| --- | --- | --- | --- | --- | --- |
| A | `#5B6B80` | **5,07:1** | **5,44:1** | Mudança mínima, mantém aparência próxima ao cinza-azulado atual | Boa para ajuste discreto |
| B | `#526173` | **5,90:1** | **6,33:1** | Escurece um pouco mais e melhora a margem de segurança | Melhor equilíbrio |
| C | `#475569` | **7,06:1** | **7,58:1** | Alto contraste, aproxima-se de um slate mais escuro | Recomendada para máxima conformidade |
| D | `#4B5563` | **7,04:1** | **7,56:1** | Neutra, menos azulada, muito comum em interfaces | Boa alternativa se quiser aparência mais sóbria |
| E | `#334155` | **9,65:1** | **10,35:1** | Muito escura, próxima do texto principal | Usar apenas se a hierarquia secundária puder ficar mais forte |

## Sugestão Principal

A melhor substituição é `#526173`, porque resolve a reprovação com margem confortável e ainda preserva a diferença visual entre texto principal e texto secundário.

```css
:root {
  --c-text-sec: #526173;
}
```

Essa opção mantém o texto secundário mais discreto que o texto principal (`#1E293B`), mas passa com folga no contraste mínimo do WCAG AA:

| Par corrigido | Ratio | Resultado |
| --- | --- | --- |
| `#526173` sobre `#F5F7FA` | **5,90:1** | Passa WCAG AA para texto normal |
| `#526173` sobre `#FFFFFF` | **6,33:1** | Passa WCAG AA para texto normal |

## Exemplos de Aplicação

### Antes

```css
:root {
  --c-text-sec: #64748B;
}
```

### Depois — ajuste recomendado

```css
:root {
  --c-text-sec: #526173;
}
```

### Componentes impactados

Essa alteração melhora a leitura de elementos como:

- Metadados dos cards, por exemplo local e data do objeto.
- Textos auxiliares de formulário.
- Placeholders e captions.
- Rótulos secundários em listas, histórico e notificações.

## Exemplo visual no contexto do projeto

| Elemento | Cor atual | Cor recomendada | Resultado esperado |
| --- | --- | --- | --- |
| `.card-meta` | `#64748B` | `#526173` | Local/data mais legíveis sem competir com o título |
| `.req-note` | `#64748B` | `#526173` | Observações obrigatórias mais acessíveis |
| `.welcome-sub` em fundos claros | `#64748B` | `#526173` | Melhor leitura em telas claras |
| Textos auxiliares de perfil | `#64748B` | `#526173` | Hierarquia mantida com contraste adequado |

## Decisão Recomendada para o Documento

Substituir a ressalva atual por uma nota de correção planejada ou aplicar a nova cor diretamente no protótipo. Caso a alteração seja aplicada, o texto pode ser atualizado para:

> Após a validação inicial, o texto secundário foi ajustado de `#64748B` para `#526173`, elevando o contraste sobre o fundo `#F5F7FA` de 4,43:1 para 5,90:1 e garantindo conformidade com WCAG 2.1 AA para texto normal.

## Observação

A opção `#475569` também é segura e já havia sido indicada como possibilidade no documento principal. No entanto, ela deixa o texto secundário bem mais próximo do texto principal. Por isso, `#526173` é a escolha mais equilibrada para preservar a hierarquia visual.