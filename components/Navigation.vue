<template>
  <nav class="bg-white dark:bg-slate-800/50 backdrop-blur-sm border-b border-gray-200 dark:border-slate-700/50 sticky top-0 z-30">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo and primary navigation -->
        <div class="flex">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center">
            <NuxtLink to="/" class="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
              Family Dinners
            </NuxtLink>
          </div>

          <!-- Primary Navigation -->
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <NuxtLink
              v-for="item in navigationItems"
              :key="item.name"
              :to="item.to"
              :class="[
                'inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200',
                $route.path === item.to
                  ? 'border-b-2 border-indigo-500 text-gray-900 dark:text-white'
                  : 'border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200'
              ]"
            >
              {{ item.name }}
            </NuxtLink>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="flex items-center sm:hidden">
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          >
            <span class="sr-only">Open main menu</span>
            <svg
              class="h-6 w-6"
              :class="{ 'hidden': mobileMenuOpen, 'block': !mobileMenuOpen }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg
              class="h-6 w-6"
              :class="{ 'block': mobileMenuOpen, 'hidden': !mobileMenuOpen }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-y-2 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-2 opacity-0"
    >
      <div v-if="mobileMenuOpen" class="sm:hidden bg-white dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-700/50">
        <div class="pt-2 pb-3 space-y-1">
          <NuxtLink
            v-for="item in navigationItems"
            :key="item.name"
            :to="item.to"
            :class="[
              'block pl-3 pr-4 py-2 text-base font-medium transition-colors duration-200',
              $route.path === item.to
                ? 'bg-indigo-50 dark:bg-indigo-900/50 border-l-4 border-indigo-500 text-indigo-700 dark:text-indigo-300'
                : 'border-l-4 border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-800 dark:hover:text-gray-200'
            ]"
            @click="mobileMenuOpen = false"
          >
            {{ item.name }}
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const mobileMenuOpen = ref(false)

const navigationItems = [
  { name: 'Dashboard', to: '/' },
  { name: 'Calendar', to: '/calendar' },
  { name: 'Games', to: '/game-library' },
  { name: 'Recipes', to: '/meal-library' },
  { name: 'Hosts', to: '/hosts' }
]
</script> 