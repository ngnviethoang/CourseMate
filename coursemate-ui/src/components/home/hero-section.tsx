import { BookOpen, Star, TrendingUp, Users, Award } from 'lucide-react'

const STATS = [
  { icon: BookOpen, value: '10,000+', label: 'Khoá học' },
  { icon: Users, value: '500K+', label: 'Học viên' },
  { icon: Award, value: '200+', label: 'Giảng viên' },
  { icon: TrendingUp, value: '95%', label: 'Tỉ lệ hài lòng' }
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-700" />

      {/* Animated blobs */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-pink-400/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 right-1/3 h-48 w-48 rounded-full bg-cyan-400/15 blur-2xl" />

      {/* Dot pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm ring-1 ring-white/20">
            <Star className="h-3 w-3 fill-amber-300 text-amber-300" />
            Nền tảng học trực tuyến hàng đầu
          </div>

          {/* Headline */}
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Nâng cao kỹ năng,{' '}
            <span className="relative">
              <span className="relative z-10 text-amber-300">mở rộng tương lai</span>
              <svg
                className="absolute -bottom-1 left-0 w-full"
                viewBox="0 0 200 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M1 5C50 1 150 1 199 5" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="mt-4 text-base leading-relaxed text-blue-100 sm:text-lg">
            Học tập từ các chuyên gia hàng đầu. Học mọi lúc, mọi nơi theo tốc độ của bạn.
          </p>
        </div>

        {/* Stats row */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="flex items-center justify-center gap-3 rounded-xl bg-white/10 p-3 backdrop-blur-sm ring-1 ring-white/15 transition-transform hover:-translate-y-0.5"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/20">
                <Icon className="h-4 w-4 text-white" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-white leading-tight">{value}</span>
                <span className="text-[10px] text-blue-200 leading-tight">{label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
