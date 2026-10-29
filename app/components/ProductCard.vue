<script setup lang="ts">
import type { Product } from '../../shared/types/catalog.types'

defineProps<{ product: Product }>()

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-PL', {
    style: 'currency',
    currency: 'PLN',
  }).format(price)

const categoryLabels: Record<string, string> = {
  battery: 'Energy storage',
  'solar panel': 'Solar panel',
  inverter: 'Inverter',
}

const formatCategory = (category: string) => categoryLabels[category] ?? category
</script>

<template>
  <article
    class="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/3 transition duration-300 hover:-translate-y-1 hover:border-emerald-900/20 hover:shadow-xl hover:shadow-emerald-950/8">
    <div
      class="relative flex h-40 items-center justify-center overflow-hidden bg-linear-to-br from-emerald-50 via-[#f3f5eb] to-lime-100/70">
      <div class="absolute -right-8 -top-14 size-40 rounded-full border border-emerald-900/6"></div>
      <div class="absolute -right-1 -top-7 size-28 rounded-full border border-emerald-900/6"></div>
      <div class="absolute bottom-0 left-0 h-16 w-full bg-linear-to-t from-emerald-900/4 to-transparent"></div>
      <svg
        v-if="product.category === 'solar panel'"
        viewBox="0 0 160 100"
        fill="none"
        class="relative z-10 w-40 drop-shadow-xl transition duration-500 group-hover:scale-105"
        aria-hidden="true">
        <path d="m30 24 92 8-13 45-91-8 12-45Z" fill="#123F32" />
        <path d="m30 24 92 8-13 45-91-8 12-45Z" stroke="#497A5E" stroke-width="2" />
        <path
          d="m53 26-9 44m32-42-8 44m32-42-7 44M23 46l94 8m-98 9 93 8"
          stroke="#A8D5A5"
          stroke-opacity=".8"
          stroke-width="1.5" />
        <path d="m73 78-3 10m27-8-2 10m-43-1 55 5" stroke="#55745E" stroke-linecap="round" stroke-width="3" />
        <path d="m36 29 22 2-9 38-23-2 10-38Z" fill="#D7F0C8" fill-opacity=".28" />
      </svg>
      <svg
        v-else-if="product.category === 'battery'"
        viewBox="0 0 120 120"
        fill="none"
        class="relative z-10 h-28 w-28 drop-shadow-xl transition duration-500 group-hover:scale-105"
        aria-hidden="true">
        <rect x="28" y="20" width="64" height="84" rx="13" fill="#174C3A" />
        <path d="M47 20v-5h26v5" stroke="#174C3A" stroke-linecap="round" stroke-linejoin="round" stroke-width="5" />
        <rect x="39" y="37" width="42" height="49" rx="6" fill="#F4F7E9" />
        <path d="m64 43-13 22h10l-4 15 14-24H60l4-13Z" fill="#6AA66E" />
        <path d="M36 95h48" stroke="#76A183" stroke-linecap="round" stroke-opacity=".55" stroke-width="3" />
      </svg>
      <svg
        v-else
        viewBox="0 0 120 120"
        fill="none"
        class="relative z-10 h-28 w-28 drop-shadow-xl transition duration-500 group-hover:scale-105"
        aria-hidden="true">
        <rect x="25" y="22" width="70" height="78" rx="13" fill="#174C3A" />
        <rect x="36" y="34" width="48" height="30" rx="5" fill="#EAF2DB" />
        <path
          d="M43 54h9l6-13 7 15 5-8h7"
          stroke="#609B6B"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2.5" />
        <circle cx="43" cy="79" r="3" fill="#B6D787" />
        <circle cx="54" cy="79" r="3" fill="#609B6B" />
        <path d="M64 79h18" stroke="#A8C1A9" stroke-linecap="round" stroke-width="3" />
      </svg>
      <span
        class="absolute left-4 top-4 rounded-full border border-white/70 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-900 shadow-sm backdrop-blur">
        {{ formatCategory(product.category) }}
      </span>
      <span
        class="absolute bottom-4 right-4 flex size-8 items-center justify-center rounded-full bg-white/75 text-emerald-900/70 backdrop-blur"
        aria-hidden="true">
        <svg viewBox="0 0 20 20" fill="none" class="size-4">
          <path
            d="M10 16.2 3.9 10A3.6 3.6 0 0 1 9 4.9l1 1 1-1a3.6 3.6 0 0 1 5.1 5.1L10 16.2Z"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5" />
        </svg>
      </span>
    </div>

    <div class="p-5">
      <p class="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-700">{{ product.manufacturer }}</p>
      <h2 class="mt-2 min-h-12 text-base font-semibold leading-6 tracking-tight text-slate-900">{{ product.name }}</h2>
      <p class="mt-2 line-clamp-2 min-h-10 text-xs leading-5 text-slate-500">{{ product.description }}</p>

      <dl class="mt-4 flex min-h-8 flex-wrap gap-2">
        <div v-if="product.powerW !== null" class="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs">
          <dt class="sr-only">Power</dt>
          <dd>
            <span class="font-semibold text-slate-800">{{ product.powerW }} W</span
            ><span class="ml-1 text-slate-600">power</span>
          </dd>
        </div>
        <div v-if="product.capacityKWh !== null" class="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs">
          <dt class="sr-only">Capacity</dt>
          <dd>
            <span class="font-semibold text-slate-800">{{ product.capacityKWh }} kWh</span
            ><span class="ml-1 text-slate-600">capacity</span>
          </dd>
        </div>
      </dl>

      <div class="mt-5 flex items-end justify-between border-t border-slate-100 pt-4">
        <div>
          <p class="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-600">List price</p>
          <strong class="mt-1 block text-xl font-semibold tracking-tight text-emerald-950">{{
            formatPrice(product.price)
          }}</strong>
        </div>
        <span class="inline-flex items-center gap-1.5 pb-1 text-[11px] font-semibold text-emerald-700">
          <span class="size-1.5 rounded-full bg-emerald-500"></span>
          In stock
        </span>
      </div>
    </div>
  </article>
</template>
