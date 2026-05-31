/**
 * Auto Prototype Connector — UniAchados v2
 * 
 * Plugin Figma que aplica conexões de protótipo automaticamente.
 * Otimizado para estrutura gerada pelo HTML-to-Design (nomes genéricos).
 */

// ─── Types ───────────────────────────────────────────────────────────────────

interface ConnectionSource {
  name: string;
  aliases: string[];
  textMatch?: string | null;
  iconMatch?: string | null;
  nodeNameMatch?: string | null;
}

interface ConnectionTransition {
  type: "DISSOLVE" | "SMART_ANIMATE" | "SLIDE_IN" | "SLIDE_OUT" | "PUSH" | "INSTANT";
  direction?: "LEFT" | "RIGHT" | "TOP" | "BOTTOM";
  duration?: number;
}

interface ConnectionEntry {
  id: number;
  fromFrame: string;
  source: ConnectionSource;
  toFrame: string;
  trigger: "ON_CLICK" | "ON_HOVER" | "ON_PRESS" | "ON_DRAG";
  navigation: "NAVIGATE" | "OVERLAY" | "SWAP" | "BACK";
  transition: ConnectionTransition;
}

interface Report {
  summary: {
    expected: number;
    applied: number;
    skippedExisting: number;
    missingSources: number;
    missingTargets: number;
    ambiguous: number;
  };
  applied: ReportEntry[];
  skippedExisting: ReportEntry[];
  missingSources: ReportEntry[];
  missingTargets: ReportEntry[];
  ambiguous: ReportEntry[];
}

interface ReportEntry {
  connectionId: number;
  fromFrame: string;
  sourceName: string;
  toFrame: string;
  detail?: string;
}

interface PluginConfig {
  overwriteExisting: boolean;
  dryRun: boolean;
}

// ─── Utilities ───────────────────────────────────────────────────────────────

function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function textContains(haystack: string, needle: string): boolean {
  return normalize(haystack).includes(normalize(needle));
}

function textMatches(a: string, b: string): boolean {
  return normalize(a) === normalize(b);
}

// ─── Frame Finder ────────────────────────────────────────────────────────────

function findFrameByName(frameName: string, allFrames: FrameNode[]): FrameNode | null {
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

function collectTextNodes(node: SceneNode, results: TextNode[]): void {
  if (node.type === "TEXT") {
    results.push(node);
    return;
  }
  if ("children" in node) {
    for (const child of (node as ChildrenMixin & SceneNode).children) {
      collectTextNodes(child as SceneNode, results);
    }
  }
}

function getAllText(node: SceneNode): string {
  if (node.type === "TEXT") return (node as TextNode).characters;
  if ("children" in node) {
    return (node as ChildrenMixin & SceneNode).children
      .map((c: SceneNode) => getAllText(c))
      .filter(Boolean)
      .join(" ");
  }
  return "";
}

/**
 * Walk up from a node to find the nearest clickable-sized ancestor frame.
 * Stops when hitting a frame too large (screen body) or too many levels.
 */
function findClickableAncestor(node: SceneNode, maxLevels: number = 5): SceneNode {
  let current: BaseNode | null = node.parent;
  let best: SceneNode = node;
  let level = 0;

  while (current && level < maxLevels) {
    if (current.type === "FRAME" || current.type === "INSTANCE" || current.type === "COMPONENT") {
      const frame = current as FrameNode;
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
function findByText(frame: FrameNode, textToFind: string): SceneNode | null {
  const textNodes: TextNode[] = [];
  collectTextNodes(frame, textNodes);

  const matches = textNodes.filter(t => textContains(t.characters, textToFind));
  if (matches.length === 0) return null;

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
function findBackButton(frame: FrameNode): SceneNode | null {
  // Strategy 1: Find by name pattern
  const byName = findNodeByNamePattern(frame, ["arrow_back", "arrow back", "back", "icon-btn", "voltar"]);
  if (byName) return byName;

  // Strategy 2: Recursive search for small element in top-left quadrant.
  // HTML-to-Design may nest content deeply, so we search all levels.
  const frameW = frame.width;
  const frameH = frame.height;
  let bestCandidate: SceneNode | null = null;
  let bestScore = 0;

  function searchBackBtn(node: SceneNode, absX: number, absY: number, depth: number): void {
    if (depth > 8) return;
    if ("width" in node && "height" in node) {
      const n = node as FrameNode;
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
      for (const child of (node as ChildrenMixin & SceneNode).children) {
        const cx = absX + ("x" in child ? (child as any).x : 0);
        const cy = absY + ("y" in child ? (child as any).y : 0);
        searchBackBtn(child as SceneNode, cx, cy, depth + 1);
      }
    }
  }

  searchBackBtn(frame, 0, 0, 0);
  return bestCandidate;
}

function findNodeByNamePattern(node: SceneNode, patterns: string[]): SceneNode | null {
  const nodeName = normalize(node.name);
  for (const p of patterns) {
    if (nodeName.includes(normalize(p))) {
      // If this node is small enough, return it; otherwise find a clickable child
      if ("width" in node && (node as any).width <= 60) {
        return node;
      }
      return findClickableAncestor(node, 2);
    }
  }
  if ("children" in node) {
    for (const child of (node as ChildrenMixin & SceneNode).children) {
      const found = findNodeByNamePattern(child as SceneNode, patterns);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Find the FAB button — circular floating button near bottom-right.
 */
function findFAB(frame: FrameNode): SceneNode | null {
  const frameH = frame.height;
  const frameW = frame.width;

  function searchFAB(node: SceneNode, absX: number, absY: number): SceneNode | null {
    if ("width" in node && "height" in node) {
      const n = node as FrameNode;
      const w = n.width;
      const h = n.height;
      // FAB: 40-80px, in bottom-right quadrant
      if (w >= 40 && w <= 80 && h >= 40 && h <= 80 && absY > frameH * 0.55 && absX > frameW * 0.5) {
        return node;
      }
    }
    if ("children" in node) {
      for (const child of (node as ChildrenMixin & SceneNode).children) {
        const cx = absX + ("x" in child ? (child as any).x : 0);
        const cy = absY + ("y" in child ? (child as any).y : 0);
        const found = searchFAB(child as SceneNode, cx, cy);
        if (found) return found;
      }
    }
    return null;
  }

  return searchFAB(frame, 0, 0);
}

/**
 * Find notification icon in the top-right area.
 */
function findNotificationIcon(frame: FrameNode): SceneNode | null {
  const frameW = frame.width;
  const frameH = frame.height;
  let bestCandidate: SceneNode | null = null;
  let bestX = 0;

  function searchTopRight(node: SceneNode, absX: number, absY: number, depth: number): void {
    if (depth > 8) return;
    if ("width" in node && "height" in node) {
      const n = node as FrameNode;
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
      for (const inner of (node as ChildrenMixin & SceneNode).children) {
        searchTopRight(inner as SceneNode,
          absX + ("x" in inner ? (inner as any).x : 0),
          absY + ("y" in inner ? (inner as any).y : 0),
          depth + 1);
      }
    }
  }

  searchTopRight(frame, 0, 0, 0);
  return bestCandidate;
}

/**
 * Find navigation bar items by label text.
 */
function findNavItem(frame: FrameNode, labelText: string): SceneNode | null {
  const frameH = frame.height;

  // Find the bottom nav — a container near the bottom of the frame
  let bottomNav: FrameNode | null = null;
  for (const child of frame.children) {
    if ("y" in child && "height" in child && "children" in child) {
      const c = child as FrameNode;
      // Bottom nav: at the bottom, short height, full width
      if ((c.y + c.height) >= frameH - 5 && c.height <= 100 && c.height >= 40 && c.width > 200) {
        bottomNav = c;
      }
    }
  }

  if (bottomNav) {
    // Search for a child of bottom nav containing the label text
    for (const child of bottomNav.children) {
      const text = getAllText(child as SceneNode);
      if (textContains(text, labelText)) {
        return child as SceneNode;
      }
    }
    // Deeper: check nested children
    const textNodes: TextNode[] = [];
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
function findCard(frame: FrameNode, textHint?: string | null): SceneNode | null {
  if (textHint) {
    // Find by text first — works for cards with specific text
    return findByText(frame, textHint);
  }

  // Generic card: find the first medium-sized frame in the scrollable body
  const cards: SceneNode[] = [];
  function searchCards(node: SceneNode, depth: number): void {
    if (depth > 5) return;
    if ("width" in node && "height" in node && "children" in node) {
      const n = node as FrameNode;
      if (n.width > 200 && n.width < 400 && n.height >= 50 && n.height <= 150) {
        cards.push(node);
      }
    }
    if ("children" in node) {
      for (const child of (node as ChildrenMixin & SceneNode).children) {
        searchCards(child as SceneNode, depth + 1);
      }
    }
  }
  searchCards(frame, 0);
  return cards.length > 0 ? cards[0] : null;
}

/**
 * Main source element finder — v2.
 */
function findSourceElementV2(
  frame: FrameNode,
  source: ConnectionSource
): { node: SceneNode | null; candidates: SceneNode[] } {

  // ─── arrow_back / back button ───
  if (source.iconMatch === "arrow_back" || source.name === "arrow_back") {
    const backBtn = findBackButton(frame);
    if (backBtn) return { node: backBtn, candidates: [] };
    return { node: null, candidates: [] };
  }

  // ─── Notifications icon ───
  if (source.iconMatch === "notifications" || source.name === "Notificações") {
    const notif = findNotificationIcon(frame);
    if (notif) return { node: notif, candidates: [] };
    return { node: null, candidates: [] };
  }

  // ─── FAB (+) button ───
  if (source.iconMatch === "add" && (source.name.includes("FAB") || source.aliases.includes("fab"))) {
    const fab = findFAB(frame);
    if (fab) return { node: fab, candidates: [] };
    return { node: null, candidates: [] };
  }

  // ─── Navigation bar items ───
  if (source.name.startsWith("Nav:")) {
    const label = source.name.replace("Nav:", "").trim();
    const navItem = findNavItem(frame, label);
    if (navItem) return { node: navItem, candidates: [] };
    if (source.textMatch) {
      const found = findByText(frame, source.textMatch);
      if (found) return { node: found, candidates: [] };
    }
    return { node: null, candidates: [] };
  }

  // ─── Card/list items ───
  if (source.nodeNameMatch === "card" || source.name.toLowerCase().includes("card")) {
    const textHint = source.textMatch || null;
    const card = findCard(frame, textHint);
    if (card) return { node: card, candidates: [] };
    return { node: null, candidates: [] };
  }

  // ─── Add icon in topbar (for Lista Objetos "+") ───
  if (source.iconMatch === "add" && !source.aliases.includes("fab")) {
    // Find in topbar: right side, small element
    const notif = findNotificationIcon(frame); // This finds rightmost small element in topbar
    // We need the second rightmost or a different approach
    // For now try by name
    const byName = findNodeByNamePattern(frame, ["add", "plus"]);
    if (byName) return { node: byName, candidates: [] };
    return { node: null, candidates: [] };
  }

  // ─── Text-based search (buttons/links) ───
  if (source.textMatch) {
    const found = findByText(frame, source.textMatch);
    if (found) return { node: found, candidates: [] };
  }

  // ─── Aliases text search ───
  for (const alias of source.aliases) {
    if (alias.startsWith("btn-") || alias.startsWith("link-")) continue;
    const found = findByText(frame, alias);
    if (found) return { node: found, candidates: [] };
  }

  // ─── Fallback: name as text ───
  const found = findByText(frame, source.name);
  if (found) return { node: found, candidates: [] };

  return { node: null, candidates: [] };
}

// ─── Reaction Builder ────────────────────────────────────────────────────────

function buildReaction(targetFrame: FrameNode, entry: ConnectionEntry): Reaction {
  let transitionObj: Transition;

  if (entry.transition.type === "INSTANT") {
    transitionObj = { type: "DISSOLVE", duration: 0, easing: { type: "LINEAR" } };
  } else if (entry.transition.type === "SLIDE_IN") {
    transitionObj = {
      type: "SLIDE_IN",
      direction: (entry.transition.direction || "LEFT") as "LEFT" | "RIGHT" | "TOP" | "BOTTOM",
      duration: entry.transition.duration || 0.3,
      easing: { type: "EASE_IN_AND_OUT" },
      matchLayers: false,
    };
  } else {
    transitionObj = {
      type: "DISSOLVE",
      duration: entry.transition.duration || 0.3,
      easing: { type: "EASE_IN_AND_OUT" },
    };
  }

  const action: Action = {
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

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function applyConnections(connections: ConnectionEntry[], config: PluginConfig): Promise<Report> {
  const report: Report = {
    summary: { expected: connections.length, applied: 0, skippedExisting: 0, missingSources: 0, missingTargets: 0, ambiguous: 0 },
    applied: [],
    skippedExisting: [],
    missingSources: [],
    missingTargets: [],
    ambiguous: [],
  };

  const allFrames = figma.currentPage.children.filter(
    (n): n is FrameNode => n.type === "FRAME"
  );

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
      const existingReactions = (targetNode as SceneNode & ReactionMixin).reactions;
      const hasClickReaction = existingReactions.some(
        (r: Reaction) => r.trigger?.type === "ON_CLICK"
      );
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
      const reactable = targetNode as SceneNode & ReactionMixin;
      let newReactions: Reaction[];
      if (config.overwriteExisting) {
        newReactions = reactable.reactions.filter((r: Reaction) => r.trigger?.type !== "ON_CLICK");
        newReactions.push(reaction);
      } else {
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
    } else if (config.dryRun) {
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

// ─── Structure Inspector ─────────────────────────────────────────────────────

interface NodeInfo {
  name: string;
  type: string;
  x: number;
  y: number;
  w: number;
  h: number;
  text?: string;
  children?: NodeInfo[];
}

function inspectNode(node: SceneNode, depth: number, maxDepth: number): NodeInfo {
  const info: NodeInfo = {
    name: node.name,
    type: node.type,
    x: "x" in node ? (node as any).x : 0,
    y: "y" in node ? (node as any).y : 0,
    w: "width" in node ? (node as any).width : 0,
    h: "height" in node ? (node as any).height : 0,
  };

  if (node.type === "TEXT") {
    info.text = (node as TextNode).characters;
  }

  if ("children" in node && depth < maxDepth) {
    info.children = (node as ChildrenMixin & SceneNode).children.map(
      (c: SceneNode) => inspectNode(c, depth + 1, maxDepth)
    );
  }

  return info;
}

function getFrameStructureSummary(frame: FrameNode, maxDepth: number = 4): any {
  // Collect all text nodes
  const textNodes: { text: string; path: string; x: number; y: number }[] = [];
  function collectTexts(node: SceneNode, path: string) {
    if (node.type === "TEXT") {
      textNodes.push({
        text: (node as TextNode).characters,
        path: path + " > " + node.name,
        x: "x" in node ? (node as any).x : 0,
        y: "y" in node ? (node as any).y : 0,
      });
    }
    if ("children" in node) {
      for (const child of (node as ChildrenMixin & SceneNode).children) {
        collectTexts(child as SceneNode, path + " > " + node.name);
      }
    }
  }
  collectTexts(frame, "");

  // Identify topbar (first short, full-width child near top)
  let topbar: NodeInfo | null = null;
  let bottomNav: NodeInfo | null = null;
  const directChildren: { name: string; type: string; x: number; y: number; w: number; h: number }[] = [];

  for (const child of frame.children) {
    const c = child as SceneNode;
    const info = {
      name: c.name,
      type: c.type,
      x: "x" in c ? (c as any).x : 0,
      y: "y" in c ? (c as any).y : 0,
      w: "width" in c ? (c as any).width : 0,
      h: "height" in c ? (c as any).height : 0,
    };
    directChildren.push(info);

    if ("height" in c && "y" in c && "width" in c && "children" in c) {
      const ch = c as FrameNode;
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

figma.ui.onmessage = async (msg: { type: string; config?: PluginConfig; connections?: ConnectionEntry[]; frameName?: string; maxDepth?: number }) => {
  if (msg.type === "apply-connections") {
    const config: PluginConfig = msg.config || { overwriteExisting: false, dryRun: false };
    const connections: ConnectionEntry[] = msg.connections || [];

    if (connections.length === 0) {
      figma.ui.postMessage({ type: "error", message: "Nenhuma conexão fornecida." });
      return;
    }

    figma.ui.postMessage({ type: "status", message: `Processando ${connections.length} conexões...` });
    const report = await applyConnections(connections, config);
    figma.ui.postMessage({ type: "report", report });
    figma.notify(
      `✅ ${report.summary.applied} | ⏭ ${report.summary.skippedExisting} | ❌ ${report.summary.missingSources + report.summary.missingTargets} | ⚠️ ${report.summary.ambiguous}`
    );
  }

  if (msg.type === "list-frames") {
    const frames = figma.currentPage.children.filter((n): n is FrameNode => n.type === "FRAME");
    const frameData = frames.map(f => ({ id: f.id, name: f.name, w: f.width, h: f.height }));
    figma.ui.postMessage({ type: "frames-list", frames: frameData });
  }

  if (msg.type === "inspect-frame") {
    const frameName = msg.frameName || "";
    const maxDepth = msg.maxDepth || 4;
    const allFrames = figma.currentPage.children.filter((n): n is FrameNode => n.type === "FRAME");

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
    const allFrames = figma.currentPage.children.filter((n): n is FrameNode => n.type === "FRAME");
    const connections: ConnectionEntry[] = msg.connections || [];
    const diagnostics: any[] = [];

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
        const textNodes: { text: string; nodeName: string }[] = [];
        const allTexts: TextNode[] = [];
        collectTextNodes(fromFrame, allTexts);
        for (const t of allTexts) {
          textNodes.push({ text: t.characters, nodeName: t.name });
        }

        // Topbar info
        let topbarChildren: { name: string; type: string; x: number; y: number; w: number; h: number }[] = [];
        for (const child of fromFrame.children) {
          if ("height" in child && "y" in child && "width" in child && "children" in child) {
            const ch = child as FrameNode;
            if (ch.height <= 80 && ch.y <= 60 && ch.width > 200) {
              topbarChildren = ch.children.map((tc: SceneNode) => ({
                name: tc.name,
                type: tc.type,
                x: "x" in tc ? (tc as any).x : 0,
                y: "y" in tc ? (tc as any).y : 0,
                w: "width" in tc ? (tc as any).width : 0,
                h: "height" in tc ? (tc as any).height : 0,
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
          directChildren: fromFrame.children.slice(0, 10).map((c: SceneNode) => ({
            name: c.name,
            type: c.type,
            x: "x" in c ? (c as any).x : 0,
            y: "y" in c ? (c as any).y : 0,
            w: "width" in c ? (c as any).width : 0,
            h: "height" in c ? (c as any).height : 0,
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
