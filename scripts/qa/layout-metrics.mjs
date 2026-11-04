export function layoutMetrics(page) {
  return page.evaluate(() => {
    const smallText = [];
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
    );
    let minimumTextPx = null;
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const parent = node.parentElement;
      const text = node.textContent.trim();
      if (
        !text ||
        !parent ||
        parent.closest("script, style, option, svg") ||
        !parent.checkVisibility({
          visibilityProperty: true,
          opacityProperty: true,
        })
      )
        continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      if (!range.getClientRects().length) continue;
      const style = getComputedStyle(parent);
      const size = Number.parseFloat(style.fontSize);
      minimumTextPx =
        minimumTextPx === null ? size : Math.min(minimumTextPx, size);
      const upper =
        style.textTransform === "uppercase" ||
        (text === text.toUpperCase() && text !== text.toLowerCase());
      if (
        size < (upper && Number.parseFloat(style.letterSpacing) > 0 ? 11 : 12)
      ) {
        smallText.push({
          text: text.slice(0, 80),
          size,
          id: parent.id,
          className: parent.className,
        });
      }
    }
    const rect = (selector) => {
      const box = document.querySelector(selector)?.getBoundingClientRect();
      return box
        ? {
            top: Math.round(box.top + scrollY),
            width: Math.round(box.width),
            height: Math.round(box.height),
          }
        : null;
    };
    return {
      minimumTextPx,
      smallText,
      horizontalOverflow: Math.max(
        0,
        document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      ),
      scene: rect(".scene-card"),
      viewport: rect("#viewport"),
      left: rect(".left-panel"),
      center: rect(".center-panel"),
      right: rect(".right-panel"),
      analysis: rect(".analysis-band"),
      visibleLesson: Boolean(document.querySelector("#lesson-panel[open]")),
      stickyColony: document.querySelector(".right-panel")?.checkVisibility()
        ? getComputedStyle(document.querySelector(".right-panel")).position ===
          "sticky"
        : false,
    };
  });
}
