/**
 * EventGenie Web UI — static server + OpenClaw proxy
 * Serves React build from web/frontend/dist (or legacy web/public)
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import os from "node:os";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, "frontend", "dist");
const PUBLIC_DIR = path.join(__dirname, "public");
const STATIC_DIR = fs.existsSync(path.join(DIST_DIR, "index.html")) ? DIST_DIR : PUBLIC_DIR;
const OUTPUT_DIR = path.join(__dirname, "..", "output");
const PORT = Number(process.env.EVENTGENIE_UI_PORT || 3080);
const PROJECT_ROOT = path.resolve(__dirname, "..");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
    const m = line.match(/^\s*([^#][^=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  }
}

loadEnvFile(path.join(PROJECT_ROOT, ".env"));
loadEnvFile(path.join(os.homedir(), ".openclaw", ".env"));

function getGatewayConfig() {
  const configPath = path.join(os.homedir(), ".openclaw", "openclaw.json");
  let port = 18789;
  let token = process.env.OPENCLAW_GATEWAY_TOKEN || "";
  if (fs.existsSync(configPath)) {
    try {
      const cfg = JSON.parse(fs.readFileSync(configPath, "utf8"));
      port = cfg.gateway?.port ?? port;
      token = cfg.gateway?.auth?.token ?? token;
    } catch { /* ignore */ }
  }
  return { port, token, host: "127.0.0.1" };
}

function resolveNode() {
  const candidates = [
    process.execPath,
    path.join(process.env.ProgramFiles || "C:\\Program Files", "nodejs", "node.exe"),
    path.join(process.env["ProgramFiles(x86)"] || "", "nodejs", "node.exe"),
  ];
  for (const p of candidates) {
    if (p && fs.existsSync(p)) return p;
  }
  return "node";
}

function resolveOpenClawCli() {
  return path.join(PROJECT_ROOT, "node_modules", "openclaw", "openclaw.mjs");
}

async function checkGateway() {
  const { port, host } = getGatewayConfig();
  try {
    const res = await fetch(`http://${host}:${port}/`, { signal: AbortSignal.timeout(2000) });
    return res.ok || res.status < 500;
  } catch {
    return false;
  }
}

const EVENT_TYPE_LABELS = {
  wedding: "свадьба",
  birthday: "день рождения",
  corporate: "корпоратив",
  conference: "конференция",
  private: "частное",
};

function buildPrompt(message, eventContext) {
  const userPart = String(message || "").trim();
  if (!eventContext?.event_name) return userPart;

  const typeLabel = EVENT_TYPE_LABELS[eventContext.event_type] || eventContext.event_type || "не указан";
  const budget = eventContext.budget_limit ? `, бюджет ${eventContext.budget_limit} ₽` : "";
  const ctx = [
    "Контекст мероприятия из формы UI:",
    `${eventContext.event_name}; тип: ${typeLabel}; дата: ${eventContext.event_date || "не указана"};`,
    `место: ${eventContext.location || "не указано"}; гостей: ${eventContext.expected_guests || "не указано"}${budget}.`,
  ].join(" ");

  return `${userPart}\n\n${ctx}`;
}

function sanitizeAgentReply(text) {
  let s = String(text || "");
  s = s.replace(/<mm:think>[\s\S]*?<\/mm:think>/gi, "");
  s = s.replace(/<think>[\s\S]*?<\/think>/gi, "");
  s = s.replace(/<think>[\s\S]*/gi, "");
  s = s.trim();

  if (
    s.includes("# EventGenie Web UI") &&
    (s.includes("web/server.mjs") || s.includes("docs/WEB-UI"))
  ) {
    return [
      "Агент вернул документацию вместо ответа по событию.",
      "",
      "Нажмите «Новый чат», заполните вкладку «Событие» и повторите, например:",
      "«Составь план подготовки с таймлайном и задачами с приоритетами».",
    ].join("\n");
  }

  return s || "(пустой ответ)";
}

function stripAnsi(text) {
  return String(text).replace(/\x1b\[[0-9;]*m/g, "");
}

function formatAgentError(stderr, stdout, code) {
  const raw = stripAnsi(`${stderr || ""}\n${stdout || ""}`).trim();

  if (/rate limit/i.test(raw)) {
    return [
      "Лимит запросов OpenRouter (бесплатная модель gpt-oss-20b:free).",
      "",
      "Что сделать:",
      "1. Подождите 1–3 минуты и повторите запрос.",
      "2. Или укажите платную модель в .env: OPENROUTER_MODEL=openrouter/auto",
      "3. Затем: .\\scripts\\setup-openclaw.ps1 и перезапустите gateway.",
    ].join("\n");
  }
  if (/timed out|timeout/i.test(raw)) {
    return "Ответ занял слишком много времени. Сократите запрос или повторите через минуту.";
  }
  if (/ECONNREFUSED/i.test(raw)) {
    return "Gateway не запущен. Выполните .\\scripts\\start-gateway.ps1";
  }

  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.includes("plugins.allow") && !/^\[.*\]\s*plugins\./i.test(l));

  const text = lines.join("\n").trim();
  if (!text) return `Ошибка OpenClaw (код ${code})`;
  return text.length > 600 ? `${text.slice(0, 600)}…` : text;
}

function runOpenClawAgent(message, sessionKey) {
  return new Promise((resolve, reject) => {
    const cli = resolveOpenClawCli();
    if (!fs.existsSync(cli)) {
      reject(new Error("openclaw не найден. Выполните: npm install"));
      return;
    }
    const child = spawn(
      resolveNode(),
      [
        cli,
        "agent",
        "--session-key", sessionKey,
        "--message", message,
        "--thinking", "off",
        "--json",
        "--timeout", "180",
      ],
      {
        cwd: PROJECT_ROOT,
        windowsHide: true,
        shell: false,
        env: { ...process.env },
      }
    );
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (d) => { stdout += d; });
    child.stderr.on("data", (d) => { stderr += d; });
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(formatAgentError(stderr, stdout, code)));
        return;
      }
      try {
        const parsed = JSON.parse(stdout);
        const text =
          parsed?.result?.payloads?.[0]?.text ||
          parsed?.payloads?.[0]?.text ||
          parsed?.text ||
          stdout;
        resolve({ text: sanitizeAgentReply(String(text).trim()), raw: parsed });
      } catch {
        resolve({ text: sanitizeAgentReply(stdout.trim()), raw: null });
      }
    });
  });
}

function classifyFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  if ([".html", ".htm"].includes(ext)) return "html";
  if ([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"].includes(ext)) return "image";
  if ([".md", ".txt", ".json"].includes(ext)) return "text";
  return null;
}

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50) || "otvet";
}

function extractTitle(reply, fallback) {
  const heading = String(reply).match(/^#\s+(.+)$/m);
  if (heading) return heading[1].trim().slice(0, 80);
  return String(fallback).trim().slice(0, 80) || "Ответ EventGenie";
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
}

function extractImageSrc(content) {
  const m = String(content).match(/!\[[^\]]*\]\(([^)]+)\)/);
  return m ? m[1].trim() : null;
}

function resolveLocalOutputPath(src) {
  let rel = String(src)
    .replace(/^\/output\//, "")
    .replace(/^output[\\/]/, "")
    .replace(/\\/g, "/");
  if (!rel || rel.includes("..")) return null;
  const full = path.resolve(OUTPUT_DIR, rel);
  if (!full.startsWith(OUTPUT_DIR) || !fs.existsSync(full) || fs.statSync(full).isDirectory()) {
    return null;
  }
  return { full, relPath: rel };
}

function guessImageExt(src, contentType) {
  if (contentType?.includes("png")) return ".png";
  if (contentType?.includes("jpeg") || contentType?.includes("jpg")) return ".jpg";
  if (contentType?.includes("webp")) return ".webp";
  if (contentType?.includes("gif")) return ".gif";
  if (contentType?.includes("svg")) return ".svg";
  const fromUrl = String(src).match(/\.(png|jpe?g|webp|gif|svg)(\?|$)/i);
  if (fromUrl) return `.${fromUrl[1].toLowerCase().replace("jpeg", "jpg")}`;
  return ".png";
}

async function saveImageFromSrc(src, title) {
  const local = resolveLocalOutputPath(src);
  if (local) return local.relPath;

  const dir = path.join(OUTPUT_DIR, "saved");
  fs.mkdirSync(dir, { recursive: true });
  const base = slugify(title || "izobrazhenie");
  const relPath = `saved/${base}-${timestamp()}.png`;
  const fullPath = path.join(OUTPUT_DIR, relPath);

  if (String(src).startsWith("data:image/")) {
    const comma = src.indexOf(",");
    if (comma === -1) throw new Error("Некорректное изображение");
    const header = src.slice(0, comma);
    const ext = guessImageExt(header);
    const finalRel = relPath.replace(/\.png$/, ext);
    const finalFull = path.join(OUTPUT_DIR, finalRel);
    fs.writeFileSync(finalFull, Buffer.from(src.slice(comma + 1), "base64"));
    return finalRel;
  }

  if (/^https?:\/\//i.test(src)) {
    const res = await fetch(src);
    if (!res.ok) throw new Error("Не удалось скачать изображение");
    const ext = guessImageExt(src, res.headers.get("content-type") || "");
    const finalRel = relPath.replace(/\.png$/, ext);
    const finalFull = path.join(OUTPUT_DIR, finalRel);
    fs.writeFileSync(finalFull, Buffer.from(await res.arrayBuffer()));
    return finalRel;
  }

  throw new Error("Изображение не найдено. Укажите путь output/... или URL.");
}

function saveTextResult(content, title, eventContext, userMessage) {
  const text = String(content || "").trim();
  if (!text) throw new Error("Пустой текст");

  const dir = path.join(OUTPUT_DIR, "saved");
  fs.mkdirSync(dir, { recursive: true });

  const docTitle = extractTitle(text, title || userMessage);
  const filename = `${slugify(docTitle)}-${timestamp()}.md`;
  const relPath = `saved/${filename}`;
  const fullPath = path.join(OUTPUT_DIR, relPath);

  const meta = [];
  if (eventContext?.event_name) meta.push(`**Событие:** ${eventContext.event_name}`);
  if (userMessage) meta.push(`**Запрос:** ${userMessage}`);
  meta.push(`**Сохранено:** ${new Date().toLocaleString("ru-RU")}`);

  const body = [`# ${docTitle}`, "", ...meta, "", "---", "", text].join("\n");
  fs.writeFileSync(fullPath, body, "utf8");
  return { savedPath: relPath, type: "text" };
}

async function saveUserResult({ content, title, eventContext, userMessage }) {
  const text = String(content || "").trim();
  if (!text) throw new Error("content is required");

  const imageSrc = extractImageSrc(text);
  if (imageSrc) {
    const savedPath = await saveImageFromSrc(imageSrc, extractTitle(text, title || userMessage));
    return { savedPath, type: "image" };
  }

  return saveTextResult(text, title, eventContext, userMessage);
}

function deleteResultFile(relPath) {
  const normalized = String(relPath || "").replace(/\\/g, "/").trim();
  if (!normalized || normalized.includes("..")) {
    throw new Error("Некорректный путь");
  }
  const full = path.resolve(OUTPUT_DIR, normalized);
  if (!full.startsWith(OUTPUT_DIR)) {
    throw new Error("Некорректный путь");
  }
  if (!fs.existsSync(full)) {
    throw new Error("Файл не найден");
  }
  if (fs.statSync(full).isDirectory()) {
    throw new Error("Нельзя удалить папку");
  }
  fs.unlinkSync(full);
}

function listResults() {
  const items = [];
  function walk(dir, rel = "") {
    if (!fs.existsSync(dir)) return;
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const relPath = rel ? `${rel}/${ent.name}` : ent.name;
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        walk(full, relPath);
        continue;
      }
      const type = classifyFile(ent.name);
      if (!type) continue;
      const stat = fs.statSync(full);
      let preview;
      let title = ent.name;
      if (type === "text" && stat.size < 8000) {
        const fileText = fs.readFileSync(full, "utf8");
        preview = fileText.slice(0, 400);
        const heading = fileText.match(/^#\s+(.+)$/m);
        if (heading) title = heading[1].trim();
      }
      items.push({
        id: relPath,
        path: relPath,
        type,
        title,
        createdAt: stat.mtime.toISOString(),
        url: `/output/${relPath.split(path.sep).join("/")}`,
        preview,
      });
    }
  }
  walk(OUTPUT_DIR);
  return items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".mjs": "application/javascript; charset=utf-8",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".json": "application/json",
    ".md": "text/markdown; charset=utf-8",
    ".txt": "text/plain; charset=utf-8",
    ".woff2": "font/woff2",
  };
  return map[ext] || "application/octet-stream";
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"));
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify(data));
}

function serveFile(res, filePath) {
  res.writeHead(200, { "Content-Type": contentType(filePath) });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  if (url.pathname === "/api/health" && req.method === "GET") {
    const gw = getGatewayConfig();
    const up = await checkGateway();
    sendJson(res, 200, {
      ok: up,
      gateway: `http://${gw.host}:${gw.port}`,
      ui: `http://127.0.0.1:${PORT}`,
    });
    return;
  }

  if (url.pathname === "/api/results" && req.method === "GET") {
    sendJson(res, 200, { items: listResults() });
    return;
  }

  if (url.pathname === "/api/results/save" && req.method === "POST") {
    try {
      const body = await readBody(req);
      const result = await saveUserResult({
        content: body.content,
        title: body.title,
        eventContext: body.eventContext,
        userMessage: body.userMessage,
      });
      sendJson(res, 200, result);
    } catch (err) {
      sendJson(res, 400, { error: err.message || String(err) });
    }
    return;
  }

  if (url.pathname === "/api/results/delete" && req.method === "POST") {
    try {
      const body = await readBody(req);
      deleteResultFile(body.path);
      sendJson(res, 200, { ok: true });
    } catch (err) {
      sendJson(res, 400, { error: err.message || String(err) });
    }
    return;
  }

  if (url.pathname === "/api/chat" && req.method === "POST") {
    try {
      const body = await readBody(req);
      const message = String(body.message || "").trim();
      if (!message) {
        sendJson(res, 400, { error: "message is required" });
        return;
      }
      const up = await checkGateway();
      if (!up) {
        sendJson(res, 503, {
          error: "OpenClaw gateway не запущен. Выполните: .\\scripts\\start-gateway.ps1",
        });
        return;
      }
      const sessionKey = body.sessionKey || "agent:main:web-ui";
      const prompt = buildPrompt(message, body.eventContext);
      const result = await runOpenClawAgent(prompt, sessionKey);
      sendJson(res, 200, { reply: result.text, sessionKey });
    } catch (err) {
      sendJson(res, 500, { error: err.message || String(err) });
    }
    return;
  }

  if (url.pathname.startsWith("/api/")) {
    sendJson(res, 404, { error: `API не найден: ${url.pathname}. Перезапустите UI: .\\scripts\\start-ui.ps1` });
    return;
  }

  if (url.pathname.startsWith("/output/")) {
    const rel = decodeURIComponent(url.pathname.slice("/output/".length));
    const filePath = path.resolve(OUTPUT_DIR, rel);
    if (!filePath.startsWith(OUTPUT_DIR) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      res.writeHead(404).end("Not found");
      return;
    }
    serveFile(res, filePath);
    return;
  }

  let filePath = path.join(STATIC_DIR, url.pathname === "/" ? "index.html" : url.pathname);
  if (!filePath.startsWith(STATIC_DIR)) {
    res.writeHead(403).end();
    return;
  }
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    serveFile(res, filePath);
    return;
  }
  const spaIndex = path.join(STATIC_DIR, "index.html");
  if (fs.existsSync(spaIndex)) {
    serveFile(res, spaIndex);
    return;
  }
  res.writeHead(404).end("Not found");
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`EventGenie UI: http://127.0.0.1:${PORT}`);
  console.log(`Static: ${STATIC_DIR}`);
  console.log("Gateway required: .\\scripts\\start-gateway.ps1");
});
