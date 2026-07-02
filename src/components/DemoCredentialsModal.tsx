import React, { useState } from 'react';
import { X, Copy, Check, LogIn } from 'lucide-react';

interface DemoCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

export default function DemoCredentialsModal({ isOpen, onClose, onLoginClick }: DemoCredentialsModalProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewRole, setViewRole] = useState<string | null>(null);

  if (!isOpen) return null;

  const demoAccounts = [
    {
      id: 'admin',
      role: 'System Administrator',
      email: 'admin@propertyflow.com',
      password: 'password123',
      color: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800',
      iconColor: 'text-indigo-600 dark:text-indigo-400'
    },
    {
      id: 'manager',
      role: 'Property Manager',
      email: 'manager@propertyflow.com',
      password: 'password123',
      color: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800',
      iconColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      id: 'staff',
      role: 'Support Staff',
      email: 'staff@propertyflow.com',
      password: 'password123',
      color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      id: 'tenant',
      role: 'Tenant',
      email: 'tenant.a@example.com',
      password: 'password123',
      color: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
      iconColor: 'text-orange-600 dark:text-orange-400'
    }
  ];

  const handleCopy = (account: typeof demoAccounts[0]) => {
    const text = `Email: ${account.email}\nPassword: ${account.password}`;
    navigator.clipboard.writeText(text);
    setCopiedId(account.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSignIn = () => {
    onClose();
    onLoginClick();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Demo Credentials
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Use these credentials to explore the different role-based views and capabilities within the PropertyFlow platform. Passwords are hidden by default for security best practices.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {demoAccounts.map(account => (
              <div key={account.id} className={`p-5 rounded-xl border ${account.color} transition-all`}>
                <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center ${account.iconColor}`}>
                  <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
                  {account.role}
                </h3>
                
                <div className="space-y-3 mb-5">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</span>
                    <div className="text-sm font-mono text-slate-900 dark:text-slate-100 bg-white/50 dark:bg-black/20 py-1.5 px-3 rounded mt-1 border border-black/5 dark:border-white/5">
                      {account.email}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Password</span>
                    <div className="text-sm font-mono text-slate-900 dark:text-slate-100 bg-white/50 dark:bg-black/20 py-1.5 px-3 rounded mt-1 border border-black/5 dark:border-white/5 flex justify-between items-center h-8">
                      {viewRole === account.id ? (
                        <span>{account.password}</span>
                      ) : (
                        <span className="text-slate-400 tracking-[0.2em] text-xs">•••••••••••</span>
                      )}
                      <button 
                        onClick={() => setViewRole(viewRole === account.id ? null : account.id)}
                        className="text-[10px] uppercase font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        {viewRole === account.id ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(account)}
                    className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    {copiedId === account.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-500" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleSignIn}
                    className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg bg-[#0F766E] hover:bg-[#115E59] dark:bg-[#14B8A6] dark:hover:bg-[#0D9488] text-white text-xs font-bold transition-colors"
                  >
                    <LogIn className="w-3.5 h-3.5 text-white" />
                    <span>Sign In</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
