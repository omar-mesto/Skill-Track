<script setup lang="ts">
const { profile } = useCompanyProfile()
</script>

<template>
  <div class="w-full min-h-screen bg-white pb-20">
    <ProfileCompanyProfileHeader
      :key="profile?.user?.avatar + '-' + profile?.user?.coverImage"
    />
    <div class="mx-4 md:mx-20 bg-background shadow-2xl rounded-b-xl p-5">
      <ProfileCompanyInformation />
      <ProfileCompanyTabs />
    </div>
  </div>
</template>
