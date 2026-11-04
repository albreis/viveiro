export function installPanelTabs(): void {
  const tabs = Array.from(
    document.querySelectorAll<HTMLButtonElement>(".panel-tabs [role=tab]"),
  );
  const activate = (selected: HTMLButtonElement) => {
    for (const tab of tabs) {
      const active = tab === selected;
      tab.tabIndex = active ? 0 : -1;
      tab.setAttribute("aria-selected", String(active));
      const panel = document.getElementById(
        tab.getAttribute("aria-controls") ?? "",
      );
      if (panel) panel.hidden = !active;
    }
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activate(tab));
    tab.addEventListener("keydown", (event) => {
      let next: number;
      switch (event.key) {
        case "ArrowLeft":
          next = (index + tabs.length - 1) % tabs.length;
          break;
        case "ArrowRight":
          next = (index + 1) % tabs.length;
          break;
        case "Home":
          next = 0;
          break;
        case "End":
          next = tabs.length - 1;
          break;
        default:
          return;
      }
      event.preventDefault();
      event.stopPropagation();
      activate(tabs[next]);
      tabs[next].focus();
    });
  });
}
