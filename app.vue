<script setup>
const { init } = useNotifications()

onMounted(() => {
  init()
})
</script>

<template>
  <ClientOnly>
    <NuxtLayout>
      <UApp>
        <NuxtPage />
      </UApp>
    </NuxtLayout>
  </ClientOnly>
</template>
