export function ownsSpaceKey(
  target: {
    tagName?: string;
    isContentEditable?: boolean;
    getAttribute?(name: string): string | null;
    closest?(selectors: string): unknown;
  } | null,
): boolean {
  return (
    !!target &&
    (target.isContentEditable === true ||
      Boolean(
        target.closest?.(
          "button, input, select, textarea, summary, a, dialog, [contenteditable], [role=region]",
        ),
      ) ||
      target.getAttribute?.("role") === "region" ||
      /^(INPUT|BUTTON|SELECT|TEXTAREA|SUMMARY|A|OL)$/.test(
        target.tagName ?? "",
      ))
  );
}
