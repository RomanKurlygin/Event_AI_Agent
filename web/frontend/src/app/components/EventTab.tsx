import { useState } from "react";
import { Calendar, MapPin, Users, Wallet, Save, CheckCircle } from "lucide-react";
import { useApp, type EventData } from "../../context/AppContext";

export function EventTab() {
  const { event: savedEvent, saveEvent } = useApp();
  const [event, setEvent] = useState<EventData>(savedEvent);
  const [saved, setSaved] = useState(false);

  const handleChange = (field: keyof EventData, value: string) => {
    setEvent((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    saveEvent(event);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const formatBudget = (val: string) => {
    const num = parseInt(val.replace(/\D/g, ""), 10);
    if (isNaN(num)) return "";
    return new Intl.NumberFormat("ru-RU").format(num);
  };

  const typeLabel: Record<string, string> = {
    wedding: "Свадьба",
    birthday: "День рождения",
    corporate: "Корпоратив",
    conference: "Конференция",
    private: "Частное",
  };

  const formatLabel: Record<string, string> = {
    offline: "Offline",
    hybrid: "Hybrid",
    online: "Online",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "var(--radius)",
    border: "1.5px solid var(--border)",
    background: "var(--input-background)",
    color: "var(--foreground)",
    fontSize: "0.9375rem",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.8125rem",
    color: "var(--muted-foreground)",
    marginBottom: "6px",
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-8 py-5 border-b"
        style={{ borderColor: "var(--border)", background: "var(--card)" }}
      >
        <div>
          <h1 style={{ fontFamily: "'Instrument Serif', serif", color: "var(--foreground)", fontSize: "1.5rem", fontWeight: 400 }}>
            Событие
          </h1>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", marginTop: "2px" }}>
            Контекст подмешивается в каждый запрос
          </p>
        </div>
      </div>

      <div className="flex-1 px-8 py-6">
        {/* Form */}
        <div
          className="p-6 mb-6"
          style={{
            background: "var(--card)",
            borderRadius: "var(--radius)",
            boxShadow: "0 2px 16px rgba(15,17,23,0.06)",
          }}
        >
          <div className="grid grid-cols-2 gap-5">
            {/* Event name */}
            <div className="col-span-2">
              <label style={labelStyle}>Название</label>
              <input
                type="text"
                value={event.name}
                onChange={(e) => handleChange("name", e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>

            {/* Type */}
            <div>
              <label style={labelStyle}>Тип события</label>
              <select
                value={event.type}
                onChange={(e) => handleChange("type", e.target.value)}
                style={{ ...inputStyle, cursor: "pointer" }}
                onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              >
                <option value="wedding">Свадьба</option>
                <option value="birthday">День рождения</option>
                <option value="corporate">Корпоратив</option>
                <option value="conference">Конференция</option>
                <option value="private">Частное</option>
              </select>
            </div>

            {/* Format */}
            <div>
              <label style={labelStyle}>Формат</label>
              <select
                value={event.format}
                onChange={(e) => handleChange("format", e.target.value)}
                style={{ ...inputStyle, cursor: "pointer" }}
                onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              >
                <option value="offline">Offline</option>
                <option value="hybrid">Hybrid</option>
                <option value="online">Online</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label style={labelStyle}>Дата</label>
              <input
                type="date"
                value={event.date}
                onChange={(e) => handleChange("date", e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>

            {/* Time */}
            <div>
              <label style={labelStyle}>Время</label>
              <input
                type="time"
                value={event.time}
                onChange={(e) => handleChange("time", e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>

            {/* Location */}
            <div className="col-span-2">
              <label style={labelStyle}>Локация</label>
              <input
                type="text"
                value={event.location}
                onChange={(e) => handleChange("location", e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>

            {/* Guests */}
            <div>
              <label style={labelStyle}>Количество гостей</label>
              <input
                type="number"
                value={event.guests}
                onChange={(e) => handleChange("guests", e.target.value)}
                min={1}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>

            {/* Budget */}
            <div>
              <label style={labelStyle}>Бюджет, ₽</label>
              <input
                type="number"
                value={event.budget}
                onChange={(e) => handleChange("budget", e.target.value)}
                min={0}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 mt-6 px-5 py-2.5 transition-all"
            style={{
              background: saved ? "var(--success)" : "var(--primary)",
              color: "#ffffff",
              borderRadius: "var(--radius)",
              fontSize: "0.9375rem",
              border: "none",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              if (!saved) (e.currentTarget as HTMLButtonElement).style.background = "#5A4AE8";
            }}
            onMouseLeave={(e) => {
              if (!saved) (e.currentTarget as HTMLButtonElement).style.background = "var(--primary)";
            }}
          >
            {saved ? <CheckCircle size={16} /> : <Save size={16} />}
            {saved ? "Сохранено" : "Сохранить"}
          </button>
        </div>

        {/* Summary card */}
        <div
          className="p-5"
          style={{
            background: "linear-gradient(135deg, rgba(109,94,252,0.08) 0%, rgba(109,94,252,0.04) 100%)",
            border: "1px solid rgba(109,94,252,0.18)",
            borderRadius: "var(--radius)",
          }}
        >
          <p style={{ fontSize: "0.75rem", color: "var(--primary)", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Сводка события
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 items-center">
            <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.125rem", color: "var(--foreground)" }}>
              {event.name || "—"}
            </span>
            <span style={{ color: "var(--muted-foreground)", fontSize: "0.875rem" }}>·</span>
            <div className="flex items-center gap-1.5">
              <Calendar size={14} color="var(--primary)" />
              <span style={{ fontSize: "0.875rem", color: "var(--foreground)" }}>
                {event.date
                  ? new Date(event.date).toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "—"}
              </span>
            </div>
            <span style={{ color: "var(--muted-foreground)", fontSize: "0.875rem" }}>·</span>
            <div className="flex items-center gap-1.5">
              <MapPin size={14} color="var(--primary)" />
              <span style={{ fontSize: "0.875rem", color: "var(--foreground)" }}>{event.location || "—"}</span>
            </div>
            <span style={{ color: "var(--muted-foreground)", fontSize: "0.875rem" }}>·</span>
            <div className="flex items-center gap-1.5">
              <Users size={14} color="var(--primary)" />
              <span style={{ fontSize: "0.875rem", color: "var(--foreground)" }}>{event.guests || "—"} гостей</span>
            </div>
            <span style={{ color: "var(--muted-foreground)", fontSize: "0.875rem" }}>·</span>
            <div className="flex items-center gap-1.5">
              <Wallet size={14} color="var(--primary)" />
              <span style={{ fontSize: "0.875rem", color: "var(--foreground)" }}>
                {event.budget ? `${formatBudget(event.budget)} ₽` : "—"}
              </span>
            </div>
            <span style={{ color: "var(--muted-foreground)", fontSize: "0.875rem" }}>·</span>
            <span
              className="px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(109,94,252,0.12)",
                color: "var(--primary)",
                fontSize: "0.8125rem",
              }}
            >
              {typeLabel[event.type] || "—"} · {formatLabel[event.format] || "—"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
