<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAddReaction, useDeleteReaction } from '@@/queries/questions'
import type { ReactionType } from '~/models/questionModel'

const props = defineProps<{
  targetType: 'question' | 'comment'
  targetId: string
  reactions: Partial<Record<ReactionType, number>>
  myReaction?: ReactionType | null
}>()

const localReactions = reactive<Record<ReactionType, number>>({
  like: props.reactions?.like || 0,
  loved: props.reactions?.loved || 0,
  applause: props.reactions?.applause || 0,
  wise: props.reactions?.wise || 0,
  support: props.reactions?.support || 0,
  opps: props.reactions?.opps || 0,
})

const activeReaction = ref<ReactionType | null>(props.myReaction ?? null)
const loading = ref(false)

const emojis: Record<ReactionType, string> = {
  like: '👍',
  loved: '❤️',
  applause: '👏',
  wise: '🧠',
  support: '🤝',
  opps: '😅',
}

const react = async (type: ReactionType) => {
  if (loading.value) return
  loading.value = true

  const previous = activeReaction.value

  try {
    if (previous === type) {
      localReactions[type]--
      activeReaction.value = null

      const { execute } = useDeleteReaction(props.targetType, props.targetId)
      await execute()

      return
    }

    if (previous) {
      localReactions[previous]--
    }

    localReactions[type]++
    activeReaction.value = type

    const { execute } = useAddReaction(props.targetType, props.targetId, type)
    await execute()
  } catch (e) {
    if (previous) localReactions[previous]++
    if (activeReaction.value) localReactions[activeReaction.value]--
    activeReaction.value = previous
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex items-center gap-3">
    <button
      v-for="t in ['like', 'loved', 'applause', 'wise', 'support', 'opps']"
      :key="t"
      class="flex items-center gap-1 px-3 py-1.5 rounded-full border text-sm transition"
      :class="
        activeReaction === t
          ? 'bg-black text-white border-black'
          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
      "
      @click="react(t as ReactionType)"
    >
      <span>{{ emojis[t as ReactionType] }}</span>
      <span class="font-medium">
        {{ localReactions[t as ReactionType] }}
      </span>
    </button>
  </div>
</template>
