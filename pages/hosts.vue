<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Host Information</h1>
    </div>

    <!-- Host Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="host in store.hosts" :key="host.id" 
        class="bg-white shadow rounded-lg overflow-hidden">
        <div class="p-6">
          <div class="flex items-center space-x-3 mb-4">
            <span class="w-4 h-4 rounded-full" :class="getHostDotColor(host.id)"></span>
            <h2 class="text-xl font-semibold text-gray-900">{{ host.name }}</h2>
          </div>
          
          <!-- Host Details -->
          <div class="space-y-4">
            <div class="flex items-start space-x-3">
              <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <h3 class="text-sm font-medium text-gray-900">Address</h3>
                <p class="mt-1 text-sm text-gray-500">{{ host.address }}</p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <div>
                <h3 class="text-sm font-medium text-gray-900">Contact</h3>
                <p class="mt-1 text-sm text-gray-500">{{ host.phone }}</p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 class="text-sm font-medium text-gray-900">Preferred Dinner Time</h3>
                <p class="mt-1 text-sm text-gray-500">{{ host.preferredTime }}</p>
              </div>
            </div>

            <div class="flex items-start space-x-3">
              <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 class="text-sm font-medium text-gray-900">Notes</h3>
                <p class="mt-1 text-sm text-gray-500">{{ host.notes }}</p>
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
    '1': 'bg-blue-500',
    '2': 'bg-green-500',
    '3': 'bg-purple-500'
  }
  return colors[hostId as keyof typeof colors] || 'bg-gray-500'
}
</script> 