import { useState, useRef, useEffect } from "react";

const CLAUDE_API = "https://api.anthropic.com/v1/messages";
const TABLEAU_SEARCH = "https://public.tableau.com/api/search/query";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=IBM+Plex+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #0e0f11;
    color: #d4cfc8;
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
  }

  .app {
    display: grid;
    grid-template-rows: auto 1fr;
    min-height: 100vh;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 24px;
  }

  /* HEADER */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 0 16px;
    border-bottom: 1px solid #1f2125;
    gap: 20px;
    flex-wrap: wrap;
  }

  .logo-area h1 {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    color: #f0ece4;
    letter-spacing: -0.3px;
  }

  .logo-area p {
    font-size: 12px;
    color: #6b6660;
    font-family: 'IBM Plex Mono', monospace;
    margin-top: 2px;
    letter-spacing: 0.5px;
  }

  .key-area {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    max-width: 420px;
  }

  .key-area label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    color: #c8a96e;
    white-space: nowrap;
    letter-spacing: 0.5px;
  }

  .key-input {
    flex: 1;
    background: #16181c;
    border: 1px solid #2a2c31;
    border-radius: 6px;
    padding: 8px 12px;
    color: #d4cfc8;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    outline: none;
    transition: border-color 0.2s;
  }

  .key-input:focus { border-color: #c8a96e; }
  .key-input::placeholder { color: #3a3c41; }

  .key-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #3a3c41;
    flex-shrink: 0;
    transition: background 0.3s;
  }
  .key-dot.active { background: #6fcf97; box-shadow: 0 0 6px #6fcf9760; }

  /* MAIN LAYOUT */
  .main {
    display: grid;
    grid-template-columns: 320px 1fr;
    gap: 0;
    height: calc(100vh - 73px);
    overflow: hidden;
  }

  /* LEFT PANEL */
  .left-panel {
    border-right: 1px solid #1f2125;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .panel-title {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    letter-spacing: 1.5px;
    color: #4a4c51;
    text-transform: uppercase;
    padding: 16px 20px 12px;
  }

  .search-area {
    padding: 0 16px 12px;
  }

  .search-row {
    display: flex;
    gap: 8px;
  }

  .search-input {
    flex: 1;
    background: #16181c;
    border: 1px solid #2a2c31;
    border-radius: 6px;
    padding: 9px 12px;
    color: #d4cfc8;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    outline: none;
    transition: border-color 0.2s;
  }

  .search-input:focus { border-color: #c8a96e; }
  .search-input::placeholder { color: #3a3c41; }

  .btn {
    background: #c8a96e;
    color: #0e0f11;
    border: none;
    border-radius: 6px;
    padding: 9px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
    white-space: nowrap;
  }

  .btn:hover { background: #d9bb80; }
  .btn:active { transform: scale(0.97); }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .btn.ghost {
    background: transparent;
    color: #c8a96e;
    border: 1px solid #2a2c31;
  }
  .btn.ghost:hover { border-color: #c8a96e; background: #c8a96e12; }

  .results-list {
    flex: 1;
    overflow-y: auto;
    padding: 4px 8px 16px;
    scrollbar-width: thin;
    scrollbar-color: #2a2c31 transparent;
  }

  .result-card {
    padding: 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.15s;
    border: 1px solid transparent;
    margin-bottom: 4px;
  }

  .result-card:hover { background: #16181c; border-color: #2a2c31; }
  .result-card.selected { background: #1a1c20; border-color: #c8a96e40; }

  .result-title {
    font-size: 13px;
    font-weight: 500;
    color: #f0ece4;
    line-height: 1.3;
    margin-bottom: 4px;
  }

  .result-meta {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    color: #5a5c61;
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .result-meta span { display: flex; align-items: center; gap: 4px; }

  .tag {
    display: inline-block;
    background: #c8a96e18;
    color: #c8a96e;
    border-radius: 4px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    padding: 2px 7px;
    margin-top: 6px;
  }

  .manual-section {
    border-top: 1px solid #1f2125;
    padding: 12px 16px;
  }

  .manual-label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    color: #4a4c51;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .manual-input {
    width: 100%;
    background: #16181c;
    border: 1px solid #2a2c31;
    border-radius: 6px;
    padding: 8px 12px;
    color: #d4cfc8;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    outline: none;
    resize: none;
    height: 56px;
    transition: border-color 0.2s;
  }

  .manual-input:focus { border-color: #c8a96e; }
  .manual-input::placeholder { color: #3a3c41; }

  /* RIGHT PANEL */
  .right-panel {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .chat-header {
    padding: 16px 24px;
    border-bottom: 1px solid #1f2125;
    min-height: 60px;
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .workbook-badge {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
  }

  .workbook-icon {
    width: 36px; height: 36px;
    background: #c8a96e18;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
  }

  .workbook-info h3 {
    font-size: 14px;
    font-weight: 500;
    color: #f0ece4;
    line-height: 1.2;
  }

  .workbook-info p {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    color: #5a5c61;
    margin-top: 2px;
  }

  .placeholder-header {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    color: #3a3c41;
  }

  /* QUICK PROMPTS */
  .quick-prompts {
    display: flex;
    gap: 8px;
    padding: 12px 24px;
    border-bottom: 1px solid #1f2125;
    overflow-x: auto;
    scrollbar-width: none;
    flex-shrink: 0;
  }

  .quick-prompts::-webkit-scrollbar { display: none; }

  .quick-btn {
    background: #16181c;
    border: 1px solid #2a2c31;
    border-radius: 20px;
    padding: 6px 14px;
    font-size: 12px;
    color: #9a9690;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.15s;
    font-family: 'DM Sans', sans-serif;
  }

  .quick-btn:hover {
    border-color: #c8a96e;
    color: #c8a96e;
    background: #c8a96e0a;
  }

  /* MESSAGES */
  .messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    scrollbar-width: thin;
    scrollbar-color: #2a2c31 transparent;
  }

  .empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 12px;
    padding: 40px;
  }

  .empty-icon {
    font-size: 40px;
    opacity: 0.3;
  }

  .empty-state h2 {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    color: #4a4c51;
  }

  .empty-state p {
    font-size: 13px;
    color: #3a3c41;
    max-width: 300px;
    line-height: 1.6;
  }

  .message {
    display: flex;
    gap: 12px;
    animation: fadeUp 0.25s ease;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .message.user { flex-direction: row-reverse; }

  .avatar {
    width: 28px; height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .avatar.claude { background: #c8a96e20; color: #c8a96e; border: 1px solid #c8a96e30; }
  .avatar.user { background: #2a2c31; color: #9a9690; }

  .bubble {
    max-width: 80%;
    padding: 12px 16px;
    border-radius: 12px;
    font-size: 13.5px;
    line-height: 1.65;
  }

  .bubble.claude {
    background: #16181c;
    border: 1px solid #2a2c31;
    color: #d4cfc8;
    border-radius: 4px 12px 12px 12px;
  }

  .bubble.user {
    background: #c8a96e18;
    border: 1px solid #c8a96e30;
    color: #e8e4dc;
    border-radius: 12px 4px 12px 12px;
  }

  .bubble.loading {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #5a5c61;
    font-style: italic;
    font-size: 13px;
  }

  .dot-pulse {
    display: flex; gap: 4px;
  }

  .dot-pulse span {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: #c8a96e;
    animation: pulse 1.2s infinite;
  }

  .dot-pulse span:nth-child(2) { animation-delay: 0.2s; }
  .dot-pulse span:nth-child(3) { animation-delay: 0.4s; }

  @keyframes pulse {
    0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
    40% { opacity: 1; transform: scale(1); }
  }

  pre {
    background: #0a0b0d;
    border: 1px solid #2a2c31;
    border-radius: 6px;
    padding: 12px;
    overflow-x: auto;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    margin: 8px 0;
    white-space: pre-wrap;
  }

  /* INPUT BAR */
  .input-bar {
    padding: 16px 24px;
    border-top: 1px solid #1f2125;
    display: flex;
    gap: 10px;
    align-items: flex-end;
  }

  .chat-input {
    flex: 1;
    background: #16181c;
    border: 1px solid #2a2c31;
    border-radius: 10px;
    padding: 10px 14px;
    color: #d4cfc8;
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px;
    outline: none;
    resize: none;
    max-height: 120px;
    line-height: 1.5;
    transition: border-color 0.2s;
  }

  .chat-input:focus { border-color: #c8a96e; }
  .chat-input::placeholder { color: #3a3c41; }

  .send-btn {
    background: #c8a96e;
    color: #0e0f11;
    border: none;
    border-radius: 8px;
    width: 38px; height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 16px;
    transition: background 0.2s, transform 0.1s;
    flex-shrink: 0;
  }

  .send-btn:hover { background: #d9bb80; }
  .send-btn:active { transform: scale(0.93); }
  .send-btn:disabled { opacity: 0.35; cursor: not-allowed; }

  .error-banner {
    background: #ff6b6b18;
    border: 1px solid #ff6b6b30;
    color: #ff9a9a;
    border-radius: 6px;
    padding: 8px 12px;
    font-size: 12px;
    font-family: 'IBM Plex Mono', monospace;
    margin: 0 24px 8px;
  }

  @media (max-width: 768px) {
    .main { grid-template-columns: 1fr; grid-template-rows: auto 1fr; }
    .left-panel { border-right: none; border-bottom: 1px solid #1f2125; max-height: 260px; }
  }
`;

const QUICK_PROMPTS = [
  "Summarize what this workbook is about",
  "What charts and visualizations does it use?",
  "What insights can I draw from this data?",
  "How was this dashboard built?",
  "Suggest improvements to this dashboard",
  "What calculated fields might be used here?",
];

function formatNumber(n) {
  if (!n) return "0";
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return String(n);
}

function renderBubbleContent(text) {
  // Basic markdown-like rendering
  const lines = text.split("\n");
  return lines.map((line, i) => {
    if (line.startsWith("### ")) return <h4 key={i} style={{ color: "#c8a96e", fontFamily: "'Playfair Display', serif", fontSize: 15, margin: "10px 0 4px" }}>{line.slice(4)}</h4>;
    if (line.startsWith("## ")) return <h3 key={i} style={{ color: "#f0ece4", fontFamily: "'Playfair Display', serif", fontSize: 16, margin: "12px 0 4px" }}>{line.slice(3)}</h3>;
    if (line.startsWith("**") && line.endsWith("**")) return <strong key={i} style={{ color: "#f0ece4", display: "block" }}>{line.slice(2, -2)}</strong>;
    if (line.startsWith("- ") || line.startsWith("• ")) return <div key={i} style={{ paddingLeft: 12, marginBottom: 2 }}>· {line.slice(2)}</div>;
    if (line.startsWith("```")) return null;
    if (line === "") return <br key={i} />;
    return <span key={i} style={{ display: "block" }}>{line}</span>;
  });
}

export default function App() {
  const [apiKey, setApiKey] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState(null);
  const [manualContext, setManualContext] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function searchTableau() {
    if (!searchQuery.trim()) return;
    setSearching(true);
    setError("");
    try {
      const url = `${TABLEAU_SEARCH}?count=12&language=en&query=${encodeURIComponent(searchQuery)}&type=workbooks`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      const hits = data?.hits?.hit || [];
      setResults(hits.map(h => ({
        id: h.id,
        title: h.document?.title || "Untitled",
        author: h.document?.username || "Unknown",
        views: h.document?.viewCount || 0,
        description: h.document?.description || "",
        url: h.document?.defaultViewRepoUrl
          ? `https://public.tableau.com/views/${h.document.defaultViewRepoUrl}`
          : null,
        tags: h.document?.tags?.slice(0, 3) || [],
        thumbnailUrl: h.document?.thumbnailStaticUrl || null,
      })));
    } catch (e) {
      setError("Could not reach Tableau Public API. Try pasting workbook info manually below.");
      setResults([]);
    } finally {
      setSearching(false);
    }
  }

  async function sendMessage(text) {
    if (!text.trim()) return;
    if (!apiKey.trim()) { setError("Please enter your Anthropic API key above."); return; }
    setError("");

    const userMsg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    // Build system context
    let context = "You are a Tableau data analyst assistant. Help users understand Tableau workbooks, dashboards, and data visualization best practices.";

    if (selected) {
      context += `\n\nCurrent Tableau workbook context:\nTitle: ${selected.title}\nAuthor: ${selected.author}\nViews: ${formatNumber(selected.views)}\nDescription: ${selected.description || "No description"}\nTags: ${selected.tags.join(", ") || "None"}\nURL: ${selected.url || "N/A"}`;
    }
    if (manualContext.trim()) {
      context += `\n\nAdditional context provided by user:\n${manualContext}`;
    }

    try {
      const res = await fetch(CLAUDE_API, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: context,
          messages: newMessages,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const reply = data.content?.[0]?.text || "No response.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      setError(e.message || "Claude API error. Check your API key.");
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {/* HEADER */}
        <header className="header">
          <div className="logo-area">
            <h1>Tableau × Claude</h1>
            <p>AI-POWERED WORKBOOK ANALYSIS</p>
          </div>
          <div className="key-area">
            <label>API KEY</label>
            <input
              className="key-input"
              type="password"
              placeholder="sk-ant-..."
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
            />
            <div className={`key-dot ${apiKey.startsWith("sk-ant-") ? "active" : ""}`} />
          </div>
        </header>

        {/* MAIN */}
        <div className="main">
          {/* LEFT */}
          <div className="left-panel">
            <div className="panel-title">Tableau Public Search</div>
            <div className="search-area">
              <div className="search-row">
                <input
                  className="search-input"
                  placeholder="Search workbooks…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && searchTableau()}
                />
                <button className="btn" onClick={searchTableau} disabled={searching || !searchQuery.trim()}>
                  {searching ? "…" : "Go"}
                </button>
              </div>
            </div>

            <div className="results-list">
              {results.length === 0 && !searching && (
                <div style={{ padding: "12px 8px", color: "#3a3c41", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1.6 }}>
                  Search for any topic — sales, climate, healthcare — to find Tableau Public workbooks to analyze.
                </div>
              )}
              {results.map(r => (
                <div
                  key={r.id}
                  className={`result-card ${selected?.id === r.id ? "selected" : ""}`}
                  onClick={() => { setSelected(r); setMessages([]); }}
                >
                  <div className="result-title">{r.title}</div>
                  <div className="result-meta">
                    <span>👤 {r.author}</span>
                    <span>👁 {formatNumber(r.views)}</span>
                  </div>
                  {r.tags.length > 0 && (
                    <div>{r.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
                  )}
                </div>
              ))}
            </div>

            {/* MANUAL CONTEXT */}
            <div className="manual-section">
              <div className="manual-label">Or paste workbook info / URL</div>
              <textarea
                className="manual-input"
                placeholder="Paste a Tableau Public URL, workbook description, or any data context…"
                value={manualContext}
                onChange={e => setManualContext(e.target.value)}
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="right-panel">
            {/* Chat Header */}
            <div className="chat-header">
              {selected ? (
                <div className="workbook-badge">
                  <div className="workbook-icon">📊</div>
                  <div className="workbook-info">
                    <h3>{selected.title}</h3>
                    <p>by {selected.author} · {formatNumber(selected.views)} views</p>
                  </div>
                  {selected.url && (
                    <a href={selected.url} target="_blank" rel="noreferrer" style={{ color: "#c8a96e", fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", textDecoration: "none", marginLeft: "auto", flexShrink: 0 }}>
                      Open ↗
                    </a>
                  )}
                </div>
              ) : (
                <span className="placeholder-header">Select a workbook or paste context to begin</span>
              )}
            </div>

            {/* Quick Prompts */}
            {(selected || manualContext) && (
              <div className="quick-prompts">
                {QUICK_PROMPTS.map(p => (
                  <button key={p} className="quick-btn" onClick={() => sendMessage(p)} disabled={loading}>
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* Error */}
            {error && <div className="error-banner">⚠ {error}</div>}

            {/* Messages */}
            <div className="messages">
              {messages.length === 0 && !loading ? (
                <div className="empty-state">
                  <div className="empty-icon">◈</div>
                  <h2>Ready to analyze</h2>
                  <p>Search for a Tableau Public workbook on the left, then ask Claude anything about it.</p>
                </div>
              ) : (
                messages.map((m, i) => (
                  <div key={i} className={`message ${m.role === "user" ? "user" : ""}`}>
                    <div className={`avatar ${m.role === "user" ? "user" : "claude"}`}>
                      {m.role === "user" ? "U" : "C"}
                    </div>
                    <div className={`bubble ${m.role === "user" ? "user" : "claude"}`}>
                      {m.role === "assistant" ? renderBubbleContent(m.content) : m.content}
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="message">
                  <div className="avatar claude">C</div>
                  <div className="bubble claude loading">
                    <div className="dot-pulse"><span /><span /><span /></div>
                    Analyzing…
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="input-bar">
              <textarea
                ref={inputRef}
                className="chat-input"
                rows={1}
                placeholder={selected || manualContext ? "Ask Claude about this workbook…" : "Select a workbook first, or paste context above"}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading || (!selected && !manualContext.trim())}
              />
              <button
                className="send-btn"
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim() || (!selected && !manualContext.trim())}
              >
                ↑
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
