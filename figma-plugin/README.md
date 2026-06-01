# UniAchados Importer + Connector

Plugin local para o Figma que importa o protótipo HTML do UniAchados como frames organizados e automatiza conexões de protótipo entre elementos clicáveis e frames de destino.

## 📁 Estrutura do projeto

```
figma-plugin/
├── manifest.json          ← Manifesto do plugin Figma
├── package.json           ← Dependências (TypeScript + typings)
├── tsconfig.json          ← Configuração TypeScript
├── build-ui.js            ← Script que injeta conexões e capturas no ui.html
├── src/
│   ├── code.ts            ← Lógica principal do plugin
│   ├── ui.html            ← Interface do plugin
│   ├── connections-internal.json ← Mapa de conexões internas do protótipo
│   └── import-assets/     ← Capturas PNG e mapa das telas do protótipo HTML
├── dist/
│   └── code.js            ← Arquivo compilado (gerado pelo build)
└── README.md
```

## 🚀 Como usar

### 1. Instalar dependências

```bash
cd figma-plugin
npm install
```

### 2. Compilar o plugin

```bash
npm run build
node build-ui.js
```

O comando `npm run build` compila `src/code.ts` → `dist/code.js`.  
O comando `node build-ui.js` injeta o JSON de conexões e as capturas do protótipo HTML no `ui.html`.

### 3. Importar no Figma Desktop

1. Abra o **Figma Desktop** (não funciona no browser).
2. Abra o arquivo do protótipo UniAchados.
3. Vá em **Plugins → Development → Import plugin from manifest…**
4. Selecione o arquivo `figma-plugin/manifest.json`.
5. O plugin aparecerá em **Plugins → Development → UniAchados Importer + Connector**.

### 4. Executar o plugin

1. Com o arquivo do protótipo aberto, execute o plugin.
2. Na interface que abrir:
  - **Aba "Importar HTML"**: clique em **▶ Importar Telas + Conexões** para criar todas as telas principais e alternativas de erro no canvas.
  - **Aba "Botões Internos"**: clique em **▶ Aplicar Botões Internos** para conectar frames já importados via HTML-to-Design.
   - **Modo Simulação (dry run)**: Marque a checkbox para testar sem alterar nada.
   - **Sobrescrever existentes**: Marque se quiser substituir conexões ON_CLICK já existentes.
3. O relatório mostrará:
  - ✅ Telas importadas
  - 🔗 Hotspots conectados
   - ✅ Conexões aplicadas com sucesso
   - ⏭ Conexões preservadas (já existiam)
   - ❌ Elementos ou frames não encontrados
   - ⚠️ Ambiguidades (múltiplos candidatos)

### 5. Verificar resultado

1. Pressione **▶ Play** (Present) no Figma.
2. Navegue pelo protótipo clicando nos botões.
3. Confira se as transições estão corretas.

## ⚙️ Configuração

### Importação do HTML

A aba **Importar HTML** cria automaticamente:

- 22 telas principais do protótipo.
- 11 alternativas de erro.
- Títulos acima de cada captura.
- Organização em duas áreas: telas principais e alternativas de erro.
- Hotspots transparentes sobre os elementos clicáveis extraídos do HTML.
- Conexões `ON_CLICK` entre os hotspots e os frames de destino.

As capturas ficam em `src/import-assets/*.png`, e o mapa de telas/hotspots fica em `src/import-assets/screens.json`.

### Arquivo `src/connections-internal.json`

Cada conexão tem a estrutura:

```json
{
  "id": 1,
  "fromFrame": "01 — Boas-vindas",
  "source": {
    "name": "Entrar",
    "aliases": ["btnEntrar", "btn-primary"],
    "textMatch": "Entrar",
    "iconMatch": null
  },
  "toFrame": "02 — Login",
  "trigger": "ON_CLICK",
  "navigation": "NAVIGATE",
  "transition": { "type": "DISSOLVE", "duration": 0.3 }
}
```

| Campo | Descrição |
|-------|-----------|
| `fromFrame` | Nome do frame de origem (usa busca fuzzy) |
| `source.name` | Nome principal do elemento |
| `source.aliases` | Nomes alternativos para busca |
| `source.textMatch` | Texto que o elemento deve conter |
| `source.iconMatch` | Ícone (ex: "arrow_back") |
| `toFrame` | Nome do frame de destino |
| `transition.type` | `DISSOLVE`, `SLIDE_IN`, `INSTANT` |

### Opções no plugin

| Opção | Default | Descrição |
|-------|---------|-----------|
| `overwriteExisting` | `false` | Sobrescrever interações ON_CLICK existentes |
| `dryRun` | `false` | Simular sem aplicar (gera só relatório) |

## 🔍 Como o plugin encontra elementos

1. **Nome exato** do nó no Figma
2. **Aliases** — variações do nome
3. **textMatch** — busca texto dentro do elemento (ex: "Entrar")
4. **iconMatch** — busca pelo nome do ícone Material (ex: "arrow_back")
5. **nodeNameMatch** — busca parcial no nome do nó (ex: "card")

A busca usa **normalização**: remove acentos, converte para minúsculas, ignora pontuação.

## 🛠 Resolver casos ambíguos

Se o relatório mostrar conexões ambíguas:

1. Abra a aba **📝 Conexões JSON** no plugin.
2. Encontre a conexão pelo `id`.
3. Ajuste `source.name` ou `source.textMatch` para ser mais específico.
4. Ou renomeie o elemento no Figma para corresponder ao esperado.
5. Execute novamente.

## ⚠️ Limitações

- O plugin opera apenas na **página atual** do Figma.
- Nomes de frames no Figma devem seguir o padrão `XX — Nome` (ex: `01 — Boas-vindas`).
- Se os frames foram capturados via HTML-to-Design, os nomes internos podem ser genéricos — o plugin tenta buscar por texto, mas alguns elementos podem não ser encontrados.
- Para melhor resultado, renomeie os elementos interativos no Figma com nomes descritivos.

## 📊 Formato do relatório

```json
{
  "summary": {
    "expected": 91,
    "applied": 75,
    "skippedExisting": 5,
    "missingSources": 8,
    "missingTargets": 2,
    "ambiguous": 1
  },
  "applied": [...],
  "skippedExisting": [...],
  "missingSources": [...],
  "missingTargets": [...],
  "ambiguous": [...]
}
```

## 🔄 Próximos passos manuais

Após executar o plugin:

1. **Verificar conexões não encontradas**: Renomear elementos no Figma ou ajustar aliases no JSON.
2. **Resolver ambiguidades**: Tornar nomes mais específicos.
3. **Testar fluxos**: Usar modo Present (▶) para validar a navegação.
4. **Ajustar transições**: Editar duração/tipo no JSON se necessário.
5. **Reimportar quando o HTML mudar**: gere novas capturas e atualize `src/import-assets/screens.json` antes de rodar `node build-ui.js` novamente.
