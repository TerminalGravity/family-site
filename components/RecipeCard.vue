<template>
  <div class="bg-white shadow rounded-lg overflow-hidden">
    <!-- Recipe Image or Placeholder -->
    <div class="h-48 bg-gray-200 relative">
      <img
        v-if="recipe.image"
        :src="recipe.image"
        :alt="recipe.title"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full flex items-center justify-center bg-gray-100">
        <svg class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      
      <!-- Category Badge -->
      <span class="absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-full"
        :class="getCategoryColor(recipe.category)">
        {{ getCategoryName(recipe.category) }}
      </span>
    </div>

    <!-- Recipe Content -->
    <div class="p-4">
      <h3 class="text-lg font-medium text-gray-900 mb-1">{{ recipe.title }}</h3>
      <p class="text-sm text-gray-500 mb-3">{{ recipe.description }}</p>
      
      <!-- Recipe Meta -->
      <div class="flex items-center text-sm text-gray-500 mb-3 space-x-4">
        <div class="flex items-center">
          <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ recipe.prepTime }} prep</span>
        </div>
        <div class="flex items-center">
          <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>Serves {{ recipe.servings }}</span>
        </div>
      </div>

      <!-- Tags -->
      <div class="flex flex-wrap gap-2">
        <span v-for="tag in recipe.tags" :key="tag"
          class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
          {{ tag }}
        </span>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="px-4 py-3 bg-gray-50 flex justify-between">
      <div class="flex space-x-2">
        <button
          @click="$emit('view', recipe)"
          class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          View Details
        </button>
        <button
          v-if="isEditable"
          @click="$emit('edit', recipe)"
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
import { useMealStore } from '~/stores/meal'

const store = useMealStore()

const props = defineProps<{
  recipe: Recipe
  isEditable?: boolean
}>()

defineEmits<{
  (e: 'view', recipe: Recipe): void
  (e: 'edit', recipe: Recipe): void
}>()

const getCategoryName = (categoryId: string): string => {
  const category = store.categories.find(c => c.id === categoryId)
  return category?.name || categoryId
}

const getCategoryColor = (categoryId: string): string => {
  const colors: Record<string, string> = {
    'italian': 'bg-red-100 text-red-800',
    'mexican': 'bg-green-100 text-green-800',
    'asian': 'bg-yellow-100 text-yellow-800',
    'american': 'bg-blue-100 text-blue-800',
    'mediterranean': 'bg-purple-100 text-purple-800',
    'desserts': 'bg-pink-100 text-pink-800'
  }
  return colors[categoryId] || 'bg-gray-100 text-gray-800'
}

const confirmDelete = async () => {
  if (confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
    try {
      await store.deleteRecipe(props.recipe.id)
    } catch (error) {
      alert('Failed to delete recipe')
    }
  }
}
</script> 