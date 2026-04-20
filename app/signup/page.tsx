'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'

type RegisterResponse = {
  user?: {
    id: string
    email: string
    username: string
    name: string | null
  }
  error?: string
}

export default function SignupPage() {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isCreator, setIsCreator] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccessMessage('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim() || undefined,
          username: username.trim(),
          email: email.trim(),
          password,
          isCreator,
        }),
      })

      const data = (await response.json()) as RegisterResponse

      if (!response.ok) {
        setError(data.error || 'Unable to create your account. Please try again.')
        return
      }

      setSuccessMessage('Account created successfully. You can now start building your profile and posting picks.')
      setName('')
      setUsername('')
      setEmail('')
      setPassword('')
      setIsCreator(false)
    } catch (submitError) {
      console.error('Signup error:', submitError)
      setError('Network error while creating account. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mx-auto max-w-4xl grid gap-8 lg:grid-cols-2">
        <section className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-3">Create your Tailer account</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Join in under a minute to track verified bets and build a transparent record.
          </p>

          <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-200">
            <li>• Publish immutable bet slips before kickoff</li>
            <li>• Build public win rate and ROI statistics automatically</li>
            <li>• Enable creator mode to monetize your picks</li>
          </ul>

          <div className="mt-8 text-sm text-gray-600 dark:text-gray-300">
            Already have an account?{' '}
            <Link href="/" className="text-blue-500 hover:text-blue-600 font-semibold">
              Return home
            </Link>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Get started</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Name (optional)
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2"
                placeholder="Your display name"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                minLength={3}
                maxLength={24}
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2"
                placeholder="tailerpro"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2"
                placeholder="At least 8 characters"
              />
            </div>

            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={isCreator}
                onChange={(event) => setIsCreator(event.target.checked)}
              />
              I want to create and sell premium picks
            </label>

            {error ? (
              <p className="text-sm text-red-500">{error}</p>
            ) : null}

            {successMessage ? (
              <p className="text-sm text-green-600">{successMessage}</p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-md py-2.5 font-semibold disabled:opacity-60"
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}
