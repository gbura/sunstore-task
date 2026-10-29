import { describe, expect, it } from 'vitest'
import type { Product } from '../shared/types/catalog.types'
import { filterProducts, type ProductFilters } from '../server/utils/filterProducts'

const defaultFilters: ProductFilters = {
  q: '',
  manufacturer: '',
  category: '',
  minPrice: 0,
  maxPrice: Number.POSITIVE_INFINITY,
  sort: 'name',
}

const products: Product[] = [
  {
    name: 'Panel 450',
    manufacturer: 'SunPower',
    category: 'solar panel',
    description: 'High-efficiency module',
    price: 500,
    powerW: 450,
    capacityKWh: null,
  },
  {
    name: 'Battery 10',
    manufacturer: 'EcoCharge',
    category: 'battery',
    description: '10,5kWh home storage',
    price: 1200,
    powerW: null,
    capacityKWh: 10.5,
  },
  {
    name: 'Connector',
    manufacturer: 'SunPower',
    category: 'connector',
    description: 'Replacement accessory',
    price: 25,
    powerW: null,
    capacityKWh: null,
  },
]

describe('filterProducts', () => {
  it('should filter by category, manufacturer, and inclusive price range [P]', () => {
    const result = filterProducts(products, {
      ...defaultFilters,
      category: 'solar panel',
      manufacturer: 'SunPower',
      minPrice: 500,
      maxPrice: 500,
    })

    expect(result.map(product => product.name)).toEqual(['Panel 450'])
  })

  it('should search product name, manufacturer, and description without case sensitivity [P]', () => {
    expect(filterProducts(products, { ...defaultFilters, q: 'HOME STORAGE' }).map(product => product.name)).toEqual([
      'Battery 10',
    ])
    expect(filterProducts(products, { ...defaultFilters, q: 'sunpower' })).toHaveLength(2)
  })

  it('should sort by price in ascending order [P]', () => {
    expect(filterProducts(products, { ...defaultFilters, sort: 'price-asc' }).map(product => product.name)).toEqual([
      'Connector',
      'Panel 450',
      'Battery 10',
    ])
  })

  it('should sort by price in descending order [P]', () => {
    expect(filterProducts(products, { ...defaultFilters, sort: 'price-desc' }).map(product => product.name)).toEqual([
      'Battery 10',
      'Panel 450',
      'Connector',
    ])
  })

  it('should sort equal-priced products by name for both price orders [P]', () => {
    const equalPricedProducts = products.map(product => ({ ...product, price: 100 }))
    const expectedNames = ['Battery 10', 'Connector', 'Panel 450']

    expect(
      filterProducts(equalPricedProducts, { ...defaultFilters, sort: 'price-asc' }).map(product => product.name),
    ).toEqual(expectedNames)

    expect(
      filterProducts(equalPricedProducts, { ...defaultFilters, sort: 'price-desc' }).map(product => product.name),
    ).toEqual(expectedNames)
  })

  it('should sort by power and keeps products without a value after products with one [P]', () => {
    expect(filterProducts(products, { ...defaultFilters, sort: 'power-desc' }).map(product => product.name)).toEqual([
      'Panel 450',
      'Battery 10',
      'Connector',
    ])
  })

  it('sorts by capacity in descending order', () => {
    expect(filterProducts(products, { ...defaultFilters, sort: 'capacity-desc' }).map(product => product.name)).toEqual(
      ['Battery 10', 'Connector', 'Panel 450'],
    )
  })
})
