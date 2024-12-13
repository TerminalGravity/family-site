<template>
  <div class="py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white">
          Recipe Library
        </h1>
        <button
          @click="showAddRecipe = true"
          class="btn-primary"
        >
          Add Recipe
        </button>
      </div>

      <!-- Search and Filters -->
      <div class="card p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Search -->
          <div class="md:col-span-2">
            <label for="search" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Search Recipes
            </label>
            <div class="relative">
              <input
                type="text"
                id="search"
                v-model="store.searchQuery"
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

          <!-- Category Filter -->
          <div>
            <label for="category" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              id="category"
              v-model="store.selectedCategory"
              class="input w-full"
            >
              <option value="">All Categories</option>
              <option v-for="category in store.categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
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
                store.selectedTags.includes(tag)
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

      <!-- Recipe Grid -->
      <div v-if="store.filteredRecipes.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RecipeCard
          v-for="recipe in store.filteredRecipes"
          :key="recipe.id"
          :recipe="recipe"
          :is-editable="true"
          @view="showRecipeDetails"
          @edit="editRecipe"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
          <svg class="h-8 w-8 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-slate-900 dark:text-white mb-1">No recipes found</h3>
        <p class="text-slate-500 dark:text-slate-400">
          Try adjusting your search or filters, or add a new recipe.
        </p>
      </div>
    </div>

    <!-- Recipe Form Modal -->
    <RecipeForm
      v-if="showAddRecipe"
      :recipe="selectedRecipe"
      @close="closeRecipeForm"
      @save="saveRecipe"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMealStore } from '~/stores/meal'

const store = useMealStore()
const showAddRecipe = ref(false)
const selectedRecipe = ref(null)

const showRecipeDetails = (recipe: any) => {
  selectedRecipe.value = recipe
  showAddRecipe.value = true
}

const editRecipe = (recipe: any) => {
  selectedRecipe.value = recipe
  showAddRecipe.value = true
}

const closeRecipeForm = () => {
  showAddRecipe.value = false
  selectedRecipe.value = null
}

const saveRecipe = async (recipeData: any) => {
  try {
    if (selectedRecipe.value) {
      await store.updateRecipe(selectedRecipe.value.id, recipeData)
    } else {
      await store.addRecipe(recipeData)
    }
    closeRecipeForm()
  } catch (error) {
    console.error('Failed to save recipe:', error)
  }
}

// Initialize the store
onMounted(() => {
  store.initializeData()
})
</script> 