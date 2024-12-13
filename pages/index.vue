<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Family Dinner Dashboard</h1>
    
    <!-- Current Week Section -->
    <div class="bg-white shadow rounded-lg p-6 mb-8">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">This Week's Dinner</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <dl class="space-y-4">
            <div>
              <dt class="text-sm font-medium text-gray-500">Host</dt>
              <dd class="text-lg text-gray-900">Smith Family</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Date</dt>
              <dd class="text-lg text-gray-900">{{ formatDate(new Date()) }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Meal Theme</dt>
              <dd class="text-lg text-gray-900">Italian Night</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Game</dt>
              <dd class="text-lg text-gray-900">Pictionary</dd>
            </div>
          </dl>
        </div>
        <div class="space-y-4">
          <button class="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
            Add Comment
          </button>
          <button class="w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50">
            View Details
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Links -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-2">Recent Photos</h3>
        <p class="text-gray-500 mb-4">View photos from our last gathering</p>
        <NuxtLink to="/photos" class="text-indigo-600 hover:text-indigo-800">
          Browse Photos →
        </NuxtLink>
      </div>
      
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-2">Meal Library</h3>
        <p class="text-gray-500 mb-4">Find inspiration for your next dinner</p>
        <NuxtLink to="/meal-library" class="text-indigo-600 hover:text-indigo-800">
          View Recipes →
        </NuxtLink>
      </div>
      
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-2">Game Night</h3>
        <p class="text-gray-500 mb-4">Discover new games to play</p>
        <NuxtLink to="/game-library" class="text-indigo-600 hover:text-indigo-800">
          Browse Games →
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}
</script> 