<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
defineProps<{ isOpen: boolean }>()

const navItems = ref([
  { label: 'Dashboard', icon: 'i-lucide-home', to: '/Dashbaord' },
  {
    label: 'Actors',
    icon: 'i-lucide-users',
    children: [
      { label: 'Users', to: '/actors/users' },
      { label: 'Companies', to: '/actors/companies' },
      { label: 'Professors', to: '/actors/professors' },
    ],
  },
  {
    label: 'Requests',
    icon: 'i-lucide-inbox',
    children: [
      { label: 'Company Requests', to: '/Dashbaord/requests' },
      { label: 'Professor Requests', to: '/Dashbaord/requests/professors' },
    ],
  },

  {
    label: 'Reports',
    icon: 'i-lucide-flag',
    children: [
      { label: 'Post Reports', to: '/reports/posts' },
      { label: 'Comment Reports', to: '/reports/comments' },
    ],
  },
])

const openDropdown = ref<string | null>(null)

const toggleDropdown = (label: string) => {
  openDropdown.value = openDropdown.value === label ? null : label
}
</script>

<template>
  <aside
    class="fixed md:static w-64 bg-primary text-white flex flex-col transition-transform duration-300 z-50"
    :class="{
      '-translate-x-full': !isOpen,
      'translate-x-0 w-full h-full': isOpen,
      'md:w-64 md:h-auto md:translate-x-0': true,
    }"
  >
    <nav class="flex-1 mt-6 pl-5">
      <ul class="space-y-2">
        <li
          v-for="item in navItems"
          :key="item.label"
          class="flex flex-col"
        >
          <div
            class="flex items-center gap-3 px-6 py-4 cursor-pointer transition rounded-l-3xl"
            :class="[
              route.path === item.to
                ? 'bg-white text-primary font-semibold'
                : 'hover:bg-white/10',
            ]"
            @click="item.children ? toggleDropdown(item.label) : router.push(item.to)"
          >
            <Icon
              :name="item.icon"
              class="text-xl"
            />
            <span>{{ item.label }}</span>
            <Icon
              v-if="item.children"
              :name="openDropdown === item.label ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
              class="ml-auto text-sm"
            />
          </div>

          <div name="fade">
            <ul
              v-if="item.children && openDropdown === item.label"
              class="ml-10 mt-1 space-y-1"
            >
              <li
                v-for="sub in item.children"
                :key="sub.label"
                class="cursor-pointer px-3 py-2  hover:bg-white/10 text-sm flex items-center gap-2 rounded-l-3xl"
                :class="route.path === sub.to ? 'bg-white text-primary font-semibold' : ''"
                @click="router.push(sub.to)"
              >
                <Icon
                  name="i-lucide-dot"
                  class="text-xs"
                />
                <span>{{ sub.label }}</span>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
</style>
