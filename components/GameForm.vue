<template>
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <form @submit.prevent="handleSubmit">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900">
              {{ game ? 'Edit Game' : 'Add New Game' }}
            </h2>
            <button @click="$emit('close')" type="button" class="text-gray-400 hover:text-gray-500">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Form Fields -->
        <div class="px-6 py-4 space-y-6">
          <!-- Basic Info -->
          <div class="grid grid-cols-1 gap-6">
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700">Game Title</label>
              <input
                type="text"
                id="title"
                v-model="form.title"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                v-model="form.description"
                rows="3"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              ></textarea>
            </div>

            <div>
              <label for="rules" class="block text-sm font-medium text-gray-700">Rules</label>
              <textarea
                id="rules"
                v-model="form.rules"
                rows="5"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              ></textarea>
            </div>
          </div>

          <!-- Game Details -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="minPlayers" class="block text-sm font-medium text-gray-700">Minimum Players</label>
              <input
                type="number"
                id="minPlayers"
                v-model="form.minPlayers"
                min="1"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label for="maxPlayers" class="block text-sm font-medium text-gray-700">Maximum Players</label>
              <input
                type="number"
                id="maxPlayers"
                v-model="form.maxPlayers"
                min="1"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label for="duration" class="block text-sm font-medium text-gray-700">Duration</label>
              <input
                type="text"
                id="duration"
                v-model="form.duration"
                placeholder="e.g., 30-45 minutes"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label for="complexity" class="block text-sm font-medium text-gray-700">Complexity</label>
              <select
                id="complexity"
                v-model="form.complexity"
                required
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <!-- Image URL -->
          <div>
            <label for="imageUrl" class="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="url"
              id="imageUrl"
              v-model="form.imageUrl"
              placeholder="https://example.com/image.jpg"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <!-- Tags -->
          <div>
            <label for="tags" class="block text-sm font-medium text-gray-700">Tags</label>
            <div class="mt-1">
              <input
                type="text"
                id="tags"
                v-model="tagInput"
                @keydown.enter.prevent="addTag"
                placeholder="Add tags (press Enter)"
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div class="mt-2 flex flex-wrap gap-2">
              <span
                v-for="tag in form.tags"
                :key="tag"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
              >
                {{ tag }}
                <button
                  type="button"
                  @click="removeTag(tag)"
                  class="ml-1 text-indigo-600 hover:text-indigo-500"
                >
                  <span class="sr-only">Remove tag</span>
                  ×
                </button>
              </span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {{ game ? 'Save Changes' : 'Add Game' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Game } from '@prisma/client'

const props = defineProps<{
  game?: Game
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', game: Omit<Game, 'id' | 'createdAt' | 'updatedAt' | 'lastPlayed'>): void
}>()

const tagInput = ref('')

// Initialize form with game data or defaults
const form = ref({
  title: '',
  description: '',
  rules: '',
  minPlayers: 2,
  maxPlayers: 4,
  duration: '',
  complexity: 'Medium',
  tags: [] as string[],
  imageUrl: '',
  createdBy: 'current-user' // TODO: Get from auth
})

// If editing, populate form with game data
if (props.game) {
  form.value = { ...props.game }
}

// Form methods
const addTag = () => {
  const tag = tagInput.value.trim()
  if (tag && !form.value.tags.includes(tag)) {
    form.value.tags.push(tag)
  }
  tagInput.value = ''
}

const removeTag = (tag: string) => {
  const index = form.value.tags.indexOf(tag)
  if (index !== -1) {
    form.value.tags.splice(index, 1)
  }
}

const handleSubmit = () => {
  if (form.value.minPlayers > form.value.maxPlayers) {
    alert('Minimum players cannot be greater than maximum players')
    return
  }

  emit('save', form.value)
}
</script> 