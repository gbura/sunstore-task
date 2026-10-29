<script setup lang="ts">
import { getQueryValue } from '../utils/getQueryValue'

defineProps<{
  manufacturers: string[]
  categories: string[]
}>()

const route = useRoute()
const router = useRouter()

const filterKeys = ['q', 'category', 'manufacturer', 'minPrice', 'maxPrice', 'sort'] as const

const filters = reactive({
  q: getQueryValue(route.query, 'q'),
  category: getQueryValue(route.query, 'category'),
  manufacturer: getQueryValue(route.query, 'manufacturer'),
  minPrice: getQueryValue(route.query, 'minPrice'),
  maxPrice: getQueryValue(route.query, 'maxPrice'),
  sort: getQueryValue(route.query, 'sort') || 'name',
})

let debounceTimeout: ReturnType<typeof setTimeout> | undefined

function updatePriceFilter(key: 'minPrice' | 'maxPrice', event: Event) {
  const input = event.target

  if (input instanceof HTMLInputElement) {
    filters[key] = input.value
  }
}

function applyFilters() {
  const query = { ...route.query }
  let hasChanges = false

  for (const key of filterKeys) {
    const value = filters[key].trim()
    const nextValue = key === 'sort' && value === 'name' ? '' : value

    if (nextValue) {
      if (route.query[key] !== nextValue) {
        hasChanges = true
      }
      query[key] = nextValue
    } else {
      if (route.query[key] != null) {
        hasChanges = true
      }
      delete query[key]
    }
  }

  if (hasChanges) {
    delete query.page
    router.push({ query })
  }
}

watch(
  filters,
  () => {
    clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(applyFilters, 350)
  },
  { deep: true },
)

watch(
  () => route.query,
  () => {
    clearTimeout(debounceTimeout)
    Object.assign(filters, {
      q: getQueryValue(route.query, 'q'),
      category: getQueryValue(route.query, 'category'),
      manufacturer: getQueryValue(route.query, 'manufacturer'),
      minPrice: getQueryValue(route.query, 'minPrice'),
      maxPrice: getQueryValue(route.query, 'maxPrice'),
      sort: getQueryValue(route.query, 'sort') || 'name',
    })
  },
)

const formatCategoryLabel = (category: string) => category.charAt(0).toUpperCase() + category.slice(1)

const resetFilters = () => {
  Object.assign(filters, { q: '', category: '', manufacturer: '', minPrice: '', maxPrice: '', sort: 'name' })
}

onBeforeUnmount(() => clearTimeout(debounceTimeout))
</script>

<template>
  <form
    @submit.prevent="applyFilters"
    class="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/3">
    <div class="mb-5 flex items-center justify-between">
      <h2 class="text-base font-semibold tracking-tight text-slate-900">Filters</h2>
      <button
        type="button"
        class="text-xs font-semibold text-emerald-700 transition hover:text-emerald-950"
        @click="resetFilters">
        Clear
      </button>
    </div>

    <label class="mb-4 grid gap-2 text-xs font-semibold text-slate-700">
      Search products
      <span class="relative">
        <svg
          viewBox="0 0 20 20"
          fill="none"
          class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true">
          <circle cx="8.8" cy="8.8" r="5.8" stroke="currentColor" stroke-width="1.5" />
          <path d="m13.1 13.1 3.8 3.8" stroke="currentColor" stroke-linecap="round" stroke-width="1.5" />
        </svg>
        <input
          name="q"
          type="search"
          v-model="filters.q"
          placeholder="Name, manufacturer..."
          class="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm font-normal text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-700/10" />
      </span>
    </label>

    <label class="mb-4 grid gap-2 text-xs font-semibold text-slate-700">
      Category
      <select
        name="category"
        v-model="filters.category"
        class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal text-slate-800 outline-none transition focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-700/10">
        <option value="">All categories</option>
        <option v-for="category in categories" :key="category" :value="category">
          {{ formatCategoryLabel(category) }}
        </option>
      </select>
    </label>

    <label class="mb-4 grid gap-2 text-xs font-semibold text-slate-700">
      Manufacturer
      <select
        name="manufacturer"
        v-model="filters.manufacturer"
        class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal text-slate-800 outline-none transition focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-700/10">
        <option value="">All manufacturers</option>
        <option v-for="manufacturer in manufacturers" :key="manufacturer" :value="manufacturer">
          {{ manufacturer }}
        </option>
      </select>
    </label>

    <fieldset class="mb-4">
      <legend class="mb-2 text-xs font-semibold text-slate-700">
        Price range <span class="font-normal text-slate-600">(PLN)</span>
      </legend>
      <div class="grid grid-cols-2 gap-2">
        <input
          name="minPrice"
          type="number"
          min="0"
          step="0.01"
          :value="filters.minPrice"
          @input="updatePriceFilter('minPrice', $event)"
          placeholder="Min"
          aria-label="Minimum price"
          class="min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal text-slate-800 outline-none transition placeholder:text-slate-500 focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-700/10" />
        <input
          name="maxPrice"
          type="number"
          min="0"
          step="0.01"
          :value="filters.maxPrice"
          @input="updatePriceFilter('maxPrice', $event)"
          placeholder="Max"
          aria-label="Maximum price"
          class="min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal text-slate-800 outline-none transition placeholder:text-slate-500 focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-700/10" />
      </div>
    </fieldset>

    <label class="mb-5 grid gap-2 text-xs font-semibold text-slate-700">
      Sort by
      <select
        name="sort"
        v-model="filters.sort"
        class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal text-slate-800 outline-none transition focus:border-emerald-700 focus:bg-white focus:ring-4 focus:ring-emerald-700/10">
        <option value="name">Name A–Z</option>
        <option value="price-asc">Price: low to high</option>
        <option value="price-desc">Price: high to low</option>
        <option value="power-desc">Power: highest first (W)</option>
        <option value="capacity-desc">Capacity: highest first (kWh)</option>
      </select>
    </label>

    <p class="mt-2 text-center text-xs text-slate-600">Results update automatically</p>
  </form>
</template>
