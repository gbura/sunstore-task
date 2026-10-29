<script setup lang="ts">
import type { ProductsResponse } from '../../shared/types/catalog.types'
import { getQueryValue } from '../utils/getQueryValue'

const route = useRoute()
const router = useRouter()
const pageLimitOptions = [10, 20, 50]

const page = computed(() => {
  const value = Number(getQueryValue(route.query, 'page') || '1')
  return Number.isSafeInteger(value) && value > 0 ? value : 1
})

const pageLimit = computed<number>({
  get: () => {
    const value = Number(getQueryValue(route.query, 'pageLimit') || '10')
    return pageLimitOptions.includes(value) ? value : 10
  },
  set: value => {
    const nextPageLimit = Number(value)

    if (!pageLimitOptions.includes(nextPageLimit)) {
      return
    }

    const nextQuery: Record<string, string | null | (string | null)[]> = {
      ...route.query,
      pageLimit: String(nextPageLimit),
    }
    delete nextQuery.page
    router.push({ query: nextQuery })
  },
})

const query = computed(() => ({
  q: route.query.q,
  manufacturer: route.query.manufacturer,
  category: route.query.category,
  minPrice: route.query.minPrice,
  maxPrice: route.query.maxPrice,
  sort: route.query.sort,
  page: page.value,
  pageLimit: pageLimit.value,
}))

const { data, error, pending } = await useFetch<ProductsResponse>('/api/products', { query })

function navigateToPage(nextPage: number) {
  const nextQuery = { ...route.query }

  if (nextPage === 1) {
    delete nextQuery.page
  } else {
    nextQuery.page = String(nextPage)
  }

  router.push({ query: nextQuery })
}

if (error.value) {
  throw createError({
    statusCode: 500,
    statusMessage: 'Failed to load products.',
  })
}

const heading = computed(() => getQueryValue(route.query, 'category') || 'Solar products')
const formattedHeading = computed(() => {
  const labels: Record<string, string> = {
    battery: 'Energy storage',
    'solar panel': 'Solar panels',
    inverter: 'Inverters',
  }

  return labels[heading.value] ?? heading.value
})

const title = computed(() =>
  [
    formattedHeading.value,
    getQueryValue(route.query, 'manufacturer'),
    getQueryValue(route.query, 'q') ? `Search: ${getQueryValue(route.query, 'q')}` : '',
    getQueryValue(route.query, 'minPrice') ? `Price from ${getQueryValue(route.query, 'minPrice')}` : '',
    getQueryValue(route.query, 'maxPrice') ? `Price up to ${getQueryValue(route.query, 'maxPrice')}` : '',
    'sun.store',
  ]
    .filter(Boolean)
    .join(' · '),
)

const description = computed(
  () =>
    `${title.value}. ${data.value?.pagination.totalItems ?? 0} products found. ` +
    'A B2B marketplace for solar installers and distributors.',
)

useSeoMeta({
  title: () => title.value,
  description: () => description.value,
  ogTitle: () => title.value,
  ogDescription: () => description.value,
})
</script>

<template>
  <div class="min-h-screen bg-[#f6f7f3] text-slate-900">
    <div class="bg-emerald-950 px-4 py-2 text-center text-xs font-medium tracking-wide text-emerald-50">
      <span class="mr-2 inline-block size-1.5 rounded-full bg-lime-300 align-middle"></span>
      Energy for people who get the job done.
      <span class="ml-1 text-emerald-200">The marketplace for renewable energy professionals</span>
    </div>

    <header class="border-b border-slate-200/80 bg-white">
      <div class="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 lg:px-8">
        <a href="/" class="flex shrink-0 items-center gap-2.5" aria-label="sun.store — home">
          <span class="flex size-9 items-center justify-center rounded-xl bg-emerald-900 text-lime-300">
            <svg viewBox="0 0 24 24" fill="none" class="size-5" aria-hidden="true">
              <circle cx="12" cy="12" r="3.5" stroke="currentColor" stroke-width="1.8" />
              <path
                d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-width="1.8" />
            </svg>
          </span>
          <span class="text-xl font-black tracking-tight text-emerald-950"
            >sun<span class="text-emerald-600">.</span>store</span
          >
        </a>

        <nav class="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <a href="/?category=solar%20panel" class="transition hover:text-emerald-800">Solar panels</a>
          <a href="/?category=battery" class="transition hover:text-emerald-800">Energy storage</a>
          <a href="#catalog" class="transition hover:text-emerald-800">Full catalog</a>
        </nav>

        <a
          href="#catalog"
          class="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:border-emerald-800 hover:bg-emerald-50">
          For installers
          <svg viewBox="0 0 20 20" fill="none" class="size-4" aria-hidden="true">
            <path
              d="M4.5 10h11m-4.5-4.5L15.5 10 11 14.5"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.6" />
          </svg>
        </a>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-5 pb-20 pt-8 lg:px-8 lg:pt-12">
      <section
        class="relative isolate overflow-hidden rounded-4xl bg-emerald-950 px-7 py-10 text-white shadow-xl shadow-emerald-950/10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
        <div class="absolute -right-20 -top-36 -z-10 size-112 rounded-full border border-white/10"></div>
        <div class="absolute -right-4 -top-20 -z-10 size-88 rounded-full border border-white/10"></div>
        <div class="absolute -bottom-44 right-24 -z-10 size-96 rounded-full bg-lime-300/10 blur-3xl"></div>
        <div class="max-w-2xl">
          <p
            class="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-lime-200">
            <span class="size-1.5 rounded-full bg-lime-300"></span>
            Better energy. Better choices.
          </p>
          <h1 class="max-w-xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            {{ formattedHeading }}<span class="text-lime-300">.</span>
          </h1>
          <p class="mt-5 max-w-lg text-base leading-7 text-emerald-100/80 sm:text-lg">
            Trusted renewable energy components, transparent pricing, and everything you need for your next
            installation.
          </p>
          <a
            href="#catalog"
            class="mt-8 inline-flex items-center gap-3 rounded-full bg-lime-300 px-5 py-3 text-sm font-bold text-emerald-950 transition hover:bg-lime-200">
            Explore the catalog
            <svg viewBox="0 0 20 20" fill="none" class="size-4" aria-hidden="true">
              <path
                d="M10 4.5v11m-4.5-4.5L10 15.5l4.5-4.5"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.7" />
            </svg>
          </a>
        </div>
        <div
          class="absolute bottom-9 right-12 hidden w-52 rounded-2xl border border-white/15 bg-white/[0.07] p-5 backdrop-blur-sm xl:block">
          <p class="text-xs font-medium text-emerald-100/70">Energy, chosen wisely</p>
          <p class="mt-2 text-3xl font-semibold tracking-tight">built to last<span class="text-lime-300">.</span></p>
          <div class="mt-5 flex items-end gap-1.5" aria-hidden="true">
            <span class="h-5 w-2 rounded-full bg-lime-300/40"></span>
            <span class="h-8 w-2 rounded-full bg-lime-300/55"></span>
            <span class="h-6 w-2 rounded-full bg-lime-300/70"></span>
            <span class="h-11 w-2 rounded-full bg-lime-300"></span>
            <span class="ml-2 text-xs text-emerald-100/70">powering a brighter future</span>
          </div>
        </div>
      </section>

      <div id="catalog" class="scroll-mt-8 pt-10">
        <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Find the right fit</p>
            <h2 class="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Product catalog</h2>
          </div>
          <p v-if="data" class="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
            <span class="font-bold text-emerald-900">{{ data.pagination.totalItems }}</span>
            {{ data.pagination.totalItems === 1 ? 'product' : 'products' }}
            <span class="text-slate-600">available</span>
          </p>
        </div>

        <div class="grid items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside aria-label="Product filters" class="lg:sticky lg:top-6">
            <ProductFilters :manufacturers="data?.manufacturers ?? []" :categories="data?.categories ?? []" />
          </aside>

          <section aria-label="Search results" :aria-busy="pending" class="min-w-0">
            <div
              v-if="error"
              role="alert"
              class="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-medium text-red-800">
              We couldn't load the products. Refresh the page or try again in a moment.
            </div>

            <template v-else-if="data">
              <p v-if="pending" role="status" class="mb-3 text-xs font-medium text-emerald-700">Updating results...</p>
              <div
                v-if="data.items.length"
                class="grid gap-4 transition-opacity duration-200 sm:grid-cols-2 xl:grid-cols-3"
                :class="{ 'opacity-60': pending }">
                <ProductCard v-for="product in data.items" :key="product.name" :product="product" />
              </div>

              <div v-else class="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                <span
                  class="mx-auto flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800">
                  <svg viewBox="0 0 24 24" fill="none" class="size-6" aria-hidden="true">
                    <circle cx="10.8" cy="10.8" r="6.3" stroke="currentColor" stroke-width="1.7" />
                    <path d="m15.5 15.5 4 4" stroke="currentColor" stroke-linecap="round" stroke-width="1.7" />
                  </svg>
                </span>
                <h3 class="mt-4 text-lg font-semibold text-slate-900">No products found</h3>
                <p class="mt-1 text-sm text-slate-500">Try changing your filters or start over.</p>
                <a
                  href="/"
                  class="mt-5 inline-flex rounded-full bg-emerald-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800">
                  Clear filters
                </a>
              </div>

              <div
                v-if="data.pagination.totalItems"
                class="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                <p class="text-sm text-slate-600" aria-live="polite">
                  Showing
                  <span class="font-semibold text-slate-900">
                    {{ (data.pagination.page - 1) * data.pagination.pageLimit + 1 }}–{{
                      Math.min(data.pagination.page * data.pagination.pageLimit, data.pagination.totalItems)
                    }}
                  </span>
                  of <span class="font-semibold text-slate-900">{{ data.pagination.totalItems }}</span> products
                </p>

                <div class="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
                  <label class="flex items-center gap-2 text-sm text-slate-600">
                    Per page
                    <select
                      v-model.number="pageLimit"
                      aria-label="Products per page"
                      class="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-sm text-slate-800 outline-none focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10"
                      :disabled="pending">
                      <option v-for="limit in pageLimitOptions" :key="limit" :value="limit">{{ limit }}</option>
                    </select>
                  </label>

                  <nav class="flex items-center gap-2" aria-label="Product pages">
                    <button
                      type="button"
                      class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-700 hover:text-emerald-800 disabled:cursor-not-allowed disabled:opacity-40"
                      :disabled="pending || data.pagination.page <= 1"
                      @click="navigateToPage(data.pagination.page - 1)">
                      Previous
                    </button>
                    <span class="min-w-20 text-center text-sm font-medium text-slate-600">
                      {{ data.pagination.page }} / {{ data.pagination.totalPages }}
                    </span>
                    <button
                      type="button"
                      class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-700 hover:text-emerald-800 disabled:cursor-not-allowed disabled:opacity-40"
                      :disabled="pending || data.pagination.page >= data.pagination.totalPages"
                      @click="navigateToPage(data.pagination.page + 1)">
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </template>
          </section>
        </div>
      </div>

      <footer
        class="mt-16 flex flex-col gap-3 border-t border-slate-200 pt-6 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <p class="font-semibold tracking-tight text-emerald-950">sun.store</p>
        <p>The renewable energy marketplace for professionals</p>
        <p>Energy that works harder.</p>
      </footer>
    </main>
  </div>
</template>
