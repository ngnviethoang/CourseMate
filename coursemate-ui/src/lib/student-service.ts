import { PagedDto, CategoryDto, CourseDto, StudentCourseDetailDto, CartDto, OrderDto, ResultIdDto } from './types'

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockCategories: CategoryDto[] = [
  {
    id: 'cat-1',
    name: 'Development',
    description: 'Software engineering & coding',
    isActive: true,
    creationTime: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat-2',
    name: 'Design',
    description: 'UI/UX and graphic design',
    isActive: true,
    creationTime: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat-3',
    name: 'Data Science',
    description: 'ML, AI and analytics',
    isActive: true,
    creationTime: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat-4',
    name: 'Business',
    description: 'Marketing, management and finance',
    isActive: true,
    creationTime: '2024-01-01T00:00:00Z'
  }
]

const mockCourses: CourseDto[] = [
  {
    id: 'course-1',
    title: 'Next.js 15 – Full Stack Development',
    description:
      'Build modern full-stack web applications with Next.js 15 including Server Components, App Router, and more.',
    price: 89,
    imageUrl: 'https://placehold.co/600x400/0ea5e9/ffffff?text=Next.js+15',
    isPublished: true,
    categoryId: 'cat-1',
    categoryName: 'Development',
    instructorId: 'inst-1',
    instructorName: 'Lee Robinson',
    creationTime: '2024-01-10T00:00:00Z'
  },
  {
    id: 'course-2',
    title: 'Advanced CSS & Sass: Flexbox, Grid, Animations',
    description: 'Level up your CSS skills with modern layouts, animations, and Sass preprocessor techniques.',
    price: 74,
    imageUrl: 'https://placehold.co/600x400/a855f7/ffffff?text=CSS+Sass',
    isPublished: true,
    categoryId: 'cat-2',
    categoryName: 'Design',
    instructorId: 'inst-2',
    instructorName: 'Jonas Schmedtmann',
    creationTime: '2024-01-15T00:00:00Z'
  },
  {
    id: 'course-3',
    title: 'Machine Learning A-Z: Python & R in Data Science',
    description:
      'Master Machine Learning with Python & R in this hands-on guide covering supervised and unsupervised techniques.',
    price: 99,
    imageUrl: 'https://placehold.co/600x400/f59e0b/ffffff?text=Machine+Learning',
    isPublished: true,
    categoryId: 'cat-3',
    categoryName: 'Data Science',
    instructorId: 'inst-3',
    instructorName: 'Kirill Eremenko',
    creationTime: '2024-01-20T00:00:00Z'
  },
  {
    id: 'course-4',
    title: 'Digital Marketing Masterclass',
    description: 'A complete guide to digital marketing strategy, social media, SEO, and paid advertising.',
    price: 59,
    imageUrl: 'https://placehold.co/600x400/ef4444/ffffff?text=Marketing',
    isPublished: true,
    categoryId: 'cat-4',
    categoryName: 'Business',
    instructorId: 'inst-4',
    instructorName: 'Ira Nersesova',
    creationTime: '2024-02-01T00:00:00Z'
  },
  {
    id: 'course-5',
    title: 'React – The Complete Guide (Hooks, Redux, TypeScript)',
    description: 'Dive in and learn React.js from scratch. Learn Hooks, Redux and much more.',
    price: 84,
    imageUrl: 'https://placehold.co/600x400/22c55e/ffffff?text=React+Complete',
    isPublished: true,
    categoryId: 'cat-1',
    categoryName: 'Development',
    instructorId: 'inst-2',
    instructorName: 'Maximilian Schwarzmuller',
    creationTime: '2024-02-10T00:00:00Z'
  },
  {
    id: 'course-6',
    title: 'Figma UI/UX Design Essentials',
    description: 'Become a UI/UX designer with Figma: wireframes, prototyping, design systems and user research.',
    price: 64,
    imageUrl: 'https://placehold.co/600x400/f97316/ffffff?text=Figma+UX',
    isPublished: true,
    categoryId: 'cat-2',
    categoryName: 'Design',
    instructorId: 'inst-5',
    instructorName: 'Daniel Walter Scott',
    creationTime: '2024-02-15T00:00:00Z'
  }
]

const mockCourseDetail: StudentCourseDetailDto = {
  id: 'course-1',
  title: 'Next.js 15 – Full Stack Development',
  description:
    'Build modern full-stack web applications with Next.js 15. This course covers the App Router, Server Components, data fetching patterns, authentication, and deployment with Vercel.',
  price: 89,
  imageUrl: 'https://placehold.co/800x450/0ea5e9/ffffff?text=Next.js+15',
  categoryId: 'cat-1',
  categoryName: 'Development',
  instructorId: 'inst-1',
  instructorName: 'Lee Robinson',
  isEnrolled: false,
  progressPercentage: 0,
  chapters: [
    {
      id: 'ch-1',
      title: 'Getting Started with Next.js',
      position: 1,
      lessons: [
        { id: 'ls-1', title: 'What is Next.js?', lessonType: 'Video', position: 1, isCompleted: false },
        { id: 'ls-2', title: 'Setting up your environment', lessonType: 'Video', position: 2, isCompleted: false },
        { id: 'ls-3', title: 'Project structure overview', lessonType: 'Reading', position: 3, isCompleted: false }
      ]
    },
    {
      id: 'ch-2',
      title: 'App Router & Routing',
      position: 2,
      lessons: [
        { id: 'ls-4', title: 'File-based routing explained', lessonType: 'Video', position: 1, isCompleted: false },
        {
          id: 'ls-5',
          title: 'Dynamic routes & catch-all segments',
          lessonType: 'Video',
          position: 2,
          isCompleted: false
        },
        { id: 'ls-6', title: 'Route Groups & Layouts', lessonType: 'Reading', position: 3, isCompleted: false },
        { id: 'ls-7', title: 'Quiz: App Router', lessonType: 'Quiz', position: 4, isCompleted: false }
      ]
    },
    {
      id: 'ch-3',
      title: 'Server Components & Data Fetching',
      position: 3,
      lessons: [
        { id: 'ls-8', title: 'Server vs Client components', lessonType: 'Video', position: 1, isCompleted: false },
        {
          id: 'ls-9',
          title: 'Fetching data with async components',
          lessonType: 'Video',
          position: 2,
          isCompleted: false
        }
      ]
    }
  ]
}

const mockCart: CartDto = {
  id: 'cart-1',
  studentId: 'student-1',
  totalPrice: 163,
  items: [
    {
      id: 'ci-1',
      courseId: 'course-1',
      courseTitle: 'Next.js 15 – Full Stack Development',
      courseImageUrl: 'https://placehold.co/200x150/0ea5e9/ffffff?text=Next.js',
      instructorName: 'Lee Robinson',
      price: 89
    },
    {
      id: 'ci-2',
      courseId: 'course-2',
      courseTitle: 'Advanced CSS & Sass: Flexbox, Grid, Animations',
      courseImageUrl: 'https://placehold.co/200x150/a855f7/ffffff?text=CSS',
      instructorName: 'Jonas Schmedtmann',
      price: 74
    }
  ]
}

const mockOrders: OrderDto[] = [
  {
    id: 'ord-aabbcc11-2233-4455-6677-889900aabbcc',
    studentId: 'student-1',
    totalAmount: 99,
    status: 1,
    items: [
      {
        id: 'oi-1',
        courseId: 'course-3',
        courseTitle: 'Machine Learning A-Z: Python & R in Data Science',
        courseImageUrl: 'https://placehold.co/200x150/f59e0b/ffffff?text=ML',
        price: 99
      }
    ]
  },
  {
    id: 'ord-11223344-5566-7788-99aa-bbccddeeff00',
    studentId: 'student-1',
    totalAmount: 59,
    status: 0,
    items: [
      {
        id: 'oi-2',
        courseId: 'course-4',
        courseTitle: 'Digital Marketing Masterclass',
        courseImageUrl: 'https://placehold.co/200x150/ef4444/ffffff?text=Marketing',
        price: 59
      }
    ]
  }
]

// ─── Mock Service ─────────────────────────────────────────────────────────────

const delay = (ms = 500) => new Promise(r => setTimeout(r, ms))

export const studentService = {
  getCategories: async (): Promise<PagedDto<CategoryDto>> => {
    await delay()
    return { items: mockCategories, pageIndex: 1, pageSize: 100, totalCount: mockCategories.length }
  },

  getCourses: async (_pageIndex = 1, _pageSize = 10, search?: string): Promise<PagedDto<CourseDto>> => {
    await delay()
    const filtered = search
      ? mockCourses.filter(c => c.title.toLowerCase().includes(search.toLowerCase()))
      : mockCourses
    return { items: filtered, pageIndex: 1, pageSize: filtered.length, totalCount: filtered.length }
  },

  getCourseById: async (id: string): Promise<StudentCourseDetailDto> => {
    await delay()
    return { ...mockCourseDetail, id }
  },

  getCart: async (): Promise<CartDto> => {
    await delay()
    return mockCart
  },

  addToCart: async (courseId: string): Promise<ResultIdDto> => {
    await delay()
    console.log('[mock] addToCart:', courseId)
    return { id: 'new-cart-item-id' }
  },

  removeFromCart: async (cartItemId: string): Promise<void> => {
    await delay()
    console.log('[mock] removeFromCart:', cartItemId)
  },

  getOrders: async (): Promise<PagedDto<OrderDto>> => {
    await delay()
    return { items: mockOrders, pageIndex: 1, pageSize: 50, totalCount: mockOrders.length }
  },

  getOrderById: async (id: string): Promise<OrderDto> => {
    await delay()
    return mockOrders.find(o => o.id === id) ?? mockOrders[0]
  },

  createOrder: async (): Promise<ResultIdDto> => {
    await delay()
    console.log('[mock] createOrder from cart')
    return { id: 'new-order-id' }
  }
}
