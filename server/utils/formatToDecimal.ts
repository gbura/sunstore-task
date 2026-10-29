export function formatToDecimal(value: string): number {
  return Number(value.replace(',', '.'))
}
