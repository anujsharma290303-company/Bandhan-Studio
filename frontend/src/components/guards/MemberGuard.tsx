import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const MemberGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user || (user.role !== 'MEMBER' && user.role !== 'ADMIN')) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};