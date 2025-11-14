import { SignupForm } from '@/components/auth/SignupForm';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Sign Up - AuthorStack',
  description: 'Create your AuthorStack account',
};

export default function SignupPage() {
  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.png"
            alt="AuthorStack"
            width={48}
            height={48}
          />
        </div>
        <h1 className="text-3xl font-bold text-center mb-2">Create Account</h1>
        <p className="text-center text-gray-600 mb-8">Join AuthorStack and manage your books</p>

        <SignupForm />

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
