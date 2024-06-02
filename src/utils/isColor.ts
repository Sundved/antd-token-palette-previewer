export function isColor(str: string, palette: Record<string, string> = {}) {
  return (
    typeof str === 'string' && (str.startsWith('rgb') || str.startsWith('#') || isPaletteColor(str, palette))
  );
}

export function isPaletteColor(str: string | number | boolean, palette: Record<string, string> = {}) {
  return (
    typeof str === 'string' && Boolean(palette?.[str])
  );
}
