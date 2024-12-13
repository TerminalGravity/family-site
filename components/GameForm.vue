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
                {{ game ? 'Edit Game' : 'Add New Game' }}
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

                <!-- Rules -->
                <div>
                  <label for="rules" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Rules
                  </label>
                  <textarea
                    id="rules"
                    v-model="form.rules"
                    rows="4"
                    :class="[
                      'input w-full',
                      errors.rules ? 'border-red-500 dark:border-red-500' : ''
                    ]"
                    required
                  ></textarea>
                  <p v-if="errors.rules" class="mt-1 text-sm text-red-500">{{ errors.rules }}</p>
                </div>

                <!-- Player Count -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label for="minPlayers" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Minimum Players
                    </label>
                    <input
                      type="number"
                      id="minPlayers"
                      v-model="form.minPlayers"
                      min="1"
                      :class="[
                        'input w-full',
                        errors.minPlayers ? 'border-red-500 dark:border-red-500' : ''
                      ]"
                      required
                    />
                    <p v-if="errors.minPlayers" class="mt-1 text-sm text-red-500">{{ errors.minPlayers }}</p>
                  </div>

                  <div>
                    <label for="maxPlayers" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Maximum Players
                    </label>
                    <input
                      type="number"
                      id="maxPlayers"
                      v-model="form.maxPlayers"
                      min="1"
                      :class="[
                        'input w-full',
                        errors.maxPlayers ? 'border-red-500 dark:border-red-500' : ''
                      ]"
                      required
                    />
                    <p v-if="errors.maxPlayers" class="mt-1 text-sm text-red-500">{{ errors.maxPlayers }}</p>
                  </div>
                </div>

                <!-- Duration -->
                <div>
                  <label for="duration" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Duration (e.g., "30 minutes", "1-2 hours")
                  </label>
                  <input
                    type="text"
                    id="duration"
                    v-model="form.duration"
                    :class="[
                      'input w-full',
                      errors.duration ? 'border-red-500 dark:border-red-500' : ''
                    ]"
                    required
                  />
                  <p v-if="errors.duration" class="mt-1 text-sm text-red-500">{{ errors.duration }}</p>
                </div>

                <!-- Complexity -->
                <div>
                  <label for="complexity" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Complexity
                  </label>
                  <select
                    id="complexity"
                    v-model="form.complexity"
                    :class="[
                      'input w-full',
                      errors.complexity ? 'border-red-500 dark:border-red-500' : ''
                    ]"
                    required
                  >
                    <option value="">Select Complexity</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                  <p v-if="errors.complexity" class="mt-1 text-sm text-red-500">{{ errors.complexity }}</p>
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
                    {{ game ? 'Save Changes' : 'Add Game' }}
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
  game?: any
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', game: any): void
}>()

const isLoading = ref(false)
const errors = ref<Record<string, string>>({})
const newTag = ref('')

const form = ref({
  title: '',
  description: '',
  rules: '',
  minPlayers: 1,
  maxPlayers: 1,
  duration: '',
  complexity: '',
  tags: [] as string[],
})

const validateForm = () => {
  const newErrors: Record<string, string> = {}

  if (!form.value.title.trim()) {
    newErrors.title = 'Title is required'
  }

  if (!form.value.description.trim()) {
    newErrors.description = 'Description is required'
  }

  if (!form.value.rules.trim()) {
    newErrors.rules = 'Rules are required'
  }

  if (form.value.minPlayers < 1) {
    newErrors.minPlayers = 'Minimum players must be at least 1'
  }

  if (form.value.maxPlayers < form.value.minPlayers) {
    newErrors.maxPlayers = 'Maximum players must be greater than or equal to minimum players'
  }

  if (!form.value.duration.trim()) {
    newErrors.duration = 'Duration is required'
  }

  if (!form.value.complexity) {
    newErrors.complexity = 'Complexity is required'
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
    console.error('Failed to save game:', error)
  } finally {
    isLoading.value = false
  }
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

// Initialize form with game data if editing
onMounted(() => {
  if (props.game) {
    form.value = {
      title: props.game.title,
      description: props.game.description,
      rules: props.game.rules,
      minPlayers: props.game.minPlayers,
      maxPlayers: props.game.maxPlayers,
      duration: props.game.duration,
      complexity: props.game.complexity,
      tags: [...props.game.tags],
    }
  }
})
</script> 