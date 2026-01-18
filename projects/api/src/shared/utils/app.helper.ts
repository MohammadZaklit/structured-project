export const SELECT_COMPONENTS_ARRAY = [2, 13, 14, 15, 16, 22, 23, 26];
export const SELECT_COMPONENT_IDS = new Set(SELECT_COMPONENTS_ARRAY);

export function isMultiSelectComponent(componentId: number): boolean {
  return SELECT_COMPONENT_IDS.has(Number(componentId));
}

export function migrationTimestamp(): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');

  const YYYY = now.getFullYear();
  const MM = pad(now.getMonth() + 1);
  const DD = pad(now.getDate());
  const HH = pad(now.getHours());
  const mm = pad(now.getMinutes());
  const SS = pad(now.getSeconds());

  return `${YYYY}${MM}${DD}${HH}${mm}${SS}`;
}
