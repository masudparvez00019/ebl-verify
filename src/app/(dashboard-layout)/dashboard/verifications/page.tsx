'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  FileText,
  Plus,
  Search,
  FileDown,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  QrCode,
  ExternalLink,
  FileSpreadsheet,
} from 'lucide-react';
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
import StatementFormDialog from '@/components/statements/statement-form-dialog';
import StatementViewDialog from '@/components/statements/statement-view-dialog';
import { StatementData } from '@/components/statements/statement-pdf-template';
import { generateCleanPdf } from '@/lib/pdf-generator';
import { exportStatementsToExcel, exportSingleStatementToExcel } from '@/lib/excel-export';

export default function VerificationsPage() {
  const [statements, setStatements] = useState<StatementData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [statementToEdit, setStatementToEdit] = useState<StatementData | null>(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [selectedStatement, setSelectedStatement] = useState<StatementData | null>(null);

  const fetchStatements = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/statements?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (res.ok) {
        setStatements(data.statements || []);
      } else {
        toast.error(data.error || 'Failed to load statements');
      }
    } catch {
      toast.error('Network error loading statements');
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchStatements();
  }, [fetchStatements]);

  const handleAddStatement = () => {
    setStatementToEdit(null);
    setFormOpen(true);
  };

  const handleEditStatement = (st: StatementData) => {
    setStatementToEdit(st);
    setFormOpen(true);
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

  const handleExportAllExcel = () => {
    if (!statements || statements.length === 0) {
      toast.error('No statement data available to export');
      return;
    }
    try {
      exportStatementsToExcel(statements);
      toast.success(`Exported ${statements.length} statement records to Excel successfully!`);
    } catch (err: any) {
      console.error('Excel Export Error:', err);
      toast.error(err?.message || 'Failed to export Excel file');
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

  const handleDeleteStatement = async (id?: string) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this statement?')) return;

    try {
      const res = await fetch(`/api/statements/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Statement deleted successfully');
        fetchStatements();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Delete failed');
      }
    } catch {
      toast.error('Failed to delete statement');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" /> Account Statements & Verification
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            Create, manage, edit, view, export to Excel, and generate official EBL e-statement PDFs with dynamic QR codes.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            onClick={fetchStatements}
            variant="outline"
            size="sm"
            className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs h-9 rounded-xl"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>

          <Button
            onClick={handleExportAllExcel}
            variant="outline"
            size="sm"
            disabled={loading || statements.length === 0}
            className="bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-xs h-9 rounded-xl font-medium transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 mr-1.5 text-emerald-600 dark:text-emerald-400" /> Export to Excel
          </Button>

          <Button
            onClick={handleAddStatement}
            size="sm"
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs h-9 rounded-xl shadow-md font-semibold"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Add Statement
          </Button>
        </div>
      </div>

      {/* Main Table Card */}
      <Card className="bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 backdrop-blur-xl shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/60">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
              EBL Account Statements ({statements.length})
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
              Database records connected to MongoDB Atlas
            </CardDescription>
          </div>

          <div className="relative w-full sm:flex-1 sm:max-w-xl md:max-w-2xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <Input
              placeholder="Search Customer Name, Account Number, Branch, or Customer ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 bg-slate-50 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-[#003876] dark:focus:border-blue-500 text-xs sm:text-sm h-10 rounded-xl transition-all shadow-2xs"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-950/50">
              <TableRow className="border-slate-200 dark:border-slate-800/80">
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
                  <TableCell colSpan={6} className="text-center py-8 text-xs text-slate-500">
                    Loading statements from MongoDB...
                  </TableCell>
                </TableRow>
              ) : statements.length > 0 ? (
                statements.map((st) => (
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
                          className="inline-flex items-center justify-center h-8 px-2.5 rounded-md text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                          title="Open Live Verification Link in New Tab"
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

                        <Button
                          onClick={() => handleEditStatement(st)}
                          size="sm"
                          variant="ghost"
                          className="h-8 text-xs text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                          title="Edit Statement"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Button>

                        <Button
                          onClick={() => handleDeleteStatement(st._id)}
                          size="sm"
                          variant="ghost"
                          className="h-8 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
                          title="Delete Statement"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-xs text-slate-500">
                    No account statements found. Click &quot;Add Statement&quot; to create your first statement!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Form Dialog for Add & Edit */}
      <StatementFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        statementToEdit={statementToEdit}
        onSuccess={fetchStatements}
      />

      {/* View & PDF Download Dialog */}
      <StatementViewDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        statement={selectedStatement}
      />
    </div>
  );
}
