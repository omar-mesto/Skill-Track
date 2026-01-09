<script setup lang="ts">
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'

const modelValue = defineModel<string>()

defineProps<{
  language?: string
}>()

const extensions = [javascript()]
</script>

<template>
  <ClientOnly>
    <Codemirror
      v-model="modelValue"
      :extensions="extensions"
      :style="{ height: '300px' }"
      :autofocus="true"
      :indent-with-tab="true"
      :tab-size="2"
      :theme="oneDark"
      class="text-black"
    />
  </ClientOnly>
</template>
