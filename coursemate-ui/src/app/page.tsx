import { Navbar } from '@/components/home/navbar'
import { HeroSection } from '@/components/home/hero-section'
import { ContinueLearning } from '@/components/home/continue-learning'
import { Categories } from '@/components/home/categories'
import { RecommendedCourses } from '@/components/home/recommended-courses'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />

      <main className="mx-auto max-w-7xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
        <ContinueLearning />
        <Categories />
        <RecommendedCourses />
      </main>

      <footer className="mt-16 border-t py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} CourseMate. All rights reserved.
      </footer>
    </div>
  )
}
