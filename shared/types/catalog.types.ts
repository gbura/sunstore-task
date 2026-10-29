export interface Product {
  name: string
  manufacturer: string
  category: string
  description: string
  price: number
  powerW: number | null
  capacityKWh: number | null
}

export interface ProductsResponse {
  items: Product[]
  categories: string[]
  manufacturers: string[]
  pagination: {
    page: number
    pageLimit: number
    totalItems: number
    totalPages: number
  }
}
