<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Meal Library</h1>
      <button
        @click="showAddRecipe = true"
        class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Add Recipe
      </button>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Search -->
        <div>
          <label for="search" class="block text-sm font-medium text-gray-700">Search Recipes</label>
          <div class="mt-1 relative rounded-md shadow-sm">
            <input
              type="text"
              id="search"
              v-model="store.searchQuery"
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

        <!-- Category Filter -->
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
          <select
            id="category"
            v-model="store.selectedCategory"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">All Categories</option>
            <option v-for="category in store.categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <!-- Clear Filters -->
        <div class="flex items-end">
          <button
            @click="store.clearFilters"
            class="text-sm text-gray-600 hover:text-gray-900"
          >
            Clear Filters
          </button>
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
              store.selectedTags.includes(tag)
                ? 'bg-indigo-100 text-indigo-800'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            ]"
          >
            {{ tag }}
          </button>
        </div>
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
    <div v-else class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No recipes found</h3>
      <p class="mt-1 text-sm text-gray-500">Try adjusting your search or filters, or add a new recipe.</p>
    </div>

    <!-- Recipe Details Modal -->
    <div v-if="selectedRecipe" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900">{{ selectedRecipe.title }}</h2>
            <button @click="selectedRecipe = null" class="text-gray-400 hover:text-gray-500">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div class="px-6 py-4">
          <div class="prose max-w-none">
            <p class="text-gray-500">{{ selectedRecipe.description }}</p>
            
            <div class="mt-6">
              <h3 class="text-lg font-medium text-gray-900">Ingredients</h3>
              <ul class="mt-2 list-disc list-inside">
                <li v-for="ingredient in selectedRecipe.ingredients" :key="ingredient" class="text-gray-600">
                  {{ ingredient }}
                </li>
              </ul>
            </div>
            
            <div class="mt-6">
              <h3 class="text-lg font-medium text-gray-900">Instructions</h3>
              <ol class="mt-2 list-decimal list-inside">
                <li v-for="(step, index) in selectedRecipe.instructions" :key="index" class="text-gray-600">
                  {{ step }}
                </li>
              </ol>
            </div>

            <div class="mt-6 flex items-center text-sm text-gray-500 space-x-4">
              <div>Prep Time: {{ selectedRecipe.prepTime }}</div>
              <div>Cook Time: {{ selectedRecipe.cookTime }}</div>
              <div>Serves: {{ selectedRecipe.servings }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recipe Form Modal -->
    <RecipeForm
      v-if="showAddRecipe || editingRecipe"
      :recipe="editingRecipe"
      @close="closeRecipeForm"
      @save="saveRecipe"
    />
  </div>
</template>

<script setup lang="ts">
import { useMealStore } from '~/stores/meal'

const store = useMealStore()
const selectedRecipe = ref<Recipe | null>(null)
const showAddRecipe = ref(false)
const editingRecipe = ref<Recipe | null>(null)

const showRecipeDetails = (recipe: Recipe) => {
  selectedRecipe.value = recipe
}

const editRecipe = (recipe: Recipe) => {
  editingRecipe.value = recipe
}

const closeRecipeForm = () => {
  showAddRecipe.value = false
  editingRecipe.value = null
}

const saveRecipe = async (recipe: Omit<Recipe, 'id' | 'createdAt'>) => {
  if (editingRecipe.value) {
    await store.updateRecipe(editingRecipe.value.id, recipe)
  } else {
    await store.addRecipe(recipe)
  }
  closeRecipeForm()
}

// Initialize data
onMounted(async () => {
  await store.initializeData()
})
</script> 