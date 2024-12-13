export default defineNuxtRouteMiddleware((to, from) => {
  // TODO: Implement proper authentication
  // For now, we'll use a simple check for a token in localStorage
  if (process.client) {
    const token = localStorage.getItem('family-site-token')
    if (!token && to.path !== '/login') {
      return navigateTo('/login')
    }
  }
}) 