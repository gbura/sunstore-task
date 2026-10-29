import { formatToDecimal } from './formatToDecimal'

export function extractSpecs(name: string, description = '') {
  const source = `${name} ${description}`

  // Prefer a specification in the name, then fall back to the product description.
  const capacity = source.match(/\b(\d+(?:[.,]\d+)?)\s*kWh\b/i)
  const capacityValue = capacity?.[1]

  const power = source.match(/\b(\d+(?:[.,]\d+)?)\s*(kW|Wp|W)\b/i)
  const powerValue = power?.[1]
  const powerUnit = power?.[2]

  return {
    capacityKWh: capacityValue ? formatToDecimal(capacityValue) : null,
    powerW:
      powerValue && powerUnit ? formatToDecimal(powerValue) * (powerUnit.toLowerCase() === 'kw' ? 1000 : 1) : null,
  }
}
