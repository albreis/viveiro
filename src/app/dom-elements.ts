interface OwnedElements {
  humidity: HTMLInputElement;
  light: HTMLInputElement;
  randomness: HTMLInputElement;
  seed: HTMLInputElement;
  trails: HTMLInputElement;
  interior: HTMLInputElement;
  chart: HTMLCanvasElement;
  "help-dialog": HTMLDialogElement;
}
const tags: Record<keyof OwnedElements, string> = {
  humidity: "INPUT",
  light: "INPUT",
  randomness: "INPUT",
  seed: "INPUT",
  trails: "INPUT",
  interior: "INPUT",
  chart: "CANVAS",
  "help-dialog": "DIALOG",
};
/** Fail with the owned ID rather than silently wiring a missing/wrong control. */
export function element<K extends keyof OwnedElements>(id: K): OwnedElements[K];
export function element(id: string): HTMLElement;
export function element(id: string): HTMLElement {
  const node = document.getElementById(id);
  if (!node) throw Error("Missing interface element: " + id);
  const expected = Object.entries(tags).find(([key]) => key === id)?.[1];
  if (expected && node.tagName !== expected)
    throw Error("Wrong interface element: " + id);
  return node;
}
