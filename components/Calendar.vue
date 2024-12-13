<template>
  <div class="bg-white shadow rounded-lg p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-800">{{ currentMonth }} {{ currentYear }}</h2>
      <div class="flex space-x-2">
        <button @click="previousMonth" class="p-2 text-gray-600 hover:text-gray-900">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
        <button @click="nextMonth" class="p-2 text-gray-600 hover:text-gray-900">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="grid grid-cols-7 gap-px bg-gray-200">
      <!-- Day Headers -->
      <template v-for="day in weekDays" :key="day">
        <div class="bg-gray-50 py-2 text-center text-sm font-medium text-gray-500">
          {{ day }}
        </div>
      </template>

      <!-- Calendar Days -->
      <template v-for="{ date, isCurrentMonth, hasDinner, host } in calendarDays" :key="date.toISOString()">
        <div
          :class="[
            'bg-white p-2 h-24 relative',
            !isCurrentMonth && 'bg-gray-50 text-gray-400',
            isToday(date) && 'bg-blue-50'
          ]"
          @click="selectDate(date)"
        >
          <div class="flex justify-between">
            <span :class="[
              'text-sm',
              isToday(date) && 'text-blue-600 font-semibold'
            ]">
              {{ date.getDate() }}
            </span>
            <span v-if="hasDinner" class="text-xs px-1 py-0.5 rounded-full"
              :class="getHostColor(host)">
              {{ host?.name }}
            </span>
          </div>
          <div v-if="hasDinner" class="mt-2">
            <p class="text-xs text-gray-500 truncate">{{ getDinnerDetails(date)?.mealTheme }}</p>
          </div>
        </div>
      </template>
    </div>

    <!-- Event Details Modal -->
    <div v-if="selectedEvent" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg max-w-lg w-full p-6">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-lg font-semibold">Dinner Details</h3>
          <button @click="selectedEvent = null" class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="space-y-4">
          <div>
            <p class="text-sm text-gray-500">Date</p>
            <p class="text-base">{{ formatDate(selectedEvent.date) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Host</p>
            <p class="text-base">{{ getHostName(selectedEvent.hostId) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Meal Theme</p>
            <p class="text-base">{{ selectedEvent.mealTheme }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Game</p>
            <p class="text-base">{{ selectedEvent.game }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDinnerStore } from '~/stores/dinner'

const store = useDinnerStore()
const currentDate = ref(new Date())
const selectedEvent = ref<DinnerEvent | null>(null)

// Calendar data
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

// Computed properties
const currentMonth = computed(() => months[currentDate.value.getMonth()])
const currentYear = computed(() => currentDate.value.getFullYear())

// Calendar navigation
const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.setMonth(currentDate.value.getMonth() + 1))
}

const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.setMonth(currentDate.value.getMonth() - 1))
}

// Calendar days generation
const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  
  const startDate = new Date(firstDayOfMonth)
  startDate.setDate(startDate.getDate() - startDate.getDay())
  
  const endDate = new Date(lastDayOfMonth)
  if (endDate.getDay() !== 6) {
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()))
  }
  
  const days = []
  const currentMonth = firstDayOfMonth.getMonth()
  
  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    const dinnerEvent = getDinnerDetails(date)
    days.push({
      date: new Date(date),
      isCurrentMonth: date.getMonth() === currentMonth,
      hasDinner: !!dinnerEvent,
      host: dinnerEvent ? store.hosts.find(h => h.id === dinnerEvent.hostId) : null
    })
  }
  
  return days
})

// Helper functions
const isToday = (date: Date) => {
  const today = new Date()
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
}

const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date))
}

const getHostColor = (host: Host | null) => {
  if (!host) return ''
  const colors = {
    '1': 'bg-blue-100 text-blue-800',
    '2': 'bg-green-100 text-green-800',
    '3': 'bg-purple-100 text-purple-800'
  }
  return colors[host.id as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

const getDinnerDetails = (date: Date): DinnerEvent | undefined => {
  return store.events.find(event => {
    const eventDate = new Date(event.date)
    return eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear()
  })
}

const getHostName = (hostId: string): string => {
  const host = store.hosts.find(h => h.id === hostId)
  return host?.name || 'Unknown Host'
}

const selectDate = (date: Date) => {
  const event = getDinnerDetails(date)
  if (event) {
    selectedEvent.value = event
  }
}

// Initialize data
onMounted(async () => {
  if (store.hosts.length === 0) {
    // Add mock hosts if none exist
    store.$patch({
      hosts: [
        { id: '1', name: 'Smith Family' },
        { id: '2', name: 'Johnson Family' },
        { id: '3', name: 'Williams Family' }
      ]
    })
  }
  
  if (store.events.length === 0) {
    // Generate a year of events
    await store.generateYearlySchedule()
  }
})
</script>

<style scoped>
/* Add any component-specific styles here */
</style> 