"use strict";
/**
 * Auto Prototype Connector — UniAchados v2
 *
 * Plugin Figma que aplica conexões de protótipo automaticamente.
 * Otimizado para estrutura gerada pelo HTML-to-Design (nomes genéricos).
 */
// ─── Utilities ───────────────────────────────────────────────────────────────
function normalize(text) {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}
function textContains(haystack, needle) {
    return normalize(haystack).includes(normalize(needle));
}
function textMatches(a, b) {
    return normalize(a) === normalize(b);
}
function isControlLikeNode(node) {
    return textContains(node.name, "Button") || textContains(node.name, "Input") || textContains(node.name, "Link") || textContains(node.name, "btn");
}
// ─── Frame Finder ────────────────────────────────────────────────────────────
function findFrameByName(frameName, allFrames) {
    const normalizedTarget = normalize(frameName);
    // Exact normalized match
    for (const frame of allFrames) {
        if (normalize(frame.name) === normalizedTarget) {
            return frame;
        }
    }
    // Partial: frame contains target
    for (const frame of allFrames) {
        const nf = normalize(frame.name);
        if (nf.includes(normalizedTarget) || normalizedTarget.includes(nf)) {
            return frame;
        }
    }
    // Try numeric prefix
    const numMatch = frameName.match(/^(\d{2})/);
    if (numMatch) {
        for (const frame of allFrames) {
            if (frame.name.startsWith(numMatch[1])) {
                return frame;
            }
        }
    }
    // Variation prefix (V01, V02, etc.)
    const varMatch = frameName.match(/^V(\d{2})/i);
    if (varMatch) {
        for (const frame of allFrames) {
            if (normalize(frame.name).includes(normalizedTarget)) {
                return frame;
            }
        }
    }
    return null;
}
// ─── Element Finder v2 (optimized for HTML-to-Design output) ─────────────────
function collectTextNodes(node, results) {
    if (node.type === "TEXT") {
        results.push(node);
        return;
    }
    if ("children" in node) {
        for (const child of node.children) {
            collectTextNodes(child, results);
        }
    }
}
function getAllText(node) {
    if (node.type === "TEXT")
        return node.characters;
    if ("children" in node) {
        return node.children
            .map((c) => getAllText(c))
            .filter(Boolean)
            .join(" ");
    }
    return "";
}
/**
 * Walk up from a node to find the nearest clickable-sized ancestor frame.
 * Stops when hitting a frame too large (screen body) or too many levels.
 */
function findClickableAncestor(node, maxLevels = 5) {
    let current = node.parent;
    let best = node;
    let level = 0;
    while (current && level < maxLevels) {
        if (current.type === "FRAME" || current.type === "INSTANCE" || current.type === "COMPONENT") {
            const frame = current;
            if (frame.width > 400 || frame.height > 200) {
                break;
            }
            if (isControlLikeNode(frame)) {
                return frame;
            }
            best = frame;
            const text = getAllText(frame);
            if (textMatches(text, getAllText(node))) {
                return frame;
            }
        }
        // Also stop if we reach a top-level frame (direct child of page)
        if (current.parent && current.parent.type === "PAGE") {
            break;
        }
        current = current.parent;
        level++;
    }
    return best;
}
/**
 * Find a node by text content, return a clickable ancestor.
 */
function findByText(frame, textToFind) {
    const textNodes = [];
    collectTextNodes(frame, textNodes);
    const matches = textNodes.filter(t => textContains(t.characters, textToFind));
    if (matches.length === 0)
        return null;
    const exact = matches.filter(t => textMatches(t.characters, textToFind));
    const candidates = exact.length > 0 ? exact : matches;
    candidates.sort((a, b) => {
        const clickableA = findClickableAncestor(a);
        const clickableB = findClickableAncestor(b);
        const controlScoreA = isControlLikeNode(clickableA) ? 1 : 0;
        const controlScoreB = isControlLikeNode(clickableB) ? 1 : 0;
        if (controlScoreA !== controlScoreB)
            return controlScoreB - controlScoreA;
        return a.characters.length - b.characters.length;
    });
    return findClickableAncestor(candidates[0]);
}
/**
 * Find back button — small element in the top-left area of the frame.
 * HTML-to-Design converts the arrow_back icon to vectors inside a small frame.
 */
function findBackButton(frame) {
    // Strategy 1: Find by name pattern
    const byName = findNodeByNamePattern(frame, ["arrow_back", "arrow back", "back", "icon-btn", "voltar"]);
    if (byName)
        return byName;
    // Strategy 2: Find the phone screen container first (375x780-ish),
    // then search within its TOP area for the back button.
    // HTML-to-Design nests deeply, so we use the phone container as reference.
    let phoneContainer = null;
    for (const child of frame.children) {
        if ("width" in child && "height" in child && "children" in child) {
            const c = child;
            // Phone screen: ~375px wide, ~780+ tall
            if (c.width >= 300 && c.width <= 430 && c.height >= 600) {
                phoneContainer = c;
                break;
            }
        }
    }
    const searchRoot = phoneContainer || frame;
    const containerW = ("width" in searchRoot) ? searchRoot.width : frame.width;
    const containerH = ("height" in searchRoot) ? searchRoot.height : frame.height;
    const maxX = containerW * 0.25; // left 25% of phone
    const maxY = containerH * 0.10; // top 10% of phone (status bar + nav bar area)
    let bestCandidate = null;
    let bestScore = -Infinity;
    function searchBackBtn(node, absX, absY, depth) {
        if (depth > 12)
            return;
        if (absX > maxX || absY > maxY)
            return;
        if (bestCandidate && bestScore > 150)
            return;
        // Skip text nodes — back button is not text
        if (node.type === "TEXT")
            return;
        if (node !== searchRoot && "width" in node && "height" in node) {
            const w = node.width;
            const h = node.height;
            const isVector = node.type === "VECTOR" || node.type === "BOOLEAN_OPERATION" ||
                node.type === "LINE" || node.type === "POLYGON" || node.type === "STAR";
            const isClickable = node.type === "FRAME" || node.type === "INSTANCE" ||
                node.type === "COMPONENT" || node.type === "GROUP";
            if (isVector && w >= 4 && w <= 40 && h >= 4 && h <= 40) {
                const clickable = findClickableAncestor(node, 4);
                const score = 200 - absX - absY;
                if (score > bestScore) {
                    bestScore = score;
                    bestCandidate = clickable;
                }
                return;
            }
            if (isClickable && w >= 16 && w <= 64 && h >= 16 && h <= 64) {
                // Only count as candidate if it has few children (icon container, not layout)
                const childCount = "children" in node ? node.children.length : 0;
                if (childCount <= 3) {
                    const score = 150 - absX - absY - w;
                    if (score > bestScore) {
                        bestScore = score;
                        bestCandidate = node;
                    }
                }
            }
        }
        if ("children" in node) {
            for (const child of node.children) {
                const cx = absX + ("x" in child ? child.x : 0);
                const cy = absY + ("y" in child ? child.y : 0);
                searchBackBtn(child, cx, cy, depth + 1);
            }
        }
    }
    searchBackBtn(searchRoot, 0, 0, 0);
    return bestCandidate;
}
function findNodeByNamePattern(node, patterns) {
    const nodeName = normalize(node.name);
    for (const p of patterns) {
        if (nodeName.includes(normalize(p))) {
            // If this node is small enough, return it; otherwise find a clickable child
            if ("width" in node && node.width <= 60) {
                return node;
            }
            return findClickableAncestor(node, 2);
        }
    }
    if ("children" in node) {
        for (const child of node.children) {
            const found = findNodeByNamePattern(child, patterns);
            if (found)
                return found;
        }
    }
    return null;
}
/**
 * Find the FAB button — circular floating button near bottom-right.
 */
function findFAB(frame) {
    const frameH = frame.height;
    const frameW = frame.width;
    function searchFAB(node, absX, absY) {
        if ("width" in node && "height" in node) {
            const n = node;
            const w = n.width;
            const h = n.height;
            // FAB: 40-80px, in bottom-right quadrant
            if (w >= 40 && w <= 80 && h >= 40 && h <= 80 && absY > frameH * 0.55 && absX > frameW * 0.5) {
                return node;
            }
        }
        if ("children" in node) {
            for (const child of node.children) {
                const cx = absX + ("x" in child ? child.x : 0);
                const cy = absY + ("y" in child ? child.y : 0);
                const found = searchFAB(child, cx, cy);
                if (found)
                    return found;
            }
        }
        return null;
    }
    return searchFAB(frame, 0, 0);
}
/**
 * Find notification icon in the top-right area.
 */
function findNotificationIcon(frame) {
    const frameW = frame.width;
    const frameH = frame.height;
    const maxY = frameH * 0.15;
    let bestCandidate = null;
    let bestX = 0;
    function searchTopRight(node, absX, absY, depth) {
        if (depth > 6)
            return;
        if (absY > maxY)
            return; // Early exit: below top region
        if ("width" in node && "height" in node) {
            const w = node.width;
            const h = node.height;
            const inRightRegion = absX > frameW * 0.65;
            const rightSize = w >= 16 && w <= 50 && h >= 16 && h <= 50;
            if (inRightRegion && rightSize && absX > bestX) {
                bestX = absX;
                bestCandidate = node;
            }
        }
        if ("children" in node) {
            for (const inner of node.children) {
                searchTopRight(inner, absX + ("x" in inner ? inner.x : 0), absY + ("y" in inner ? inner.y : 0), depth + 1);
            }
        }
    }
    searchTopRight(frame, 0, 0, 0);
    return bestCandidate;
}
/**
 * Find navigation bar items by label text.
 */
function findNavItem(frame, labelText) {
    // First find the phone container (375x780-ish)
    let phoneContainer = null;
    for (const child of frame.children) {
        if ("width" in child && "height" in child && "children" in child) {
            const c = child;
            if (c.width >= 300 && c.width <= 430 && c.height >= 600) {
                phoneContainer = c;
                break;
            }
        }
    }
    const searchRoot = phoneContainer || frame;
    const rootH = ("height" in searchRoot) ? searchRoot.height : frame.height;
    // Find the bottom nav — a container near the bottom
    let bottomNav = null;
    function findBottomBar(node, absY, depth) {
        if (depth > 3 || bottomNav)
            return;
        if ("y" in node && "height" in node && "children" in node && "width" in node) {
            const c = node;
            const nodeBottom = absY + c.height;
            // Bottom nav: near the bottom, short height, wide
            if (nodeBottom >= rootH - 10 && c.height <= 100 && c.height >= 40 && c.width > 200) {
                bottomNav = c;
                return;
            }
        }
        if ("children" in node) {
            for (const child of node.children) {
                const cy = absY + ("y" in child ? child.y : 0);
                findBottomBar(child, cy, depth + 1);
            }
        }
    }
    findBottomBar(searchRoot, 0, 0);
    if (bottomNav) {
        // Search for a child of bottom nav containing the label text
        for (const child of bottomNav.children) {
            const text = getAllText(child);
            if (textContains(text, labelText)) {
                return child;
            }
        }
        // Deeper: check nested children
        const textNodes = [];
        collectTextNodes(bottomNav, textNodes);
        for (const tn of textNodes) {
            if (textContains(tn.characters, labelText)) {
                return findClickableAncestor(tn, 3);
            }
        }
    }
    // Fallback: search only in phone container for the text
    if (phoneContainer) {
        return findByText(phoneContainer, labelText);
    }
    return findByText(frame, labelText);
}
/**
 * Find card/list items, optionally with a text hint.
 */
function findCard(frame, textHint) {
    if (textHint) {
        // Find by text first — works for cards with specific text
        return findByText(frame, textHint);
    }
    // Generic card: find the first medium-sized frame in the scrollable body
    const cards = [];
    function searchCards(node, depth) {
        if (depth > 5)
            return;
        if ("width" in node && "height" in node && "children" in node) {
            const n = node;
            if (n.width > 200 && n.width < 400 && n.height >= 50 && n.height <= 150) {
                cards.push(node);
            }
        }
        if ("children" in node) {
            for (const child of node.children) {
                searchCards(child, depth + 1);
            }
        }
    }
    searchCards(frame, 0);
    return cards.length > 0 ? cards[0] : null;
}
/**
 * Main source element finder — v2.
 */
function findSourceElementV2(frame, source) {
    // ─── arrow_back / back button ───
    if (source.iconMatch === "arrow_back" || source.name === "arrow_back") {
        const backBtn = findBackButton(frame);
        if (backBtn)
            return { node: backBtn, candidates: [] };
        return { node: null, candidates: [] };
    }
    // ─── Notifications icon ───
    if (source.iconMatch === "notifications" || source.name === "Notificações") {
        const notif = findNotificationIcon(frame);
        if (notif)
            return { node: notif, candidates: [] };
        return { node: null, candidates: [] };
    }
    // ─── FAB (+) button ───
    if (source.iconMatch === "add" && (source.name.includes("FAB") || source.aliases.includes("fab"))) {
        const fab = findFAB(frame);
        if (fab)
            return { node: fab, candidates: [] };
        return { node: null, candidates: [] };
    }
    // ─── Navigation bar items ───
    if (source.name.startsWith("Nav:")) {
        const label = source.name.replace("Nav:", "").trim();
        const navItem = findNavItem(frame, label);
        if (navItem)
            return { node: navItem, candidates: [] };
        if (source.textMatch) {
            const found = findByText(frame, source.textMatch);
            if (found)
                return { node: found, candidates: [] };
        }
        return { node: null, candidates: [] };
    }
    // ─── Card/list items ───
    if (source.nodeNameMatch === "card" || source.name.toLowerCase().includes("card")) {
        const textHint = source.textMatch || null;
        const card = findCard(frame, textHint);
        if (card)
            return { node: card, candidates: [] };
        return { node: null, candidates: [] };
    }
    // ─── Add icon in topbar (for Lista Objetos "+") ───
    if (source.iconMatch === "add" && !source.aliases.includes("fab")) {
        // Find in topbar: right side, small element
        const notif = findNotificationIcon(frame); // This finds rightmost small element in topbar
        // We need the second rightmost or a different approach
        // For now try by name
        const byName = findNodeByNamePattern(frame, ["add", "plus"]);
        if (byName)
            return { node: byName, candidates: [] };
        return { node: null, candidates: [] };
    }
    // ─── Text-based search (buttons/links) ───
    if (source.textMatch) {
        const found = findByText(frame, source.textMatch);
        if (found)
            return { node: found, candidates: [] };
    }
    // ─── Aliases text search ───
    for (const alias of source.aliases) {
        if (alias.startsWith("btn-") || alias.startsWith("link-"))
            continue;
        const found = findByText(frame, alias);
        if (found)
            return { node: found, candidates: [] };
    }
    // ─── Fallback: name as text ───
    const found = findByText(frame, source.name);
    if (found)
        return { node: found, candidates: [] };
    return { node: null, candidates: [] };
}
// ─── Reaction Builder ────────────────────────────────────────────────────────
function buildReaction(targetFrame, entry) {
    let transitionObj;
    if (entry.transition.type === "INSTANT") {
        transitionObj = { type: "DISSOLVE", duration: 0, easing: { type: "LINEAR" } };
    }
    else if (entry.transition.type === "SLIDE_IN") {
        transitionObj = {
            type: "SLIDE_IN",
            direction: (entry.transition.direction || "LEFT"),
            duration: entry.transition.duration || 0.3,
            easing: { type: "EASE_IN_AND_OUT" },
            matchLayers: false,
        };
    }
    else {
        transitionObj = {
            type: "DISSOLVE",
            duration: entry.transition.duration || 0.3,
            easing: { type: "EASE_IN_AND_OUT" },
        };
    }
    const action = {
        type: "NODE",
        destinationId: targetFrame.id,
        navigation: "NAVIGATE",
        transition: transitionObj,
        preserveScrollPosition: false,
    };
    return {
        trigger: { type: "ON_CLICK" },
        actions: [action],
    };
}
function buildImportReaction(targetFrame) {
    return {
        trigger: { type: "ON_CLICK" },
        actions: [{
                type: "NODE",
                destinationId: targetFrame.id,
                navigation: "NAVIGATE",
                transition: {
                    type: "DISSOLVE",
                    duration: 0.2,
                    easing: { type: "EASE_IN_AND_OUT" },
                },
                preserveScrollPosition: false,
            }],
    };
}
async function loadImportFonts() {
    await Promise.all([
        figma.loadFontAsync({ family: "Inter", style: "Regular" }),
        figma.loadFontAsync({ family: "Inter", style: "Medium" }),
        figma.loadFontAsync({ family: "Inter", style: "Bold" }),
    ]);
}
function createLabel(text, x, y, size, style, color) {
    const label = figma.createText();
    label.name = text;
    label.fontName = { family: "Inter", style };
    label.fontSize = size;
    label.characters = text;
    label.fills = [{ type: "SOLID", color }];
    label.x = x;
    label.y = y;
    return label;
}
// ─── Main Logic ──────────────────────────────────────────────────────────────
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function getSingleFlowStartFrame(allFrames) {
    const frames = allFrames || figma.currentPage.children.filter((n) => n.type === "FRAME");
    return findFrameByName("01 — Boas-vindas", frames) ||
        frames.filter(isScreenFrame).sort((a, b) => screenSortKey(a.name) - screenSortKey(b.name))[0] ||
        frames[0] ||
        null;
}
function unifyPrototypeFlows() {
    const report = {
        summary: { expected: 1, applied: 0, skippedExisting: 0, missingSources: 0, missingTargets: 0, ambiguous: 0 },
        applied: [],
        skippedExisting: [],
        missingSources: [],
        missingTargets: [],
        ambiguous: [],
    };
    const startFrame = getSingleFlowStartFrame();
    if (!startFrame) {
        report.missingTargets.push({
            connectionId: 0,
            fromFrame: "Página atual",
            sourceName: "Flows",
            toFrame: "UniAchados",
            detail: "Nenhum frame encontrado para iniciar o fluxo",
        });
        report.summary.missingTargets++;
        return report;
    }
    try {
        const previous = (figma.currentPage.flowStartingPoints || []).length;
        figma.currentPage.flowStartingPoints = [{ nodeId: startFrame.id, name: "UniAchados" }];
        report.applied.push({
            connectionId: 1,
            fromFrame: startFrame.name,
            sourceName: `Flows unificados (${previous} removidos)`,
            toFrame: "UniAchados",
        });
        report.summary.applied = 1;
    }
    catch (error) {
        report.missingSources.push({
            connectionId: 0,
            fromFrame: "Página atual",
            sourceName: "Flows",
            toFrame: startFrame.name,
            detail: `Erro ao atualizar flows: ${error.message || error}`,
        });
        report.summary.missingSources++;
    }
    return report;
}
// ─── Frame Organizer ────────────────────────────────────────────────────────
const ORGANIZE_LABEL_PLUGIN_KEY = "uniachados-organize-label";
const ORGANIZE_LAYOUT = {
    "01": { col: 0, row: 0 },
    "02": { col: 1, row: 0 },
    "03": { col: 2, row: 0 },
    "V01": { col: 1, row: 1 },
    "V02": { col: 1, row: 2 },
    "V03": { col: 2, row: 1 },
    "V04": { col: 2, row: 2 },
    "V12": { col: 2, row: 3 },
    "04": { col: 1, row: 4 },
    "05": { col: 2, row: 4 },
    "07": { col: 3, row: 4 },
    "08": { col: 4, row: 4 },
    "09": { col: 5, row: 4 },
    "06": { col: 2, row: 5 },
    "V05": { col: 2, row: 6 },
    "V13": { col: 3, row: 6 },
    "V06": { col: 4, row: 5 },
    "10": { col: 0, row: 5 },
    "11": { col: 1, row: 5 },
    "V08": { col: 0, row: 6 },
    "12": { col: 1, row: 7 },
    "20": { col: 2, row: 7 },
    "21": { col: 3, row: 7 },
    "22": { col: 4, row: 7 },
    "V07": { col: 1, row: 8 },
    "V11": { col: 2, row: 8 },
    "13": { col: 1, row: 10 },
    "14": { col: 2, row: 10 },
    "16": { col: 3, row: 10 },
    "17": { col: 4, row: 10 },
    "18": { col: 2, row: 11 },
    "19": { col: 3, row: 11 },
    "15": { col: 4, row: 11 },
    "V10": { col: 2, row: 12 },
    "V09": { col: 3, row: 12 },
};
const ORGANIZE_SECTIONS = [
    { title: "Autenticação", col: 0, row: -0.35, color: { r: 0.12, g: 0.23, b: 0.37 } },
    { title: "Fluxo Principal — Aluno", col: 0, row: 3.65, color: { r: 0.12, g: 0.23, b: 0.37 } },
    { title: "Telas Auxiliares — Aluno", col: 0, row: 6.65, color: { r: 0.12, g: 0.23, b: 0.37 } },
    { title: "Fluxo Administrador", col: 0, row: 9.65, color: { r: 0.73, g: 0.11, b: 0.11 } },
];
function screenKeyFromName(frameName) {
    const match = frameName.match(/^(V?\d{2})\s+—/i);
    return match ? match[1].toUpperCase() : null;
}
function removeOrganizerLabels() {
    const labels = figma.currentPage.findAll(node => node.getPluginData(ORGANIZE_LABEL_PLUGIN_KEY) === "true");
    for (const label of labels) {
        label.remove();
    }
}
async function organizeFramesByJourney() {
    await loadImportFonts();
    const allFrames = figma.currentPage.children.filter((n) => n.type === "FRAME");
    const screenFrames = allFrames.filter(frame => {
        const key = screenKeyFromName(frame.name);
        return key !== null && ORGANIZE_LAYOUT[key] !== undefined;
    });
    const unmappedFrames = allFrames.filter(frame => {
        const key = screenKeyFromName(frame.name);
        return key === null || ORGANIZE_LAYOUT[key] === undefined;
    });
    const report = {
        summary: { expected: screenFrames.length, applied: 0, skippedExisting: 0, missingSources: 0, missingTargets: 0, ambiguous: 0 },
        applied: [],
        skippedExisting: [],
        missingSources: [],
        missingTargets: [],
        ambiguous: [],
    };
    if (screenFrames.length === 0) {
        report.missingTargets.push({
            connectionId: 0,
            fromFrame: "Página atual",
            sourceName: "Organizar Frames",
            toFrame: "",
            detail: "Nenhum frame com nome 01/V01 encontrado",
        });
        report.summary.missingTargets++;
        return report;
    }
    const baseX = Math.min(...screenFrames.map(frame => frame.x));
    const baseY = Math.min(...screenFrames.map(frame => frame.y));
    const maxFrameWidth = Math.max(...screenFrames.map(frame => frame.width));
    const maxFrameHeight = Math.max(...screenFrames.map(frame => frame.height));
    const stepX = Math.max(820, maxFrameWidth + 260);
    const stepY = Math.max(1180, maxFrameHeight + 320);
    removeOrganizerLabels();
    for (const section of ORGANIZE_SECTIONS) {
        const label = createLabel(section.title, baseX + section.col * stepX, baseY + section.row * stepY, 26, "Bold", section.color);
        label.setPluginData(ORGANIZE_LABEL_PLUGIN_KEY, "true");
        figma.currentPage.appendChild(label);
    }
    let moved = 0;
    for (const frame of screenFrames) {
        const key = screenKeyFromName(frame.name);
        if (!key)
            continue;
        const pos = ORGANIZE_LAYOUT[key];
        frame.x = baseX + pos.col * stepX;
        frame.y = baseY + pos.row * stepY;
        report.applied.push({
            connectionId: moved + 1,
            fromFrame: frame.name,
            sourceName: "Organizado por jornada",
            toFrame: `col ${pos.col}, row ${pos.row}`,
        });
        report.summary.applied++;
        moved++;
    }
    report.applied.unshift({
        connectionId: 0,
        fromFrame: "Organizador",
        sourceName: `Espaçamento: ${Math.round(stepX)}px x ${Math.round(stepY)}px`,
        toFrame: `${screenFrames.length} frames`,
    });
    const navComponents = figma.currentPage.children.filter(node => node.type === "COMPONENT" && (node.name === BOTTOM_NAV_COMPONENT_NAME || node.getPluginData(BOTTOM_NAV_PLUGIN_KEY) === "component"));
    for (const component of navComponents) {
        if ("x" in component && "y" in component) {
            component.x = baseX;
            component.y = baseY - 260;
        }
    }
    figma.currentPage.selection = screenFrames.slice(0, 1);
    figma.viewport.scrollAndZoomIntoView(screenFrames);
    unifyPrototypeFlows();
    // Report unmapped frames for diagnostics
    if (unmappedFrames.length > 0) {
        for (const frame of unmappedFrames.slice(0, 20)) {
            report.missingSources.push({
                connectionId: 0,
                fromFrame: frame.name,
                sourceName: "Não mapeado",
                toFrame: screenKeyFromName(frame.name) || "(sem key)",
                detail: `Frame "${frame.name}" não está no mapa de organização`,
            });
        }
        report.summary.missingSources = unmappedFrames.length;
    }
    return report;
}
function addPhoneChromeToVariants() {
    const report = {
        summary: { expected: 0, applied: 0, skippedExisting: 0, missingSources: 0, missingTargets: 0, ambiguous: 0 },
        applied: [],
        skippedExisting: [],
        missingSources: [],
        missingTargets: [],
        ambiguous: [],
    };
    const allFrames = figma.currentPage.children.filter((n) => n.type === "FRAME");
    const variants = allFrames.filter(f => /^V\d{2}\s+—/i.test(f.name));
    report.summary.expected = variants.length;
    for (const v of variants) {
        try {
            // Find the phone-screen rectangle (the PNG image fill, 375x780-ish)
            let phoneRect = null;
            const allDescendants = v.findAll(node => {
                if (node.type !== "RECTANGLE")
                    return false;
                const r = node;
                if (r.width < 320 || r.width > 430 || r.height < 600 || r.height > 900)
                    return false;
                const fills = r.fills;
                if (fills === figma.mixed)
                    return false;
                return Array.isArray(fills) && fills.some(f => f.type === "IMAGE");
            });
            if (allDescendants.length > 0) {
                phoneRect = allDescendants[0];
            }
            const target = phoneRect || v;
            // Clear chrome from the outer frame if it was previously applied incorrectly
            if (phoneRect) {
                try {
                    v.cornerRadius = 0;
                    v.strokes = [];
                    v.strokeWeight = 0;
                    v.effects = [];
                }
                catch ( /* ignore */_a) { /* ignore */ }
            }
            // Apply phone chrome to the actual phone-screen element
            target.cornerRadius = 36;
            target.strokes = [{ type: "SOLID", color: { r: 0.10, g: 0.12, b: 0.16 } }];
            target.strokeWeight = 8;
            target.strokeAlign = "OUTSIDE";
            target.effects = [{
                    type: "DROP_SHADOW",
                    color: { r: 0, g: 0, b: 0, a: 0.18 },
                    offset: { x: 0, y: 8 },
                    radius: 24,
                    spread: 0,
                    visible: true,
                    blendMode: "NORMAL",
                }];
            v.setPluginData("uniachados-phone-chrome", "true");
            report.applied.push({
                connectionId: 0,
                fromFrame: v.name,
                sourceName: phoneRect ? "Moldura no PNG da tela" : "Moldura no frame (PNG não encontrado)",
                toFrame: `${Math.round(target.width || v.width)}x${Math.round(target.height || v.height)}`,
            });
            report.summary.applied++;
        }
        catch (e) {
            report.missingSources.push({
                connectionId: 0,
                fromFrame: v.name,
                sourceName: "Erro ao aplicar moldura",
                toFrame: "",
                detail: String(e),
            });
            report.summary.missingSources++;
        }
    }
    return report;
}
function cloneVisualStyle(target, source) {
    const writableTarget = target;
    const writableSource = source;
    try {
        writableTarget.fills = writableSource.fills;
    }
    catch ( /* ignore */_a) { /* ignore */ }
    try {
        writableTarget.strokes = writableSource.strokes;
    }
    catch ( /* ignore */_b) { /* ignore */ }
    try {
        writableTarget.strokeWeight = writableSource.strokeWeight;
    }
    catch ( /* ignore */_c) { /* ignore */ }
    try {
        writableTarget.strokeAlign = writableSource.strokeAlign;
    }
    catch ( /* ignore */_d) { /* ignore */ }
    try {
        writableTarget.cornerRadius = writableSource.cornerRadius;
    }
    catch ( /* ignore */_e) { /* ignore */ }
    try {
        writableTarget.effects = writableSource.effects;
    }
    catch ( /* ignore */_f) { /* ignore */ }
    try {
        writableTarget.clipsContent = writableSource.clipsContent;
    }
    catch ( /* ignore */_g) { /* ignore */ }
}
function hasText(node, text) {
    return textContains(getAllText(node), text);
}
function isStartCaptureArtifact(node) {
    const text = getAllText(node);
    return textContains(text, "Start Capturing") || textContains(node.name, "Notifications alt+T");
}
function findBottomNavChild(frame) {
    return frame.children.find(child => isImportedBottomNav(child)) || null;
}
function findDirectPhoneChild(frame) {
    return frame.children.find(child => {
        if (child.type !== "FRAME")
            return false;
        if (isImportedBottomNav(child))
            return false;
        return child.width >= 360 && child.width <= 430 && child.height >= 740 && child.height <= 830;
    }) || null;
}
function findNestedPhoneCandidate(frame) {
    const candidates = frame.findAll(node => {
        if (node.type !== "FRAME")
            return false;
        const candidate = node;
        if (candidate === frame)
            return false;
        if (isImportedBottomNav(candidate))
            return false;
        if (isStartCaptureArtifact(candidate))
            return false;
        if (candidate.width < 360 || candidate.width > 430)
            return false;
        if (candidate.height < 740 || candidate.height > 830)
            return false;
        const text = getAllText(candidate);
        return textContains(text, "09:41") || textContains(text, "Login") || textContains(text, "Criar conta") || textContains(text, "Solicitação");
    });
    candidates.sort((a, b) => Math.abs(a.height - 780) - Math.abs(b.height - 780));
    return candidates[0] || null;
}
function normalizePhoneChildren(phone) {
    const children = phone.children.filter((child) => child.type !== "INSTANCE" || !isImportedBottomNav(child));
    const status = children.find(child => "height" in child && child.height <= 40 && hasText(child, "09:41"));
    const body = children.find(child => child !== status && "height" in child && child.height > 300);
    if (status && "x" in status && "y" in status && "height" in status) {
        status.x = 0;
        status.y = 0;
    }
    if (body && status && "x" in body && "y" in body && "height" in status) {
        body.x = 0;
        body.y = status.height;
    }
}
function collectDirectScreenPieces(frame) {
    return frame.children
        .filter((child) => {
        if (isImportedBottomNav(child))
            return false;
        if (isStartCaptureArtifact(child))
            return false;
        if (!("width" in child) || !("height" in child))
            return false;
        const width = child.width;
        return width >= 320 && width <= 430;
    })
        .sort((a, b) => (a.y || 0) - (b.y || 0));
}
function wrapScreenPieces(frame, pieces, referencePhone, phoneX, phoneY) {
    if (pieces.length === 0)
        return null;
    const wrapper = figma.createFrame();
    wrapper.name = "Container";
    wrapper.resize(referencePhone.width, referencePhone.height);
    wrapper.x = phoneX;
    wrapper.y = phoneY;
    cloneVisualStyle(wrapper, referencePhone);
    frame.appendChild(wrapper);
    let y = 0;
    for (const piece of pieces) {
        wrapper.appendChild(piece);
        piece.x = 0;
        piece.y = y;
        y += piece.height || 0;
    }
    normalizePhoneChildren(wrapper);
    return wrapper;
}
async function normalizeVariantLayouts() {
    const report = {
        summary: { expected: 0, applied: 0, skippedExisting: 0, missingSources: 0, missingTargets: 0, ambiguous: 0 },
        applied: [],
        skippedExisting: [],
        missingSources: [],
        missingTargets: [],
        ambiguous: [],
    };
    const allFrames = figma.currentPage.children.filter((node) => node.type === "FRAME");
    const referenceFrame = findFrameByName("02 — Login", allFrames);
    const referencePhone = referenceFrame ? findDirectPhoneChild(referenceFrame) : null;
    const referenceNav = referenceFrame ? findBottomNavChild(referenceFrame) : null;
    const variants = allFrames.filter(frame => /^V\d{2}\s+—/i.test(frame.name));
    report.summary.expected = variants.length;
    if (!referenceFrame || !referencePhone || !referenceNav) {
        report.missingTargets.push({
            connectionId: 0,
            fromFrame: "02 — Login",
            sourceName: "Frame de referência",
            toFrame: "Variações",
            detail: "Não encontrei o frame Login correto com celular e nav inferior",
        });
        report.summary.missingTargets++;
        return report;
    }
    await loadImportFonts();
    const phoneX = referencePhone.x;
    const phoneY = referencePhone.y;
    const navX = referenceNav.x;
    const navY = referenceNav.y;
    for (const frame of variants) {
        try {
            const nav = findBottomNavChild(frame);
            let phone = findDirectPhoneChild(frame) || findNestedPhoneCandidate(frame);
            let detail = "telefone reposicionado";
            if (phone) {
                if (phone.parent !== frame) {
                    frame.appendChild(phone);
                    detail = "telefone retirado de wrapper incorreto";
                }
                phone.x = phoneX;
                phone.y = phoneY;
                cloneVisualStyle(phone, referencePhone);
                normalizePhoneChildren(phone);
            }
            else {
                const pieces = collectDirectScreenPieces(frame);
                phone = wrapScreenPieces(frame, pieces, referencePhone, phoneX, phoneY);
                detail = phone ? "status/body agrupados no padrão do Login" : "telefone não encontrado";
            }
            for (const child of frame.children.slice()) {
                if (child === phone || child === nav)
                    continue;
                if (isImportedBottomNav(child))
                    continue;
                if (isStartCaptureArtifact(child) || child.name === "Body" || child.name === "Container") {
                    child.remove();
                }
            }
            frame.resize(referenceFrame.width, referenceFrame.height);
            cloneVisualStyle(frame, referenceFrame);
            frame.clipsContent = false;
            if (nav && "x" in nav && "y" in nav) {
                nav.x = navX;
                nav.y = navY;
            }
            if (!phone) {
                report.missingSources.push({
                    connectionId: 0,
                    fromFrame: frame.name,
                    sourceName: "Telefone da variação",
                    toFrame: "02 — Login",
                    detail: "Não encontrei containers de tela para normalizar",
                });
                report.summary.missingSources++;
                continue;
            }
            report.applied.push({
                connectionId: report.summary.applied + 1,
                fromFrame: frame.name,
                sourceName: detail,
                toFrame: `${Math.round(referenceFrame.width)}x${Math.round(referenceFrame.height)}; phone ${Math.round(phoneX)},${Math.round(phoneY)}; nav ${Math.round(navX)},${Math.round(navY)}`,
            });
            report.summary.applied++;
        }
        catch (error) {
            report.missingSources.push({
                connectionId: 0,
                fromFrame: frame.name,
                sourceName: "Corrigir variação",
                toFrame: "",
                detail: String(error),
            });
            report.summary.missingSources++;
        }
    }
    figma.currentPage.selection = variants.slice(0, 1);
    figma.viewport.scrollAndZoomIntoView(variants);
    return report;
}
function findBackArrowInFrame(frame) {
    const candidates = [];
    function walk(node, depth) {
        if (depth > 8)
            return;
        try {
            const abs = node.absoluteBoundingBox;
            if (abs) {
                const relX = abs.x - frame.x;
                const relY = abs.y - frame.y;
                // Expanded search area: top-left 40% width, top 20% height
                const inTopLeft = relX >= -10 && relX < frame.width * 0.40 && relY >= -10 && relY < frame.height * 0.20;
                if (inTopLeft) {
                    let score = 0;
                    const nameL = node.name.toLowerCase();
                    // Strongest signal: explicit name
                    if (nameL.includes("arrow_back") || nameL === "←")
                        score += 100;
                    if (nameL === "back" || nameL.includes("voltar"))
                        score += 80;
                    // Text node with arrow character
                    if (node.type === "TEXT") {
                        const chars = node.characters.trim();
                        if (chars === "←" || chars === "arrow_back")
                            score += 90;
                        // Material icons font often renders the back arrow as specific chars
                        if (chars === "" || chars === "\uE5C4" || chars === "\uE5E0")
                            score += 90;
                    }
                    // Button-named container in top-left
                    if (nameL === "button" || nameL.includes("icon-btn") || nameL.includes("iconbutton"))
                        score += 50;
                    // Generic "Icon" node in top-left is likely the back icon
                    if (nameL === "icon" && relX < frame.width * 0.20)
                        score += 40;
                    // Square small clickable element in top-left
                    if ("width" in node && "height" in node) {
                        const w = node.width;
                        const h = node.height;
                        if (w >= 20 && w <= 72 && h >= 20 && h <= 72 && Math.abs(w - h) < 24) {
                            score += 25;
                            // Bonus if very close to the top-left corner
                            if (relX < frame.width * 0.15 && relY < frame.height * 0.12)
                                score += 15;
                        }
                    }
                    if (score > 0) {
                        candidates.push({ node, relX, relY, score });
                    }
                }
            }
        }
        catch ( /* ignore */_a) { /* ignore */ }
        if ("children" in node) {
            for (const child of node.children)
                walk(child, depth + 1);
        }
    }
    walk(frame, 0);
    if (candidates.length === 0)
        return null;
    // Prefer highest score, then closest to top-left
    candidates.sort((a, b) => b.score - a.score || (a.relX + a.relY) - (b.relX + b.relY));
    const best = candidates[0];
    // Return clickable ancestor (the Button container) instead of the bare Icon
    return findClickableAncestor(best.node, 3);
}
function connectBackArrows() {
    const report = {
        summary: { expected: 0, applied: 0, skippedExisting: 0, missingSources: 0, missingTargets: 0, ambiguous: 0 },
        applied: [],
        skippedExisting: [],
        missingSources: [],
        missingTargets: [],
        ambiguous: [],
    };
    const allFrames = figma.currentPage.children.filter((n) => n.type === "FRAME");
    const screenFrames = allFrames.filter(isScreenFrame);
    report.summary.expected = screenFrames.length;
    // Frames where back doesn't make sense (entry points + confirmations without back arrow)
    const skipScreens = new Set(["01", "04", "13", "09", "11", "17", "V11"]);
    for (const frame of screenFrames) {
        const key = screenKeyFromName(frame.name);
        if (key && key.startsWith("V")) {
            report.skippedExisting.push({
                connectionId: 0,
                fromFrame: frame.name,
                sourceName: "Variação — navegação somente pela nav inferior",
                toFrame: "",
            });
            report.summary.skippedExisting++;
            continue;
        }
        if (key && skipScreens.has(key)) {
            report.skippedExisting.push({
                connectionId: 0,
                fromFrame: frame.name,
                sourceName: "Tela inicial — sem voltar",
                toFrame: "",
            });
            report.summary.skippedExisting++;
            continue;
        }
        const backNode = findBackArrowInFrame(frame);
        if (!backNode) {
            report.missingSources.push({
                connectionId: 0,
                fromFrame: frame.name,
                sourceName: "← (botão voltar)",
                toFrame: "",
                detail: "Ícone arrow_back não encontrado no topo da tela",
            });
            report.summary.missingSources++;
            continue;
        }
        try {
            const reaction = {
                trigger: { type: "ON_CLICK" },
                actions: [{ type: "BACK" }],
            };
            backNode.reactions = [reaction];
            report.applied.push({
                connectionId: 0,
                fromFrame: frame.name,
                sourceName: backNode.name || "← Voltar",
                toFrame: "(BACK navigation)",
            });
            report.summary.applied++;
        }
        catch (e) {
            report.missingSources.push({
                connectionId: 0,
                fromFrame: frame.name,
                sourceName: "← (botão voltar)",
                toFrame: "",
                detail: `Erro ao aplicar reação: ${e}`,
            });
            report.summary.missingSources++;
        }
    }
    return report;
}
async function applyConnections(connections, config) {
    const report = {
        summary: { expected: connections.length, applied: 0, skippedExisting: 0, missingSources: 0, missingTargets: 0, ambiguous: 0 },
        applied: [],
        skippedExisting: [],
        missingSources: [],
        missingTargets: [],
        ambiguous: [],
    };
    const allFrames = figma.currentPage.children.filter((n) => n.type === "FRAME");
    let processed = 0;
    for (const entry of connections) {
        // Yield every 3 connections to avoid Figma timeout
        if (processed > 0 && processed % 3 === 0) {
            await sleep(10);
            figma.ui.postMessage({ type: "status", message: `Processando... ${processed}/${connections.length}` });
        }
        processed++;
        const fromFrame = findFrameByName(entry.fromFrame, allFrames);
        if (!fromFrame) {
            report.missingTargets.push({
                connectionId: entry.id,
                fromFrame: entry.fromFrame,
                sourceName: entry.source.name,
                toFrame: entry.toFrame,
                detail: `Frame de origem "${entry.fromFrame}" não encontrado`,
            });
            report.summary.missingTargets++;
            continue;
        }
        const toFrame = findFrameByName(entry.toFrame, allFrames);
        if (!toFrame) {
            report.missingTargets.push({
                connectionId: entry.id,
                fromFrame: entry.fromFrame,
                sourceName: entry.source.name,
                toFrame: entry.toFrame,
                detail: `Frame de destino "${entry.toFrame}" não encontrado`,
            });
            report.summary.missingTargets++;
            continue;
        }
        const { node: sourceNode, candidates } = findSourceElementV2(fromFrame, entry.source);
        if (!sourceNode && candidates.length === 0) {
            report.missingSources.push({
                connectionId: entry.id,
                fromFrame: entry.fromFrame,
                sourceName: entry.source.name,
                toFrame: entry.toFrame,
                detail: `Elemento "${entry.source.name}" não encontrado em "${fromFrame.name}"`,
            });
            report.summary.missingSources++;
            continue;
        }
        if (!sourceNode && candidates.length > 1) {
            report.ambiguous.push({
                connectionId: entry.id,
                fromFrame: entry.fromFrame,
                sourceName: entry.source.name,
                toFrame: entry.toFrame,
                detail: `${candidates.length} candidatos: ${candidates.slice(0, 5).map(c => c.name).join(", ")}`,
            });
            report.summary.ambiguous++;
            continue;
        }
        const targetNode = sourceNode || candidates[0];
        if (!targetNode) {
            report.missingSources.push({
                connectionId: entry.id,
                fromFrame: entry.fromFrame,
                sourceName: entry.source.name,
                toFrame: entry.toFrame,
                detail: `Nenhum candidato`,
            });
            report.summary.missingSources++;
            continue;
        }
        // Check existing reactions
        if ("reactions" in targetNode) {
            const existingReactions = targetNode.reactions;
            const hasClickReaction = existingReactions.some((r) => { var _a; return ((_a = r.trigger) === null || _a === void 0 ? void 0 : _a.type) === "ON_CLICK"; });
            if (hasClickReaction && !config.overwriteExisting) {
                report.skippedExisting.push({
                    connectionId: entry.id,
                    fromFrame: entry.fromFrame,
                    sourceName: entry.source.name,
                    toFrame: entry.toFrame,
                    detail: `"${targetNode.name}" já tem ON_CLICK`,
                });
                report.summary.skippedExisting++;
                continue;
            }
        }
        // Apply reaction
        if (!config.dryRun && "reactions" in targetNode) {
            try {
                const reaction = buildReaction(toFrame, entry);
                const reactable = targetNode;
                let newReactions;
                if (config.overwriteExisting) {
                    newReactions = reactable.reactions.filter((r) => { var _a; return ((_a = r.trigger) === null || _a === void 0 ? void 0 : _a.type) !== "ON_CLICK"; });
                    newReactions.push(reaction);
                }
                else {
                    newReactions = [...reactable.reactions, reaction];
                }
                reactable.reactions = newReactions;
                report.applied.push({
                    connectionId: entry.id,
                    fromFrame: entry.fromFrame,
                    sourceName: `${entry.source.name} (${targetNode.name})`,
                    toFrame: entry.toFrame,
                });
                report.summary.applied++;
            }
            catch (e) {
                report.missingSources.push({
                    connectionId: entry.id,
                    fromFrame: entry.fromFrame,
                    sourceName: entry.source.name,
                    toFrame: entry.toFrame,
                    detail: `Erro ao aplicar: ${e.message || e}`,
                });
                report.summary.missingSources++;
            }
        }
        else if (config.dryRun) {
            report.applied.push({
                connectionId: entry.id,
                fromFrame: entry.fromFrame,
                sourceName: `${entry.source.name} (${targetNode.name}) [DRY RUN]`,
                toFrame: entry.toFrame,
            });
            report.summary.applied++;
        }
    }
    return report;
}
// ─── Bottom Nav Component Builder ───────────────────────────────────────────
const BOTTOM_NAV_COMPONENT_NAME = "UniAchados — Nav Inferior Component";
const BOTTOM_NAV_INSTANCE_NAME = "UniAchados — Nav Inferior";
const BOTTOM_NAV_PLUGIN_KEY = "uniachados-bottom-nav";
const MAIN_BOTTOM_NAV_LABELS = {
    "01": "1. Boas-vindas",
    "02": "2. Login",
    "03": "3. Cadastro",
    "04": "4. Home Aluno",
    "05": "5. Buscar",
    "06": "6. Filtros",
    "07": "7. Detalhes",
    "08": "8. Retirada",
    "09": "9. Conf. Solicitação",
    "10": "10. Cad. Perdido",
    "11": "11. Conf. Cadastro",
    "12": "12. Solicitações",
    "13": "13. Painel Admin",
    "14": "14. Objetos Admin",
    "15": "15. Histórico",
    "16": "16. Cad. Encontrado",
    "17": "17. Conf. Encontrado",
    "18": "18. Validar",
    "19": "19. Encerrar",
    "20": "20. Notificações",
    "21": "21. Perfil",
    "22": "22. Ajuda",
};
function isScreenFrame(frame) {
    return /^(\d{2}|V\d{2})\s+—/.test(frame.name);
}
function screenSortKey(frameName) {
    const mainMatch = frameName.match(/^(\d{2})\s+—/);
    if (mainMatch)
        return Number(mainMatch[1]);
    const variantMatch = frameName.match(/^V(\d{2})\s+—/i);
    if (variantMatch)
        return 100 + Number(variantMatch[1]);
    return 999;
}
function navLabelForFrame(frameName) {
    const mainMatch = frameName.match(/^(\d{2})\s+—/);
    if (mainMatch && MAIN_BOTTOM_NAV_LABELS[mainMatch[1]]) {
        return MAIN_BOTTOM_NAV_LABELS[mainMatch[1]];
    }
    const variantMatch = frameName.match(/^(V\d{2})\s+—\s+(.+)$/i);
    if (variantMatch) {
        return `${variantMatch[1].toUpperCase()}. ${variantMatch[2]}`;
    }
    return frameName;
}
function getBottomNavTargets(allFrames) {
    return allFrames
        .filter(isScreenFrame)
        .map(frame => ({ frame, label: navLabelForFrame(frame.name), sortKey: screenSortKey(frame.name) }))
        .sort((a, b) => a.sortKey - b.sortKey);
}
function findPhoneContainerInFrame(frame) {
    for (const child of frame.children) {
        if ("width" in child && "height" in child && "children" in child) {
            const container = child;
            if (container.width >= 300 && container.width <= 430 && container.height >= 600) {
                return container;
            }
        }
    }
    return null;
}
function isImportedBottomNav(node) {
    if (node.getPluginData(BOTTOM_NAV_PLUGIN_KEY) === "instance")
        return true;
    if (node.name === BOTTOM_NAV_INSTANCE_NAME)
        return true;
    if (!("width" in node) || !("height" in node))
        return false;
    const width = node.width;
    const height = node.height;
    if (width < 300 || height < 70 || height > 600)
        return false;
    const text = getAllText(node);
    return textContains(text, "Telas:") || textContains(text, "1. Boas-vindas");
}
function removeExistingBottomNav(frame) {
    let removed = 0;
    // Search up to 3 levels deep to find and remove embedded "Telas:" nav blocks
    function searchAndRemove(parent, depth) {
        if (depth > 3)
            return;
        for (const child of parent.children.slice()) {
            if (isImportedBottomNav(child)) {
                child.remove();
                removed++;
            }
            else if ("children" in child && depth < 3) {
                searchAndRemove(child, depth + 1);
            }
        }
    }
    searchAndRemove(frame, 0);
    // Fallback: if nothing was removed, find TextNode "Telas:" and remove its nearest frame parent
    if (removed === 0) {
        const telasNodes = frame.findAll(node => node.type === "TEXT" && node.characters.includes("Telas:"));
        for (const tNode of telasNodes) {
            let target = tNode.parent;
            // Walk up to find a frame container that holds the nav (not the root frame itself)
            while (target && target !== frame && target.parent !== frame) {
                target = target.parent;
            }
            if (target && target !== frame && !target.removed) {
                target.remove();
                removed++;
            }
        }
    }
    return removed;
}
function removeGeneratedBottomNavComponents() {
    let removed = 0;
    const nodes = figma.currentPage.findAll(node => node.getPluginData(BOTTOM_NAV_PLUGIN_KEY) === "component" || node.name === BOTTOM_NAV_COMPONENT_NAME);
    for (const node of nodes) {
        node.remove();
        removed++;
    }
    return removed;
}
function buttonWidthForLabel(label) {
    return Math.max(72, Math.min(168, label.length * 7 + 24));
}
async function createBottomNavComponent(targets) {
    await loadImportFonts();
    const component = figma.createComponent();
    component.name = BOTTOM_NAV_COMPONENT_NAME;
    component.setPluginData(BOTTOM_NAV_PLUGIN_KEY, "component");
    component.resize(600, 120);
    component.clipsContent = false;
    component.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
    component.strokes = [{ type: "SOLID", color: { r: 0.86, g: 0.88, b: 0.91 }, opacity: 1 }];
    component.strokeWeight = 1;
    component.cornerRadius = 8;
    const title = createLabel("Telas:", 18, 18, 13, "Bold", { r: 0.12, g: 0.16, b: 0.23 });
    component.appendChild(title);
    let x = 78;
    let y = 10;
    const gap = 8;
    const rowHeight = 32;
    for (const target of targets) {
        const width = buttonWidthForLabel(target.label);
        if (x + width > 582) {
            x = 18;
            y += rowHeight;
        }
        const button = figma.createFrame();
        button.name = `Nav item — ${target.label}`;
        button.setPluginData(BOTTOM_NAV_PLUGIN_KEY, "button");
        button.resize(width, 26);
        button.x = x;
        button.y = y;
        button.cornerRadius = 7;
        button.clipsContent = false;
        button.fills = [{ type: "SOLID", color: { r: 0.96, g: 0.98, b: 1 } }];
        button.strokes = [{ type: "SOLID", color: { r: 0.83, g: 0.87, b: 0.93 }, opacity: 1 }];
        button.strokeWeight = 1;
        button.reactions = [buildImportReaction(target.frame)];
        const label = createLabel(target.label, 10, 6, 12, "Regular", { r: 0.17, g: 0.22, b: 0.30 });
        button.appendChild(label);
        component.appendChild(button);
        x += width + gap;
    }
    component.resize(600, y + rowHeight + 10);
    return component;
}
async function rebuildBottomNavComponent(config) {
    var _a, _b;
    const allFrames = figma.currentPage.children.filter((n) => n.type === "FRAME");
    const sourceFrames = allFrames.filter(isScreenFrame).sort((a, b) => screenSortKey(a.name) - screenSortKey(b.name));
    const targets = getBottomNavTargets(allFrames);
    const report = {
        summary: { expected: sourceFrames.length, applied: 0, skippedExisting: 0, missingSources: 0, missingTargets: 0, ambiguous: 0 },
        applied: [],
        skippedExisting: [],
        missingSources: [],
        missingTargets: [],
        ambiguous: [],
    };
    if (targets.length === 0) {
        report.missingTargets.push({ connectionId: 0, fromFrame: "Página atual", sourceName: "Nav Inferior", toFrame: "", detail: "Nenhum frame 01/V01 encontrado" });
        report.summary.missingTargets++;
        return report;
    }
    if (config.dryRun) {
        report.summary.applied = sourceFrames.length;
        report.applied.push({
            connectionId: 0,
            fromFrame: "Página atual",
            sourceName: `DRY RUN: recriaria 1 componente com ${targets.length} botões`,
            toFrame: `${sourceFrames.length} frames`,
        });
        return report;
    }
    for (const frame of sourceFrames) {
        removeExistingBottomNav(frame);
    }
    removeGeneratedBottomNavComponents();
    const component = await createBottomNavComponent(targets);
    const minX = sourceFrames.reduce((min, frame) => Math.min(min, frame.x), ((_a = sourceFrames[0]) === null || _a === void 0 ? void 0 : _a.x) || 0);
    const minY = sourceFrames.reduce((min, frame) => Math.min(min, frame.y), ((_b = sourceFrames[0]) === null || _b === void 0 ? void 0 : _b.y) || 0);
    component.x = minX;
    component.y = minY - component.height - 80;
    let index = 0;
    for (const frame of sourceFrames) {
        if (index > 0 && index % 5 === 0) {
            await sleep(10);
            figma.ui.postMessage({ type: "status", message: `Recriando nav inferior... ${index}/${sourceFrames.length}` });
        }
        const phone = findPhoneContainerInFrame(frame);
        const instance = component.createInstance();
        instance.name = BOTTOM_NAV_INSTANCE_NAME;
        instance.setPluginData(BOTTOM_NAV_PLUGIN_KEY, "instance");
        frame.appendChild(instance);
        const navX = phone ? phone.x + Math.max(0, (phone.width - component.width) / 2) : 0;
        const navY = phone ? phone.y + phone.height + 16 : frame.height + 16;
        instance.x = navX;
        instance.y = navY;
        frame.clipsContent = false;
        frame.resize(Math.max(frame.width, navX + component.width), Math.max(frame.height, navY + component.height + 16));
        report.applied.push({
            connectionId: index + 1,
            fromFrame: frame.name,
            sourceName: `Instância da nav (${targets.length} botões)`,
            toFrame: BOTTOM_NAV_COMPONENT_NAME,
        });
        report.summary.applied++;
        index++;
    }
    return report;
}
function inspectNode(node, depth, maxDepth) {
    const info = {
        name: node.name,
        type: node.type,
        x: "x" in node ? node.x : 0,
        y: "y" in node ? node.y : 0,
        w: "width" in node ? node.width : 0,
        h: "height" in node ? node.height : 0,
    };
    if (node.type === "TEXT") {
        info.text = node.characters;
    }
    if ("children" in node && depth < maxDepth) {
        info.children = node.children.map((c) => inspectNode(c, depth + 1, maxDepth));
    }
    return info;
}
function getFrameStructureSummary(frame, maxDepth = 4) {
    // Collect all text nodes
    const textNodes = [];
    function collectTexts(node, path) {
        if (node.type === "TEXT") {
            textNodes.push({
                text: node.characters,
                path: path + " > " + node.name,
                x: "x" in node ? node.x : 0,
                y: "y" in node ? node.y : 0,
            });
        }
        if ("children" in node) {
            for (const child of node.children) {
                collectTexts(child, path + " > " + node.name);
            }
        }
    }
    collectTexts(frame, "");
    // Identify topbar (first short, full-width child near top)
    let topbar = null;
    let bottomNav = null;
    const directChildren = [];
    for (const child of frame.children) {
        const c = child;
        const info = {
            name: c.name,
            type: c.type,
            x: "x" in c ? c.x : 0,
            y: "y" in c ? c.y : 0,
            w: "width" in c ? c.width : 0,
            h: "height" in c ? c.height : 0,
        };
        directChildren.push(info);
        if ("height" in c && "y" in c && "width" in c && "children" in c) {
            const ch = c;
            if (ch.height <= 80 && ch.y <= 60 && ch.width > 200 && !topbar) {
                topbar = inspectNode(ch, 0, 3);
            }
            if ((ch.y + ch.height) >= frame.height - 5 && ch.height <= 100 && ch.height >= 40 && ch.width > 200) {
                bottomNav = inspectNode(ch, 0, 3);
            }
        }
    }
    return {
        frameName: frame.name,
        frameSize: { w: frame.width, h: frame.height },
        directChildrenCount: frame.children.length,
        directChildren,
        topbar,
        bottomNav,
        allTextNodes: textNodes,
        tree: inspectNode(frame, 0, maxDepth),
    };
}
function exportNumber(value) {
    const numeric = Number(value) || 0;
    return Math.round(numeric * 100) / 100;
}
function summarizePaints(node) {
    if (!("fills" in node))
        return undefined;
    const fills = node.fills;
    if (fills === figma.mixed || !Array.isArray(fills))
        return undefined;
    return fills.slice(0, 4).map((paint) => {
        var _a, _b;
        if (paint.type === "SOLID") {
            return {
                type: paint.type,
                color: paint.color,
                opacity: (_a = paint.opacity) !== null && _a !== void 0 ? _a : 1,
            };
        }
        return { type: paint.type, opacity: "opacity" in paint ? (_b = paint.opacity) !== null && _b !== void 0 ? _b : 1 : 1 };
    });
}
function summarizeReactions(node, allFrames) {
    if (!("reactions" in node))
        return [];
    const reactions = (node.reactions || []);
    return reactions.map(reaction => {
        var _a;
        return ({
            trigger: ((_a = reaction.trigger) === null || _a === void 0 ? void 0 : _a.type) || null,
            actions: (reaction.actions || []).map((action) => {
                var _a;
                const destination = action.destinationId
                    ? ((_a = allFrames.find(frame => frame.id === action.destinationId)) === null || _a === void 0 ? void 0 : _a.name) || action.destinationId
                    : undefined;
                return {
                    type: action.type,
                    navigation: action.navigation,
                    destination,
                };
            }),
        });
    });
}
function findNodePath(root, target) {
    if (root.id === target.id)
        return root.name;
    if (!("children" in root))
        return null;
    for (const child of root.children) {
        const childPath = findNodePath(child, target);
        if (childPath)
            return `${root.name} > ${childPath}`;
    }
    return null;
}
function exportNodeTree(node, allFrames, depth, maxDepth) {
    const info = {
        name: node.name,
        type: node.type,
        x: "x" in node ? exportNumber(node.x) : 0,
        y: "y" in node ? exportNumber(node.y) : 0,
        w: "width" in node ? exportNumber(node.width) : 0,
        h: "height" in node ? exportNumber(node.height) : 0,
        visible: "visible" in node ? node.visible : true,
    };
    if (node.type === "TEXT") {
        const textNode = node;
        info.text = textNode.characters;
        info.fontSize = textNode.fontSize === figma.mixed ? "mixed" : textNode.fontSize;
    }
    const fills = summarizePaints(node);
    if (fills && fills.length > 0)
        info.fills = fills;
    const reactions = summarizeReactions(node, allFrames);
    if (reactions.length > 0)
        info.reactions = reactions;
    if ("layoutMode" in node) {
        info.autoLayout = {
            mode: node.layoutMode,
            primaryAxisSizingMode: node.primaryAxisSizingMode,
            counterAxisSizingMode: node.counterAxisSizingMode,
            itemSpacing: node.itemSpacing,
            padding: {
                top: node.paddingTop,
                right: node.paddingRight,
                bottom: node.paddingBottom,
                left: node.paddingLeft,
            },
        };
    }
    if ("children" in node && depth < maxDepth) {
        const children = node.children;
        info.childCount = children.length;
        info.children = children.slice(0, 80).map(child => exportNodeTree(child, allFrames, depth + 1, maxDepth));
        if (children.length > 80)
            info.childrenTruncated = children.length - 80;
    }
    return info;
}
function collectExportDetails(frame, allFrames) {
    const textNodes = [];
    const clickableNodes = [];
    function walk(node, path, depth) {
        if (depth > 10)
            return;
        const nodePath = path ? `${path} > ${node.name}` : node.name;
        if (node.type === "TEXT") {
            textNodes.push({
                path: nodePath,
                name: node.name,
                text: node.characters,
                x: "x" in node ? exportNumber(node.x) : 0,
                y: "y" in node ? exportNumber(node.y) : 0,
                w: "width" in node ? exportNumber(node.width) : 0,
                h: "height" in node ? exportNumber(node.height) : 0,
            });
        }
        const reactions = summarizeReactions(node, allFrames);
        if (reactions.length > 0) {
            clickableNodes.push({
                path: nodePath,
                name: node.name,
                type: node.type,
                x: "x" in node ? exportNumber(node.x) : 0,
                y: "y" in node ? exportNumber(node.y) : 0,
                w: "width" in node ? exportNumber(node.width) : 0,
                h: "height" in node ? exportNumber(node.height) : 0,
                reactions,
            });
        }
        if ("children" in node) {
            for (const child of node.children) {
                walk(child, nodePath, depth + 1);
            }
        }
    }
    walk(frame, "", 0);
    return { textNodes: textNodes.slice(0, 160), clickableNodes: clickableNodes.slice(0, 120) };
}
function exportConnectionChecks(frame, allFrames, connections) {
    return connections
        .filter(entry => { var _a; return ((_a = findFrameByName(entry.fromFrame, allFrames)) === null || _a === void 0 ? void 0 : _a.id) === frame.id; })
        .map(entry => {
        const targetFrame = findFrameByName(entry.toFrame, allFrames);
        const { node, candidates } = findSourceElementV2(frame, entry.source);
        const sourceNode = node || candidates[0] || null;
        return {
            id: entry.id,
            sourceName: entry.source.name,
            sourceText: entry.source.textMatch,
            sourceIcon: entry.source.iconMatch,
            toFrame: entry.toFrame,
            targetExists: Boolean(targetFrame),
            sourceFound: Boolean(sourceNode),
            sourcePath: sourceNode ? findNodePath(frame, sourceNode) : null,
            sourceNode: sourceNode ? {
                name: sourceNode.name,
                type: sourceNode.type,
                x: "x" in sourceNode ? exportNumber(sourceNode.x) : 0,
                y: "y" in sourceNode ? exportNumber(sourceNode.y) : 0,
                w: "width" in sourceNode ? exportNumber(sourceNode.width) : 0,
                h: "height" in sourceNode ? exportNumber(sourceNode.height) : 0,
                reactions: summarizeReactions(sourceNode, allFrames),
            } : null,
            candidateCount: candidates.length,
        };
    });
}
function exportStructure(scope, maxDepth, connections) {
    const allFrames = figma.currentPage.children.filter((node) => node.type === "FRAME");
    const selectedFrames = figma.currentPage.selection.filter((node) => node.type === "FRAME");
    const sourceFrames = scope === "selected" && selectedFrames.length > 0
        ? selectedFrames
        : allFrames.filter(isScreenFrame).sort((a, b) => screenSortKey(a.name) - screenSortKey(b.name));
    return {
        meta: {
            app: "UniAchados Figma plugin",
            exportType: "editable-structure-diagnostic",
            pageName: figma.currentPage.name,
            scope,
            selectedFramesUsed: scope === "selected" && selectedFrames.length > 0,
            frameCount: sourceFrames.length,
            maxDepth,
            note: "Cole este JSON junto com o print para diagnosticar estrutura, layout e conexoes sem achatar a tela como imagem.",
        },
        frames: sourceFrames.map(frame => {
            const details = collectExportDetails(frame, allFrames);
            return {
                id: frame.id,
                name: frame.name,
                x: exportNumber(frame.x),
                y: exportNumber(frame.y),
                w: exportNumber(frame.width),
                h: exportNumber(frame.height),
                clipsContent: frame.clipsContent,
                textNodes: details.textNodes,
                clickableNodes: details.clickableNodes,
                expectedConnections: exportConnectionChecks(frame, allFrames, connections),
                tree: exportNodeTree(frame, allFrames, 0, maxDepth),
            };
        }),
    };
}
function sanitizeFileName(input) {
    return input
        .replace(/[\\/:*?"<>|]/g, "-")
        .replace(/\s+/g, " ")
        .trim();
}
function bytesToBase64(bytes) {
    let binary = "";
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.subarray(i, i + chunkSize);
        binary += String.fromCharCode(...Array.from(chunk));
    }
    return btoa(binary);
}
async function exportAllScreenshots(scale = 2) {
    const allFrames = figma.currentPage.children.filter((node) => node.type === "FRAME");
    const sourceFrames = allFrames
        .filter(isScreenFrame)
        .sort((a, b) => screenSortKey(a.name) - screenSortKey(b.name));
    const files = [];
    let index = 0;
    for (const frame of sourceFrames) {
        index++;
        figma.ui.postMessage({ type: "status", message: `Exportando print... ${index}/${sourceFrames.length} (${frame.name})` });
        const bytes = await frame.exportAsync({
            format: "PNG",
            constraint: {
                type: "SCALE",
                value: scale,
            },
        });
        files.push({
            frameName: frame.name,
            fileName: `${sanitizeFileName(frame.name)}.png`,
            mimeType: "image/png",
            base64: bytesToBase64(bytes),
        });
        if (index % 3 === 0) {
            await sleep(10);
        }
    }
    return { files };
}
// ─── Plugin Entry Point ──────────────────────────────────────────────────────
figma.showUI(__html__, { width: 520, height: 640 });
figma.ui.onmessage = async (msg) => {
    if (msg.type === "apply-connections") {
        const config = msg.config || { overwriteExisting: false, dryRun: false };
        const connections = msg.connections || [];
        if (connections.length === 0) {
            figma.ui.postMessage({ type: "error", message: "Nenhuma conexão fornecida." });
            return;
        }
        figma.ui.postMessage({ type: "status", message: `Processando ${connections.length} conexões...` });
        const report = await applyConnections(connections, config);
        if (!config.dryRun)
            unifyPrototypeFlows();
        figma.ui.postMessage({ type: "report", report });
        figma.notify(`✅ ${report.summary.applied} | ⏭ ${report.summary.skippedExisting} | ❌ ${report.summary.missingSources + report.summary.missingTargets} | ⚠️ ${report.summary.ambiguous}`);
    }
    if (msg.type === "rebuild-bottom-nav") {
        const config = msg.config || { overwriteExisting: true, dryRun: false };
        figma.ui.postMessage({ type: "status", message: "Recriando nav inferior como componente único..." });
        const report = await rebuildBottomNavComponent(config);
        if (!config.dryRun)
            unifyPrototypeFlows();
        figma.ui.postMessage({ type: "report", report });
        figma.notify(`✅ Nav inferior recriada em ${report.summary.applied} frames`);
    }
    if (msg.type === "unify-flows") {
        figma.ui.postMessage({ type: "status", message: "Unificando flows da página..." });
        const report = unifyPrototypeFlows();
        figma.ui.postMessage({ type: "report", report });
        figma.notify(`✅ Flows unificados em 1 fluxo`);
    }
    if (msg.type === "organize-frames") {
        figma.ui.postMessage({ type: "status", message: "Organizando frames por jornada..." });
        const report = await organizeFramesByJourney();
        figma.ui.postMessage({ type: "report", report });
        figma.notify(`✅ ${report.summary.applied} frames organizados`);
    }
    if (msg.type === "fix-variant-layouts") {
        figma.ui.postMessage({ type: "status", message: "Corrigindo variações pelo padrão da tela Login..." });
        const report = await normalizeVariantLayouts();
        figma.ui.postMessage({ type: "report", report });
        figma.notify(`✅ ${report.summary.applied} variações corrigidas`);
    }
    if (msg.type === "add-phone-chrome") {
        figma.ui.postMessage({ type: "status", message: "Adicionando moldura de celular aos variantes..." });
        const report = addPhoneChromeToVariants();
        figma.ui.postMessage({ type: "report", report });
        figma.notify(`✅ ${report.summary.applied} variantes com moldura (${report.summary.skippedExisting} já tinham)`);
    }
    if (msg.type === "connect-back-arrows") {
        figma.ui.postMessage({ type: "status", message: "Conectando setas de voltar..." });
        const report = connectBackArrows();
        figma.ui.postMessage({ type: "report", report });
        figma.notify(`✅ ${report.summary.applied} setas conectadas (${report.summary.missingSources} sem ícone)`);
    }
    if (msg.type === "list-frames") {
        const frames = figma.currentPage.children.filter((n) => n.type === "FRAME");
        const frameData = frames.map(f => ({ id: f.id, name: f.name, w: f.width, h: f.height }));
        figma.ui.postMessage({ type: "frames-list", frames: frameData });
    }
    if (msg.type === "inspect-frame") {
        const frameName = msg.frameName || "";
        const maxDepth = msg.maxDepth || 4;
        const allFrames = figma.currentPage.children.filter((n) => n.type === "FRAME");
        if (!frameName) {
            // List all frames with their names
            const listing = allFrames.map(f => ({
                name: f.name,
                id: f.id,
                w: f.width,
                h: f.height,
                childCount: f.children.length,
            }));
            figma.ui.postMessage({ type: "inspect-result", data: { allFrames: listing } });
            return;
        }
        const frame = findFrameByName(frameName, allFrames);
        if (!frame) {
            figma.ui.postMessage({
                type: "inspect-result",
                data: {
                    error: `Frame "${frameName}" não encontrado`,
                    availableFrames: allFrames.map(f => f.name),
                },
            });
            return;
        }
        const structure = getFrameStructureSummary(frame, maxDepth);
        figma.ui.postMessage({ type: "inspect-result", data: structure });
    }
    if (msg.type === "inspect-all-errors") {
        // Inspect frames that had errors and return structure details
        const allFrames = figma.currentPage.children.filter((n) => n.type === "FRAME");
        const connections = msg.connections || [];
        const diagnostics = [];
        for (const entry of connections) {
            const fromFrame = findFrameByName(entry.fromFrame, allFrames);
            if (!fromFrame) {
                diagnostics.push({
                    connectionId: entry.id,
                    issue: "frame_not_found",
                    frameName: entry.fromFrame,
                    availableFrames: allFrames.map(f => f.name),
                });
                continue;
            }
            const toFrame = findFrameByName(entry.toFrame, allFrames);
            if (!toFrame) {
                diagnostics.push({
                    connectionId: entry.id,
                    issue: "target_frame_not_found",
                    frameName: entry.toFrame,
                    availableFrames: allFrames.map(f => f.name),
                });
                continue;
            }
            const { node } = findSourceElementV2(fromFrame, entry.source);
            if (!node) {
                // Collect info about what IS in this frame
                const textNodes = [];
                const allTexts = [];
                collectTextNodes(fromFrame, allTexts);
                for (const t of allTexts) {
                    textNodes.push({ text: t.characters, nodeName: t.name });
                }
                // For arrow_back: show phone container structure
                let phoneInfo = null;
                if (entry.source.iconMatch === "arrow_back" || entry.source.name === "arrow_back") {
                    for (const child of fromFrame.children) {
                        if ("width" in child && "height" in child && "children" in child) {
                            const c = child;
                            if (c.width >= 300 && c.width <= 430 && c.height >= 600) {
                                // Found phone container — show top children
                                const topChildren = [];
                                function scanTop(n, ax, ay, d) {
                                    if (d > 4 || ay > 80)
                                        return;
                                    topChildren.push({
                                        name: n.name, type: n.type, depth: d,
                                        x: Math.round(ax), y: Math.round(ay),
                                        w: "width" in n ? Math.round(n.width) : 0,
                                        h: "height" in n ? Math.round(n.height) : 0,
                                        childCount: "children" in n ? n.children.length : 0,
                                    });
                                    if ("children" in n) {
                                        for (const ch of n.children) {
                                            scanTop(ch, ax + ("x" in ch ? ch.x : 0), ay + ("y" in ch ? ch.y : 0), d + 1);
                                        }
                                    }
                                }
                                scanTop(c, 0, 0, 0);
                                phoneInfo = { w: c.width, h: c.height, topNodes: topChildren.slice(0, 30) };
                                break;
                            }
                        }
                    }
                }
                // Topbar info
                let topbarChildren = [];
                for (const child of fromFrame.children) {
                    if ("height" in child && "y" in child && "width" in child && "children" in child) {
                        const ch = child;
                        if (ch.height <= 80 && ch.y <= 60 && ch.width > 200) {
                            topbarChildren = ch.children.map((tc) => ({
                                name: tc.name,
                                type: tc.type,
                                x: "x" in tc ? tc.x : 0,
                                y: "y" in tc ? tc.y : 0,
                                w: "width" in tc ? tc.width : 0,
                                h: "height" in tc ? tc.height : 0,
                            }));
                            break;
                        }
                    }
                }
                diagnostics.push({
                    connectionId: entry.id,
                    issue: "source_not_found",
                    frameName: fromFrame.name,
                    sourceName: entry.source.name,
                    sourceConfig: entry.source,
                    frameTextNodes: textNodes.slice(0, 50),
                    topbarChildren,
                    phoneInfo,
                    directChildren: fromFrame.children.slice(0, 10).map((c) => ({
                        name: c.name,
                        type: c.type,
                        x: "x" in c ? c.x : 0,
                        y: "y" in c ? c.y : 0,
                        w: "width" in c ? c.width : 0,
                        h: "height" in c ? c.height : 0,
                    })),
                });
            }
        }
        figma.ui.postMessage({ type: "diagnostics-result", data: diagnostics });
    }
    if (msg.type === "export-structure") {
        const scope = msg.scope || "selected";
        const maxDepth = msg.maxDepth || 5;
        const connections = msg.connections || [];
        figma.ui.postMessage({ type: "status", message: "Exportando estrutura dos frames..." });
        const data = exportStructure(scope, maxDepth, connections);
        figma.ui.postMessage({ type: "structure-export", data });
        figma.notify(`✅ Estrutura exportada: ${data.frames.length} frame(s)`);
    }
    if (msg.type === "export-all-screenshots") {
        figma.ui.postMessage({ type: "status", message: "Gerando prints de todas as telas..." });
        const data = await exportAllScreenshots(2);
        figma.ui.postMessage({ type: "screenshots-export", data });
        figma.notify(`✅ Prints exportados: ${data.files.length} tela(s)`);
    }
    if (msg.type === "close") {
        figma.closePlugin();
    }
};
