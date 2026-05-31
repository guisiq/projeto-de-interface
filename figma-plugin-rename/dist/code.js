"use strict";
/**
 * Auto Rename Frames — UniAchados
 *
 * Identifica cada frame pelo conteúdo de texto e renomeia com o nome correto.
 * Funciona com frames capturados pelo HTML-to-Design (nomes genéricos).
 */
const SCREEN_SIGNATURES = [
    // ─── Variações de erro (mais específicas, testar primeiro) ───
    { name: "V01 — Login Erro", requiredTexts: ["Login institucional", "E-mail ou senha incorretos"], priority: 100 },
    { name: "V02 — Login Vazio", requiredTexts: ["Login institucional", "Campo obrigatório"], priority: 100 },
    { name: "V03 — Cadastro Erro Email", requiredTexts: ["Criar conta", "E-mail inválido"], priority: 100 },
    { name: "V04 — Cadastro Erro Senha", requiredTexts: ["Criar conta", "mínimo 8 caracteres"], priority: 100 },
    { name: "V05 — Busca Vazia", requiredTexts: ["Buscar objetos", "Nenhum resultado"], priority: 100 },
    { name: "V06 — Retirada Erro", requiredTexts: ["Solicitar retirada", "Preencha todos os campos"], priority: 100 },
    { name: "V07 — Solicitação Rejeitada", requiredTexts: ["não aprovada"], priority: 100 },
    { name: "V08 — Cad Perdido Erro", requiredTexts: ["Cadastrar objeto perdido", "Preencha todos os campos"], priority: 100 },
    { name: "V09 — Cad Encontrado Erro", requiredTexts: ["Cadastrar objeto encontrado", "Preencha todos os campos"], priority: 100 },
    { name: "V10 — Modal Rejeição", requiredTexts: ["Validar solicitação", "Motivo da rejeição"], priority: 100 },
    { name: "V11 — Sem Conexão", requiredTexts: ["Sem conexão"], priority: 100 },
    { name: "V12 — Cadastro Variação", requiredTexts: ["Criar conta", "Nome completo"], forbiddenTexts: ["inválido", "mínimo 8"], priority: 50 },
    { name: "V13 — Buscar Variação", requiredTexts: ["Buscar objetos", "Todos", "Eletrônicos"], forbiddenTexts: ["Nenhum resultado"], priority: 50 },
    // ─── Telas de confirmação (específicas — exigir texto exato da confirmação) ───
    { name: "09 — Confirmação Solicitação", requiredTexts: ["Solicitação enviada!", "Seu pedido foi registrado"], priority: 95 },
    { name: "11 — Confirmação Cadastro", requiredTexts: ["Objeto cadastrado!", "objeto perdido foi registrado"], priority: 95 },
    { name: "17 — Confirmação Encontrado", requiredTexts: ["Objeto publicado"], priority: 90 },
    // ─── Telas principais ───
    { name: "01 — Boas-vindas", requiredTexts: ["UniAchados", "Achados e perdidos"], priority: 80 },
    { name: "04 — Home", requiredTexts: ["Objetos recentes", "Ver todos"], forbiddenTexts: ["Achados e perdidos"], priority: 85 },
    { name: "02 — Login", requiredTexts: ["Login institucional", "Entrar como aluno"], forbiddenTexts: ["incorretos", "obrigatório"], priority: 70 },
    { name: "03 — Cadastro Usuário", requiredTexts: ["Criar conta", "Nome completo", "E-mail institucional"], forbiddenTexts: ["inválido", "mínimo 8"], priority: 70 },
    { name: "05 — Buscar", requiredTexts: ["Buscar objetos", "Todos", "Eletrônicos", "objetos encontrados"], forbiddenTexts: ["Nenhum resultado"], priority: 75 },
    { name: "06 — Filtros Avançados", requiredTexts: ["Filtros avançados", "Aplicar filtros"], priority: 70 },
    { name: "07 — Detalhes", requiredTexts: ["Detalhes", "Local encontrado", "Onde retirar"], forbiddenTexts: ["descreva", "Preencha", "Nome do objeto"], priority: 75 },
    { name: "08 — Solicitar Retirada", requiredTexts: ["Solicitar retirada", "descreva características"], forbiddenTexts: ["Preencha todos"], priority: 70 },
    { name: "10 — Cadastrar Perdido", requiredTexts: ["Cadastrar objeto perdido", "Nome do objeto"], forbiddenTexts: ["Preencha todos"], priority: 70 },
    { name: "12 — Solicitações", requiredTexts: ["Minhas solicitações", "Solicitado em"], forbiddenTexts: ["Objetos recentes"], priority: 75 },
    { name: "13 — Painel Admin", requiredTexts: ["Painel Admin", "Pendentes", "Cadastrados", "Encerrados"], priority: 85 },
    { name: "14 — Lista Objetos", requiredTexts: ["Objetos cadastrados"], priority: 70 },
    { name: "15 — Histórico", requiredTexts: ["Histórico de casos"], priority: 70 },
    { name: "16 — Cadastrar Encontrado", requiredTexts: ["Cadastrar objeto encontrado", "Local encontrado"], forbiddenTexts: ["Preencha todos"], priority: 70 },
    { name: "18 — Validar Solicitação", requiredTexts: ["Validar solicitação", "Aprovar retirada"], forbiddenTexts: ["Motivo da rejeição"], priority: 70 },
    { name: "19 — Encerramento Caso", requiredTexts: ["Encerrar caso", "Resumo da entrega"], priority: 70 },
    { name: "20 — Notificações", requiredTexts: ["Notificações", "aprovada"], forbiddenTexts: ["Buscar objetos", "Login institucional", "Objetos recentes"], priority: 65 },
    { name: "21 — Perfil", requiredTexts: ["Meu perfil", "Sair"], priority: 70 },
    { name: "22 — Ajuda", requiredTexts: ["Ajuda", "FAQ"], priority: 70 },
];
// ─── Utilities ───
function getAllTextContent(node) {
    if (node.type === "TEXT")
        return node.characters;
    if ("children" in node) {
        return node.children
            .map((c) => getAllTextContent(c))
            .filter(Boolean)
            .join(" ");
    }
    return "";
}
function normalize(text) {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
}
function textContains(haystack, needle) {
    return normalize(haystack).includes(normalize(needle));
}
function autoRenameFrames() {
    const frames = figma.currentPage.children.filter((n) => n.type === "FRAME");
    const result = {
        total: frames.length,
        renamed: 0,
        unidentified: 0,
        details: [],
        unidentifiedFrames: [],
    };
    // Sort signatures by priority (higher first)
    const sortedSigs = [...SCREEN_SIGNATURES].sort((a, b) => (b.priority || 0) - (a.priority || 0));
    const allMatches = [];
    const frameTexts = [];
    for (let fi = 0; fi < frames.length; fi++) {
        const fullText = getAllTextContent(frames[fi]);
        frameTexts.push(fullText);
        for (let si = 0; si < sortedSigs.length; si++) {
            const sig = sortedSigs[si];
            // Check required texts
            const hasAllRequired = sig.requiredTexts.every(t => textContains(fullText, t));
            if (!hasAllRequired)
                continue;
            // Check forbidden texts
            if (sig.forbiddenTexts) {
                const hasForbidden = sig.forbiddenTexts.some(t => textContains(fullText, t));
                if (hasForbidden)
                    continue;
            }
            // Score = priority + number of required texts matched (all matched by definition)
            const score = (sig.priority || 0) * 10 + sig.requiredTexts.length;
            allMatches.push({ frameIdx: fi, sigIdx: si, score });
        }
    }
    // Phase 2: Assign best matches greedily (highest score first)
    allMatches.sort((a, b) => b.score - a.score);
    const assignedFrames = new Set();
    const assignedSigs = new Set();
    for (const match of allMatches) {
        if (assignedFrames.has(match.frameIdx))
            continue;
        if (assignedSigs.has(match.sigIdx))
            continue;
        const frame = frames[match.frameIdx];
        const sig = sortedSigs[match.sigIdx];
        const oldName = frame.name;
        if (oldName !== sig.name) {
            frame.name = sig.name;
            result.details.push({ oldName, newName: sig.name, nodeId: frame.id });
            result.renamed++;
        }
        assignedFrames.add(match.frameIdx);
        assignedSigs.add(match.sigIdx);
    }
    // Phase 3: Report unidentified frames
    for (let fi = 0; fi < frames.length; fi++) {
        if (!assignedFrames.has(fi)) {
            result.unidentified++;
            result.unidentifiedFrames.push({
                name: frames[fi].name,
                nodeId: frames[fi].id,
                sampleText: frameTexts[fi].substring(0, 200),
            });
        }
    }
    return result;
}
// ─── Plugin Entry Point ───
figma.showUI(__html__, { width: 480, height: 500 });
figma.ui.onmessage = (msg) => {
    if (msg.type === "rename") {
        const result = autoRenameFrames();
        figma.ui.postMessage({ type: "result", result });
        figma.notify(`✅ ${result.renamed} frames renomeados | ❓ ${result.unidentified} não identificados`);
    }
    if (msg.type === "list-frames") {
        const frames = figma.currentPage.children.filter((n) => n.type === "FRAME");
        const data = frames.map(f => ({
            id: f.id,
            name: f.name,
            text: getAllTextContent(f).substring(0, 150),
        }));
        figma.ui.postMessage({ type: "frames-list", frames: data });
    }
    if (msg.type === "close") {
        figma.closePlugin();
    }
};
