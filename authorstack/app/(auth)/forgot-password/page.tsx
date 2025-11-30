import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Reset your AuthorStack password',
}

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="font-heading text-h2 text-ink">Reset password</h1>
        <p className="text-body text-charcoal mt-2">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>
      {/* Auth form will be implemented in Prompt 2 */}
      <div className="p-6 bg-surface rounded-lg shadow-elevated">
        <p className="text-small text-muted-foreground text-center">
          Password reset form placeholder - implement with Appwrite Auth
        </p>
      </div>
    </div>
  )
}
