import type { Product } from '../../shared/types/catalog.types'

export type ProductSort = 'name' | 'price-asc' | 'price-desc' | 'power-desc' | 'capacity-desc'

export interface ProductFilters {
  q: string
  manufacturer: string
  category: string
  minPrice: number
  maxPrice: number
  sort: ProductSort
}

export function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  const search = filters.q.trim().toLocaleLowerCase('pl')

  const filteredProducts = products.filter(product => {
    const text = [product.name, product.manufacturer, product.description].join(' ').toLocaleLowerCase('pl')

    return (
      (!filters.manufacturer || product.manufacturer === filters.manufacturer) &&
      (!filters.category || product.category === filters.category) &&
      product.price >= filters.minPrice &&
      product.price <= filters.maxPrice &&
      (!search || text.includes(search))
    )
  })

  filteredProducts.sort((a, b) => {
    const byName = a.name.localeCompare(b.name, 'pl')

    switch (filters.sort) {
      case 'price-asc':
        return a.price - b.price || byName
      case 'price-desc':
        return b.price - a.price || byName
      case 'power-desc':
        return (b.powerW ?? -1) - (a.powerW ?? -1) || byName
      case 'capacity-desc':
        return (b.capacityKWh ?? -1) - (a.capacityKWh ?? -1) || byName
      default:
        return byName
    }
  })

  return filteredProducts
}
