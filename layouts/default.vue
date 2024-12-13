<template>
  <div class="min-h-screen">
    <!-- Navigation Header -->
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <!-- Logo -->
            <div class="flex-shrink-0 flex items-center">
              <NuxtLink to="/" class="text-xl font-bold text-indigo-600">
                Family Dinners
              </NuxtLink>
            </div>

            <!-- Navigation Links -->
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NuxtLink to="/" class="nav-link" active-class="active-nav-link">
                Dashboard
              </NuxtLink>
              <NuxtLink to="/calendar" class="nav-link" active-class="active-nav-link">
                Calendar
              </NuxtLink>
              <NuxtLink to="/meal-library" class="nav-link" active-class="active-nav-link">
                Meals
              </NuxtLink>
              <NuxtLink to="/game-library" class="nav-link" active-class="active-nav-link">
                Games
              </NuxtLink>
              <NuxtLink to="/photos" class="nav-link" active-class="active-nav-link">
                Photos
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
// Layout logic here
</script>

<style>
.nav-link {
  @apply inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700;
}

.active-nav-link {
  @apply border-b-2 border-indigo-500 text-gray-900;
}
</style> 