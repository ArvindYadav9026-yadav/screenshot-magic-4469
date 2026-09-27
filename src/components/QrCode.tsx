/**
 * Deterministic decorative QR-style block for prototype traceability tags.
 * Not a scannable code — it visualises the traceability ID.
 */
export function QrCode({ value, size = 128 }: { value: string; size?: number }) {
  const grid = 21;
  let seed = 0;
  for (let i = 0; i < value.length; i++) seed = (seed * 31 + value.charCodeAt(i)) % 100000;

  const cells: boolean[] = [];
  let state = seed || 7;
  for (let i = 0; i < grid * grid; i++) {
    state = (state * 1103515245 + 12345) % 2147483648;
    cells.push((state >> 16) % 100 < 48);
  }

  const isFinder = (r: number, c: number) => {
    const inBox = (br: number, bc: number) => r >= br && r < br + 7 && c >= bc && c < bc + 7;
    return inBox(0, 0) || inBox(0, grid - 7) || inBox(grid - 7, 0);
  };
  const finderOn = (r: number, c: number) => {
    const rr = r < 7 ? r : r - (grid - 7);
    const cc = c < 7 ? c : c - (grid - 7);
    const ring = Math.max(Math.abs(rr - 3), Math.abs(cc - 3));
    return ring === 3 || ring <= 1;
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${grid} ${grid}`}
      role="img"
      aria-label={`Traceability code ${value}`}
      className="rounded-lg bg-card p-0.5"
    >
      {Array.from({ length: grid }).map((_, r) =>
        Array.from({ length: grid }).map((__, c) => {
          const on = isFinder(r, c) ? finderOn(r, c) : cells[r * grid + c];
          if (!on) return null;
          return (
            <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="currentColor" />
          );
        }),
      )}
    </svg>
  );
}
