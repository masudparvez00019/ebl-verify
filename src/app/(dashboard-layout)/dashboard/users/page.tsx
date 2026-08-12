'use client';

import React, { useState } from 'react';
import { Users, UserPlus, Search, Shield, MoreHorizontal, UserCheck, Mail, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const usersList = [
    { id: '1', name: 'System Admin', email: 'admin@eblverify.com', role: 'admin', status: 'Active', joined: '2026-08-10' },
    { id: '2', name: 'Masud Parvez', email: 'masudparvez00019@gmail.com', role: 'admin', status: 'Active', joined: '2026-08-11' },
    { id: '3', name: 'Verification Officer 1', email: 'officer1@eblverify.com', role: 'staff', status: 'Active', joined: '2026-08-11' },
    { id: '4', name: 'Support Manager', email: 'support@eblverify.com', role: 'staff', status: 'Inactive', joined: '2026-08-09' },
  ];

  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" /> User & Admin Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            Manage administrative access permissions, staff accounts, and user roles.
          </p>
        </div>

        <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white text-xs h-9 rounded-xl shadow-md">
          <UserPlus className="w-3.5 h-3.5 mr-1.5" /> Add New User
        </Button>
      </div>

      <Card className="bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 backdrop-blur-xl shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/60">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Active System Accounts</CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
              Users registered in MongoDB database with assigned privileges
            </CardDescription>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search user name or email..."
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
                <TableHead className="text-slate-500 dark:text-slate-400 text-xs font-semibold">USER</TableHead>
                <TableHead className="text-slate-500 dark:text-slate-400 text-xs font-semibold">ROLE</TableHead>
                <TableHead className="text-slate-500 dark:text-slate-400 text-xs font-semibold">STATUS</TableHead>
                <TableHead className="text-slate-500 dark:text-slate-400 text-xs font-semibold">JOINED DATE</TableHead>
                <TableHead className="text-right text-slate-500 dark:text-slate-400 text-xs font-semibold">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((u) => (
                <TableRow key={u.id} className="border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border border-blue-500/30">
                        <AvatarFallback className="bg-blue-600 text-white font-bold text-xs">
                          {u.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-slate-200">{u.name}</div>
                        <div className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Mail className="w-2.5 h-2.5" /> {u.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {u.role === 'admin' ? (
                      <Badge className="bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20 text-[10px]">
                        <Shield className="w-3 h-3 mr-1" /> Admin
                      </Badge>
                    ) : (
                      <Badge className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 text-[10px]">
                        Staff Officer
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={u.status === 'Active' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 text-[10px]' : 'bg-slate-100 text-slate-500 text-[10px]'}>
                      {u.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-mono text-slate-500">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {u.joined}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 dark:hover:text-white">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
