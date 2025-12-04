'use client'

import { useRouter } from 'next/navigation'
import { useState, FormEvent, useEffect, useRef } from 'react'
import { saveToken } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { API_BASE } from '@/lib/config'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'student' | 'teacher'>('student')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [animate, setAnimate] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => setAnimate(true), [])

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password.trim()) {
      setError('Please enter username and password')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role }),
      })

      const data = await res.json()

      // 🔥 DEBUG: SHOW FULL RESPONSE
      console.log("FULL LOGIN RESPONSE:", data)

      // 🔥 AUTO-DETECT TOKEN NAME
      const token =
        data.accessToken ||
        data.token ||
        data.access_token ||
        data.jwt ||
        data.jwtToken

      // 🔥 SHOW TOKEN (even if undefined)
      console.log("TOKEN RECEIVED:", token)

      if (!token) {
        setError('Login failed: no token received')
        return
      }

      saveToken(token)

      // Redirect based on selected role
      if (role === 'teacher') {
        router.push('/dashboard/teacher')
      } else {
        router.push('/dashboard/student')
      }
    } catch (err) {
      console.error(err)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ---------------- PARTICLE BACKGROUND (UNCHANGED) ----------------

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = (canvas.width = window.innerWidth)
    const height = (canvas.height = window.innerHeight)
    const numParticles = 200
    const maxDistance = 200
    const particles: { x: number; y: number; vx: number; vy: number; size: number }[] = []

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.3) * 1,
        vy: (Math.random() - 0.3) * 1,
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
      particles.forEach((p) => {
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

        particles.forEach((other) => {
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

  // ---------------- UI (UNCHANGED) ----------------

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-black p-6 overflow-hidden">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />

      <Card
        className={`relative w-full max-w-md p-10 shadow-2xl rounded-3xl bg-gray-900/90 backdrop-blur-md transform transition-all duration-700 z-10 ${
          animate ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-12 scale-95'
        }`}
      >
        <CardContent>
          <h1 className="text-4xl font-bold mb-4 text-center text-red-500 animate-bounce">Login</h1>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Username</label>
              <Input
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-600 rounded-xl p-4 bg-gray-800 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">Password</label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-600 rounded-xl p-4 bg-gray-800 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">Login as</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={role === 'student'}
                    onChange={() => setRole('student')}
                    className="accent-red-500"
                  />
                  Student
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="role"
                    value="teacher"
                    checked={role === 'teacher'}
                    onChange={() => setRole('teacher')}
                    className="accent-red-500"
                  />
                  Teacher
                </label>
              </div>
            </div>

            {error && <p className="text-red-500 text-center text-sm animate-pulse">{error}</p>}

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <div className="text-center mt-4">
            <Button
              variant="link"
              className="text-red-500"
              onClick={() => router.push('/register')}
            >
              Create Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
