import { defineStore } from 'pinia'

interface Host {
  id: string
  name: string
  address: string
  phone: string
  preferredTime: string
  notes: string
}

interface DinnerEvent {
  id: string
  date: string
  hostId: string
  mealTheme: string
  game: string
  comments: Comment[]
}

interface Comment {
  id: string
  userId: string
  content: string
  timestamp: string
}

// Sample meal themes and games for random assignment
const MEAL_THEMES = [
  'Italian Night',
  'Mexican Fiesta',
  'Asian Fusion',
  'American BBQ',
  'Mediterranean Feast',
  'Comfort Food',
  'Breakfast for Dinner',
  'Seafood Special',
  'Vegetarian Delight',
  'International Potluck'
]

const GAMES = [
  'Pictionary',
  'Charades',
  'Trivial Pursuit',
  'Scrabble',
  'Monopoly',
  'Cards Against Humanity',
  'Jenga',
  'Uno',
  'Taboo',
  'Board Game of Host\'s Choice'
]

export const useDinnerStore = defineStore('dinner', {
  state: () => ({
    hosts: [
      {
        id: '1',
        name: "Abby's House",
        address: '123 Family Lane',
        phone: '(555) 123-4567',
        preferredTime: '6:00 PM',
        notes: 'Please park in the driveway or along the street. Ring doorbell on arrival.'
      },
      {
        id: '2',
        name: "Jack's House",
        address: '456 Home Street',
        phone: '(555) 234-5678',
        preferredTime: '6:30 PM',
        notes: 'Garage code available upon request. Dogs are friendly!'
      },
      {
        id: '3',
        name: 'Home',
        address: '789 Comfort Ave',
        phone: '(555) 345-6789',
        preferredTime: '6:00 PM',
        notes: 'Street parking available. Please text upon arrival.'
      }
    ] as Host[],
    events: [] as DinnerEvent[],
    currentWeek: null as DinnerEvent | null,
  }),

  getters: {
    getCurrentWeekEvent: (state) => state.currentWeek,
    getUpcomingEvents: (state) => {
      const now = new Date()
      return state.events
        .filter(event => new Date(event.date) > now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    },
  },

  actions: {
    async fetchCurrentWeek() {
      const now = new Date()
      this.currentWeek = this.events.find(event => {
        const eventDate = new Date(event.date)
        const eventWeek = getWeekNumber(eventDate)
        const currentWeek = getWeekNumber(now)
        return eventWeek === currentWeek && eventDate.getFullYear() === now.getFullYear()
      }) || null
    },

    async addComment(eventId: string, content: string) {
      const comment: Comment = {
        id: Date.now().toString(),
        userId: 'current-user', // TODO: Get from auth
        content,
        timestamp: new Date().toISOString()
      }

      const event = this.events.find(e => e.id === eventId)
      if (event) {
        event.comments.push(comment)
      }
    },

    async generateYearlySchedule() {
      // Clear existing events
      this.events = []
      
      const startDate = new Date()
      startDate.setHours(0, 0, 0, 0)
      
      // Find the next Sunday to start the schedule
      while (startDate.getDay() !== 0) {
        startDate.setDate(startDate.getDate() + 1)
      }
      
      // Initialize quarters (13 weeks each)
      const quarters = [
        { start: 0, end: 12 },
        { start: 13, end: 25 },
        { start: 26, end: 38 },
        { start: 39, end: 51 }
      ]

      // Bonus week rotation (one extra week per host per year)
      // Q1 bonus -> Host 1, Q2 bonus -> Host 2, Q3 bonus -> Host 3, Q4 bonus -> Host 1
      const bonusWeeks = {
        0: '1', // Q1 bonus to Host 1
        1: '2', // Q2 bonus to Host 2
        2: '3', // Q3 bonus to Host 3
        3: '1'  // Q4 bonus to Host 1 (cycles back)
      }
      
      // Generate events for each quarter
      quarters.forEach((quarter, quarterIndex) => {
        // Generate 4 events for each host in the quarter
        const hostsSchedule = [
          ...Array(4).fill('1'),
          ...Array(4).fill('2'),
          ...Array(4).fill('3'),
          bonusWeeks[quarterIndex as keyof typeof bonusWeeks] // Add bonus week
        ]
        
        // Shuffle the hosts schedule for this quarter
        for (let i = hostsSchedule.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [hostsSchedule[i], hostsSchedule[j]] = [hostsSchedule[j], hostsSchedule[i]]
        }
        
        // Create events for each week in the quarter
        for (let week = quarter.start; week <= quarter.end; week++) {
          const eventDate = new Date(startDate)
          eventDate.setDate(eventDate.getDate() + (week * 7))
          
          // Get host for this week from the shuffled schedule
          const hostId = hostsSchedule[week - quarter.start]
          
          // Randomly select meal theme and game
          const mealTheme = MEAL_THEMES[Math.floor(Math.random() * MEAL_THEMES.length)]
          const game = GAMES[Math.floor(Math.random() * GAMES.length)]
          
          const event: DinnerEvent = {
            id: `week-${week + 1}`,
            date: eventDate.toISOString(),
            hostId,
            mealTheme,
            game,
            comments: []
          }
          
          this.events.push(event)
        }
      })
      
      // Update current week
      await this.fetchCurrentWeek()
    }
  }
})

// Helper function to get week number
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
} 