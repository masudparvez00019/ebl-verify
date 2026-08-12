'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  ShieldCheck,
  CheckCircle2,
  Database,
  Search,
  Plus,
  RefreshCw,
  Sparkles,
  ExternalLink,
  Eye,
  FileDown,
  QrCode,
  FileSpreadsheet,
  Building2,
  Receipt,
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
import StatementViewDialog from '@/components/statements/statement-view-dialog';
import { StatementData } from '@/components/statements/statement-pdf-template';
import { generateCleanPdf } from '@/lib/pdf-generator';
import { exportSingleStatementToExcel } from '@/lib/excel-export';

interface DashboardStats {
  totalStatements: number;
  totalUsers: number;
  activeQrHashes: number;
  totalTransactions: number;
  totalClosingBalance: string;
  totalBranches: number;
  dbStatus: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statements, setStatements] = useState<StatementData[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [selectedStatement, setSelectedStatement] = useState<StatementData | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/dashboard/stats');
      const data = await res.json();
      if (res.ok) {
        setStats(data.stats);
        setStatements(data.recentStatements || []);
      } else {
        toast.error(data.error || 'Failed to load dashboard metrics');
      }
    } catch {
      toast.error('Network error loading dashboard statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

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
    }
  };

  const handleViewStatement = (st: StatementData) => {
    setSelectedStatement(st);
    setViewOpen(true);
  };

  const handleDirectDownloadPdf = async (st: StatementData) => {
    if (!st._id) return;
    setDownloadingId(st._id);
    toast.info('Generating official PDF statement...');
    try {
      await generateCleanPdf(st);
      toast.success('PDF downloaded successfully!');
    } catch (err: any) {
      console.error('Direct PDF Download Error:', err);
      toast.error('Failed to generate PDF');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleExportSingleExcel = (st: StatementData) => {
    try {
      exportSingleStatementToExcel(st);
      toast.success(`Exported ${st.accountNo} to Excel successfully!`);
    } catch (err: any) {
      console.error('Excel Export Error:', err);
      toast.error(err?.message || 'Failed to export Excel file');
    }
  };

  const filteredStatements = statements.filter(
    (st) =>
      st.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.accountNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.branchName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.qrCodeHash?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#003876] via-[#002b5c] to-[#001730] text-white border border-blue-600/30 dark:border-slate-800/80 p-6 lg:p-8 shadow-xl shadow-[#003876]/10"
      >
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-white/10 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-[#F5C518]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 dark:bg-blue-500/20 backdrop-blur-md border border-white/20 text-white dark:text-blue-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#F5C518]" /> EBL Verification Real-Time Control Center
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
              System Overview & MongoDB Analytics
            </h1>
            <p className="text-blue-100/90 dark:text-slate-300 text-sm mt-1 max-w-xl">
              Live metrics connected to MongoDB Atlas. Monitor statement verifications, QR code hashes, transactions, and system activity in real time.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Button
              onClick={fetchDashboardData}
              variant="outline"
              disabled={loading}
              className="bg-white/10 dark:bg-slate-900/80 border-white/20 dark:border-slate-700 text-white hover:bg-white/20 dark:hover:bg-slate-800 text-xs h-10 rounded-xl backdrop-blur-md"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh Data
            </Button>

            <Button
              onClick={handleSeedAdmin}
              disabled={seeding}
              variant="outline"
              className="bg-white/10 dark:bg-slate-900/80 border-white/20 dark:border-slate-700 text-white hover:bg-white/20 dark:hover:bg-slate-800 text-xs h-10 rounded-xl backdrop-blur-md hidden sm:inline-flex"
            >
              <ShieldCheck className="w-3.5 h-3.5 mr-2 text-[#F5C518]" />
              {seeding ? 'Checking...' : 'Check Admin Seed'}
            </Button>

            <Link href="/dashboard/verifications">
              <Button className="bg-[#F5C518] text-slate-950 hover:bg-[#e0b20f] font-bold text-xs h-10 rounded-xl shadow-lg transition-all">
                <Plus className="w-4 h-4 mr-1.5" /> Add New Statement
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Real KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Total Statements */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 backdrop-blur-xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Account Statements</CardTitle>
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-[#003876] dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                <ShieldCheck className="w-4.5 h-4.5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
                {loading ? '...' : (stats?.totalStatements ?? 0)}
              </div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live database records
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Active QR Code Hashes */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 backdrop-blur-xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active QR Hashes</CardTitle>
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                <CheckCircle2 className="w-4.5 h-4.5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
                {loading ? '...' : (stats?.activeQrHashes ?? 0)}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">
                100% Verification Portal Ready
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Total Transactions Tracked */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 backdrop-blur-xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400">Transactions Tracked</CardTitle>
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                <Receipt className="w-4.5 h-4.5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
                {loading ? '...' : (stats?.totalTransactions ?? 0)}
              </div>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-1">
                Across {stats?.totalBranches || 0} EBL Branches
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Database Status */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 backdrop-blur-xl shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-slate-500 dark:text-slate-400">Database System</CardTitle>
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20">
                <Database className="w-4.5 h-4.5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-slate-900 dark:text-white">MongoDB Atlas</div>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> SRV Cluster Connected
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Verification Records Table Section */}
      <Card className="bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 backdrop-blur-xl rounded-2xl overflow-hidden shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/60">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Live Verification Feed ({filteredStatements.length})
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
              Real-time records synced from MongoDB database
            </CardDescription>
          </div>

          <div className="relative w-full sm:flex-1 sm:max-w-xl md:max-w-2xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <Input
              placeholder="Search Customer Name, Account Number, Branch, or QR Hash..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 bg-slate-50 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-[#003876] dark:focus:border-blue-500 text-xs sm:text-sm h-10 rounded-xl transition-all shadow-2xs"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/80 dark:bg-slate-950/50">
                <TableRow className="border-slate-200 dark:border-slate-800/80 hover:bg-transparent">
                  <TableHead className="text-slate-500 dark:text-slate-400 text-xs font-semibold">CUSTOMER NAME</TableHead>
                  <TableHead className="text-slate-500 dark:text-slate-400 text-xs font-semibold">ACCOUNT NO</TableHead>
                  <TableHead className="text-slate-500 dark:text-slate-400 text-xs font-semibold">PRODUCT & BRANCH</TableHead>
                  <TableHead className="text-slate-500 dark:text-slate-400 text-xs font-semibold">QR HASH</TableHead>
                  <TableHead className="text-slate-500 dark:text-slate-400 text-xs font-semibold">CLOSING BALANCE</TableHead>
                  <TableHead className="text-right text-slate-500 dark:text-slate-400 text-xs font-semibold">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-xs text-slate-500">
                      Loading live records from MongoDB Atlas...
                    </TableCell>
                  </TableRow>
                ) : filteredStatements.length > 0 ? (
                  filteredStatements.map((st) => (
                    <TableRow
                      key={st._id}
                      className="border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <TableCell>
                        <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{st.customerName}</div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[200px]">{st.customerAddress}</div>
                      </TableCell>

                      <TableCell className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
                        {st.accountNo}
                      </TableCell>

                      <TableCell>
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">{st.productName}</div>
                        <div className="text-[10px] text-slate-500">{st.branchName} ({st.branchCode})</div>
                      </TableCell>

                      <TableCell>
                        <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 font-mono text-[10px] max-w-[120px] truncate">
                          <QrCode className="w-3 h-3 mr-1 text-blue-500" />
                          {st.qrCodeHash ? st.qrCodeHash.slice(0, 10) + '...' : 'GEN'}
                        </Badge>
                      </TableCell>

                      <TableCell className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                        {st.currencyName === 'BANGLADESH TAKA' ? 'BDT ' : ''}{st.closingBalance || '0.00'}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            onClick={() => handleViewStatement(st)}
                            size="sm"
                            variant="ghost"
                            className="h-8 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                            title="View Statement Document"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" /> View
                          </Button>

                          <a
                            href={`/ebl-cert-portal-flat/verify.php?qr=${st.qrCodeHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center h-8 px-2 rounded-md text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                            title="Open Live Verification Link"
                          >
                            <ExternalLink className="w-3.5 h-3.5 mr-1" /> Verify Link
                          </a>

                          <Button
                            onClick={() => handleDirectDownloadPdf(st)}
                            disabled={downloadingId === st._id}
                            size="sm"
                            variant="ghost"
                            className="h-8 text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                            title="Download PDF directly"
                          >
                            <FileDown className={`w-3.5 h-3.5 mr-1 ${downloadingId === st._id ? 'animate-bounce' : ''}`} /> PDF
                          </Button>

                          <Button
                            onClick={() => handleExportSingleExcel(st)}
                            size="sm"
                            variant="ghost"
                            className="h-8 text-xs text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                            title="Export statement details & transactions to Excel"
                          >
                            <FileSpreadsheet className="w-3.5 h-3.5 mr-1" /> Excel
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-xs text-slate-500">
                      No records match your search criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Statement Dialog */}
      <StatementViewDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        statement={selectedStatement}
      />
    </div>
  );
}

