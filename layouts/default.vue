<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
    <div class="min-h-screen flex flex-col">
      <!-- Background gradient effects -->
      <div class="fixed inset-0">
        <div class="absolute inset-0 bg-gradient-to-br from-indigo-50/20 via-transparent to-purple-50/20 dark:from-indigo-950/20 dark:to-purple-950/20"></div>
        <div class="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-slate-100/[0.03] bg-[size:20px_20px]"></div>
      </div>
      
      <!-- Content -->
      <div class="relative flex-1 flex flex-col z-10">
        <slot />
      </div>

      <!-- Theme Toggle -->
      <ThemeToggle />
    </div>
  </div>
</template>

<script setup lang="ts">
import ThemeToggle from '~/components/ThemeToggle.vue'
</script>

<style>
/* Base styles */
:root {
  --primary: rgb(79, 70, 229);
  --primary-light: rgb(99, 102, 241);
  --primary-dark: rgb(67, 56, 202);
  
  /* Light mode */
  --bg-main: rgb(249, 250, 251);
  --bg-card: rgb(255, 255, 255);
  --text-primary: rgb(17, 24, 39);
  --text-secondary: rgb(107, 114, 128);
  --border-color: rgb(229, 231, 235);
}

/* Dark mode */
:root.dark {
  --primary: rgb(129, 140, 248);
  --primary-light: rgb(165, 180, 252);
  --primary-dark: rgb(99, 102, 241);
  
  --bg-main: rgb(15, 23, 42);
  --bg-card: rgb(30, 41, 59);
  --text-primary: rgb(241, 245, 249);
  --text-secondary: rgb(148, 163, 184);
  --border-color: rgb(51, 65, 85);
}

/* Smooth transitions */
.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Enhanced focus styles */
*:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--text-secondary);
  border-radius: 4px;
}

.dark ::-webkit-scrollbar-thumb {
  background: var(--border-color);
}

/* Card styles */
.card {
  @apply bg-white dark:bg-slate-800 rounded-lg shadow-sm dark:shadow-lg dark:shadow-slate-800/50 border border-gray-100 dark:border-slate-700/50;
}

/* Button styles */
.btn-primary {
  @apply bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900;
}

.btn-secondary {
  @apply bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-slate-900;
}

/* Input styles */
.input {
  @apply bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors duration-200;
}

/* Tag styles */
.tag {
  @apply inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200;
}

/* Grid background pattern */
.bg-grid-slate-900 {
  background-image: linear-gradient(currentColor 1px, transparent 1px),
    linear-gradient(to right, currentColor 1px, transparent 1px);
}

.bg-grid-slate-100 {
  background-image: linear-gradient(currentColor 1px, transparent 1px),
    linear-gradient(to right, currentColor 1px, transparent 1px);
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

.animate-slide-in {
  animation: slideIn 0.5s ease-out;
}
</style> 