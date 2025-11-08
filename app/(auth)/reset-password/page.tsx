import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

export const metadata = {
  title: 'Reset Password - AuthorStack',
  description: 'Set your new password',
};

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-center mb-2">Set New Password</h1>
        <p className="text-center text-gray-600 mb-8">Enter your new password below</p>

        <ResetPasswordForm />
      </div>
    </div>
  );
}
