import { describe, expect, it } from 'vitest'
import { extractSpecs } from '../server/utils/extractSpecs'

describe('extractSpecs', () => {
  it('should extract capacity from a product description with a decimal comma [P]', () => {
    const name = 'Home battery'
    const description = 'Stores 10,5 kWh of energy'

    expect(extractSpecs(name, description)).toEqual({
      capacityKWh: 10.5,
      powerW: null,
    })
  })

  it.each([
    ['Panel 450Wp', 450],
    ['Inverter 5 kW', 5000],
    ['Panel 440 W', 440],
  ])('should convert power in "%s" to watts [P]', (name, expectedPower) => {
    const powerW = extractSpecs(name).powerW

    expect(powerW).toBe(expectedPower)
  })

  it('should return null when the name and description contain no supported specification [N]', () => {
    const name = 'Connector 10-pack'
    const description = 'Replacement accessory'

    expect(extractSpecs(name, description)).toEqual({
      capacityKWh: null,
      powerW: null,
    })
  })
})
