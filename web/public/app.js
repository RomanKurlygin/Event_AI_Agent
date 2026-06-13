const QUICK_ACTIONS = [
  { label: "📅 План", message: "Составь план подготовки с таймлайном и задачами с приоритетами." },
  { label: "💰 Бюджет", message: "Посчитай смету по категориям с резервом 10% и рекомендациями." },
  { label: "📦 Всё", message: "Нужен полный пакет: план подготовки и бюджет." },
  { label: "🎬 Run-of-show", message: "Сделай run-of-show на день события по минутам с ответственными." },
  { label: "👥 Гости", message: "Составь шаблон списка гостей, RSVP и план рассадки." },
  { label: "✉️ Invite", message: "Напиши текст приглашения: короткий и развёрнутый вариант." },
  { label: "🖼️ HTML", message: "Сделай HTML-карточку приглашения, тема wedding-elegant. Сохрани в output/invitations/." },
  { label: "📱 VK пост", message: "Напиши пост-анонс и countdown для VK с хештегами." },
  { label: "⚠️ Риски", message: "Какие риски и plan B? Чек-лист перед событием." },
  { label: "🖼️ Баннер", message: "Сгенерируй баннер для VK 16:9, элегантный, без текста на картинке." },
  { label: "📋 Опрос", message: "Составь опрос гостей после события, 10 вопросов." },
  { label: "💌 Спасибо", message: "Напиши благодарность гостям: коротко для VK и развёрнуто." },
];

const messagesEl = document.getElementById("messages");
const composer = document.getElementById("composer");
const input = document.getElementById("message_input");
const sendBtn = document.getElementById("send_btn");
const statusEl = document.getElementById("status");
const statusText = document.getElementById("status_text");
const quickEl = document.getElementById("quick_actions");

let sessionKey = `agent:main:web-ui-${Date.now()}`;

function getEventContext() {
  const dateInput = document.getElementById("event_date").value;
  let event_date = dateInput;
  if (dateInput && dateInput.includes("T")) {
    event_date = new Date(dateInput).toISOString();
  }
  return {
    event_name: document.getElementById("event_name").value.trim(),
    event_type: document.getElementById("event_type").value,
    event_date,
    location: document.getElementById("location").value.trim(),
    expected_guests: Number(document.getElementById("expected_guests").value) || undefined,
    budget_limit: Number(document.getElementById("budget_limit").value) || undefined,
  };
}

function appendMessage(role, text) {
  const div = document.createElement("div");
  div.className = `msg ${role}`;
  div.textContent = text;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return div;
}

function setLoading(on) {
  sendBtn.disabled = on;
  input.disabled = on;
}

async function checkHealth() {
  try {
    const res = await fetch("/api/health");
    const data = await res.json();
    statusEl.classList.toggle("online", data.ok);
    statusEl.classList.toggle("offline", !data.ok);
    statusText.textContent = data.ok
      ? `Gateway: ${data.gateway}`
      : "Gateway выключен — запустите start-gateway.ps1";
    return data.ok;
  } catch {
    statusEl.classList.add("offline");
    statusText.textContent = "UI сервер недоступен";
    return false;
  }
}

async function sendMessage(text) {
  const message = text.trim();
  if (!message) return;

  appendMessage("user", message);
  setLoading(true);
  const typing = appendMessage("typing", "EventGenie думает…");

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        eventContext: getEventContext(),
        sessionKey,
      }),
    });
    const data = await res.json();
    typing.remove();

    if (!res.ok) {
      appendMessage("error", data.error || "Ошибка запроса");
      return;
    }
    appendMessage("bot", data.reply || "(пустой ответ)");
  } catch (err) {
    typing.remove();
    appendMessage("error", err.message || String(err));
  } finally {
    setLoading(false);
    input.focus();
  }
}

QUICK_ACTIONS.forEach(({ label, message }) => {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "chip";
  btn.textContent = label;
  btn.title = message;
  btn.addEventListener("click", () => {
    input.value = message;
    input.focus();
  });
  quickEl.appendChild(btn);
});

composer.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value;
  input.value = "";
  sendMessage(text);
});

document.getElementById("clear_chat").addEventListener("click", () => {
  messagesEl.innerHTML = "";
  sessionKey = `agent:main:web-ui-${Date.now()}`;
  appendMessage("system", "Новый чат. Контекст события слева применится к следующим запросам.");
});

appendMessage(
  "system",
  "Привет! Я EventGenie. Заполни событие слева или нажми быстрое действие — запрос уйдёт в OpenClaw."
);

checkHealth();
setInterval(checkHealth, 15000);
