<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { useGlobalStore } from '@@/stores/global'
import {
  useAddReaction,
  useDeleteReaction,
  useGetReactionsList,
  useGetReactionsCount,
} from '@@/queries/questions'
import type { ReactionType } from '~/models/questionModel'
import type { ReactionModel } from '~/models/reactionModel'

const props = defineProps<{
  targetType: 'question' | 'comment' | 'post'
  targetId: string
  reactions?: Partial<Record<ReactionType, number>>
  myReaction?: ReactionType | null
}>()

const store = useGlobalStore()

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
const fetchedOnce = ref(false)

const emojis: Record<ReactionType, string> = {
  like: '👍',
  loved: '❤️',
  applause: '👏',
  wise: '🧠',
  support: '🤝',
  opps: '😅',
}

const currentUserId = computed(() => store.id)

const resetCounts = () => {
  localReactions.like = 0
  localReactions.loved = 0
  localReactions.applause = 0
  localReactions.wise = 0
  localReactions.support = 0
  localReactions.opps = 0
}

const normalizeUserId = (userId: ReactionModel['userId']) => {
  if (!userId) return ''
  if (typeof userId === 'string') return userId

  return userId._id || ''
}
const fetchReactions = async () => {
  const { data, execute } = useGetReactionsList(props.targetType, props.targetId)

  await execute()

  const items = data.value?.data || []

  resetCounts()

  let my: ReactionType | null = null

  for (const r of items) {
    if (r?.type) {
      localReactions[r.type] = (localReactions[r.type] || 0) + 1
    }

    const uid =
      typeof r.userId === 'object' ? r.userId._id : r.userId

    if (uid === currentUserId.value) {
      my = r.type
    }
  }

  activeReaction.value = my
}

watch(
  () => [props.targetType, props.targetId],
  () => {
    fetchedOnce.value = false
    fetchReactions()
  },
  { immediate: true },
)

const react = async (type: ReactionType) => {
  if (loading.value) return
  loading.value = true

  const previous = activeReaction.value

  try {
    if (previous === type) {
      localReactions[type] = Math.max(0, localReactions[type] - 1)
      activeReaction.value = null

      const { execute } = useDeleteReaction(props.targetType, props.targetId)
      await execute()

      return
    }

    if (previous) {
      localReactions[previous] = Math.max(0, localReactions[previous] - 1)
    }

    localReactions[type]++
    activeReaction.value = type

    const { execute } = useAddReaction(props.targetType, props.targetId, type)
    await execute()
  } catch (e) {
    if (previous) localReactions[previous]++
    if (activeReaction.value) {
      localReactions[activeReaction.value] = Math.max(0, localReactions[activeReaction.value] - 1)
    }
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
