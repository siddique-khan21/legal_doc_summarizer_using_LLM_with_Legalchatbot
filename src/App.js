import { useState, useRef, useEffect } from "react";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Inter:wght@300;400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--black:#080808;--white:#ffffff;--off:#f9f9f7;--mid:#e8e8e4;--subtle:#c4c4be;--muted:#8a8a84;--border:rgba(8,8,8,0.1)}
.dark {
  --black: #ffffff;
  --white: #0b0b0b;
  --off: #111111;
  --mid: #1a1a1a;
  --subtle: #888;
  --muted: #aaa;
  --border: rgba(255,255,255,0.1);
}
body{
  font-family:'Inter',sans-serif;
  background:var(--white);
  color:var(--black);
  -webkit-font-smoothing:antialiased;
  transition: background 0.3s ease, color 0.3s ease;
}

.app-header{height:80px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;padding:0 56px;background:rgba(255,255,255,0.96);backdrop-filter:blur(16px);position:sticky;top:0;z-index:100}
.hd-left{display:flex;align-items:center;gap:16px}
.hd-mark{width:40px;height:40px;background:var(--black);display:flex;align-items:center;justify-content:center}
.hd-brand{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:300;letter-spacing:4px;text-transform:uppercase}
.hd-divider{width:1px;height:28px;background:var(--border);margin:0 8px}
.hd-sub{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:var(--muted)}
.hd-nav{display:flex;gap:40px}
.hd-nav a{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);text-decoration:none;cursor:pointer;transition:color 0.2s}
.hd-nav a:hover,.hd-nav a.on{color:var(--black)}
.hd-cta{background:var(--black);color:white;border:none;padding:12px 28px;font-size:11px;letter-spacing:3px;text-transform:uppercase;cursor:pointer;transition:opacity 0.2s}
.hd-cta:hover{opacity:0.8}

.hero{display:grid;grid-template-columns:1fr 1fr;min-height:560px;border-bottom:1px solid var(--border)}
.hero-left{padding:80px 56px;border-right:1px solid var(--border);display:flex;flex-direction:column;justify-content:space-between}
.hero-tag{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:var(--muted);margin-bottom:40px;display:flex;align-items:center;gap:12px}
.hero-tag::before{content:'';display:block;width:32px;height:1px;background:var(--black)}
.hero-h1{font-family:'Cormorant Garamond',serif;font-size:clamp(52px,6vw,80px);font-weight:300;line-height:1.0;letter-spacing:-1px;margin-bottom:32px}
.hero-h1 i{font-style:italic}
.hero-p{font-size:14px;line-height:1.8;color:var(--muted);max-width:420px}
.hero-stats{display:flex;gap:0;border-top:1px solid var(--border);margin-top:56px}
.stat{flex:1;padding:28px 0;border-right:1px solid var(--border)}
.stat:last-child{border-right:none;padding-left:28px}
.stat:first-child{padding-right:28px}
.stat:not(:first-child):not(:last-child){padding:28px}
.stat-n{font-family:'Cormorant Garamond',serif;font-size:40px;font-weight:300;line-height:1;margin-bottom:6px}
.stat-l{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--muted)}

.hero-right{padding:80px 56px;display:flex;flex-direction:column;justify-content:center;gap:20px}
.drop-area{border:1px solid var(--border);padding:48px 40px;text-align:center;cursor:pointer;transition:all 0.3s;background:var(--off)}
.drop-area:hover{border-color:var(--black);background:white}
.drop-icon{width:56px;height:56px;border:1px solid var(--border);margin:0 auto 20px;display:flex;align-items:center;justify-content:center;background:white}
.drop-title{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:300;margin-bottom:8px}
.drop-hint{font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted)}
.file-chip{display:flex;align-items:center;gap:10px;padding:12px 16px;border:1px solid var(--border);font-size:12px;background:var(--off)}
.btn-analyze{background:var(--black);color:white;border:none;padding:18px 32px;font-size:11px;letter-spacing:3px;text-transform:uppercase;cursor:pointer;width:100%;transition:opacity 0.2s;font-family:'Inter',sans-serif}
.btn-analyze:hover:not(:disabled){opacity:0.8}
.btn-analyze:disabled{opacity:0.35;cursor:not-allowed}

.workspace{display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid var(--border)}
.ws-col{border-right:1px solid var(--border)}
.ws-col:last-child{border-right:none}
.ws-head{padding:24px 40px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.ws-title{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:300;letter-spacing:0.5px}
.ws-tag{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);border:1px solid var(--border);padding:4px 12px}
.ws-body{padding:32px 40px;min-height:300px}
.placeholder-text{font-size:13px;color:var(--subtle);line-height:1.7;font-style:italic}
.summary-output{font-size:14px;line-height:1.9;color:#2a2a2a;white-space:pre-wrap}

.risk-item{padding:20px 0;border-bottom:1px solid var(--border)}
.risk-item:last-child{border-bottom:none}
.risk-item:first-child{padding-top:0}
.risk-head{display:flex;align-items:center;gap:10px;margin-bottom:8px}
.risk-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.risk-text{font-size:13px;line-height:1.7;color:#3a3a3a;padding-left:18px}

.chat-section{border-bottom:1px solid var(--border)}
.chat-head{padding:24px 56px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.chat-online{display:flex;align-items:center;gap:6px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--muted)}
.chat-online::before{content:'';width:6px;height:6px;border-radius:50%;background:#27ae60}
.chat-feed{height:320px;overflow-y:auto;padding:32px 56px;display:flex;flex-direction:column;gap:16px;border-bottom:1px solid var(--border)}
.chat-feed::-webkit-scrollbar{width:3px}
.chat-feed::-webkit-scrollbar-thumb{background:var(--mid)}
.bubble{max-width:72%;padding:14px 18px;font-size:13px;line-height:1.7}
.bubble-user{align-self:flex-end;background:var(--black);color:white}
.bubble-bot{align-self:flex-start;background:var(--off);border:1px solid var(--border)}
.chat-bar{display:flex}
.chat-in{flex:1;border:none;outline:none;padding:20px 56px;font-family:'Inter',sans-serif;font-size:13px;background:white;color:var(--black);border-right:1px solid var(--border)}
.chat-in::placeholder{color:var(--subtle)}
.chat-send{background:var(--black);color:white;border:none;padding:20px 40px;font-family:'Inter',sans-serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;cursor:pointer;transition:opacity 0.2s}
.chat-send:hover{opacity:0.8}
.shimmer-line{height:13px;background:linear-gradient(90deg,var(--off) 25%,var(--mid) 50%,var(--off) 75%);background-size:200% 100%;animation:sh 1.5s infinite;margin-bottom:12px}
@keyframes sh{to{background-position:-200% 0}}
.app-footer{padding:32px 56px;display:flex;align-items:center;justify-content:space-between;border-top:1px solid var(--border)}
.ft-brand{font-family:'Cormorant Garamond',serif;font-size:14px;letter-spacing:3px;text-transform:uppercase;font-weight:300}
.ft-note{font-size:11px;color:var(--muted);letter-spacing:1px}
`;

function RiskItems({ text }) {
  const lines = text.split("\n").filter(l => l.trim());
  const items = [];
  let content = "", level = "";
  for (const l of lines) {
    const lo = l.toLowerCase();
    if (lo.includes("high")) { if (content && level) items.push({ level, content }); level = "high"; content = l; }
    else if (lo.includes("medium")) { if (content && level) items.push({ level, content }); level = "medium"; content = l; }
    else if (lo.includes("low")) { if (content && level) items.push({ level, content }); level = "low"; content = l; }
    else content += " " + l;
  }
  if (content && level) items.push({ level, content });
  if (!items.length) return <p className="summary-output">{text}</p>;
  const dotColor = { high: "#c0392b", medium: "#e67e22", low: "#27ae60" };
  const textColor = { high: "#c0392b", medium: "#e67e22", low: "#27ae60" };
  const label = { high: "High Risk", medium: "Medium Risk", low: "Low Risk" };
  return items.map((it, i) => (
    <div key={i} className="risk-item">
      <div className="risk-head">
        <div className="risk-dot" style={{ background: dotColor[it.level] }} />
        <span style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", fontWeight: 500, color: textColor[it.level] }}>{label[it.level]}</span>
      </div>
      <p className="risk-text">{it.content.trim()}</p>
    </div>
  ));
}

function Shimmer() {
  return <>
    <div className="shimmer-line" style={{ width: "100%" }} />
    <div className="shimmer-line" style={{ width: "85%" }} />
    <div className="shimmer-line" style={{ width: "92%" }} />
    <div className="shimmer-line" style={{ width: "70%", marginTop: 16 }} />
    <div className="shimmer-line" style={{ width: "80%" }} />
  </>;
}

export default function App() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [risks, setRisks] = useState("");
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState([{ role: "bot", text: "Good day. I'm your Lexara legal assistant. I can answer questions about law, contracts, and your uploaded documents. How may I help you?" }]);
  const [msg, setMsg] = useState("");
  const feedRef = useRef(null);
  const [dark, setDark] = useState(false);

  useEffect(() => { if (feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight; }, [chat]);

  async function analyze() {
    if (!file) return;
    setLoading(true); setSummary(""); setRisks("");
    try {
      const fd = new FormData(); fd.append("file", file);
      const r = await fetch("http://127.0.0.1:8000/summarize", { method: "POST", body: fd });
      const d = await r.json();
      setSummary(d.summary); setRisks(d.risks);
    } catch { setSummary("Backend error. Ensure server is running on port 8000."); }
    setLoading(false);
  }

  async function send() {
    if (!msg.trim()) return;
    const m = msg; setMsg("");
    setChat(h => [...h, { role: "user", text: m }, { role: "bot", text: "…", id: "typing" }]);
    try {
      const r = await fetch("http://127.0.0.1:8000/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: m }) });
      const d = await r.json();
      setChat(h => h.map(x => x.id === "typing" ? { role: "bot", text: d.reply } : x));
    } catch {
      setChat(h => h.map(x => x.id === "typing" ? { role: "bot", text: "Connection error. Please ensure the backend is running." } : x));
    }
  }

  return (
  <div className={dark ? "dark" : ""}>
      <style>{css}</style>
      <header className="app-header">
        <div className="hd-left">
          <div className="hd-mark">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 3L4 7v5c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V7L12 3z"/></svg>
          </div>
          <div className="hd-brand">Lexara</div>
          <div className="hd-divider" />
          <div className="hd-sub">Legal Intelligence Platform</div>
        </div>
      <nav className="hd-nav"></nav>
       <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
  <button
    onClick={() => setDark(!dark)}
    style={{
      border: "1px solid var(--border)",
      background: "transparent",
      padding: "10px 16px",
      cursor: "pointer",
      fontSize: "11px",
      letterSpacing: "2px"
    }}
  >
    {dark ? "LIGHT" : "DARK"}
  </button>

  
</div>
      </header>

      <section className="hero">
        <div className="hero-left">
          <div>
            <div className="hero-tag">Enterprise Legal AI</div>
            <h1 className="hero-h1">Legal clarity.<br /><i>Delivered</i><br />instantly.</h1>
            <p className="hero-p">Upload any contract or legal document. Lexara extracts what matters — summaries, risks, obligations — so your team moves faster and misses nothing.</p>
          </div>
          <div className="hero-stats">
            <div className="stat"><div className="stat-n">10×</div><div className="stat-l">Faster review</div></div>
            <div className="stat"><div className="stat-n">99%</div><div className="stat-l">Risk accuracy</div></div>
            <div className="stat"><div className="stat-n">PDF</div><div className="stat-l">DOCX support</div></div>
          </div>
        </div>

        <div className="hero-right">
          <div className="drop-area" onClick={() => document.getElementById("fi").click()}>
            <div className="drop-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#080808" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
            </div>
            <div className="drop-title">Drop your document here</div>
            <div className="drop-hint">PDF or DOCX — up to 10MB</div>
            <input id="fi" type="file" accept=".pdf,.docx" style={{ display: "none" }} onChange={e => setFile(e.target.files[0])} />
          </div>
          {file && <div className="file-chip">📎 {file.name}</div>}
          <button className="btn-analyze" disabled={!file || loading} onClick={analyze}>
            {loading ? "Analyzing…" : "Analyze Document"}
          </button>
        </div>
      </section>

      <div className="workspace">
        <div className="ws-col">
          <div className="ws-head">
            <span className="ws-title">Summary</span>
            <span className="ws-tag">AI Generated</span>
          </div>
          <div className="ws-body">
            {loading ? <Shimmer /> : summary
              ? <p className="summary-output">{summary}</p>
              : <p className="placeholder-text">Your document summary will appear here once you upload and analyze a file.</p>}
          </div>
        </div>
        <div className="ws-col">
          <div className="ws-head">
            <span className="ws-title">Risk Analysis</span>
            <span className="ws-tag">{risks ? `${(risks.match(/high|medium|low/gi) || []).length} Clauses` : "Highlighted"}</span>
          </div>
          <div className="ws-body">
            {loading ? <Shimmer /> : risks
              ? <RiskItems text={risks} />
              : <p className="placeholder-text">Identified risk clauses will be listed here — classified by severity with plain-language explanations.</p>}
          </div>
        </div>
      </div>

      <section className="chat-section">
        <div className="chat-head">
          <span className="ws-title">Legal Assistant</span>
          <span className="chat-online">Available</span>
        </div>
        <div className="chat-feed" ref={feedRef}>
          {chat.map((m, i) => <div key={i} className={`bubble bubble-${m.role}`}>{m.text}</div>)}
        </div>
        <div className="chat-bar">
          <input className="chat-in" value={msg} onChange={e => setMsg(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()} placeholder="Ask a legal question…" />
          <button className="chat-send" onClick={send}>Send</button>
        </div>
      </section>

      <footer className="app-footer">
        <div className="ft-brand">Lexara</div>
        <div className="ft-note">Powered by AI · Not a substitute for legal counsel</div>
      </footer>
    </div>
  );
}
