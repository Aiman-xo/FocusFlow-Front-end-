import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');

  :root {
    --primary-fixed: #5FFBD6;
    --on-primary-fixed: #041329;
    --glass-bg: rgba(255,255,255,0.04);
    --glass-border: rgba(255,255,255,0.08);
    --text-muted: rgba(255,255,255,0.45);
    --text-soft: rgba(255,255,255,0.7);
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; }

  .fs-root {
    font-family: 'DM Sans', sans-serif;
    background: radial-gradient(ellipse at 70% 10%, #0d1c32 0%, #041329 100%);
    color: white;
    min-height: 100vh;
    overflow-x: hidden;
  }

  .fs-glow-tr {
    position: fixed; top: -10%; right: -10%;
    width: 600px; height: 600px;
    background: rgba(95,251,214,0.05);
    border-radius: 50%; filter: blur(120px);
    pointer-events: none; z-index: 0;
    animation: fs-pulseglow 8s ease-in-out infinite alternate;
  }
  .fs-glow-bl {
    position: fixed; bottom: -10%; left: -10%;
    width: 500px; height: 500px;
    background: rgba(30,80,140,0.12);
    border-radius: 50%; filter: blur(120px);
    pointer-events: none; z-index: 0;
  }

  @keyframes fs-pulseglow {
    from { opacity: 0.6; transform: scale(1); }
    to   { opacity: 1;   transform: scale(1.12); }
  }

  /* Nav */
  .fs-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 48px;
    background: rgba(4,19,41,0.6);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(95,251,214,0.06);
  }
  .fs-nav-logo { display: flex; align-items: center; gap: 10px; }
  .fs-nav-logo-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: rgba(95,251,214,0.1);
    border: 1px solid rgba(95,251,214,0.2);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 14px rgba(95,251,214,0.12);
  }
  .fs-nav-logo-icon svg { width: 20px; height: 20px; }
  .fs-nav-logo-text {
    font-family: 'Instrument Serif', serif;
    font-size: 20px; letter-spacing: -0.3px; color: white;
  }
  .fs-nav-links { display: flex; gap: 32px; }
  .fs-nav-links a {
    font-size: 13px; color: var(--text-muted);
    text-decoration: none; letter-spacing: 0.02em;
    transition: color 0.2s;
  }
  .fs-nav-links a:hover { color: white; }
  .fs-nav-cta {
    padding: 9px 22px; border-radius: 9px;
    background: var(--primary-fixed); color: var(--on-primary-fixed);
    font-size: 13px; font-weight: 600; cursor: pointer;
    border: none; letter-spacing: 0.01em;
    box-shadow: 0 0 20px rgba(95,251,214,0.25);
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .fs-nav-cta:hover { transform: scale(1.03); box-shadow: 0 0 30px rgba(95,251,214,0.4); }

  /* Hero */
  .fs-hero {
    min-height: 100vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center;
    padding: 120px 24px 80px;
    position: relative; z-index: 1;
  }
  .fs-hero-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 14px; border-radius: 99px;
    background: rgba(95,251,214,0.07);
    border: 1px solid rgba(95,251,214,0.18);
    font-size: 11px; font-weight: 600;
    color: var(--primary-fixed); letter-spacing: 0.08em; text-transform: uppercase;
    margin-bottom: 28px;
    animation: fs-fadein 0.6s ease both;
  }
  .fs-hero-badge .fs-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--primary-fixed);
    box-shadow: 0 0 6px var(--primary-fixed);
    animation: fs-blink 2s ease-in-out infinite;
  }
  @keyframes fs-blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

  .fs-hero-title {
    font-family: 'Instrument Serif', serif;
    font-size: clamp(48px, 8vw, 88px);
    line-height: 1.05; letter-spacing: -2px;
    max-width: 800px;
    animation: fs-fadein 0.7s 0.1s ease both;
  }
  .fs-hero-title em {
    font-style: italic; color: var(--primary-fixed);
    text-shadow: 0 0 40px rgba(95,251,214,0.4);
  }
  .fs-hero-sub {
    margin-top: 20px; max-width: 440px;
    font-size: 15px; line-height: 1.7;
    color: var(--text-soft);
    animation: fs-fadein 0.7s 0.2s ease both;
  }
  .fs-hero-actions {
    margin-top: 36px;
    display: flex; align-items: center; gap: 14px;
    animation: fs-fadein 0.7s 0.3s ease both;
  }
  .fs-btn-primary {
    padding: 13px 32px; border-radius: 10px;
    background: var(--primary-fixed); color: var(--on-primary-fixed);
    font-size: 14px; font-weight: 700; cursor: pointer; border: none;
    box-shadow: 0 0 24px rgba(95,251,214,0.3);
    display: flex; align-items: center; gap: 8px;
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .fs-btn-primary:hover { transform: scale(1.03); box-shadow: 0 0 36px rgba(95,251,214,0.45); }
  .fs-btn-ghost {
    padding: 13px 28px; border-radius: 10px;
    background: transparent; color: var(--text-soft);
    font-size: 14px; font-weight: 500; cursor: pointer;
    border: 1px solid rgba(255,255,255,0.1);
    transition: border-color 0.2s, color 0.2s;
  }
  .fs-btn-ghost:hover { border-color: rgba(255,255,255,0.25); color: white; }

  /* Hero visual */
  .fs-hero-visual {
    margin-top: 60px; position: relative;
    width: 100%; max-width: 720px;
    animation: fs-fadein 0.8s 0.4s ease both;
  }
  .fs-hero-visual-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(95,251,214,0.1);
    border-radius: 20px; padding: 28px 32px;
    backdrop-filter: blur(20px);
    box-shadow: 0 0 60px rgba(95,251,214,0.06), inset 0 1px 0 rgba(255,255,255,0.05);
  }
  .fs-hv-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 24px;
  }
  .fs-hv-title { font-size: 13px; font-weight: 600; color: var(--text-soft); }
  .fs-hv-status {
    font-size: 11px; color: var(--primary-fixed);
    background: rgba(95,251,214,0.08);
    padding: 4px 10px; border-radius: 99px;
    border: 1px solid rgba(95,251,214,0.15);
  }
  .fs-task-row {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.04);
  }
  .fs-task-row:last-child { border-bottom: none; }
  .fs-task-check {
    width: 18px; height: 18px; border-radius: 5px;
    border: 1.5px solid rgba(95,251,214,0.3);
    flex-shrink: 0; display: flex; align-items: center; justify-content: center;
  }
  .fs-task-check.done {
    background: rgba(95,251,214,0.15);
    border-color: var(--primary-fixed);
  }
  .fs-task-check.done::after {
    content: ''; width: 5px; height: 9px;
    border: 1.5px solid var(--primary-fixed);
    border-left: none; border-top: none;
    transform: rotate(45deg) translate(-1px, -1px);
  }
  .fs-task-label { font-size: 13px; color: var(--text-soft); flex: 1; }
  .fs-task-label.done { text-decoration: line-through; color: var(--text-muted); }
  .fs-task-tag {
    font-size: 10px; padding: 3px 8px; border-radius: 99px; font-weight: 500;
  }
  .fs-tag-focus { background: rgba(95,251,214,0.08); color: var(--primary-fixed); border: 1px solid rgba(95,251,214,0.15); }
  .fs-tag-deep  { background: rgba(100,149,237,0.1); color: #84a9f5; border: 1px solid rgba(100,149,237,0.2); }
  .fs-tag-review{ background: rgba(255,200,100,0.08); color: #ffd080; border: 1px solid rgba(255,200,100,0.15); }

  .fs-stat-pill {
    position: absolute;
    background: rgba(13,28,50,0.9);
    border: 1px solid rgba(95,251,214,0.12);
    border-radius: 12px; padding: 10px 16px;
    backdrop-filter: blur(12px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  }
  .fs-stat-pill-left  { left: -60px; top: 50%; transform: translateY(-50%); animation: fs-float1 5s ease-in-out infinite; }
  .fs-stat-pill-right { right: -60px; top: 30%; animation: fs-float2 6s ease-in-out infinite; }
  @keyframes fs-float1 { 0%,100%{transform:translateY(-50%) translateX(0)} 50%{transform:translateY(-52%) translateX(-4px)} }
  @keyframes fs-float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  .fs-stat-val { font-size: 20px; font-weight: 700; color: var(--primary-fixed); line-height: 1; }
  .fs-stat-lbl { font-size: 10px; color: var(--text-muted); margin-top: 2px; letter-spacing: 0.04em; }

  @keyframes fs-fadein {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Section */
  .fs-section {
    position: relative; z-index: 1;
    padding: 100px 48px;
    max-width: 1100px; margin: 0 auto;
  }
  .fs-section-label {
    font-size: 11px; font-weight: 600; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--primary-fixed); margin-bottom: 14px;
  }
  .fs-section-title {
    font-family: 'Instrument Serif', serif;
    font-size: clamp(32px, 5vw, 52px);
    line-height: 1.1; letter-spacing: -1px; max-width: 540px;
  }
  .fs-section-sub {
    margin-top: 12px; max-width: 400px;
    font-size: 14px; line-height: 1.7; color: var(--text-muted);
  }

  /* Features */
  .fs-features-grid {
    margin-top: 56px;
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
  }
  .fs-feat-card {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: 18px; padding: 28px 26px;
    backdrop-filter: blur(12px);
    transition: border-color 0.25s, transform 0.2s, box-shadow 0.25s;
    cursor: default;
  }
  .fs-feat-card:hover {
    border-color: rgba(95,251,214,0.2);
    transform: translateY(-4px);
    box-shadow: 0 16px 48px rgba(95,251,214,0.06);
  }
  .fs-feat-icon {
    width: 44px; height: 44px; border-radius: 12px;
    background: rgba(95,251,214,0.08);
    border: 1px solid rgba(95,251,214,0.15);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 18px;
    box-shadow: 0 0 16px rgba(95,251,214,0.08);
  }
  .fs-feat-icon .material-symbols-outlined { font-size: 22px !important; color: var(--primary-fixed); }
  .fs-feat-card h3 { font-size: 15px; font-weight: 600; margin-bottom: 8px; }
  .fs-feat-card p  { font-size: 13px; line-height: 1.65; color: var(--text-muted); }

  /* Stats row */
  .fs-stats-row {
    display: grid; grid-template-columns: repeat(3,1fr);
    gap: 1px; background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px; overflow: hidden; margin: 80px 0;
  }
  .fs-stat-cell { background: rgba(4,19,41,0.8); padding: 36px 40px; text-align: center; }
  .fs-stat-cell .fs-big { font-family: 'Instrument Serif', serif; font-size: 48px; color: var(--primary-fixed); line-height: 1; }
  .fs-stat-cell .fs-lbl { font-size: 12px; color: var(--text-muted); margin-top: 6px; letter-spacing: 0.04em; }

  /* Testimonials */
  .fs-testi-grid { margin-top: 52px; display: grid; grid-template-columns: repeat(2,1fr); gap: 20px; }
  .fs-testi-card {
    background: var(--glass-bg); border: 1px solid var(--glass-border);
    border-radius: 18px; padding: 28px; backdrop-filter: blur(12px);
  }
  .fs-testi-quote { font-size: 14px; line-height: 1.7; color: var(--text-soft); margin-bottom: 20px; font-style: italic; }
  .fs-testi-quote span { color: var(--primary-fixed); font-style: normal; }
  .fs-testi-author { display: flex; align-items: center; gap: 10px; }
  .fs-testi-avatar {
    width: 34px; height: 34px; border-radius: 50%;
    background: linear-gradient(135deg, rgba(95,251,214,0.3), rgba(30,80,140,0.5));
    border: 1px solid rgba(95,251,214,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 600; color: var(--primary-fixed);
  }
  .fs-testi-name { font-size: 13px; font-weight: 600; }
  .fs-testi-role { font-size: 11px; color: var(--text-muted); }

  /* CTA */
  .fs-cta-section { position: relative; z-index: 1; padding: 60px 24px 120px; text-align: center; }
  .fs-cta-inner {
    max-width: 640px; margin: 0 auto;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(95,251,214,0.1);
    border-radius: 28px; padding: 60px 48px;
    backdrop-filter: blur(20px);
    box-shadow: 0 0 80px rgba(95,251,214,0.05), inset 0 1px 0 rgba(255,255,255,0.05);
  }
  .fs-cta-inner h2 {
    font-family: 'Instrument Serif', serif;
    font-size: clamp(32px, 5vw, 48px);
    letter-spacing: -1px; line-height: 1.1; margin-bottom: 14px;
  }
  .fs-cta-inner h2 em { font-style: italic; color: var(--primary-fixed); }
  .fs-cta-inner p { font-size: 14px; color: var(--text-muted); line-height: 1.7; margin-bottom: 32px; }
  .fs-cta-note { margin-top: 16px; font-size: 11px; color: var(--text-muted); }

  /* Footer */
  .fs-footer {
    position: relative; z-index: 1;
    border-top: 1px solid rgba(255,255,255,0.05);
    padding: 28px 48px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .fs-foot-left { display: flex; align-items: center; gap: 8px; }
  .fs-foot-logo { font-family: 'Instrument Serif', serif; font-size: 16px; }
  .fs-foot-copy { font-size: 12px; color: var(--text-muted); }
  .fs-foot-links { display: flex; gap: 24px; }
  .fs-foot-links a { font-size: 12px; color: var(--text-muted); text-decoration: none; transition: color 0.2s; }
  .fs-foot-links a:hover { color: white; }

  @media (max-width: 768px) {
    .fs-nav { padding: 16px 20px; }
    .fs-nav-links { display: none; }
    .fs-section { padding: 60px 20px; }
    .fs-features-grid { grid-template-columns: 1fr; }
    .fs-stats-row { grid-template-columns: 1fr; }
    .fs-testi-grid { grid-template-columns: 1fr; }
    .fs-stat-pill { display: none; }
    .fs-cta-inner { padding: 40px 24px; }
    .fs-footer { flex-direction: column; gap: 16px; text-align: center; }
  }
`;

const SpaIcon = () => (
  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="none">
    <path d="M16 26 C16 26 4 22 4 12 C4 12 10 10 14 14 C14 14 15 18 16 26Z" fill="#5FFBD6" />
    <path d="M16 26 C16 26 28 22 28 12 C28 12 22 10 18 14 C18 14 17 18 16 26Z" fill="#5FFBD6" opacity="0.65" />
    <path d="M10 28 C12 26.5 14 26 16 26 C18 26 20 26.5 22 28" stroke="#5FFBD6" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const Icon = ({ name, style }) => (
  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", ...style }}>
    {name}
  </span>
);

const features = [
  { icon: "timer",      title: "Ritual Timers",      desc: "Pomodoro, deep work blocks, and custom focus sessions — with ambient soundscapes that adapt to your rhythm." },
  { icon: "psychology", title: "Flow Intelligence",   desc: "Learns when you do your best thinking and surfaces the right tasks at the right time, automatically." },
  { icon: "spa",        title: "Mindful Check-ins",   desc: "Brief intentional pauses between tasks. Set energy, clarity, and intention — not just to-dos." },
  { icon: "bolt",       title: "Instant Capture",     desc: "Toss ideas, tasks, or links in with a keystroke. Inbox zero, always. Nothing slips through." },
  { icon: "bar_chart",  title: "Flow Analytics",      desc: "Understand your productivity patterns with beautiful insights — weekly streaks, peak hours, energy trends." },
  { icon: "hub",        title: "Deep Integrations",   desc: "Sync with GitHub, Notion, Linear, and Slack. Your tasks, wherever they live, in one calm view." },
];


export default function FlowStateLanding() {
    const nav = useNavigate()
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = styles;
    document.head.appendChild(styleEl);
    return () => document.head.removeChild(styleEl);
  }, []);

  return (
    <div className="fs-root">
      <div className="fs-glow-tr" />
      <div className="fs-glow-bl" />

      {/* Nav */}
      <nav className="fs-nav">
        <div className="fs-nav-logo">
          <div className="fs-nav-logo-icon">
            <SpaIcon />
          </div>
          <span className="fs-nav-logo-text">FlowState</span>
        </div>
        <div className="fs-nav-links">
          <a href="#">Features</a>
          <a href="#">How it works</a>
          <a href="#">Pricing</a>
          <a href="#">Blog</a>
        </div>
        <button className="fs-nav-cta" onClick={()=>nav('/login')}>Get Started Free</button>
      </nav>

      {/* Hero */}
      <section className="fs-hero">
        <div className="fs-hero-badge">
          <span className="fs-dot" /> Now in public beta
        </div>
        <h1 className="fs-hero-title">
          Your workspace,<br />in <em>deep focus</em>
        </h1>
        <p className="fs-hero-sub">
          FlowState blends mindful task management with focus rituals — so you ship more of what matters, distraction-free.
        </p>
        <div className="fs-hero-actions">
          <button className="fs-btn-primary" onClick={()=>nav('/login')}>
            <Icon name="spa" style={{ fontSize: 18 }} />
            Enter Workspace
          </button>
          <button className="fs-btn-ghost">Watch demo →</button>
        </div>

        {/* Dashboard preview */}
        <div className="fs-hero-visual">
          <div className="fs-hero-visual-card">
            <div className="fs-hv-header">
              <span className="fs-hv-title">Today's Focus</span>
              <span className="fs-hv-status">● Flow Active</span>
            </div>
            {[
              { label: "Design new onboarding screens",  tag: "Focus",     tagCls: "fs-tag-focus", done: true  },
              { label: "Review pull requests #42–#45",   tag: "Review",    tagCls: "fs-tag-review", done: true  },
              { label: "Write weekly retrospective",     tag: "Deep work", tagCls: "fs-tag-deep",   done: false },
              { label: "Prepare Q3 roadmap draft",       tag: "Focus",     tagCls: "fs-tag-focus",  done: false },
            ].map((t, i) => (
              <div className="fs-task-row" key={i}>
                <div className={`fs-task-check${t.done ? " done" : ""}`} />
                <span className={`fs-task-label${t.done ? " done" : ""}`}>{t.label}</span>
                <span className={`fs-task-tag ${t.tagCls}`}>{t.tag}</span>
              </div>
            ))}
          </div>
          <div className="fs-stat-pill fs-stat-pill-left">
            <div className="fs-stat-val">3.2h</div>
            <div className="fs-stat-lbl">Deep focus today</div>
          </div>
          <div className="fs-stat-pill fs-stat-pill-right">
            <div className="fs-stat-val">94%</div>
            <div className="fs-stat-lbl">Flow streak</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="fs-section">
        <div className="fs-section-label">Why FlowState</div>
        <h2 className="fs-section-title">Built for the way deep thinkers actually work</h2>
        <p className="fs-section-sub">Every feature is designed to reduce friction and keep you in the zone — not pull you out of it.</p>

        <div className="fs-features-grid">
          {features.map((f) => (
            <div className="fs-feat-card" key={f.title}>
              <div className="fs-feat-icon">
                <Icon name={f.icon} />
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>

      </section>

      {/* Testimonials */}

      {/* Footer */}
      <footer className="fs-footer">
        <div className="fs-foot-left">
          <span className="fs-foot-logo">FlowState</span>
          <span className="fs-foot-copy">© 2026</span>
        </div>
        <div className="fs-foot-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Changelog</a>
          <a href="#">Contact</a>
        </div>
      </footer>
    </div>
  );
}