export const STATUS_COLOR: Record<number, string> = {
  0: "#23a559",
  1: "#f0b232",
  2: "#f23f43",
  3: "#80848e",
};

export function statusLabel(status: number) {
  return ["Online", "Ausente", "Não perturbe", "Offline"][status] ?? "Offline";
}
