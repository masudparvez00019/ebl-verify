'use client';

import React, { useState } from 'react';
import { FileText, ShieldAlert, CheckCircle2, Info, AlertTriangle, Search, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function LogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<'ALL' | 'AUTH' | 'SECURITY' | 'INFO'>('ALL');

  const logs = [
    { id: 'LOG-109', timestamp: '2026-08-12 04:30:12', level: 'AUTH', action: 'Admin Login Successful', user: 'admin@eblverify.com', ip: '127.0.0.1', status: 'SUCCESS' },
    { id: 'LOG-108', timestamp: '2026-08-12 03:52:00', level: 'INFO', action: 'MongoDB Atlas SRV Connection Pool Established', user: 'System', ip: 'cluster0.ypyky', status: 'INFO' },
    { id: 'LOG-107', timestamp: '2026-08-12 02:15:40', level: 'SECURITY', action: 'JWT Session Token Issued (7 Days)', user: 'admin@eblverify.com', ip: '127.0.0.1', status: 'SUCCESS' },
    { id: 'LOG-106', timestamp: '2026-08-11 23:10:05', level: 'AUTH', action: 'Failed Auth Attempt (Invalid Password)', user: 'unknown@test.com', ip: '103.14.22.9', status: 'WARN' },
    { id: 'LOG-105', timestamp: '2026-08-11 21:00:00', level: 'INFO', action: 'System Route Guard Middleware initialized', user: 'System', ip: '127.0.0.1', status: 'INFO' },
  ];

  const filteredLogs = logs.filter((l) => {
    const matchesQuery =
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === 'ALL' || l.level === levelFilter;
    return matchesQuery && matchesLevel;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" /> Security & Audit Logs
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            Real-time audit trailing of administrative activity, auth requests, and security events.
          </p>
        </div>

        <Button variant="outline" size="sm" className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs h-9 rounded-xl">
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh Logs
        </Button>
      </div>

      <Card className="bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 backdrop-blur-xl shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center gap-2">
            {(['ALL', 'AUTH', 'SECURITY', 'INFO'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  levelFilter === lvl
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-xs h-9 rounded-xl"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-950/50">
              <TableRow className="border-slate-200 dark:border-slate-800/80">
                <TableHead className="text-slate-500 dark:text-slate-400 text-xs font-semibold">LOG ID</TableHead>
                <TableHead className="text-slate-500 dark:text-slate-400 text-xs font-semibold">LEVEL</TableHead>
                <TableHead className="text-slate-500 dark:text-slate-400 text-xs font-semibold">EVENT ACTION</TableHead>
                <TableHead className="text-slate-500 dark:text-slate-400 text-xs font-semibold">INITIATOR</TableHead>
                <TableHead className="text-slate-500 dark:text-slate-400 text-xs font-semibold">IP ADDRESS</TableHead>
                <TableHead className="text-slate-500 dark:text-slate-400 text-xs font-semibold">TIMESTAMP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id} className="border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <TableCell className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">{log.id}</TableCell>
                  <TableCell>
                    {log.level === 'AUTH' && <Badge className="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 text-[10px]">AUTH</Badge>}
                    {log.level === 'SECURITY' && <Badge className="bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 text-[10px]">SECURITY</Badge>}
                    {log.level === 'INFO' && <Badge className="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 text-[10px]">INFO</Badge>}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-slate-800 dark:text-slate-200">{log.action}</TableCell>
                  <TableCell className="text-xs text-slate-500 font-mono">{log.user}</TableCell>
                  <TableCell className="text-xs text-slate-500 font-mono">{log.ip}</TableCell>
                  <TableCell className="text-xs text-slate-500 font-mono">{log.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
