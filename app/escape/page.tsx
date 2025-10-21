'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type StageKey = 'format' | 'debug' | 'numbers' | 'port';
const STAGES: { key: StageKey; title: string; hint?: string }[] = [
  { key: 'format', title: 'Format code correctly' },
  { key: 'debug',  title: 'Click the correct debug hotspot', hint: 'Click the glowing chip!' },
  { key: 'numbers',title: 'Generate numbers 0…1000' },
  { key: 'port',   title: 'Port data: CSV → JSON' },
];

export default function EscapeRoom() {
  // --- timer ---
  const [manualStart, setManualStart] = useState(false);
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!manualStart) return;
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [manualStart]);
  const reset = () => { setManualStart(false); setSeconds(0); };

  // --- stage state ---
  const [i, setI] = useState(0);
  const [output, setOutput] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  const mmss = useMemo(() => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  }, [seconds]);

  // Stage actions (also used by tests via window.__escape_auto)
  function formatCodeAction() {
    const ugly = 'function add (a,b){return a+ b}';
    const pretty = `function add(a, b) {\n  return a + b;\n}`;
    setOutput(pretty);
    return pretty;
  }

  function debugClickAction(correct: boolean) {
    const res = correct ? 'Debug OK: breakpoint hit' : 'Wrong area – try the glowing chip';
    setOutput(res);
    return res;
  }

  function numbersAction() {
    const arr = Array.from({ length: 1001 }, (_, n) => n);
    const txt = arr.join(',');
    setOutput(txt);
    return txt;
  }

  function portCsvToJsonAction() {
    const csv = 'id,name\n1,Ada\n2,Linus\n3,Grace';
    const rows = csv.split('\n');
    const [h, ...rest] = rows;
    const cols = h.split(',');
    const json = rest.map(r => {
      const vals = r.split(',');
      return Object.fromEntries(cols.map((c, idx) => [c, isNaN(Number(vals[idx])) ? vals[idx] : Number(vals[idx])]));
    });
    const txt = JSON.stringify(json, null, 2);
    setOutput(txt);
    return txt;
  }

  // expose simple auto-runner for Playwright (3 examples)
  useEffect(() => {
    (window as any).__escape_auto = {
      runAll: () => [formatCodeAction(), numbersAction(), portCsvToJsonAction()],
      save: saveSnippet
    };
  }, []);

  async function saveSnippet() {
    const title = `Escape-${new Date().toISOString()}`;
    const res = await fetch('/api/snippets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, html: output })
    });
    if (!res.ok) { setMsg('Save failed'); return false; }
    setMsg('Saved to DB');
    return true;
  }

  // hotspot position for debug stage
  const imgRef = useRef<HTMLDivElement>(null);
  function onRoomClick(e: React.MouseEvent) {
    if (STAGES[i].key !== 'debug') return;
    const box = imgRef.current?.getBoundingClientRect();
    if (!box) return;
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    // Correct hotspot (roughly 40x40px box near right side)
    const correct = x > box.width * 0.68 && x < box.width * 0.68 + 60 && y > box.height * 0.42 && y < box.height * 0.42 + 60;
    debugClickAction(correct);
  }

  return (
    <div className="escape-root">
      {/* background image layer */}
      <div className="escape-bg" aria-hidden />

      <div className="escape-ui">
        <header className="escape-row">
          <h1>Escape Room</h1>
          <div className="timer">
            <span>Timer: {mmss}</span>
            <button onClick={() => setManualStart(true)}>Start</button>
            <button onClick={() => setManualStart(false)}>Stop</button>
            <button onClick={reset}>Reset</button>
          </div>
        </header>

        <div className="escape-row stages">
          <ol className="stage-list">
            {STAGES.map((s, idx) => (
              <li key={s.key}>
                <button className={idx === i ? 'stage active' : 'stage'} onClick={() => setI(idx)}>{s.title}</button>
              </li>
            ))}
          </ol>

          <div className="stage-content">
            <h3>{STAGES[i].title}</h3>

            {STAGES[i].key === 'format' && (
              <div>
                <p>Auto-format a small JS function.</p>
                <button onClick={formatCodeAction}>Run</button>
              </div>
            )}

            {STAGES[i].key === 'debug' && (
              <div>
                <p>{STAGES[i].hint}</p>
                <div ref={imgRef} className="room-img" onClick={onRoomClick} role="button" aria-label="Escape room image" />
              </div>
            )}

            {STAGES[i].key === 'numbers' && (
              <div>
                <p>Generate numbers from 0 to 1000, comma-separated.</p>
                <button onClick={numbersAction}>Run</button>
              </div>
            )}

            {STAGES[i].key === 'port' && (
              <div>
                <p>Convert CSV to JSON (id,name).</p>
                <button onClick={portCsvToJsonAction}>Run</button>
              </div>
            )}

            <div className="output-wrap">
              <div className="output-title">Output</div>
              <pre className="output" aria-live="polite">{output}</pre>
            </div>

            <div className="actions">
              <button onClick={saveSnippet}>Save Output</button>
              {msg && <span className="msg">{msg}</span>}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
