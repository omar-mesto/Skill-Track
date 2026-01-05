<script setup lang="ts">
import { ref } from 'vue'
import { useAddReaction, useDeleteReaction } from '@@/queries/questions/index'
import type { ReactionType } from '~/models/questionModel'

const props = defineProps<{
  targetType: 'question' | 'comment'
  targetId: string
}>()

const active = ref(false)
const activeType = ref<ReactionType>('like')

const floating = ref<{ id: number; emoji: string }[]>([])
let seq = 0

const emojis: Record<ReactionType, string> = {
  wise: '🧠',
  loved: '❤️',
  support: '🤝',
  applause: '👏',
  like: '👍',
  opps: '😅',
}

const react = async (type: ReactionType) => {
  activeType.value = type

  const id = ++seq
  floating.value.push({ id, emoji: emojis[type] })
  setTimeout(() => {
    floating.value = floating.value.filter(x => x.id !== id)
  }, 900)

  if (!active.value) {
    const { execute } = useAddReaction(props.targetType, props.targetId, type)
    await execute()
    active.value = true
  } else {
    const { execute } = useDeleteReaction(props.targetType, props.targetId)
    await execute()
    active.value = false
  }
}
</script>

<template>
  <div class="relative flex items-center gap-2">
    <div class="flex flex-wrap gap-2">
      <button
        v-for="t in (['wise', 'loved', 'support', 'applause', 'like', 'opps'] as ReactionType[])"
        :key="t"
        type="button"
        class="px-3 py-1 rounded-full text-sm border bg-white hover:bg-gray-50 transition reaction-btn"
        :class="active && activeType === t ? 'border-primary text-primary' : 'border-gray-200 text-gray-700'"
        @click="react(t)"
      >
        <span class="mr-1">{{ emojis[t] }}</span>
        {{ t }}
      </button>
    </div>

    <div class="absolute left-0 -top-6 pointer-events-none">
      <span
        v-for="f in floating"
        :key="f.id"
        class="floating-emoji"
      >
        {{ f.emoji }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.reaction-btn { transform: translateZ(0); }
.reaction-btn:active { transform: scale(0.97); }

.floating-emoji{
  display:inline-block;
  margin-right:6px;
  animation: floatUp 0.9s ease-out forwards;
}

@keyframes floatUp{
  0%{ opacity:0; transform: translateY(10px) scale(0.9); }
  20%{ opacity:1; transform: translateY(0px) scale(1.05); }
  100%{ opacity:0; transform: translateY(-18px) scale(1); }
}
</style>
