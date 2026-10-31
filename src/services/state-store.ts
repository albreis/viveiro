const KEY = "viveiro-v1";

export function readState<T>(): T | null {
  try {
    const value = localStorage.getItem(KEY);
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
}

export function writeState(value: unknown): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
