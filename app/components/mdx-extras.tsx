import { Children, isValidElement, type ReactNode } from "react";

// MDX here runs with blockJS on, so components take plain string props and child elements, never {expressions}.

/** Hover/focus tooltip: <Tip text="detail">term</Tip> */
export function Tip({ text, children }: { text: string; children: ReactNode }) {
  return (
    <span className="tip" tabIndex={0}>
      {children}
      <span role="tooltip" className="tip-body">{text}</span>
    </span>
  );
}

const TONES = { key: "🔑", warn: "⚠️", tip: "💡", trap: "🪤" } as const;

/** Highlighted note: <Callout tone="warn">text</Callout> */
export function Callout({ tone = "key", children }: { tone?: keyof typeof TONES; children: ReactNode }) {
  return (
    <aside className={`callout callout-${tone}`}>
      <span aria-hidden="true" className="callout-icon">{TONES[tone]}</span>
      <div>{children}</div>
    </aside>
  );
}

/** One box in a diagram: <Flow><Step icon="📝" label="..." note="..." /></Flow> */
export function Step({ icon, label, note }: { icon: string; label: string; note?: string }) {
  return (
    <li tabIndex={note ? 0 : undefined}>
      <span aria-hidden="true" className="flow-icon">{icon}</span>
      <strong>{label}</strong>
      {note && <span className="flow-note">{note}</span>}
    </li>
  );
}

export function Flow({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <figure className="flow">
      {title && <figcaption>{title}</figcaption>}
      <ol>{children}</ol>
    </figure>
  );
}

/** Hierarchy: <Tree><Node icon label level note><Node .../></Node></Tree> */
export function Tree({ children }: { children: ReactNode }) {
  return (
    <figure className="tree">
      <ul>{children}</ul>
    </figure>
  );
}

export function Node({ icon, label, note, level, children }: { icon: string; label: string; note?: string; level?: string; children?: ReactNode }) {
  return (
    <li>
      <div className="tree-box" tabIndex={note ? 0 : undefined}>
        <span aria-hidden="true" className="flow-icon">{icon}</span>
        <span>
          {level && <span className="tree-level">{level}</span>}
          <strong>{label}</strong>
          {note && <span className="tree-note">{note}</span>}
        </span>
      </div>
      {children && <ul>{children}</ul>}
    </li>
  );
}

/** Proportion bar: <Split unit=" ข้อ"><Seg label="..." value="20" /></Split> */
export function Seg(_: { label: string; value: string }) {
  return null; // data holder, rendered by Split
}

export function Split({ unit = "", children }: { unit?: string; children: ReactNode }) {
  const items = Children.toArray(children)
    .filter(isValidElement<{ label: string; value: string }>)
    .map((c) => ({ label: c.props.label, value: Number(c.props.value) }));
  const total = items.reduce((n, i) => n + i.value, 0);
  return (
    <figure className="split">
      <div className="split-bar" role="img" aria-label={items.map((i) => `${i.label} ${i.value}${unit}`).join(", ")}>
        {items.map((i, n) => (
          <span key={i.label} className={`split-seg s${n % 4}`} style={{ flexGrow: i.value }} title={`${i.label}: ${i.value}${unit}`}>
            {i.value}
          </span>
        ))}
      </div>
      <ul>
        {items.map((i, n) => (
          <li key={i.label}><span className={`dot s${n % 4}`} />{i.label} <b>{Math.round((i.value / total) * 100)}%</b></li>
        ))}
      </ul>
    </figure>
  );
}
