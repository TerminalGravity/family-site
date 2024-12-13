<template>
  <div :class="{ 'dark': isDarkMode }" class="min-h-screen">
    <div class="bg-white dark:bg-gray-900 min-h-screen">
      <!-- Navigation -->
      <Navigation />

      <!-- Main Content -->
      <NuxtLayout>
        <main id="main-content" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <!-- Dark Mode Toggle -->
          <div class="fixed top-4 right-4 sm:right-8 z-50">
            <button
              @click="toggleDarkMode"
              class="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              aria-label="Toggle dark mode"
            >
              <svg
                v-if="isDarkMode"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <svg
                v-else
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            </button>
          </div>

          <!-- Page Content -->
          <NuxtPage />
        </main>
      </NuxtLayout>
    </div>

    <!-- Toast Notifications -->
    <div aria-live="polite" class="fixed bottom-0 right-0 p-6 z-50">
      <TransitionGroup
        enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="max-w-sm w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden mb-3"
        >
          <div class="p-4">
            <div class="flex items-center">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ toast.message }}
                </p>
              </div>
              <div class="ml-4 flex-shrink-0 flex">
                <button
                  @click="removeToast(toast.id)"
                  class="rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <span class="sr-only">Close</span>
                  <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, provide } from 'vue'

// Dark mode state
const isDarkMode = ref(false)

// Toast notifications
interface Toast {
  id: number
  message: string
}

const toasts = ref<Toast[]>([])
let toastId = 0

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('darkMode', 'true')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('darkMode', 'false')
  }
}

const showToast = (message: string) => {
  const id = ++toastId
  toasts.value.push({ id, message })
  setTimeout(() => removeToast(id), 5000)
}

const removeToast = (id: number) => {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

// Initialize dark mode from localStorage
onMounted(() => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const storedDarkMode = localStorage.getItem('darkMode')
  
  // Use stored preference if available, otherwise use system preference
  isDarkMode.value = storedDarkMode !== null 
    ? storedDarkMode === 'true'
    : prefersDark

  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  }
})

// Watch for system dark mode changes
onMounted(() => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', e => {
    if (localStorage.getItem('darkMode') === null) {
      isDarkMode.value = e.matches
      if (e.matches) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  })
})

// Provide toast functionality to child components
provide('showToast', showToast)
</script>

<style>
:root {
  color-scheme: light;
}

:root.dark {
  color-scheme: dark;
}

body {
  transition: background-color 0.3s ease;
}
</style>
