<template>
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <form @submit.prevent="handleSubmit">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900">
              {{ recipe ? 'Edit Recipe' : 'Add New Recipe' }}
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
              <label for="title" class="block text-sm font-medium text-gray-700">Recipe Title</label>
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
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              ></textarea>
            </div>

            <div>
              <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
              <select
                id="category"
                v-model="form.category"
                required
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option v-for="category in store.categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Ingredients -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Ingredients</label>
            <div v-for="(ingredient, index) in form.ingredients" :key="index" class="flex mb-2">
              <input
                type="text"
                v-model="form.ingredients[index]"
                class="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="e.g., 2 cups flour"
              />
              <button
                type="button"
                @click="removeIngredient(index)"
                class="ml-2 text-red-600 hover:text-red-700"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <button
              type="button"
              @click="addIngredient"
              class="mt-2 inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Ingredient
            </button>
          </div>

          <!-- Instructions -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
            <div v-for="(instruction, index) in form.instructions" :key="index" class="flex mb-2">
              <textarea
                v-model="form.instructions[index]"
                rows="2"
                class="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                :placeholder="'Step ' + (index + 1)"
              ></textarea>
              <button
                type="button"
                @click="removeInstruction(index)"
                class="ml-2 text-red-600 hover:text-red-700"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <button
              type="button"
              @click="addInstruction"
              class="mt-2 inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Step
            </button>
          </div>

          <!-- Meta Info -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label for="prepTime" class="block text-sm font-medium text-gray-700">Prep Time</label>
              <input
                type="text"
                id="prepTime"
                v-model="form.prepTime"
                placeholder="e.g., 30 minutes"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label for="cookTime" class="block text-sm font-medium text-gray-700">Cook Time</label>
              <input
                type="text"
                id="cookTime"
                v-model="form.cookTime"
                placeholder="e.g., 1 hour"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label for="servings" class="block text-sm font-medium text-gray-700">Servings</label>
              <input
                type="number"
                id="servings"
                v-model="form.servings"
                min="1"
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
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
            {{ recipe ? 'Save Changes' : 'Add Recipe' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMealStore } from '~/stores/meal'

const props = defineProps<{
  recipe?: Recipe
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', recipe: Omit<Recipe, 'id' | 'createdAt'>): void
}>()

const store = useMealStore()
const tagInput = ref('')

// Initialize form with recipe data or defaults
const form = ref({
  title: '',
  description: '',
  category: store.categories[0]?.id || '',
  ingredients: [''],
  instructions: [''],
  prepTime: '',
  cookTime: '',
  servings: 4,
  tags: [] as string[],
  createdBy: 'current-user' // TODO: Get from auth
})

// If editing, populate form with recipe data
if (props.recipe) {
  form.value = { ...props.recipe }
}

// Form methods
const addIngredient = () => {
  form.value.ingredients.push('')
}

const removeIngredient = (index: number) => {
  form.value.ingredients.splice(index, 1)
}

const addInstruction = () => {
  form.value.instructions.push('')
}

const removeInstruction = (index: number) => {
  form.value.instructions.splice(index, 1)
}

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
  // Remove empty ingredients and instructions
  const recipe = {
    ...form.value,
    ingredients: form.value.ingredients.filter(i => i.trim()),
    instructions: form.value.instructions.filter(i => i.trim())
  }
  emit('save', recipe)
}
</script> 