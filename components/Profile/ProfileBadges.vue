<script setup lang="ts">
import { useGetBadges } from '@@/queries/Profile/student/badges'

const { data } = useGetBadges()

const badges = computed(() => data.value?.data ?? [])
</script>

<template>
  <div class="bg-white p-4 sm:p-6 rounded-xl shadow-xl mt-6 mx-3 sm:mx-6">
    <h3 class="font-bold text-black text-lg sm:text-xl mb-4">
      Badges
    </h3>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div
        v-for="(b, i) in badges"
        :key="i"
        class="p-4 bg-gray-50 rounded-xl flex items-center gap-3"
      >
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 text-primary grid place-items-center rounded-xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-square-star-icon lucide-square-star"
          ><path d="M11.035 7.69a1 1 0 0 1 1.909.024l.737 1.452a1 1 0 0 0 .737.535l1.634.256a1 1 0 0 1 .588 1.806l-1.172 1.168a1 1 0 0 0-.282.866l.259 1.613a1 1 0 0 1-1.541 1.134l-1.465-.75a1 1 0 0 0-.912 0l-1.465.75a1 1 0 0 1-1.539-1.133l.258-1.613a1 1 0 0 0-.282-.866l-1.156-1.153a1 1 0 0 1 .572-1.822l1.633-.256a1 1 0 0 0 .737-.535z" /><rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="2"
          /></svg>
        </div>

        <div>
          <p class="font-semibold text-black text-sm sm:text-base">
            {{ b.name }}
          </p>
          <p class="text-xs sm:text-sm text-gray-500">
            {{ b.description }}
          </p>
          <p class="text-Sequand">
            {{ b.level }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
