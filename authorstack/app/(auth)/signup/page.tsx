import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create your AuthorStack account',
}

export default function SignupPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="font-heading text-h2 text-ink">Create your account</h1>
        <p className="text-body text-charcoal mt-2">
          Start tracking your book sales today
        </p>
      </div>
      {/* Auth form will be implemented in Prompt 2 */}
      <div className="p-6 bg-surface rounded-lg shadow-elevated">
        <p className="text-small text-muted-foreground text-center">
          Signup form placeholder - implement with Appwrite Auth
        </p>
      </div>
    </div>
  )
}
