<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const links = [
  { name: 'Questuin', icon: 'i-heroicons-home', path: '/Questions' },
  { name: 'Tasks', icon: 'i-heroicons-clipboard-document', path: '/tasks' },
  { name: 'Portfolio', icon: 'i-heroicons-briefcase', path: '/profile/student' },
  { name: 'Community', icon: 'i-heroicons-users', path: '/community' },
  { name: 'Settings', icon: 'i-heroicons-cog-6-tooth', path: '/settings' },
]

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits(['close'])
const storage = useGlobalStore()
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 bg-black/40 z-40 md:hidden"
    @click="emit('close')"
  />

  <aside
    class="
      z-50 bg-[#0B1C33] text-white flex flex-col p-4 w-64
      fixed inset-y-0 left-0 transition-transform duration-300
      md:sticky md:top-0 md:h-screen md:translate-x-0
    "
    :class="open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
  >
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-2">
        <button
          class="md:hidden text-white"
          @click="emit('close')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line
              x1="18"
              y1="6"
              x2="6"
              y2="18"
            />
            <line
              x1="6"
              y1="6"
              x2="18"
              y2="18"
            />
          </svg>
        </button>

        <h2 class="text-xl font-bold hover:cursor-pointer">
          <NuxtLink to="/">Skill Track</NuxtLink>
        </h2>
      </div>
    </div>

    <nav class="flex-1 space-y-2">
      <button
        v-for="l in links"
        :key="l.name"
        class="flex items-center hover:cursor-pointer gap-3 px-3 py-2 rounded-lg hover:bg-white/10 w-full text-left"
        @click="
          router.push(l.path);
          emit('close')
        "
      >
        <UIcon
          :name="l.icon"
          class="w-5 h-5"
        />
        <span>{{ l.name }}</span>
      </button>
    </nav>

    <div class="border-t border-white/10 pt-4">
      <p class="text-white">
        {{ storage.name }}
      </p>
      <p class="opacity-80 text-sm">
        {{ storage.email }}
      </p>
    </div>
  </aside>
</template>
