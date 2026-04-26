import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../contexts/AuthContext';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

type ActiveTab = 'admin' | 'member';

export const LoginPage = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ActiveTab>('admin');
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  // Already logged in — redirect
  if (user) {
    navigate(user.role === 'ADMIN' ? '/admin' : '/member', { replace: true });
    return null;
  }

  const onSubmit = async (data: LoginForm) => {
    setServerError('');
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      // AuthContext sets user — navigate based on role
      // useEffect will redirect after user state updates
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Something went wrong';
      setServerError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    setServerError('');
    reset();
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-navy-900 via-navy-600 to-navy-500">
      {/* Left — Branding */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-16 text-white">
        <div className="mb-8">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
            <span className="text-3xl font-black">B</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight leading-tight mb-4">
            Bandan<br />
            <span className="text-blue-300">Studio</span>
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-sm">
            Complete management platform for client billing and team equipment tracking.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          {[
            { emoji: '🧾', text: 'Quotation & billing management' },
            { emoji: '📷', text: 'Team equipment checkout & tracking' },
            { emoji: '💰', text: 'Payment & payout management' },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-3 text-white/70">
              <span className="text-xl">{item.emoji}</span>
              <span className="text-sm font-medium">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Login card */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="card p-8 shadow-2xl">
            {/* Logo (mobile) */}
            <div className="lg:hidden text-center mb-6">
              <div className="w-12 h-12 bg-navy-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl font-black">B</span>
              </div>
              <h2 className="text-xl font-bold text-navy-600">Bandan Studio</h2>
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-1">Sign in</h2>
            <p className="text-sm text-slate-500 mb-6">
              Admin and team members use this page
            </p>

            {/* Tab selector */}
            <div className="flex bg-slate-100 rounded-lg p-1 mb-6">
              {(['admin', 'member'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all duration-150 capitalize
                    ${activeTab === tab
                      ? 'bg-white text-navy-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  {tab === 'admin' ? '🔑 Admin' : '👤 Team Member'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {/* Email */}
              <div>
                <label className="label">Email</label>
                <input
                  {...register('email')}
                  type="email"
                  placeholder={
                    activeTab === 'admin'
                      ? 'admin@bandanstudio.com'
                      : 'yourname@bandanstudio.com'
                  }
                  className="input-field"
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="label">Password</label>
                <input
                  {...register('password')}
                  type="password"
                  placeholder="••••••••"
                  className="input-field"
                  autoComplete="current-password"
                />
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Server error */}
              {serverError && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  <p className="text-sm text-red-600 font-medium">⚠ {serverError}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full mt-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  `Sign in as ${activeTab === 'admin' ? 'Admin' : 'Team Member'}`
                )}
              </button>
            </form>

            <p className="text-center text-xs text-slate-400 mt-6">
              {activeTab === 'admin'
                ? 'Admin credentials provided at setup'
                : 'Credentials provided by your admin'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};