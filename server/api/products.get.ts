import { parse } from 'csv-parse/sync'
import { extractSpecs } from '../utils/extractSpecs'
import { filterProducts, type ProductSort } from '../utils/filterProducts'
import { formatToDecimal } from '../utils/formatToDecimal'

type Row = {
  name: string
  manufacturer: string
  description: string
  price: string
  category: string
}

export default defineEventHandler(async event => {
  const query = getQuery(event)

  const q = query.q ?? ''
  const manufacturer = query.manufacturer ?? ''
  const category = query.category ?? ''
  const minPrice = query.minPrice ?? ''
  const maxPrice = query.maxPrice ?? ''
  const sort = query.sort ?? 'name'
  const page = Number(query.page ?? 1)
  const pageLimit = Number(query.pageLimit ?? 10)
  const offset = (page - 1) * pageLimit

  if (
    !Number.isSafeInteger(page) ||
    !Number.isSafeInteger(pageLimit) ||
    !Number.isSafeInteger(offset) ||
    page < 1 ||
    pageLimit < 1
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid pagination',
    })
  }

  if (
    typeof q !== 'string' ||
    typeof manufacturer !== 'string' ||
    typeof category !== 'string' ||
    typeof minPrice !== 'string' ||
    typeof maxPrice !== 'string' ||
    typeof sort !== 'string'
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid filters',
    })
  }

  const priceFrom = minPrice.trim() === '' ? 0 : Number(minPrice)
  const priceTo = maxPrice.trim() === '' ? Infinity : Number(maxPrice)

  if (
    !Number.isFinite(priceFrom) ||
    (maxPrice.trim() !== '' && !Number.isFinite(priceTo)) ||
    priceFrom < 0 ||
    priceTo < 0 ||
    priceFrom > priceTo
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid price range',
    })
  }

  const allowedSorts: ProductSort[] = ['name', 'price-asc', 'price-desc', 'power-desc', 'capacity-desc']
  const productSort = allowedSorts.find(allowedSort => allowedSort === sort)

  if (!productSort) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid sort',
    })
  }

  const csv = await useStorage('assets:server').getItem<string>('products.csv')

  if (csv == null) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing CSV',
    })
  }

  const rows = parse(csv, {
    columns: true,
    bom: true,
    skip_empty_lines: true,
    trim: true,
  }) as Row[]

  if (rows.some(row => !row.name || !row.manufacturer || !row.category || !row.price.trim())) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing CSV fields',
    })
  }

  const products = rows.map(row => ({
    id: row.name,
    name: row.name,
    manufacturer: row.manufacturer,
    category: row.category,
    description: row.description ?? '',
    price: formatToDecimal(row.price),
    ...extractSpecs(row.name, row.description),
  }))

  if (products.some(product => !Number.isFinite(product.price) || product.price < 0)) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Invalid CSV price',
    })
  }

  const filteredProducts = filterProducts(products, {
    q,
    manufacturer,
    category,
    minPrice: priceFrom,
    maxPrice: priceTo,
    sort: productSort,
  })

  const totalItems = filteredProducts.length
  const items = filteredProducts.slice(offset, offset + pageLimit)

  return {
    manufacturers: [...new Set(products.map(product => product.manufacturer))].sort(),
    categories: [...new Set(products.map(product => product.category))].sort(),
    items,
    pagination: {
      page,
      pageLimit,
      totalItems,
      totalPages: Math.ceil(totalItems / pageLimit),
    },
  }
})
