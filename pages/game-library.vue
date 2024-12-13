<template>
  <div class="py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white">
          Game Library
        </h1>
        <button
          @click="showAddGame = true"
          class="btn-primary"
        >
          Add Game
        </button>
      </div>

      <!-- Search and Filters -->
      <div class="card p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Search -->
          <div class="md:col-span-2">
            <label for="search" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Search Games
            </label>
            <div class="relative">
              <input
                type="text"
                id="search"
                v-model="store.filters.search"
                class="input w-full"
                placeholder="Search by name, description, or tags"
              />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Complexity Filter -->
          <div>
            <label for="complexity" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Complexity
            </label>
            <select
              id="complexity"
              v-model="store.filters.complexity"
              class="input w-full"
            >
              <option value="">All Levels</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <!-- Player Count Filter -->
          <div>
            <label for="playerCount" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Number of Players
            </label>
            <input
              type="number"
              id="playerCount"
              v-model="store.filters.playerCount"
              min="1"
              class="input w-full"
              placeholder="Enter player count"
            />
          </div>
        </div>

        <!-- Tags -->
        <div class="mt-6">
          <div class="flex flex-wrap gap-2">
            <button
              v-for="tag in store.allTags"
              :key="tag"
              @click="store.toggleTag(tag)"
              :class="[
                'tag',
                store.filters.tags.includes(tag)
                  ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              ]"
            >
              {{ tag }}
            </button>
          </div>
        </div>

        <!-- Clear Filters -->
        <div class="mt-6 flex justify-end">
          <button
            @click="store.clearFilters"
            class="btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="store.isLoading" class="flex justify-center py-12">
        <svg class="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <!-- Game Grid -->
      <div v-else-if="store.filteredGames.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GameCard
          v-for="game in store.filteredGames"
          :key="game.id"
          :game="game"
          :is-editable="true"
          @view="showGameDetails"
          @edit="editGame"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
          <svg class="h-8 w-8 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-slate-900 dark:text-white mb-1">No games found</h3>
        <p class="text-slate-500 dark:text-slate-400">
          Try adjusting your search or filters, or add a new game.
        </p>
      </div>
    </div>

    <!-- Game Form Modal -->
    <GameForm
      v-if="showAddGame"
      :game="selectedGame"
      @close="closeGameForm"
      @save="saveGame"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '~/stores/game'

const store = useGameStore()
const showAddGame = ref(false)
const selectedGame = ref(null)

const showGameDetails = (game: any) => {
  selectedGame.value = game
  showAddGame.value = true
}

const editGame = (game: any) => {
  selectedGame.value = game
  showAddGame.value = true
}

const closeGameForm = () => {
  showAddGame.value = false
  selectedGame.value = null
}

const saveGame = async (gameData: any) => {
  try {
    if (selectedGame.value) {
      await store.updateGame(selectedGame.value.id, gameData)
    } else {
      await store.addGame(gameData)
    }
    closeGameForm()
  } catch (error) {
    console.error('Failed to save game:', error)
  }
}

// Initialize the store
onMounted(async () => {
  if (store.games.length === 0) {
    await store.fetchGames()
  }
})
</script> 