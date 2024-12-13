import { defineStore } from 'pinia'

interface Recipe {
  id: string
  title: string
  description: string
  category: string
  ingredients: string[]
  instructions: string[]
  prepTime: string
  cookTime: string
  servings: number
  image?: string
  tags: string[]
  createdBy: string
  createdAt: string
  lastMadeAt?: string
}

interface Category {
  id: string
  name: string
  description: string
}

// Sample categories
const CATEGORIES: Category[] = [
  {
    id: 'italian',
    name: 'Italian',
    description: 'Classic Italian dishes and modern interpretations'
  },
  {
    id: 'mexican',
    name: 'Mexican',
    description: 'Traditional Mexican recipes and fusion dishes'
  },
  {
    id: 'asian',
    name: 'Asian',
    description: 'Dishes from various Asian cuisines'
  },
  {
    id: 'american',
    name: 'American',
    description: 'Classic American comfort food and BBQ'
  },
  {
    id: 'mediterranean',
    name: 'Mediterranean',
    description: 'Healthy Mediterranean dishes'
  },
  {
    id: 'desserts',
    name: 'Desserts',
    description: 'Sweet treats and baked goods'
  }
]

// Sample recipes
const SAMPLE_RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Classic Spaghetti and Meatballs',
    description: 'Traditional Italian comfort food with homemade meatballs and marinara sauce',
    category: 'italian',
    ingredients: [
      '1 lb ground beef',
      '1/2 lb ground pork',
      '1 cup breadcrumbs',
      '2 eggs',
      '1/4 cup milk',
      '1/2 cup grated Parmesan',
      '2 cloves garlic, minced',
      '1 lb spaghetti',
      '32 oz marinara sauce',
      'Salt and pepper to taste'
    ],
    instructions: [
      'Mix ground meats, breadcrumbs, eggs, milk, cheese, and garlic',
      'Form into 1.5-inch meatballs',
      'Brown meatballs in a large skillet',
      'Add marinara sauce and simmer for 30 minutes',
      'Cook spaghetti according to package instructions',
      'Serve meatballs and sauce over spaghetti'
    ],
    prepTime: '30 minutes',
    cookTime: '45 minutes',
    servings: 6,
    tags: ['pasta', 'beef', 'family-favorite'],
    createdBy: 'Smith Family',
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    title: 'Taco Night Special',
    description: 'Build-your-own taco bar with all the fixings',
    category: 'mexican',
    ingredients: [
      '2 lbs ground beef',
      'Taco seasoning',
      'Corn tortillas',
      'Flour tortillas',
      'Shredded lettuce',
      'Diced tomatoes',
      'Shredded cheese',
      'Sour cream',
      'Guacamole',
      'Salsa'
    ],
    instructions: [
      'Brown ground beef and add taco seasoning',
      'Warm tortillas',
      'Prepare all toppings and arrange in bowls',
      'Let everyone build their own tacos'
    ],
    prepTime: '20 minutes',
    cookTime: '15 minutes',
    servings: 8,
    tags: ['tacos', 'beef', 'customizable'],
    createdBy: 'Johnson Family',
    createdAt: '2024-01-02T00:00:00.000Z'
  }
]

export const useMealStore = defineStore('meal', {
  state: () => ({
    recipes: [] as Recipe[],
    categories: [] as Category[],
    searchQuery: '',
    selectedCategory: '',
    selectedTags: [] as string[]
  }),

  getters: {
    filteredRecipes: (state) => {
      return state.recipes.filter(recipe => {
        const matchesSearch = state.searchQuery === '' ||
          recipe.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          recipe.description.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          recipe.tags.some(tag => tag.toLowerCase().includes(state.searchQuery.toLowerCase()))

        const matchesCategory = state.selectedCategory === '' ||
          recipe.category === state.selectedCategory

        const matchesTags = state.selectedTags.length === 0 ||
          state.selectedTags.every(tag => recipe.tags.includes(tag))

        return matchesSearch && matchesCategory && matchesTags
      })
    },

    allTags: (state) => {
      const tagSet = new Set<string>()
      state.recipes.forEach(recipe => {
        recipe.tags.forEach(tag => tagSet.add(tag))
      })
      return Array.from(tagSet).sort()
    }
  },

  actions: {
    async initializeData() {
      // In a real app, this would fetch from an API
      this.categories = CATEGORIES
      this.recipes = SAMPLE_RECIPES
    },

    async addRecipe(recipe: Omit<Recipe, 'id' | 'createdAt'>) {
      const newRecipe: Recipe = {
        ...recipe,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      }
      this.recipes.push(newRecipe)
    },

    async updateRecipe(id: string, updates: Partial<Recipe>) {
      const recipe = this.recipes.find(r => r.id === id)
      if (recipe) {
        Object.assign(recipe, updates)
      }
    },

    async deleteRecipe(id: string) {
      const index = this.recipes.findIndex(r => r.id === id)
      if (index !== -1) {
        this.recipes.splice(index, 1)
      }
    },

    setSearchQuery(query: string) {
      this.searchQuery = query
    },

    setSelectedCategory(category: string) {
      this.selectedCategory = category
    },

    toggleTag(tag: string) {
      const index = this.selectedTags.indexOf(tag)
      if (index === -1) {
        this.selectedTags.push(tag)
      } else {
        this.selectedTags.splice(index, 1)
      }
    },

    clearFilters() {
      this.searchQuery = ''
      this.selectedCategory = ''
      this.selectedTags = []
    }
  }
}) 