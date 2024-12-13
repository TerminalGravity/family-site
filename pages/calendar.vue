<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Dinner Schedule</h1>
      <button
        @click="generateSchedule"
        class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Generate New Schedule
      </button>
    </div>

    <!-- Host Legend -->
    <div class="bg-white shadow rounded-lg p-4 mb-6">
      <h2 class="text-lg font-medium text-gray-900 mb-4">Hosts</h2>
      <div class="flex flex-wrap gap-4">
        <div v-for="host in store.hosts" :key="host.id" 
          class="flex items-center space-x-2">
          <span class="w-3 h-3 rounded-full" :class="getHostDotColor(host.id)"></span>
          <span class="text-sm text-gray-700">{{ host.name }}</span>
        </div>
      </div>
    </div>

    <!-- Calendar Component -->
    <Calendar />

    <!-- Schedule Info -->
    <div class="mt-6 bg-white shadow rounded-lg p-6">
      <h2 class="text-lg font-medium text-gray-900 mb-4">Schedule Information</h2>
      <div class="space-y-4">
        <p class="text-sm text-gray-600">
          The dinner schedule follows a quarterly equalization system:
        </p>
        <ul class="list-disc pl-5 text-sm text-gray-600 space-y-2">
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
        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-yellow-700">
                Need to swap dates? Contact the administrator. We'll maintain the quarterly balance while accommodating schedule changes.
              </p>
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
    '1': 'bg-blue-500',
    '2': 'bg-green-500',
    '3': 'bg-purple-500'
  }
  return colors[hostId as keyof typeof colors] || 'bg-gray-500'
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