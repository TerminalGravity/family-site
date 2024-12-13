<template>
  <div>
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="true" class="fixed inset-0 bg-slate-900/75 backdrop-blur-sm z-40"></div>
      </Transition>

      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div v-if="true" class="fixed inset-0 z-50 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <div class="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white dark:bg-slate-800 p-6 text-left align-middle shadow-xl transition-all">
              <h3 class="text-lg font-medium leading-6 text-slate-900 dark:text-white mb-4">
                {{ recipe ? 'Edit Recipe' : 'Add New Recipe' }}
              </h3>

              <form @submit.prevent="handleSubmit" class="space-y-6">
                <!-- Loading Overlay -->
                <div v-if="isLoading" class="absolute inset-0 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm flex items-center justify-center">
                  <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                </div>

                <!-- Title -->
                <div>
                  <label for="title" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    v-model="form.title"
                    :class="[
                      'input w-full',
                      errors.title ? 'border-red-500 dark:border-red-500' : ''
                    ]"
                    required
                  />
                  <p v-if="errors.title" class="mt-1 text-sm text-red-500">{{ errors.title }}</p>
                </div>

                <!-- Description -->
                <div>
                  <label for="description" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    v-model="form.description"
                    rows="3"
                    :class="[
                      'input w-full',
                      errors.description ? 'border-red-500 dark:border-red-500' : ''
                    ]"
                    required
                  ></textarea>
                  <p v-if="errors.description" class="mt-1 text-sm text-red-500">{{ errors.description }}</p>
                </div>

                <!-- Category -->
                <div>
                  <label for="category" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    v-model="form.category"
                    :class="[
                      'input w-full',
                      errors.category ? 'border-red-500 dark:border-red-500' : ''
                    ]"
                    required
                  >
                    <option value="">Select Category</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                      {{ category.name }}
                    </option>
                  </select>
                  <p v-if="errors.category" class="mt-1 text-sm text-red-500">{{ errors.category }}</p>
                </div>

                <!-- Ingredients -->
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Ingredients
                  </label>
                  <div class="space-y-2">
                    <div v-for="(ingredient, index) in form.ingredients" :key="index" class="flex gap-2">
                      <input
                        type="text"
                        v-model="form.ingredients[index]"
                        :placeholder="'Ingredient ' + (index + 1)"
                        class="input flex-1"
                      />
                      <button
                        type="button"
                        @click="removeIngredient(index)"
                        class="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    @click="addIngredient"
                    class="mt-2 btn-secondary"
                  >
                    Add Ingredient
                  </button>
                  <p v-if="errors.ingredients" class="mt-1 text-sm text-red-500">{{ errors.ingredients }}</p>
                </div>

                <!-- Instructions -->
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Instructions
                  </label>
                  <div class="space-y-2">
                    <div v-for="(instruction, index) in form.instructions" :key="index" class="flex gap-2">
                      <div class="flex-none pt-2 text-slate-400 dark:text-slate-500">
                        {{ index + 1 }}.
                      </div>
                      <textarea
                        v-model="form.instructions[index]"
                        :placeholder="'Step ' + (index + 1)"
                        rows="2"
                        class="input flex-1"
                      ></textarea>
                      <button
                        type="button"
                        @click="removeInstruction(index)"
                        class="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    @click="addInstruction"
                    class="mt-2 btn-secondary"
                  >
                    Add Step
                  </button>
                  <p v-if="errors.instructions" class="mt-1 text-sm text-red-500">{{ errors.instructions }}</p>
                </div>

                <!-- Time and Servings -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label for="prepTime" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Prep Time
                    </label>
                    <input
                      type="text"
                      id="prepTime"
                      v-model="form.prepTime"
                      placeholder="e.g., 30 minutes"
                      :class="[
                        'input w-full',
                        errors.prepTime ? 'border-red-500 dark:border-red-500' : ''
                      ]"
                      required
                    />
                    <p v-if="errors.prepTime" class="mt-1 text-sm text-red-500">{{ errors.prepTime }}</p>
                  </div>

                  <div>
                    <label for="cookTime" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Cook Time
                    </label>
                    <input
                      type="text"
                      id="cookTime"
                      v-model="form.cookTime"
                      placeholder="e.g., 1 hour"
                      :class="[
                        'input w-full',
                        errors.cookTime ? 'border-red-500 dark:border-red-500' : ''
                      ]"
                      required
                    />
                    <p v-if="errors.cookTime" class="mt-1 text-sm text-red-500">{{ errors.cookTime }}</p>
                  </div>

                  <div>
                    <label for="servings" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Servings
                    </label>
                    <input
                      type="number"
                      id="servings"
                      v-model="form.servings"
                      min="1"
                      :class="[
                        'input w-full',
                        errors.servings ? 'border-red-500 dark:border-red-500' : ''
                      ]"
                      required
                    />
                    <p v-if="errors.servings" class="mt-1 text-sm text-red-500">{{ errors.servings }}</p>
                  </div>
                </div>

                <!-- Tags -->
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Tags
                  </label>
                  <div class="flex flex-wrap gap-2 mb-2">
                    <span
                      v-for="tag in form.tags"
                      :key="tag"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200"
                    >
                      {{ tag }}
                      <button
                        type="button"
                        @click="removeTag(tag)"
                        class="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-800 focus:outline-none"
                      >
                        <span class="sr-only">Remove tag</span>
                        <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.707 6.293a1 1 0 011.414 0L10 8.586l1.879-1.88a1 1 0 111.414 1.415L11.414 10l1.879 1.879a1 1 0 01-1.414 1.414L10 11.414l-1.879 1.879a1 1 0 01-1.414-1.414L8.586 10 6.707 8.121a1 1 0 010-1.414z" />
                        </svg>
                      </button>
                    </span>
                  </div>
                  <div class="flex gap-2">
                    <input
                      type="text"
                      v-model="newTag"
                      @keyup.enter="addTag"
                      placeholder="Add a tag"
                      class="input flex-1"
                    />
                    <button
                      type="button"
                      @click="addTag"
                      class="btn-secondary"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <!-- Form Actions -->
                <div class="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    @click="$emit('close')"
                    class="btn-secondary"
                    :disabled="isLoading"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="btn-primary"
                    :disabled="isLoading"
                  >
                    {{ recipe ? 'Save Changes' : 'Add Recipe' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  recipe?: any
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', recipe: any): void
}>()

const isLoading = ref(false)
const errors = ref<Record<string, string>>({})
const newTag = ref('')

const categories = [
  { id: 'italian', name: 'Italian' },
  { id: 'mexican', name: 'Mexican' },
  { id: 'asian', name: 'Asian' },
  { id: 'american', name: 'American' },
  { id: 'mediterranean', name: 'Mediterranean' },
  { id: 'desserts', name: 'Desserts' }
]

const form = ref({
  title: '',
  description: '',
  category: '',
  ingredients: [] as string[],
  instructions: [] as string[],
  prepTime: '',
  cookTime: '',
  servings: 4,
  tags: [] as string[]
})

const validateForm = () => {
  const newErrors: Record<string, string> = {}

  if (!form.value.title.trim()) {
    newErrors.title = 'Title is required'
  }

  if (!form.value.description.trim()) {
    newErrors.description = 'Description is required'
  }

  if (!form.value.category) {
    newErrors.category = 'Category is required'
  }

  if (form.value.ingredients.length === 0) {
    newErrors.ingredients = 'At least one ingredient is required'
  }

  if (form.value.instructions.length === 0) {
    newErrors.instructions = 'At least one instruction step is required'
  }

  if (!form.value.prepTime.trim()) {
    newErrors.prepTime = 'Prep time is required'
  }

  if (!form.value.cookTime.trim()) {
    newErrors.cookTime = 'Cook time is required'
  }

  if (form.value.servings < 1) {
    newErrors.servings = 'Servings must be at least 1'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    isLoading.value = true
    await emit('save', { ...form.value })
  } catch (error) {
    console.error('Failed to save recipe:', error)
  } finally {
    isLoading.value = false
  }
}

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
  const tag = newTag.value.trim()
  if (tag && !form.value.tags.includes(tag)) {
    form.value.tags.push(tag)
  }
  newTag.value = ''
}

const removeTag = (tag: string) => {
  form.value.tags = form.value.tags.filter(t => t !== tag)
}

// Initialize form with recipe data if editing
onMounted(() => {
  if (props.recipe) {
    form.value = {
      title: props.recipe.title,
      description: props.recipe.description,
      category: props.recipe.category,
      ingredients: [...props.recipe.ingredients],
      instructions: [...props.recipe.instructions],
      prepTime: props.recipe.prepTime,
      cookTime: props.recipe.cookTime,
      servings: props.recipe.servings,
      tags: [...props.recipe.tags]
    }
  }
})
</script> 