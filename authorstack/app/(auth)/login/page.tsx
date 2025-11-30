import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to your AuthorStack account',
}

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="font-heading text-h2 text-ink">Welcome back</h1>
        <p className="text-body text-charcoal mt-2">
          Sign in to access your dashboard
        </p>
      </div>
      {/* Auth form will be implemented in Prompt 2 */}
      <div className="p-6 bg-surface rounded-lg shadow-elevated">
        <p className="text-small text-muted-foreground text-center">
          Login form placeholder - implement with Appwrite Auth
        </p>
      </div>
    </div>
  )
}
