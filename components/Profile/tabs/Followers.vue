<script setup lang="ts">
import { useGetFollowers, useGetFollowing } from '@@/queries/follow'
import { computed } from 'vue'

const props = defineProps<{ userId: string }>()

const { data: dataFollowers } = useGetFollowers(props.userId)
const followers = computed(() => dataFollowers.value?.data?.data ?? [])

const { data } = useGetFollowing(props.userId)
const following = computed(() => data.value?.data?.data ?? [])
</script>

<template>
  <div class="sm:flex block gap-5 justify-between">
    <div class="text-black sm:w-1/2 w-full">
      <h3 class="text-xl font-bold">
        Followers
      </h3>

      <div v-if="followers.length === 0">
        No followers
      </div>

      <div class="space-y-3 mt-3">
        <div
          v-for="f in followers"
          :key="f._id"
          class="p-3 border rounded-xl bg-background text-black"
        >
          <UUser
            class=""
            :name="typeof f.follower === 'object' ? f.follower.name : ''"
            :description="typeof f.follower === 'object' ? f.follower.email : ''"
            :avatar="{
              src: typeof f.follower === 'object'
                ? (f.follower.avatar
                  ? 'http://localhost:5000/' + f.follower.avatar
                  : '/StudentLogin.png')
                : '/StudentLogin.png',
            }"
            size="xl"
            :ui="{ name: 'text-black' }"
          />
        </div>
      </div>
    </div>
    <div class="text-black sm:w-1/2 w-full sm:my-0 my-5">
      <h3 class="text-xl font-bold">
        Following
      </h3>

      <div v-if="followers.length === 0">
        No following
      </div>

      <div class="space-y-3 mt-3 container">
        <div
          v-for="f in following"
          :key="f._id"
          class="p-3 border rounded-xl bg-background text-black"
        >
          <UUser
            class=""
            :name="typeof f.following === 'object' ? f.following.name : ''"
            :description="typeof f.following === 'object' ? f.following.email : ''"
            :avatar="{
              src: typeof f.following === 'object'
                ? (f.following.avatar
                  ? 'http://localhost:5000/' + f.following.avatar
                  : '/StudentLogin.png')
                : '/StudentLogin.png',
            }"
            size="xl"
            :ui="{ name: 'text-black' }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
