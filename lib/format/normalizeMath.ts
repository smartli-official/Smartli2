/**
 * The app has no LaTeX renderer, so models must write formulas in plain
 * Unicode (H₂O, CO₂, x²). When they emit LaTeX anyway ($H_2O$, $$...$$,
 * \ce{...}), ReactMarkdown prints the dollar signs literally — the bug in
 * the screenshot. This normalizer converts those leftovers to readable
 * Unicode before rendering. Money ($20) is left untouched.
 */

const SUBSCRIPT_MAP: Record<string, string> = {
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
  '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
  '+': '₊', '-': '₋', '(': '₍', ')': '₎',
  a: 'ₐ', e: 'ₑ', o: 'ₒ', x: 'ₓ', h: 'ₕ', k: 'ₖ', l: 'ₗ',
  m: 'ₘ', n: 'ₙ', p: 'ₚ', s: 'ₛ', t: 'ₜ',
};

const SUPERSCRIPT_MAP: Record<string, string> = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
  '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  '+': '⁺', '-': '⁻', '(': '⁽', ')': '⁾',
  a: 'ᵃ', b: 'ᵇ', c: 'ᶜ', d: 'ᵈ', e: 'ᵉ', f: 'ᶠ', g: 'ᵍ', h: 'ʰ',
  i: 'ⁱ', j: 'ʲ', k: 'ᵏ', l: 'ˡ', m: 'ᵐ', n: 'ⁿ', o: 'ᵒ', p: 'ᵖ',
  r: 'ʳ', s: 'ˢ', t: 'ᵗ', u: 'ᵘ', v: 'ᵛ', w: 'ʷ', x: 'ˣ', y: 'ʸ', z: 'ᶻ',
};

const GREEK_MAP: Record<string, string> = {
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε',
  zeta: 'ζ', eta: 'η', theta: 'θ', kappa: 'κ', lambda: 'λ',
  mu: 'μ', nu: 'ν', pi: 'π', rho: 'ρ', sigma: 'σ', tau: 'τ',
  phi: 'φ', chi: 'χ', psi: 'ψ', omega: 'ω',
  Delta: 'Δ', Sigma: 'Σ', Omega: 'Ω',
};

const sub = (s: string) =>
  s.split('').map((c) => SUBSCRIPT_MAP[c] ?? c).join('');
const sup = (s: string) =>
  s.split('').map((c) => SUPERSCRIPT_MAP[c] ?? c).join('');

/** Convert the *inside* of a $...$ segment to plain Unicode. */
function convertInner(inner: string): string {
  let s = inner;
  // \ce{H2O} — digits after letters are subscripts (H2O → H₂O)
  s = s.replace(/\\ce\{([^}]*)\}/g, (_, formula: string) =>
    formula.replace(/([A-Za-z])(\d+)/g, (_, l: string, d: string) => l + sub(d)),
  );
  // Formatting wrappers carry no meaning once delimiters are gone
  s = s.replace(/\\(mathrm|mathit|mathbf|text|ce)\{([^}]*)\}/g, '$2');
  s = s.replace(/\\([a-zA-Z]+)/g, (m, name: string) => GREEK_MAP[name] ?? '');
  // Braced sub/superscripts first, then single-char ones
  s = s.replace(/_\{([^}]*)\}/g, (_, g: string) => sub(g));
  s = s.replace(/\^\{([^}]*)\}/g, (_, g: string) => sup(g));
  s = s.replace(/_([0-9a-zA-Z+\-()])/g, (_, c: string) => SUBSCRIPT_MAP[c] ?? c);
  s = s.replace(/\^([0-9a-zA-Z+\-()])/g, (_, c: string) => SUPERSCRIPT_MAP[c] ?? c);
  // Bare formula digits inside math mode: CO2 → CO₂, mc2 → mc₂
  s = s.replace(/([A-Za-z])(\d+)/g, (_, l: string, d: string) => l + sub(d));
  // Thin spaces / escaped chars
  s = s.replace(/\\[,;:!\s]/g, '');
  s = s.replace(/\\/g, '');
  return s;
}

/**
 * Replace $...$ / $$...$$ math segments with Unicode equivalents.
 * Segments without math markers (plain money like "$20 and $30") pass
 * through untouched.
 */
export function normalizeMathDelimiters(text: string): string {
  if (!text || !text.includes('$')) return text;
  // Display math first so its inner $...$ isn't matched separately
  let out = text.replace(/\$\$([\s\S]+?)\$\$/g, (_, inner: string) =>
    convertInner(inner),
  );
  out = out.replace(/\$([^$\n]+?)\$/g, (whole, inner: string) => {
    if (!/[_^\\]/.test(inner) && !/[A-Za-z]\d/.test(inner)) return whole;
    return convertInner(inner);
  });
  return out;
}
