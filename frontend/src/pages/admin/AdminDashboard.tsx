import { useAuth } from '../../contexts/AuthContext';

export const AdminDashboard = () => {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="card p-8 text-center">
        <h1 className="text-2xl font-bold text-navy-600 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-slate-500 mb-4">Welcome, {user?.email}</p>
        <button onClick={logout} className="btn-secondary">
          Logout
        </button>
      </div>
    </div>
  );
};