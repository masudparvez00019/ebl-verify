'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { Settings, Database, Shield, Lock, Save, KeyRound, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SettingsPage() {
  const [dbName, setDbName] = useState('ebl_verify');
  const [sessionDuration, setSessionDuration] = useState('7 Days');
  const [requireHttps, setRequireHttps] = useState(true);
  const [autoLogout, setAutoLogout] = useState(true);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('System settings saved successfully!');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error('Please complete all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    toast.success('Admin password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" /> System & Security Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
          Configure system environment, MongoDB Atlas parameters, and authentication security.
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl">
          <TabsTrigger value="general" className="text-xs font-semibold rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
            <Database className="w-3.5 h-3.5 mr-1.5" /> Database & System
          </TabsTrigger>
          <TabsTrigger value="security" className="text-xs font-semibold rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
            <Shield className="w-3.5 h-3.5 mr-1.5" /> Security & Session
          </TabsTrigger>
          <TabsTrigger value="password" className="text-xs font-semibold rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
            <KeyRound className="w-3.5 h-3.5 mr-1.5" /> Change Password
          </TabsTrigger>
        </TabsList>

        {/* Database & System */}
        <TabsContent value="general" className="mt-4">
          <Card className="bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 backdrop-blur-xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-blue-600 dark:text-blue-400" /> MongoDB Atlas Configuration
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                Connected cluster configuration for EBL Verification system
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Cluster Host</Label>
                  <Input readOnly value="cluster0.ypyky.mongodb.net" className="bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-xs h-10 font-mono text-slate-600 dark:text-slate-400" />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Database Name</Label>
                  <Input value={dbName} onChange={(e) => setDbName(e.target.value)} className="bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-xs h-10 font-mono" />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Session JWT Lifespan</Label>
                  <Input value={sessionDuration} onChange={(e) => setSessionDuration(e.target.value)} className="bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-xs h-10 font-mono" />
                </div>

                <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white text-xs h-9 rounded-xl">
                  <Save className="w-3.5 h-3.5 mr-1.5" /> Save Database Settings
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Policies */}
        <TabsContent value="security" className="mt-4">
          <Card className="bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 backdrop-blur-xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">Security & Access Protocols</CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400">Enforce strict authentication and cookie policies</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-200">Enforce Secure HTTP-Only Cookies</p>
                  <p className="text-[11px] text-slate-500">Prevent XSS attacks by restricting access to session tokens</p>
                </div>
                <Switch checked={requireHttps} onCheckedChange={setRequireHttps} />
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-4">
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-200">Auto Inactive Logout</p>
                  <p className="text-[11px] text-slate-500">Automatically invalidate session after 30 minutes of inactivity</p>
                </div>
                <Switch checked={autoLogout} onCheckedChange={setAutoLogout} />
              </div>

              <Button onClick={() => toast.success('Security policies updated!')} className="bg-blue-600 hover:bg-blue-500 text-white text-xs h-9 rounded-xl">
                <Save className="w-3.5 h-3.5 mr-1.5" /> Save Security Policies
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Change Admin Password */}
        <TabsContent value="password" className="mt-4">
          <Card className="bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 backdrop-blur-xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">Change Admin Password</CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400">Update your current administrator password</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Current Password</Label>
                  <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required className="bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-xs h-10" />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">New Password</Label>
                  <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-xs h-10" />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Confirm New Password</Label>
                  <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-xs h-10" />
                </div>

                <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white text-xs h-9 rounded-xl">
                  <Lock className="w-3.5 h-3.5 mr-1.5" /> Update Admin Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
