export function installWorkbenchDocking(): void {
  // Tall columns move with the page until their bottom is visible.
  const observer = new ResizeObserver((entries) => {
    for (const { target, borderBoxSize } of entries) {
      const panel = target as HTMLElement;
      panel.style.setProperty(
        "--dock-height",
        borderBoxSize[0].blockSize + "px",
      );
    }
  });
  document
    .querySelectorAll(".workspace-scene > *, .secondary-controls > *")
    .forEach((panel) => observer.observe(panel));
  window.addEventListener("pagehide", () => observer.disconnect(), {
    once: true,
  });
}
