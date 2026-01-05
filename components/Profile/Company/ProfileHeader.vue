<script setup lang="ts">
import { computed, ref } from 'vue'

const { profile } = useCompanyProfile()

const cacheBuster = ref(Date.now())

const avatarSrc = computed(() => {
  const url = profile.value?.user?.avatar

  return url ? `${url}?v=${cacheBuster.value}` : ''
})

const coverSrc = computed(() => {
  const url = profile.value?.user?.coverImage

  return url ? `${url}?v=${cacheBuster.value}` : ''
})

const refreshImages = () => {
  cacheBuster.value = Date.now()
}

defineExpose({ refreshImages })
</script>

<template>
  <div class="relative w-full">
    <div class="w-full h-40 sm:h-48 md:h-60 lg:h-72 overflow-hidden">
      <img
        :key="coverSrc"
        :src="coverSrc"
        class="w-full h-full object-cover"
      >
    </div>

    <div
      class="absolute left-5 sm:left-26 -bottom-12 sm:-bottom-16
        w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden
        border-4 border-white shadow-xl bg-white"
    >
      <img
        :key="avatarSrc"
        :src="avatarSrc"
        class="w-full h-full object-cover"
      >
    </div>
  </div>
</template>
