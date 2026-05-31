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
            best = frame;
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
    if (matches.length === 1) {
        return findClickableAncestor(matches[0]);
    }
    // Multiple: prefer exact match
    const exact = matches.filter(t => textMatches(t.characters, textToFind));
    if (exact.length === 1) {
        return findClickableAncestor(exact[0]);
    }
    // Prefer shortest text (most specific)
    matches.sort((a, b) => a.characters.length - b.characters.length);
    return findClickableAncestor(matches[0]);
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
    // Strategy 2: Recursive search for small element in top-left quadrant.
    // HTML-to-Design may nest content deeply, so we search all levels.
    const frameW = frame.width;
    const frameH = frame.height;
    let bestCandidate = null;
    let bestScore = 0;
    function searchBackBtn(node, absX, absY, depth) {
        if (depth > 8)
            return;
        if ("width" in node && "height" in node) {
            const n = node;
            const w = n.width;
            const h = n.height;
            // Back button: 16-60px, in top-left region (left 15%, top 10%)
            const inLeftRegion = absX < frameW * 0.15;
            const inTopRegion = absY < frameH * 0.12;
            const rightSize = w >= 16 && w <= 60 && h >= 16 && h <= 60;
            if (inLeftRegion && inTopRegion && rightSize) {
                // Score: prefer smaller and more top-left
                const score = 100 - (absX + absY) / 2;
                if (score > bestScore) {
                    bestScore = score;
                    bestCandidate = node;
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
    searchBackBtn(frame, 0, 0, 0);
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
    let bestCandidate = null;
    let bestX = 0;
    function searchTopRight(node, absX, absY, depth) {
        if (depth > 8)
            return;
        if ("width" in node && "height" in node) {
            const n = node;
            const w = n.width;
            const h = n.height;
            // Notification icon: small, in top-right region
            const inRightRegion = absX > frameW * 0.7;
            const inTopRegion = absY < frameH * 0.12;
            const rightSize = w >= 16 && w <= 50 && h >= 16 && h <= 50;
            if (inRightRegion && inTopRegion && rightSize && absX > bestX) {
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
    const frameH = frame.height;
    // Find the bottom nav — a container near the bottom of the frame
    let bottomNav = null;
    for (const child of frame.children) {
        if ("y" in child && "height" in child && "children" in child) {
            const c = child;
            // Bottom nav: at the bottom, short height, full width
            if ((c.y + c.height) >= frameH - 5 && c.height <= 100 && c.height >= 40 && c.width > 200) {
                bottomNav = c;
            }
        }
    }
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
    // Fallback: search entire frame
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
// ─── Main Logic ──────────────────────────────────────────────────────────────
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
        // Yield every 20 connections to avoid Figma timeout
        if (processed > 0 && processed % 20 === 0) {
            await sleep(0);
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
        figma.ui.postMessage({ type: "report", report });
        figma.notify(`✅ ${report.summary.applied} | ⏭ ${report.summary.skippedExisting} | ❌ ${report.summary.missingSources + report.summary.missingTargets} | ⚠️ ${report.summary.ambiguous}`);
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
    if (msg.type === "close") {
        figma.closePlugin();
    }
};
