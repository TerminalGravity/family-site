<template>
  <div class="bg-white shadow rounded-lg overflow-hidden">
    <!-- Game Image or Placeholder -->
    <div class="h-48 bg-gray-200 relative">
      <img
        v-if="game.imageUrl"
        :src="game.imageUrl"
        :alt="game.title"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full flex items-center justify-center bg-gray-100">
        <svg class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <!-- Complexity Badge -->
      <span class="absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-full"
        :class="getComplexityColor(game.complexity)">
        {{ game.complexity }}
      </span>
    </div>

    <!-- Game Content -->
    <div class="p-4">
      <h3 class="text-lg font-medium text-gray-900 mb-1">{{ game.title }}</h3>
      <p class="text-sm text-gray-500 mb-3">{{ game.description }}</p>

      <!-- Game Meta -->
      <div class="flex items-center text-sm text-gray-500 mb-3 space-x-4">
        <div class="flex items-center">
          <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span>{{ game.minPlayers }}-{{ game.maxPlayers }} players</span>
        </div>
        <div class="flex items-center">
          <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ game.duration }}</span>
        </div>
      </div>

      <!-- Rating -->
      <div v-if="game.averageRating" class="flex items-center mb-3">
        <div class="flex">
          <template v-for="i in 5" :key="i">
            <svg
              :class="[
                'h-4 w-4',
                i <= Math.round(game.averageRating)
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              ]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </template>
          <span class="ml-1 text-sm text-gray-500">
            ({{ game.ratings.length }} {{ game.ratings.length === 1 ? 'rating' : 'ratings' }})
          </span>
        </div>
      </div>

      <!-- Tags -->
      <div class="flex flex-wrap gap-2">
        <span v-for="tag in game.tags" :key="tag"
          class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
          {{ tag }}
        </span>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="px-4 py-3 bg-gray-50 flex justify-between">
      <div class="flex space-x-2">
        <button
          @click="$emit('view', game)"
          class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          View Details
        </button>
        <button
          v-if="isEditable"
          @click="$emit('edit', game)"
          class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Edit
        </button>
        <button
          v-if="isEditable"
          @click="confirmDelete"
          class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Game, Rating, Comment } from '@prisma/client'
import { useGameStore } from '~/stores/game'

interface GameWithDetails extends Game {
  ratings: Rating[]
  comments: Comment[]
  averageRating?: number
}

const props = defineProps<{
  game: GameWithDetails
  isEditable?: boolean
}>()

defineEmits<{
  (e: 'view', game: GameWithDetails): void
  (e: 'edit', game: GameWithDetails): void
}>()

const store = useGameStore()

const getComplexityColor = (complexity: string): string => {
  const colors = {
    'Easy': 'bg-green-100 text-green-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'Hard': 'bg-red-100 text-red-800'
  }
  return colors[complexity as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

const confirmDelete = async () => {
  if (confirm('Are you sure you want to delete this game? This action cannot be undone.')) {
    try {
      await store.deleteGame(props.game.id)
    } catch (error) {
      alert('Failed to delete game')
    }
  }
}
</script> 