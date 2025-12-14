
export function generateId(prefix?: string): string {
  const id = Math.random().toString(36).substring(2, 9);
  return prefix ? `${prefix}_${id}` : id;
}

export function generateNumericId(length: number = 6): number {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
