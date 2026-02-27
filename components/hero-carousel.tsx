'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

interface HeroSlide {
  id: number
  title: string
  subtitle: string
  description: string
  cta: string
  image: string
  color: string
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    title: 'Learn & Get Certificates',
    subtitle: 'Master New Skills',
    description: 'From beginner to expert. Complete courses and earn professional certificates recognized by industry leaders.',
    cta: 'Start Learning',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&h=400&fit=crop',
    color: 'from-green-600/90 to-emerald-700/90',
  },
  {
    id: 2,
    title: 'Expert Instructors',
    subtitle: 'Learn from the Best',
    description: 'Access courses taught by industry professionals with years of real-world experience.',
    cta: 'Explore Courses',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    color: 'from-blue-600/90 to-cyan-700/90',
  },
  {
    id: 3,
    title: 'Flexible Learning',
    subtitle: 'Learn at Your Pace',
    description: 'Study whenever and wherever you want. No fixed schedules, just quality education at your convenience.',
    cta: 'Browse Programs',
    image: 'https://images.unsplash.com/photo-1516534775068-bb57e5155d91?w=800&h=400&fit=crop',
    color: 'from-purple-600/90 to-pink-700/90',
  },
  {
    id: 4,
    title: 'Build Your Future',
    subtitle: 'Career Growth Awaits',
    description: 'Invest in yourself with our comprehensive courses designed to advance your career in tech.',
    cta: 'Get Started',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop',
    color: 'from-orange-600/90 to-red-700/90',
  },
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  useEffect(() => {
    if (!autoplay) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(timer)
  }, [autoplay])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setAutoplay(false)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    setAutoplay(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
    setAutoplay(false)
  }

  const slide = heroSlides[currentSlide]

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden z-0">
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {heroSlides.map((s, index) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={s.image}
                alt={s.title}
                className="w-full h-full object-cover"
              />
              {/* Overlay Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-r ${s.color}`} />
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center justify-start">
              <div className="w-full max-w-4xl px-4 sm:px-6 md:px-8 lg:px-16 py-6 sm:py-8 md:py-12">
                <div className="mb-4 sm:mb-5 md:mb-6">
                  <p className="text-primary-foreground/80 text-xs sm:text-sm md:text-base lg:text-lg font-medium mb-1 sm:mb-2">
                    {s.subtitle}
                  </p>
                  <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary-foreground mb-3 sm:mb-4 md:mb-4 text-balance leading-tight">
                    {s.title}
                  </h2>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg text-primary-foreground/90 mb-4 sm:mb-6 md:mb-8 max-w-2xl line-clamp-3 sm:line-clamp-none">
                    {s.description}
                  </p>
                </div>
                <Button className="bg-white hover:bg-white/90 text-foreground font-semibold py-2 px-4 sm:py-3 sm:px-6 md:py-6 md:px-8 rounded-lg text-xs sm:text-sm md:text-base">
                  {s.cta}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white p-1 sm:p-2 rounded-full transition-all"
        aria-label="Previous slide"
      >
        <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 text-white p-1 sm:p-2 rounded-full transition-all"
        aria-label="Next slide"
      >
        <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicators */}
      <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2 sm:gap-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? 'bg-white w-6 sm:w-8 h-2 sm:h-3'
                : 'bg-white/50 hover:bg-white/70 w-2 sm:w-3 h-2 sm:h-3'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
