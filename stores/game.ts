import { defineStore } from 'pinia'
import type { Game, Rating, Comment } from '@prisma/client'

interface GameWithDetails extends Game {
  ratings: Rating[]
  comments: Comment[]
  averageRating?: number
}

interface GameFilters {
  search: string
  complexity: string
  playerCount: number | null
  tags: string[]
}

export const useGameStore = defineStore('game', {
  state: () => ({
    games: [] as GameWithDetails[],
    filters: {
      search: '',
      complexity: '',
      playerCount: null,
      tags: []
    } as GameFilters,
    isLoading: false,
    error: null as string | null
  }),

  getters: {
    filteredGames: (state) => {
      return state.games.filter(game => {
        const matchesSearch = state.filters.search === '' ||
          game.title.toLowerCase().includes(state.filters.search.toLowerCase()) ||
          game.description.toLowerCase().includes(state.filters.search.toLowerCase())

        const matchesComplexity = state.filters.complexity === '' ||
          game.complexity === state.filters.complexity

        const matchesPlayerCount = !state.filters.playerCount ||
          (game.minPlayers <= state.filters.playerCount &&
           game.maxPlayers >= state.filters.playerCount)

        const matchesTags = state.filters.tags.length === 0 ||
          state.filters.tags.every(tag => game.tags.includes(tag))

        return matchesSearch && matchesComplexity && matchesPlayerCount && matchesTags
      })
    },

    allTags: (state) => {
      const tagSet = new Set<string>()
      state.games.forEach(game => {
        game.tags.forEach(tag => tagSet.add(tag))
      })
      return Array.from(tagSet).sort()
    }
  },

  actions: {
    async fetchGames() {
      this.isLoading = true
      this.error = null
      try {
        const response = await fetch('/api/games')
        if (!response.ok) throw new Error('Failed to fetch games')
        const data = await response.json()
        this.games = data.map((game: GameWithDetails) => ({
          ...game,
          averageRating: game.ratings.length
            ? game.ratings.reduce((acc, r) => acc + r.value, 0) / game.ratings.length
            : undefined
        }))
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'An error occurred'
      } finally {
        this.isLoading = false
      }
    },

    async addGame(gameData: Omit<Game, 'id' | 'createdAt' | 'updatedAt'>) {
      this.isLoading = true
      this.error = null
      try {
        const response = await fetch('/api/games', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(gameData)
        })
        if (!response.ok) throw new Error('Failed to add game')
        const newGame = await response.json()
        this.games.push({ ...newGame, ratings: [], comments: [] })
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'An error occurred'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async updateGame(id: string, updates: Partial<Game>) {
      this.isLoading = true
      this.error = null
      try {
        const response = await fetch(`/api/games/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        })
        if (!response.ok) throw new Error('Failed to update game')
        const updatedGame = await response.json()
        const index = this.games.findIndex(g => g.id === id)
        if (index !== -1) {
          this.games[index] = {
            ...this.games[index],
            ...updatedGame
          }
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'An error occurred'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async deleteGame(id: string) {
      this.isLoading = true
      this.error = null
      try {
        const response = await fetch(`/api/games/${id}`, {
          method: 'DELETE'
        })
        if (!response.ok) throw new Error('Failed to delete game')
        const index = this.games.findIndex(g => g.id === id)
        if (index !== -1) {
          this.games.splice(index, 1)
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'An error occurred'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async addRating(gameId: string, value: number) {
      this.isLoading = true
      this.error = null
      try {
        const response = await fetch(`/api/games/${gameId}/ratings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value })
        })
        if (!response.ok) throw new Error('Failed to add rating')
        const newRating = await response.json()
        const game = this.games.find(g => g.id === gameId)
        if (game) {
          game.ratings.push(newRating)
          game.averageRating = game.ratings.reduce((acc, r) => acc + r.value, 0) / game.ratings.length
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'An error occurred'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async addComment(gameId: string, content: string) {
      this.isLoading = true
      this.error = null
      try {
        const response = await fetch(`/api/games/${gameId}/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content })
        })
        if (!response.ok) throw new Error('Failed to add comment')
        const newComment = await response.json()
        const game = this.games.find(g => g.id === gameId)
        if (game) {
          game.comments.push(newComment)
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'An error occurred'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    setFilters(filters: Partial<GameFilters>) {
      this.filters = { ...this.filters, ...filters }
    },

    clearFilters() {
      this.filters = {
        search: '',
        complexity: '',
        playerCount: null,
        tags: []
      }
    }
  }
}) 