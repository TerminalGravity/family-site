import { defineStore } from 'pinia'
import type { Photo, Comment } from '@prisma/client'

interface PhotoWithComments extends Photo {
  comments: Comment[]
}

interface PhotoFilters {
  search: string
  startDate: Date | null
  endDate: Date | null
  tags: string[]
}

export const usePhotoStore = defineStore('photo', {
  state: () => ({
    photos: [] as PhotoWithComments[],
    filters: {
      search: '',
      startDate: null,
      endDate: null,
      tags: []
    } as PhotoFilters,
    isLoading: false,
    error: null as string | null
  }),

  getters: {
    filteredPhotos: (state) => {
      return state.photos.filter(photo => {
        const matchesSearch = state.filters.search === '' ||
          photo.title.toLowerCase().includes(state.filters.search.toLowerCase()) ||
          (photo.description?.toLowerCase().includes(state.filters.search.toLowerCase()) ?? false)

        const matchesDateRange = (!state.filters.startDate || new Date(photo.dinnerDate) >= state.filters.startDate) &&
          (!state.filters.endDate || new Date(photo.dinnerDate) <= state.filters.endDate)

        const matchesTags = state.filters.tags.length === 0 ||
          state.filters.tags.every(tag => photo.tags.includes(tag))

        return matchesSearch && matchesDateRange && matchesTags
      })
    },

    photosByMonth: (state) => {
      const grouped = new Map<string, PhotoWithComments[]>()
      state.photos.forEach(photo => {
        const date = new Date(photo.dinnerDate)
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        if (!grouped.has(key)) {
          grouped.set(key, [])
        }
        grouped.get(key)?.push(photo)
      })
      return grouped
    },

    allTags: (state) => {
      const tagSet = new Set<string>()
      state.photos.forEach(photo => {
        photo.tags.forEach(tag => tagSet.add(tag))
      })
      return Array.from(tagSet).sort()
    }
  },

  actions: {
    async fetchPhotos() {
      this.isLoading = true
      this.error = null
      try {
        const response = await fetch('/api/photos')
        if (!response.ok) throw new Error('Failed to fetch photos')
        this.photos = await response.json()
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'An error occurred'
      } finally {
        this.isLoading = false
      }
    },

    async addPhoto(photoData: FormData) {
      this.isLoading = true
      this.error = null
      try {
        const response = await fetch('/api/photos', {
          method: 'POST',
          body: photoData
        })
        if (!response.ok) throw new Error('Failed to add photo')
        const newPhoto = await response.json()
        this.photos.push({ ...newPhoto, comments: [] })
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'An error occurred'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async updatePhoto(id: string, updates: Partial<Photo>) {
      this.isLoading = true
      this.error = null
      try {
        const response = await fetch(`/api/photos/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        })
        if (!response.ok) throw new Error('Failed to update photo')
        const updatedPhoto = await response.json()
        const index = this.photos.findIndex(p => p.id === id)
        if (index !== -1) {
          this.photos[index] = {
            ...this.photos[index],
            ...updatedPhoto
          }
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'An error occurred'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async deletePhoto(id: string) {
      this.isLoading = true
      this.error = null
      try {
        const response = await fetch(`/api/photos/${id}`, {
          method: 'DELETE'
        })
        if (!response.ok) throw new Error('Failed to delete photo')
        const index = this.photos.findIndex(p => p.id === id)
        if (index !== -1) {
          this.photos.splice(index, 1)
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'An error occurred'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async addComment(photoId: string, content: string) {
      this.isLoading = true
      this.error = null
      try {
        const response = await fetch(`/api/photos/${photoId}/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content })
        })
        if (!response.ok) throw new Error('Failed to add comment')
        const newComment = await response.json()
        const photo = this.photos.find(p => p.id === photoId)
        if (photo) {
          photo.comments.push(newComment)
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'An error occurred'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    setFilters(filters: Partial<PhotoFilters>) {
      this.filters = { ...this.filters, ...filters }
    },

    clearFilters() {
      this.filters = {
        search: '',
        startDate: null,
        endDate: null,
        tags: []
      }
    }
  }
}) 