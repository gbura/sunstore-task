import { describe, expect, it } from 'vitest'
import { formatToDecimal } from '../server/utils/formatToDecimal'

describe('formatToDecimal', () => {
  it('should format value to decimal [P]', () => {
    const value = '10,5'

    const formattedValue = formatToDecimal(value)

    expect(formattedValue).toBe(10.5)
  })

  it('should preserve a value that is already decimal [P]', () => {
    const value = '10.5'

    const formattedValue = formatToDecimal(value)

    expect(formattedValue).toBe(10.5)
  })
})
