export function getColor(str: string, palette: Record<string, string> = {}) {
  return (
    typeof str === 'string' && palette?.[str] ? palette[str] : str
  );
}
