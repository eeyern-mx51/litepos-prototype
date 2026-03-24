import { createContext, useContext, useState, useCallback, useRef } from "react";
import tokens from "../theme/tokens";

// ══════════════════════════════════════════════════════════════════════
// Context — lets any input in the tree show/hide the keyboard
// ══════════════════════════════════════════════════════════════════════

const SoftKeyboardContext = createContext(null);

export function useSoftKeyboard() {
  return useContext(SoftKeyboardContext);
}

/**
 * Wrap the device frame content with this provider.
 * `enabled` should be true when keyboardType === "onscreen".
 */
export function SoftKeyboardProvider({ children, enabled }) {
  const [visible, setVisible] = useState(false);
  const [layout, setLayout] = useState("alpha"); // "alpha" | "numeric"
  const inputRef = useRef(null); // current DOM <input>/<textarea>

  const show = useCallback((layoutType, inputEl) => {
    inputRef.current = inputEl;
    setLayout(layoutType);
    setVisible(true);
  }, []);

  const hide = useCallback(() => {
    inputRef.current = null;
    setVisible(false);
  }, []);

  return (
    <SoftKeyboardContext.Provider value={{ visible, layout, setLayout, inputRef, show, hide, enabled }}>
      {children}
    </SoftKeyboardContext.Provider>
  );
}

// ══════════════════════════════════════════════════════════════════════
// Keyboard constants & layouts (Gboard-inspired)
// ══════════════════════════════════════════════════════════════════════

const KB_BG = "#1B1B1F";
const KEY_BG = "#3C3C40";
const KEY_SP = "#2A2A2E"; // special keys
const KEY_TEXT = "#E8E8EA";
const KEY_SP_TEXT = "#B0B0B4";
const KEY_H = 40;
const GAP = 5;
const KB_HEIGHT = 232;

const ALPHA = [
  ["q","w","e","r","t","y","u","i","o","p"],
  ["a","s","d","f","g","h","j","k","l"],
  ["{shift}","z","x","c","v","b","n","m","{bksp}"],
  ["{123}",",","{space}",".","{done}"],
];

const NUMERIC = [
  ["1","2","3","4","5","6","7","8","9","0"],
  ["-","/",":",";","(",")","$","&","@","\""],
  ["{#+=}",".",",","?","!","'","{bksp}"],
  ["{abc}",",","{space}",".","{done}"],
];

const SYMBOLS = [
  ["[","]","{","}","#","%","^","*","+","="],
  ["_","\\","|","~","<",">","€","£","¥","·"],
  ["{123}",".",",","?","!","'","{bksp}"],
  ["{abc}",",","{space}",".","{done}"],
];

// ══════════════════════════════════════════════════════════════════════
// SVG icons for special keys
// ══════════════════════════════════════════════════════════════════════

function ShiftIcon({ active, capsLock }) {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24"
      fill={capsLock ? tokens.color.fg.brand : active ? KEY_TEXT : KEY_SP_TEXT}
    >
      {capsLock
        ? <path d="M12 2l-8 9h5v5h6v-5h5L12 2zm-4 18h8v2H8v-2z" />
        : <path d="M12 4l-8 8h5v8h6v-8h5z" />}
    </svg>
  );
}

function BkspIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill={KEY_SP_TEXT}>
      <path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 12.59L17.59 17 14 13.41 10.41 17 9 15.59 12.59 12 9 8.41 10.41 7 14 10.59 17.59 7 19 8.41 15.41 12 19 15.59z" />
    </svg>
  );
}

function DoneIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="#fff">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  );
}

// ══════════════════════════════════════════════════════════════════════
// Key styling helper
// ══════════════════════════════════════════════════════════════════════

function ks(flex, variant = "default", active = false) {
  const bg = variant === "accent"
    ? tokens.color.bg.action.primary.default
    : variant === "special"
      ? active ? `${tokens.color.fg.brand}30` : KEY_SP
      : KEY_BG;
  return {
    flex,
    height: KEY_H,
    borderRadius: 6,
    border: active && variant === "special" ? `1px solid ${tokens.color.fg.brand}60` : "none",
    background: bg,
    color: variant === "accent" ? "#fff" : KEY_TEXT,
    fontSize: 17,
    fontWeight: 400,
    fontFamily: "'Figtree', sans-serif",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    minWidth: 0,
    WebkitTapHighlightColor: "transparent",
    touchAction: "manipulation",
    userSelect: "none",
  };
}

// ══════════════════════════════════════════════════════════════════════
// Main keyboard component
// ══════════════════════════════════════════════════════════════════════

export default function SoftKeyboard() {
  const ctx = useSoftKeyboard();
  const [shifted, setShifted] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [mode, setMode] = useState("alpha"); // "alpha" | "num" | "sym"
  const lastShiftTime = useRef(0);

  if (!ctx?.visible) return null;

  const isAlpha = ctx.layout === "alpha" ? mode === "alpha" : false;
  const rows = ctx.layout === "numeric"
    ? (mode === "sym" ? SYMBOLS : NUMERIC)
    : (mode === "num" ? NUMERIC : mode === "sym" ? SYMBOLS : ALPHA);

  // ── DOM input manipulation ──────────────────────────────────────

  const typeChar = (char) => {
    const el = ctx.inputRef.current;
    if (!el) return;

    const display = (shifted || capsLock) && mode === "alpha" ? char.toUpperCase() : char;
    const proto = el.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, "value").set;

    const s = el.selectionStart ?? el.value.length;
    const e = el.selectionEnd ?? el.value.length;
    setter.call(el, el.value.slice(0, s) + display + el.value.slice(e));
    el.dispatchEvent(new Event("input", { bubbles: true }));

    requestAnimationFrame(() => {
      const p = s + display.length;
      el.selectionStart = el.selectionEnd = p;
    });

    if (shifted && !capsLock) setShifted(false);
  };

  const backspace = () => {
    const el = ctx.inputRef.current;
    if (!el || !el.value) return;

    const proto = el.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, "value").set;

    const s = el.selectionStart ?? el.value.length;
    const e = el.selectionEnd ?? el.value.length;
    let nv, np;
    if (s !== e) { nv = el.value.slice(0, s) + el.value.slice(e); np = s; }
    else if (s > 0) { nv = el.value.slice(0, s - 1) + el.value.slice(s); np = s - 1; }
    else return;

    setter.call(el, nv);
    el.dispatchEvent(new Event("input", { bubbles: true }));
    requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = Math.max(0, np); });
  };

  const handleShift = () => {
    const now = Date.now();
    if (now - lastShiftTime.current < 400 && shifted) {
      setCapsLock(true);
      setShifted(true);
    } else if (capsLock) {
      setCapsLock(false);
      setShifted(false);
    } else {
      setShifted(!shifted);
    }
    lastShiftTime.current = now;
  };

  const handleDone = () => {
    const el = ctx.inputRef.current;
    if (el) el.blur();
    ctx.hide();
  };

  // Prevent mousedown from stealing focus from the input
  const pd = (e) => e.preventDefault();

  // ── Render key ─────────────────────────────────────────────────

  const renderKey = (key) => {
    if (key === "{shift}") {
      const active = shifted || capsLock;
      return (
        <button key="shift" onMouseDown={pd} onClick={handleShift} style={ks(1.4, "special", active)}>
          <ShiftIcon active={active} capsLock={capsLock} />
        </button>
      );
    }
    if (key === "{bksp}") {
      return (
        <button key="bksp" onMouseDown={pd} onClick={backspace} style={ks(1.4, "special")}>
          <BkspIcon />
        </button>
      );
    }
    if (key === "{123}") {
      return (
        <button key="123" onMouseDown={pd} onClick={() => setMode("num")} style={ks(1.4, "special")}>
          <span style={{ fontSize: 13, fontWeight: 600, color: KEY_SP_TEXT }}>123</span>
        </button>
      );
    }
    if (key === "{#+=}") {
      return (
        <button key="sym" onMouseDown={pd} onClick={() => setMode("sym")} style={ks(1.4, "special")}>
          <span style={{ fontSize: 12, fontWeight: 600, color: KEY_SP_TEXT }}>#+=</span>
        </button>
      );
    }
    if (key === "{abc}") {
      return (
        <button key="abc" onMouseDown={pd} onClick={() => setMode("alpha")} style={ks(1.4, "special")}>
          <span style={{ fontSize: 13, fontWeight: 600, color: KEY_SP_TEXT }}>ABC</span>
        </button>
      );
    }
    if (key === "{space}") {
      return (
        <button key="space" onMouseDown={pd} onClick={() => typeChar(" ")}
          style={{ ...ks(4), borderRadius: 20, background: KEY_SP }}
        >
          <span style={{ fontSize: 11, letterSpacing: 1, color: KEY_SP_TEXT }}>space</span>
        </button>
      );
    }
    if (key === "{done}") {
      return (
        <button key="done" onMouseDown={pd} onClick={handleDone} style={ks(1.4, "accent")}>
          <DoneIcon />
        </button>
      );
    }

    // Regular character
    const display = (shifted || capsLock) && mode === "alpha" ? key.toUpperCase() : key;
    return (
      <button key={key + mode} onMouseDown={pd} onClick={() => typeChar(key)} style={ks(1)}>
        {display}
      </button>
    );
  };

  // ── Render ─────────────────────────────────────────────────────

  return (
    <div
      style={{
        height: KB_HEIGHT,
        background: KB_BG,
        padding: "6px 3px 8px",
        display: "flex",
        flexDirection: "column",
        gap: GAP,
        justifyContent: "flex-end",
        flexShrink: 0,
        borderTop: "1px solid #333",
      }}
    >
      {/* Suggestion strip / mode indicator */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          height: 28,
          paddingBottom: 2,
        }}
      >
        {ctx.layout === "numeric" ? (
          <span style={{ fontSize: 10, color: KEY_SP_TEXT, letterSpacing: 0.5 }}>NUMERIC</span>
        ) : (
          <>
            <button onMouseDown={pd} onClick={() => typeChar("the ")}
              style={{ height: 26, padding: "0 12px", borderRadius: 13, border: "none", background: KEY_SP, color: KEY_SP_TEXT, fontSize: 12, fontFamily: "inherit", cursor: "pointer" }}>
              the
            </button>
            <button onMouseDown={pd} onClick={() => typeChar("and ")}
              style={{ height: 26, padding: "0 12px", borderRadius: 13, border: "none", background: KEY_SP, color: KEY_SP_TEXT, fontSize: 12, fontFamily: "inherit", cursor: "pointer" }}>
              and
            </button>
            <button onMouseDown={pd} onClick={() => typeChar("is ")}
              style={{ height: 26, padding: "0 12px", borderRadius: 13, border: "none", background: KEY_SP, color: KEY_SP_TEXT, fontSize: 12, fontFamily: "inherit", cursor: "pointer" }}>
              is
            </button>
          </>
        )}
      </div>

      {rows.map((row, ri) => (
        <div
          key={ri}
          style={{
            display: "flex",
            gap: GAP,
            justifyContent: "center",
            paddingLeft: mode === "alpha" && ri === 1 ? 14 : 0,
            paddingRight: mode === "alpha" && ri === 1 ? 14 : 0,
          }}
        >
          {row.map((k) => renderKey(k))}
        </div>
      ))}
    </div>
  );
}
