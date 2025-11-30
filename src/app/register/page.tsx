'use client'

import { useRouter } from 'next/navigation'
import { useState, FormEvent, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { API_BASE } from '@/lib/config'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
}

export default function RegisterPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [error, setError] = useState('')
  const [animate, setAnimate] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => setAnimate(true), [])

  async function handleRegister(e: FormEvent) {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email, mobile }),
      })

      const data = await res.json()
      if (!res.ok) return setError(data.message || 'Register failed')

      // Save user data to localStorage after successful registration
      localStorage.setItem('user', JSON.stringify({
        name: username,
        email,
        phone: mobile,
      }))

      router.push('/login')
    } catch {
      setError('Something went wrong. Please try again.')
    }
  }

  // Spider-web effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = (canvas.width = window.innerWidth)
    const height = (canvas.height = window.innerHeight)
    const numParticles = 200
    const maxDistance = 200
    const particlesArr: Particle[] = []

    for (let i = 0; i < numParticles; i++) {
      particlesArr.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
        size: 2 + Math.random() * 2,
      })
    }

    const mouse = { x: width / 2, y: height / 2 }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    window.addEventListener('mousemove', handleMouseMove)

    const animateParticles = () => {
      ctx.clearRect(0, 0, width, height)

      particlesArr.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = 'white'
        ctx.fill()

        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < maxDistance) {
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.strokeStyle = `rgba(255,255,255,${1 - dist / maxDistance})`
          ctx.lineWidth = 1.2
          ctx.stroke()
        }

        particlesArr.forEach((other) => {
          const dx = p.x - other.x
          const dy = p.y - other.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(other.x, other.y)
            ctx.strokeStyle = `rgba(255,255,255,${1 - dist / 120})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        })
      })
      requestAnimationFrame(animateParticles)
    }

    animateParticles()
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-black p-6 overflow-hidden">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />

      <Card
        className={`relative w-full max-w-md p-10 shadow-2xl rounded-3xl bg-gray-900/90 backdrop-blur-md transform transition-all duration-700 z-10 ${
          animate ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-12 scale-95'
        }`}
      >
        <CardContent>
          <h1 className="text-4xl font-bold mb-4 text-center text-red-500 animate-bounce">
            Create Account
          </h1>
          <p className="text-gray-300 text-center mb-8 font-semibold">
            Register your account
          </p>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="relative">
              <label className="block text-gray-300 mb-2 font-medium">Username</label>
              <Input
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-600 rounded-xl p-4 bg-gray-800 text-white focus:ring-2 focus:ring-red-500 shadow-sm transition duration-300 hover:shadow-md"
              />
            </div>

            <div className="relative">
              <label className="block text-gray-300 mb-2 font-medium">Email</label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-600 rounded-xl p-4 bg-gray-800 text-white focus:ring-2 focus:ring-red-500 shadow-sm transition duration-300 hover:shadow-md"
              />
            </div>

            <div className="relative">
              <label className="block text-gray-300 mb-2 font-medium">Mobile Number</label>
              <Input
                type="tel"
                placeholder="Enter your mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full border border-gray-600 rounded-xl p-4 bg-gray-800 text-white focus:ring-2 focus:ring-red-500 shadow-sm transition duration-300 hover:shadow-md"
              />
            </div>

            <div className="relative">
              <label className="block text-gray-300 mb-2 font-medium">Password</label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-600 rounded-xl p-4 bg-gray-800 text-white focus:ring-2 focus:ring-red-500 shadow-sm transition duration-300 hover:shadow-md"
              />
            </div>

            {error && <p className="text-red-500 text-center text-sm animate-pulse">{error}</p>}

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-xl transform transition duration-300 hover:scale-105 shadow-lg"
            >
              Register
            </Button>
          </form>

          <div className="flex items-center my-6">
            <hr className="flex-1 border-gray-700" />
            <span className="mx-4 text-gray-400">or</span>
            <hr className="flex-1 border-gray-700" />
          </div>

          <div className="text-center">
            <Button
              variant="link"
              className="text-red-500 hover:underline font-medium transition transform hover:scale-105"
              onClick={() => router.push('/login')}
            >
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
