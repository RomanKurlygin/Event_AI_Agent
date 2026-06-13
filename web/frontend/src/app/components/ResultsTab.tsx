import { useEffect, useState } from "react";
import { FileText, Code, Image, Download, Copy, ExternalLink, Sparkles, Trash2 } from "lucide-react";
import { deleteResult, fetchResults, type Artifact } from "../../lib/api";
import { useApp } from "../../context/AppContext";

type ArtifactType = "text" | "html" | "image";
type FilterType = "all" | ArtifactType;

const TYPE_ICON: Record<ArtifactType, React.ReactNode> = {
  text: <FileText size={18} />,
  html: <Code size={18} />,
  image: <Image size={18} />,
};

const TYPE_LABEL: Record<ArtifactType, string> = {
  text: "Текст",
  html: "HTML",
  image: "Картинка",
};

const TYPE_COLOR: Record<ArtifactType, string> = {
  text: "rgba(109,94,252,0.12)",
  html: "rgba(34,197,94,0.12)",
  image: "rgba(245,158,11,0.12)",
};

const TYPE_FG: Record<ArtifactType, string> = {
  text: "var(--primary)",
  html: "var(--success)",
  image: "#F59E0B",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ResultsTab({ active }: { active: boolean }) {
  const { resultsRefreshKey } = useApp();
  const [filter, setFilter] = useState<FilterType>("all");
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!active) return;
    setLoading(true);
    fetchResults()
      .then(setArtifacts)
      .catch(() => setArtifacts([]))
      .finally(() => setLoading(false));
  }, [active, resultsRefreshKey]);

  const filtered = artifacts.filter((a) => filter === "all" || a.type === filter);

  const handleCopy = async (artifact: Artifact) => {
    try {
      const res = await fetch(artifact.url);
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setCopied(artifact.id);
      setTimeout(() => setCopied(null), 1500);
    } catch { /* ignore */ }
  };

  const handleDelete = async (artifact: Artifact) => {
    if (!window.confirm(`Удалить «${artifact.title}»?`)) return;

    setDeletingId(artifact.id);
    try {
      await deleteResult(artifact.path);
      setArtifacts((prev) => prev.filter((a) => a.id !== artifact.id));
    } catch {
      /* ignore */
    } finally {
      setDeletingId(null);
    }
  };

  const tabs: { key: FilterType; label: string }[] = [
    { key: "all", label: "Все" },
    { key: "text", label: "Тексты" },
    { key: "html", label: "HTML" },
    { key: "image", label: "Картинки" },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>
      <div className="px-8 py-5 border-b" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
        <h1 style={{ fontFamily: "'Instrument Serif', serif", color: "var(--foreground)", fontSize: "1.5rem", fontWeight: 400 }}>
          Результаты
        </h1>
        <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", marginTop: "2px" }}>
          Файлы из папки output/
        </p>
      </div>

      <div
        className="flex items-center gap-1 px-8 py-4 border-b"
        style={{ borderColor: "var(--border)", background: "var(--card)" }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className="px-4 py-1.5"
            style={{
              borderRadius: "999px",
              fontSize: "0.875rem",
              background: filter === tab.key ? "var(--primary)" : "transparent",
              color: filter === tab.key ? "#ffffff" : "var(--muted-foreground)",
              border: "none",
              cursor: "pointer",
            }}
          >
            {tab.label}
            <span className="ml-1.5" style={{ opacity: 0.6, fontSize: "0.75rem" }}>
              {tab.key === "all"
                ? artifacts.length
                : artifacts.filter((a) => a.type === tab.key).length}
            </span>
          </button>
        ))}
      </div>

      <div className="flex-1 px-8 py-6">
        {loading ? (
          <p style={{ color: "var(--muted-foreground)" }}>Загрузка…</p>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center" style={{ minHeight: "300px" }}>
            <div className="w-16 h-16 flex items-center justify-center rounded-2xl mb-5" style={{ background: "rgba(109,94,252,0.08)" }}>
              <Sparkles size={28} color="var(--primary)" />
            </div>
            <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: "1.25rem", color: "var(--foreground)", marginBottom: "8px" }}>
              Пока нет результатов
            </p>
            <p style={{ color: "var(--muted-foreground)", fontSize: "0.9375rem", textAlign: "center", maxWidth: "340px" }}>
              Попроси в чате план, HTML-приглашение или баннер — файлы появятся здесь.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {filtered.map((artifact) => (
              <ArtifactCard
                key={artifact.id}
                artifact={artifact}
                copied={copied === artifact.id}
                deleting={deletingId === artifact.id}
                onCopy={() => handleCopy(artifact)}
                onDelete={() => handleDelete(artifact)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ArtifactCard({
  artifact,
  copied,
  deleting,
  onCopy,
  onDelete,
}: {
  artifact: Artifact;
  copied: boolean;
  deleting: boolean;
  onCopy: () => void;
  onDelete: () => void;
}) {
  const type = artifact.type as ArtifactType;

  return (
    <div
      className="flex flex-col p-5"
      style={{
        background: "var(--card)",
        borderRadius: "var(--radius)",
        boxShadow: "0 2px 16px rgba(15,17,23,0.06)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0"
          style={{ background: TYPE_COLOR[type], color: TYPE_FG[type] }}
        >
          {TYPE_ICON[type]}
        </div>
        <div className="flex-1 min-w-0">
          <p style={{ fontWeight: 500, color: "var(--foreground)", fontSize: "0.9375rem", lineHeight: 1.3 }}>
            {artifact.title}
          </p>
          <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", marginTop: "2px" }}>
            {formatDate(artifact.createdAt)}
          </p>
        </div>
        <span
          className="px-2 py-0.5 rounded-full flex-shrink-0"
          style={{
            background: TYPE_COLOR[type],
            color: TYPE_FG[type],
            fontSize: "0.6875rem",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          {TYPE_LABEL[type]}
        </span>
      </div>

      {type === "image" ? (
        <img
          src={artifact.url}
          alt={artifact.title}
          className="rounded-xl mb-4 w-full object-cover"
          style={{ minHeight: "80px", maxHeight: "140px" }}
        />
      ) : type === "html" ? (
        <div
          className="rounded-xl mb-4 flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #F0EFFE 0%, #E8E3FF 100%)", minHeight: "80px" }}
        >
          <p style={{ fontFamily: "'Instrument Serif', serif", fontSize: "0.9375rem", color: "var(--primary)" }}>
            ✉️ HTML-шаблон
          </p>
        </div>
      ) : artifact.preview ? (
        <div
          className="px-3 py-3 rounded-xl mb-4 overflow-hidden"
          style={{
            background: "var(--input-background)",
            fontSize: "0.8125rem",
            color: "var(--muted-foreground)",
            lineHeight: 1.55,
            whiteSpace: "pre-wrap",
            maxHeight: "100px",
            overflow: "hidden",
          }}
        >
          {artifact.preview}
        </div>
      ) : null}

      <div className="flex items-center gap-2 mt-auto">
        <a
          href={artifact.url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 flex-1 justify-center no-underline"
          style={{
            border: "1px solid var(--border)",
            borderRadius: "calc(var(--radius) - 4px)",
            background: "var(--input-background)",
            color: "var(--foreground)",
            fontSize: "0.8125rem",
          }}
        >
          <ExternalLink size={13} />
          Открыть
        </a>
        <a
          href={artifact.url}
          download={artifact.title}
          className="flex items-center px-3 py-1.5"
          style={{
            border: "1px solid var(--border)",
            borderRadius: "calc(var(--radius) - 4px)",
            background: "var(--input-background)",
            color: "var(--muted-foreground)",
          }}
          title="Скачать"
        >
          <Download size={13} />
        </a>
        <button
          onClick={onCopy}
          className="flex items-center px-3 py-1.5"
          style={{
            border: `1px solid ${copied ? "var(--success)" : "var(--border)"}`,
            borderRadius: "calc(var(--radius) - 4px)",
            background: copied ? "rgba(34,197,94,0.08)" : "var(--input-background)",
            color: copied ? "var(--success)" : "var(--muted-foreground)",
            cursor: "pointer",
          }}
          title="Копировать"
        >
          <Copy size={13} />
        </button>
        <button
          onClick={onDelete}
          disabled={deleting}
          className="flex items-center px-3 py-1.5"
          style={{
            border: "1px solid rgba(239, 68, 68, 0.25)",
            borderRadius: "calc(var(--radius) - 4px)",
            background: deleting ? "rgba(239, 68, 68, 0.05)" : "var(--input-background)",
            color: "var(--error)",
            cursor: deleting ? "not-allowed" : "pointer",
            opacity: deleting ? 0.6 : 1,
          }}
          title="Удалить"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
