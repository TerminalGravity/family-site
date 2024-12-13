<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Game Library</h1>
      <button
        @click="showAddGame = true"
        class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Add Game
      </button>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search -->
        <div class="md:col-span-2">
          <label for="search" class="block text-sm font-medium text-gray-700">Search Games</label>
          <div class="mt-1 relative rounded-md shadow-sm">
            <input
              type="text"
              id="search"
              v-model="store.filters.search"
              class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-4 pr-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Search by name, description, or tags"
            />
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Complexity Filter -->
        <div>
          <label for="complexity" class="block text-sm font-medium text-gray-700">Complexity</label>
          <select
            id="complexity"
            v-model="store.filters.complexity"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">All Levels</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <!-- Player Count Filter -->
        <div>
          <label for="playerCount" class="block text-sm font-medium text-gray-700">Number of Players</label>
          <input
            type="number"
            id="playerCount"
            v-model="store.filters.playerCount"
            min="1"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter player count"
          />
        </div>
      </div>

      <!-- Tags -->
      <div class="mt-4">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="tag in store.allTags"
            :key="tag"
            @click="store.toggleTag(tag)"
            :class="[
              'inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium',
              store.filters.tags.includes(tag)
                ? 'bg-indigo-100 text-indigo-800'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            ]"
          >
            {{ tag }}
          </button>
        </div>
      </div>

      <!-- Clear Filters -->
      <div class="mt-4 flex justify-end">
        <button
          @click="store.clearFilters"
          class="text-sm text-gray-600 hover:text-gray-900"
        >
          Clear Filters
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="store.isLoading" class="text-center py-12">
      <svg class="animate-spin h-8 w-8 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <!-- Error State -->
    <div v-else-if="store.error" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-red-800">{{ store.error }}</h3>
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
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No games found</h3>
      <p class="mt-1 text-sm text-gray-500">Try adjusting your search or filters, or add a new game.</p>
    </div>

    <!-- Game Details Modal -->
    <div v-if="selectedGame" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900">{{ selectedGame.title }}</h2>
            <button @click="selectedGame = null" class="text-gray-400 hover:text-gray-500">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div class="px-6 py-4">
          <div class="prose max-w-none">
            <p class="text-gray-500">{{ selectedGame.description }}</p>
            
            <div class="mt-6">
              <h3 class="text-lg font-medium text-gray-900">Rules</h3>
              <div class="mt-2 text-gray-600 whitespace-pre-line">{{ selectedGame.rules }}</div>
            </div>

            <div class="mt-6 grid grid-cols-2 gap-4">
              <div>
                <h4 class="font-medium text-gray-900">Players</h4>
                <p class="text-gray-600">{{ selectedGame.minPlayers }}-{{ selectedGame.maxPlayers }} players</p>
              </div>
              <div>
                <h4 class="font-medium text-gray-900">Duration</h4>
                <p class="text-gray-600">{{ selectedGame.duration }}</p>
              </div>
              <div>
                <h4 class="font-medium text-gray-900">Complexity</h4>
                <p class="text-gray-600">{{ selectedGame.complexity }}</p>
              </div>
              <div>
                <h4 class="font-medium text-gray-900">Last Played</h4>
                <p class="text-gray-600">
                  {{ selectedGame.lastPlayed ? formatDate(selectedGame.lastPlayed) : 'Never' }}
                </p>
              </div>
            </div>

            <!-- Ratings -->
            <div class="mt-6">
              <h3 class="text-lg font-medium text-gray-900">Ratings</h3>
              <div class="mt-2">
                <div class="flex items-center">
                  <div class="flex">
                    <template v-for="i in 5" :key="i">
                      <button
                        @click="rateGame(selectedGame.id, i)"
                        :class="[
                          'h-5 w-5',
                          i <= (userRating || Math.round(selectedGame.averageRating || 0))
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        ]"
                      >
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    </template>
                  </div>
                  <span class="ml-2 text-sm text-gray-500">
                    {{ selectedGame.ratings.length }} {{ selectedGame.ratings.length === 1 ? 'rating' : 'ratings' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Comments -->
            <div class="mt-6">
              <h3 class="text-lg font-medium text-gray-900">Comments</h3>
              <div class="mt-2 space-y-4">
                <div v-for="comment in selectedGame.comments" :key="comment.id" class="bg-gray-50 p-4 rounded-lg">
                  <div class="flex justify-between">
                    <span class="text-sm font-medium text-gray-900">{{ comment.createdBy }}</span>
                    <span class="text-sm text-gray-500">{{ formatDate(comment.createdAt) }}</span>
                  </div>
                  <p class="mt-1 text-sm text-gray-600">{{ comment.content }}</p>
                </div>
                <div class="mt-4">
                  <textarea
                    v-model="newComment"
                    rows="3"
                    class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Add a comment..."
                  ></textarea>
                  <div class="mt-2 flex justify-end">
                    <button
                      @click="addComment(selectedGame.id)"
                      class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Post Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Game Form Modal -->
    <GameForm
      v-if="showAddGame || editingGame"
      :game="editingGame"
      @close="closeGameForm"
      @save="saveGame"
    />
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '~/stores/game'
import type { Game } from '@prisma/client'

const store = useGameStore()
const selectedGame = ref<Game | null>(null)
const showAddGame = ref(false)
const editingGame = ref<Game | null>(null)
const newComment = ref('')
const userRating = ref<number>(0)

const showGameDetails = (game: Game) => {
  selectedGame.value = game
}

const editGame = (game: Game) => {
  editingGame.value = game
}

const closeGameForm = () => {
  showAddGame.value = false
  editingGame.value = null
}

const saveGame = async (game: Omit<Game, 'id' | 'createdAt' | 'updatedAt' | 'lastPlayed'>) => {
  if (editingGame.value) {
    await store.updateGame(editingGame.value.id, game)
  } else {
    await store.addGame(game)
  }
  closeGameForm()
}

const formatDate = (date: string | Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date))
}

const rateGame = async (gameId: string, rating: number) => {
  userRating.value = rating
  await store.addRating(gameId, rating)
}

const addComment = async (gameId: string) => {
  if (!newComment.value.trim()) return

  await store.addComment(gameId, newComment.value)
  newComment.value = ''
}

// Initialize data
onMounted(async () => {
  await store.fetchGames()
})
</script> 