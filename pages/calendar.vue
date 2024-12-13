<template>
  <div class="py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white">
          Dinner Schedule
        </h1>
        <button
          @click="generateSchedule"
          class="btn-primary"
        >
          Generate New Schedule
        </button>
      </div>

      <!-- Host Legend -->
      <div class="card p-6 mb-8">
        <h2 class="text-lg font-medium text-slate-900 dark:text-white mb-4">Hosts</h2>
        <div class="flex flex-wrap gap-4">
          <div 
            v-for="host in store.hosts" 
            :key="host.id" 
            class="flex items-center space-x-2"
          >
            <span 
              class="w-3 h-3 rounded-full" 
              :class="getHostDotColor(host.id)"
            ></span>
            <span class="text-sm text-slate-700 dark:text-slate-300">
              {{ host.name }}
            </span>
          </div>
        </div>
      </div>

      <!-- Calendar Component -->
      <div class="card overflow-hidden">
        <Calendar />
      </div>

      <!-- Schedule Info -->
      <div class="mt-8 card p-6">
        <h2 class="text-lg font-medium text-slate-900 dark:text-white mb-4">
          Schedule Information
        </h2>
        <div class="space-y-4">
          <p class="text-sm text-slate-600 dark:text-slate-400">
            The dinner schedule follows a quarterly equalization system:
          </p>
          <ul class="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-2">
            <li>Each quarter (13 weeks) includes:
              <ul class="list-circle pl-5 mt-1">
                <li>4 dinners at each host's location</li>
                <li>1 bonus week that rotates between hosts</li>
              </ul>
            </li>
            <li>Bonus weeks rotate quarterly:
              <ul class="list-circle pl-5 mt-1">
                <li>Q1 bonus: Abby's</li>
                <li>Q2 bonus: Jack's</li>
                <li>Q3 bonus: Home</li>
                <li>Q4 bonus: Abby's (cycle repeats)</li>
              </ul>
            </li>
            <li>Within each quarter, the schedule is randomized for variety while maintaining the equal distribution.</li>
          </ul>

          <!-- Warning Box -->
          <div class="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 dark:border-amber-500 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-amber-400 dark:text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-amber-700 dark:text-amber-200">
                  Need to swap dates? Contact the administrator. We'll maintain the quarterly balance while accommodating schedule changes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDinnerStore } from '~/stores/dinner'

const store = useDinnerStore()

const getHostDotColor = (hostId: string): string => {
  const colors = {
    '1': 'bg-blue-500 dark:bg-blue-400',
    '2': 'bg-green-500 dark:bg-green-400',
    '3': 'bg-purple-500 dark:bg-purple-400'
  }
  return colors[hostId as keyof typeof colors] || 'bg-gray-500 dark:bg-gray-400'
}

const generateSchedule = async () => {
  if (confirm('Are you sure you want to generate a new schedule? This will replace the current schedule.')) {
    await store.generateYearlySchedule()
  }
}

// Initialize the store if needed
onMounted(async () => {
  if (store.events.length === 0) {
    await store.generateYearlySchedule()
  }
})
</script>

<style>
.list-circle {
  list-style-type: circle;
}
</style> 