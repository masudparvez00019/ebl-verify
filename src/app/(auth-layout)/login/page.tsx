'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Sparkles,
  KeyRound,
  CheckCircle2,
  LockKeyhole,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/shared/theme-toggle';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const fillDemoAdmin = () => {
    setEmail('admin@eblverify.com');
    setPassword('Admin@123456');
    toast.info('Demo admin credentials filled!');
  };

  const handleForgotPassword = () => {
    toast.info('Please contact your System Administrator to reset your admin password.', {
      duration: 4000,
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      toast.success('Welcome back, Admin! Redirecting to Dashboard...');
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 800);
    } catch (err: any) {
      toast.error(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 selection:bg-[#F5C518]/30">
      
      {/* ── Top Bar Header Matching EBL Theme ── */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-xs transition-colors">
        {/* Left: EBL Main Logo */}
        <Link href="/" className="flex items-center gap-2 group transition-transform active:scale-95">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/ebl-logo-left.png"
            alt="Eastern Bank PLC Logo"
            className="h-10 md:h-12 w-auto object-contain transition-opacity hover:opacity-95"
          />
        </Link>

        {/* Right: EBL Self Service Logo & Theme Switcher */}
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/ebl-logo-right.png"
            alt="EBL Self Service"
            className="h-10 md:h-12 w-auto object-contain hidden sm:block"
          />
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />
          <ThemeToggle />
        </div>
      </header>

      {/* Signature EBL Gold Yellow Accent Line */}
      <div className="h-1 bg-[#F5C518] w-full shadow-xs" />

      {/* ── Main Content Area with Dynamic Background ── */}
      <main className="relative flex-1 flex items-center justify-center p-4 md:p-8 overflow-hidden">
        {/* Subtle EBL Deep Navy Ambient Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#003876]/15 dark:bg-[#003876]/25 rounded-full blur-[120px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#F5C518]/10 dark:bg-[#F5C518]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Dynamic Decorative Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-md my-6"
        >
          {/* Glassmorphic Login Card */}
          <div className="bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-900/10 dark:shadow-black/70 backdrop-blur-2xl rounded-3xl overflow-hidden transition-all">
            
            {/* Card Top Brand Banner (EBL Navy Gradient Header) */}
            <div className="relative bg-gradient-to-r from-[#003876] via-[#002b5c] to-[#001c3d] text-white p-6 pb-7 text-center overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-[#F5C518]/20 rounded-full blur-lg pointer-events-none" />
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
                className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-0.5 shadow-lg shadow-black/20 mb-3"
              >
                <ShieldCheck className="w-8 h-8 text-[#F5C518]" />
              </motion.div>

              <Badge className="bg-[#F5C518] text-slate-950 font-bold text-[10px] px-2.5 py-0.5 mb-2 hover:bg-[#e0b20f] border-none tracking-wider uppercase">
                Official Admin Portal
              </Badge>

              <h1 className="text-2xl font-bold tracking-tight text-white">
                EBL Verification System
              </h1>
              <p className="text-xs text-blue-100/80 mt-1 max-w-xs mx-auto">
                Secure access for statement verification & admin management
              </p>
            </div>

            {/* Card Body & Form */}
            <div className="p-6 md:p-8 space-y-6">
              
              {/* Quick Demo Autofill Pill */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                onClick={fillDemoAdmin}
                className="w-full text-xs py-2.5 px-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-blue-900 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all flex items-center justify-between group shadow-2xs"
              >
                <span className="flex items-center gap-2 font-medium">
                  <Sparkles className="w-4 h-4 text-[#003876] dark:text-[#F5C518] animate-spin" style={{ animationDuration: '6s' }} />
                  Testing? Click to fill default admin credentials
                </span>
                <span className="font-mono text-[10px] bg-[#003876] text-white dark:bg-blue-900 dark:text-blue-100 px-2 py-0.5 rounded-md font-semibold group-hover:bg-[#002957] transition-colors">
                  Auto Fill
                </span>
              </motion.button>

              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email Address */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Admin Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@eblverify.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-[#003876] dark:focus:border-blue-500 focus:ring-[#003876]/20 dark:focus:ring-blue-500/20 h-11 text-sm rounded-xl transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Password
                    </Label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs font-medium text-[#003876] dark:text-blue-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10 pr-10 bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-[#003876] dark:focus:border-blue-500 focus:ring-[#003876]/20 dark:focus:ring-blue-500/20 h-11 text-sm rounded-xl transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Option */}
                <div className="flex items-center justify-between pt-1">
                  <label htmlFor="remember" className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(!!checked)}
                      className="border-slate-300 dark:border-slate-700 data-[state=checked]:bg-[#003876] dark:data-[state=checked]:bg-blue-600"
                    />
                    <span>Remember session on this device</span>
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-gradient-to-r from-[#003876] via-[#002b5c] to-[#001e40] hover:from-[#002b5c] hover:to-[#001730] text-white font-semibold rounded-xl shadow-lg shadow-[#003876]/20 dark:shadow-blue-900/40 transition-all duration-200 mt-2 text-sm border-t border-white/20 active:scale-[0.99]"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Verifying Credentials...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Sign In to Dashboard <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </form>

              {/* Security & Compliance Badges */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5 justify-center py-1 bg-slate-50 dark:bg-slate-950/40 rounded-lg">
                  <LockKeyhole className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>256-Bit SSL Encrypted</span>
                </div>
                <div className="flex items-center gap-1.5 justify-center py-1 bg-slate-50 dark:bg-slate-950/40 rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#003876] dark:text-blue-400" />
                  <span>ISO 27001 Certified</span>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </main>

      {/* ── Footer ── */}
      <footer className="py-4 px-4 text-center border-t border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <p>
          Protected by Eastern Bank PLC Verification & Security Protocols &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}