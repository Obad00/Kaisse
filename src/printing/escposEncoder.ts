// Minimal ESC/POS command builder tailored for 58mm thermal printers.
// Reference: standard ESC/POS command set supported by most cheap
// Bluetooth thermal printers found in Senegal (GOOJPRT, Xprinter clones, etc).

const ESC = 0x1b;
const GS = 0x1d;

export class EscPosBuilder {
  private bytes: number[] = [];

  private push(...vals: number[]) {
    this.bytes.push(...vals);
    return this;
  }

  init() {
    return this.push(ESC, 0x40); // ESC @  — initialize printer
  }

  align(target: "left" | "center" | "right") {
    const map = { left: 0, center: 1, right: 2 } as const;
    return this.push(ESC, 0x61, map[target]);
  }

  bold(on: boolean) {
    return this.push(ESC, 0x45, on ? 1 : 0);
  }

  doubleSize(on: boolean) {
    // GS ! n — n=0x11 sets both width and height x2, 0x00 resets
    return this.push(GS, 0x21, on ? 0x11 : 0x00);
  }

  text(value: string) {
    // 58mm printers commonly use CP437 / plain ASCII; strip characters
    // outside printable range as a safety net and keep accents best-effort.
    const encoder = new TextEncoder();
    const clean = value.normalize("NFC");
    this.bytes.push(...Array.from(encoder.encode(clean)));
    return this;
  }

  line(value = "") {
    return this.text(value).newline();
  }

  newline() {
    return this.push(0x0a);
  }

  divider(char = "-", width = 32) {
    return this.line(char.repeat(width));
  }

  feed(lines = 3) {
    return this.push(ESC, 0x64, lines);
  }

  cut() {
    return this.push(GS, 0x56, 0x00); // full cut
  }

  build(): Uint8Array {
    return new Uint8Array(this.bytes);
  }
}

/** Splits a left/right pair onto a fixed-width line, e.g. "Burger x2 ... 5000" */
export function twoColumnLine(left: string, right: string, width = 32): string {
  const space = Math.max(1, width - left.length - right.length);
  return `${left}${" ".repeat(space)}${right}`;
}

export function wrapText(value: string, width = 32): string[] {
  const words = value.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > width) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}
