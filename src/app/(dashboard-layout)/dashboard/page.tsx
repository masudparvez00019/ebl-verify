'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  TrendingUp,
  Database,
  Search,
  Filter,
  Plus,
  RefreshCw,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface VerificationRecord {
  id: string;
  applicant: string;
  email: string;
  type: string;
  status: 'Verified' | 'Pending' | 'Rejected';
  score: number;
  date: string;
}

export default function DashboardPage() {
  const [seeding, setSeeding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const mockRecords: VerificationRecord[] = [
    {
      id: 'VER-9042',
      applicant: 'Masud Parvez',
      email: 'masudparvez00019@gmail.com',
      type: 'Bank Account & NID',
      status: 'Verified',
      score: 98,
      date: '2026-08-12 03:45',
    },
    {
      id: 'VER-9041',
      applicant: 'Tanvir Hossain',
      email: 'tanvir@example.com',
      type: 'EBL Card Verification',
      status: 'Verified',
      score: 95,
      date: '2026-08-12 02:10',
    },
    {
      id: 'VER-9040',
      applicant: 'Rahim Uddin',
      email: 'rahim@example.com',
      type: 'Employment Record',
      status: 'Pending',
      score: 72,
      date: '2026-08-11 22:15',
    },
    {
      id: 'VER-9039',
      applicant: 'Sarah Khan',
      email: 'sarah.k@example.com',
      type: 'Passport & Identity',
      status: 'Verified',
      score: 99,
      date: '2026-08-11 19:30',
    },
    {
      id: 'VER-9038',
      applicant: 'Kamal Ahmed',
      email: 'kamal@example.com',
      type: 'Credit History Check',
      status: 'Rejected',
      score: 45,
      date: '2026-08-11 16:05',
    },
  ];

  const filteredRecords = mockRecords.filter(
    (rec) =>
      rec.applicant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSeedAdmin = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/auth/seed-admin');
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || 'Admin seeding check completed!');
      } else {
        toast.error(data.error || 'Seeding failed');
      }
    } catch {
      toast.error('Failed to trigger admin seed route');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 dark:from-blue-950/80 dark:via-indigo-950/60 dark:to-slate-900 text-white border border-blue-600/30 dark:border-slate-800/80 p-6 lg:p-8 shadow-xl shadow-blue-600/10"
      >
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-white/10 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 dark:bg-blue-500/20 backdrop-blur-md border border-white/30 dark:border-blue-400/30 text-white dark:text-blue-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Welcome to EBL Verify Control Center
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
              Admin Overview & Live Analytics
            </h1>
            <p className="text-blue-100 dark:text-slate-300 text-sm mt-1 max-w-xl">
              Monitor verification records, user access controls, database sync status, and system security protocols in real time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleSeedAdmin}
              disabled={seeding}
              variant="outline"
              className="bg-white/10 dark:bg-slate-900/80 border-white/20 dark:border-slate-700 text-white hover:bg-white/20 dark:hover:bg-slate-800 text-xs h-10 rounded-xl backdrop-blur-md"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-2 ${seeding ? 'animate-spin' : ''}`} />
              {seeding ? 'Checking Seed...' : 'Check Admin Seed'}
            </Button>

            <Link href="/dashboard/verifications">
              <Button className="bg-white text-blue-900 hover:bg-slate-100 dark:bg-blue-600 dark:hover:bg-blue-500 dark:text-white text-xs font-semibold h-10 rounded-xl shadow-lg">
                <Plus className="w-4 h-4 mr-1.5" /> Add Statement
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 backdrop-blur-xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Verifications</CardTitle>
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">1,248</div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" /> +14.2% from last week
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 backdrop-blur-xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400">Verified Success Rate</CardTitle>
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">94.8%</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">1,183 Records Approved</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 backdrop-blur-xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400">Pending Review</CardTitle>
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                <Clock className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">42</div>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-1">Requires admin approval</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 backdrop-blur-xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400">Database Status</CardTitle>
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20">
                <Database className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">MongoDB SRV</div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active Cluster connected
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Verification Records Table Section */}
      <Card className="bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 backdrop-blur-xl rounded-2xl overflow-hidden shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/60">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Recent Verification Logs</CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
              Real-time feed of user authentication & verification requests
            </CardDescription>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search applicant or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 text-xs h-9 rounded-xl"
              />
            </div>
            <Button variant="outline" size="sm" className="bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs h-9 rounded-xl">
              <Filter className="w-3.5 h-3.5 mr-1" /> Filter
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/80 dark:bg-slate-950/50">
                <TableRow className="border-slate-200 dark:border-slate-800/80 hover:bg-transparent">
                  <TableHead className="text-slate-500 dark:text-slate-400 text-xs font-semibold">RECORD ID</TableHead>
                  <TableHead className="text-slate-500 dark:text-slate-400 text-xs font-semibold">APPLICANT</TableHead>
                  <TableHead className="text-slate-500 dark:text-slate-400 text-xs font-semibold">VERIFICATION TYPE</TableHead>
                  <TableHead className="text-slate-500 dark:text-slate-400 text-xs font-semibold">SCORE</TableHead>
                  <TableHead className="text-slate-500 dark:text-slate-400 text-xs font-semibold">STATUS</TableHead>
                  <TableHead className="text-slate-500 dark:text-slate-400 text-xs font-semibold">TIMESTAMP</TableHead>
                  <TableHead className="text-right text-slate-500 dark:text-slate-400 text-xs font-semibold">ACTION</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <TableRow key={record.id} className="border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <TableCell className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
                        {record.id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">{record.applicant}</div>
                          <div className="text-[10px] text-slate-500">{record.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-slate-600 dark:text-slate-300">{record.type}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-12 bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                record.score >= 90
                                  ? 'bg-emerald-500'
                                  : record.score >= 70
                                  ? 'bg-amber-500'
                                  : 'bg-red-500'
                              }`}
                              style={{ width: `${record.score}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{record.score}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {record.status === 'Verified' && (
                          <Badge className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 text-[10px]">
                            Verified
                          </Badge>
                        )}
                        {record.status === 'Pending' && (
                          <Badge className="bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 text-[10px]">
                            Pending
                          </Badge>
                        )}
                        {record.status === 'Rejected' && (
                          <Badge className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 text-[10px]">
                            Rejected
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-slate-500 font-mono">{record.date}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/40">
                          Details <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-xs text-slate-500">
                      No records match your query.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
