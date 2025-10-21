'use client';

import { useState } from 'react';

const STEPS = ['Step 1', 'Step 2', 'Step 3'] as const;

export default function Home() {
  const [activeStep, setActiveStep] = useState<number>(1); // 1..3

  const contentByStep: Record<number, string[]> = {
    1: ['Open VSCode', 'Create Next.js app', 'Run dev server', 'Check /about'],
    2: ['Install VSCode', 'Install Chrome', 'Install Node', 'etc'],
    3: ['Write HTML generator', 'Add Save button', 'Run tests', 'Dockerize'],
  };

  const generatedOutput = `<!doctype html>
<html>
  <head><meta charset="utf-8"><title>Output</title></head>
  <body>
    <h1>Escape Room</h1>
    <p>Manual timer + stages go here…</p>
    <script>/* inline JS here */</script>
  </body>
</html>`.replace(/\n/g, '\n');

  return (
    <section className="grid">
      {/* LEFT: Tabs/Steps/Content */}
      <div className="left">
        <h2 className="section-title">Tabs</h2>

        <div className="tabs-headers">
          <span>Tabs Headers:</span>
          <button className="add" aria-label="Add tab" onClick={() => alert('Add tab placeholder')}>[+]</button>
        </div>

        <ul className="steps" role="tablist" aria-label="Steps">
          {STEPS.map((label, i) => {
            const n = i + 1;
            const active = n === activeStep;
            return (
              <li key={n}>
                <button
                  role="tab"
                  aria-selected={active}
                  className={active ? 'step active' : 'step'}
                  onClick={() => setActiveStep(n)}
                >
                  {label}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="panel" aria-live="polite">
          <div className="panel-title">Tabs Content</div>
          <div className="panel-body">
            <div className="panel-step">Step {activeStep}:</div>
            <ol>
              {contentByStep[activeStep].map((line, idx) => <li key={idx}>{line}</li>)}
            </ol>
          </div>
        </div>
      </div>

      {/* RIGHT: Output box */}
      <div className="right">
        <div className="output-title">Output</div>
        <div className="output-box">
          <pre className="code" aria-label="Generated HTML/JS">{generatedOutput}</pre>
        </div>
      </div>
    </section>
  );
}
