<template>
  <div class="py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white">
          Welcome to Family Dinners
        </h1>
        <p class="mt-2 text-lg text-slate-600 dark:text-slate-400">
          Your weekly family dinner and game night planner
        </p>
      </div>

      <!-- Current Week -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-4">
          This Week's Dinner
        </h2>
        <div v-if="store.currentWeek" class="card p-6">
          <div class="flex items-start space-x-4">
            <div class="flex-shrink-0">
              <span 
                class="inline-flex items-center justify-center h-12 w-12 rounded-lg"
                :class="getHostBgColor(store.currentWeek.hostId)"
              >
                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <p class="text-lg font-medium text-slate-900 dark:text-white">
                  {{ getHostName(store.currentWeek.hostId) }}
                </p>
                <p class="text-sm text-slate-500 dark:text-slate-400">
                  {{ formatDate(store.currentWeek.date) }}
                </p>
              </div>
              <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p class="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Dinner Theme
                  </p>
                  <p class="mt-1 text-base text-slate-900 dark:text-white">
                    {{ store.currentWeek.mealTheme }}
                  </p>
                </div>
                <div>
                  <p class="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Game
                  </p>
                  <p class="mt-1 text-base text-slate-900 dark:text-white">
                    {{ store.currentWeek.game }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="card p-6 text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
            <svg class="h-8 w-8 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-slate-900 dark:text-white mb-1">
            No dinner scheduled
          </h3>
          <p class="text-slate-500 dark:text-slate-400">
            Generate a new schedule to get started.
          </p>
        </div>
      </div>

      <!-- Quick Links -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <NuxtLink to="/calendar" class="card p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <span class="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
            </div>
            <div>
              <h3 class="text-lg font-medium text-slate-900 dark:text-white">
                Calendar
              </h3>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                View and manage the dinner schedule
              </p>
            </div>
          </div>
        </NuxtLink>

        <NuxtLink to="/game-library" class="card p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <span class="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
            </div>
            <div>
              <h3 class="text-lg font-medium text-slate-900 dark:text-white">
                Games
              </h3>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Browse and manage game library
              </p>
            </div>
          </div>
        </NuxtLink>

        <NuxtLink to="/meal-library" class="card p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <span class="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </span>
            </div>
            <div>
              <h3 class="text-lg font-medium text-slate-900 dark:text-white">
                Recipes
              </h3>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Browse and manage recipe library
              </p>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDinnerStore } from '~/stores/dinner'

const store = useDinnerStore()

const getHostName = (hostId: string): string => {
  const host = store.hosts.find(h => h.id === hostId)
  return host?.name || 'Unknown Host'
}

const getHostBgColor = (hostId: string): string => {
  const colors = {
    '1': 'bg-blue-500 dark:bg-blue-600',
    '2': 'bg-green-500 dark:bg-green-600',
    '3': 'bg-purple-500 dark:bg-purple-600'
  }
  return colors[hostId as keyof typeof colors] || 'bg-gray-500 dark:bg-gray-600'
}

const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date))
}

// Initialize the store if needed
onMounted(async () => {
  if (store.events.length === 0) {
    await store.generateYearlySchedule()
  }
  await store.fetchCurrentWeek()
})
</script> 