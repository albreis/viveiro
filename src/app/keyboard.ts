export function ownsSpaceKey(
  target: { tagName?: string; isContentEditable?: boolean } | null,
): boolean {
  return (
    !!target &&
    (target.isContentEditable === true ||
      /^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(target.tagName ?? ""))
  );
}
