<script setup>
const { init } = useNotifications()

onMounted(() => {
  console.log('🚀 Notifications init called')
  init()
})
</script>

<template>
  <NuxtLayout>
    <UApp>
      <NuxtPage />
    </UApp>
  </NuxtLayout>
</template>
