'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  FileDown,
  Printer,
  Copy,
  ExternalLink,
  Loader2,
  FileCheck,
  ZoomIn,
  ZoomOut,
  FileSpreadsheet,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import StatementPdfTemplate, { StatementData } from './statement-pdf-template';
import { generateCleanPdf } from '@/lib/pdf-generator';
import { exportSingleStatementToExcel } from '@/lib/excel-export';
import { getAppUrl } from '@/lib/utils';

interface StatementViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  statement: StatementData | null;
}

export default function StatementViewDialog({
  open,
  onOpenChange,
  statement,
}: StatementViewDialogProps) {
  const [downloading, setDownloading] = useState(false);
  const [zoomScale, setZoomScale] = useState(0.9);

  if (!statement) return null;

  const baseUrl = getAppUrl();
  const qrUrl = `${baseUrl}/ebl-cert-portal-flat/verify.php?qr=${statement.qrCodeHash}`;

  const copyQrUrl = () => {
    navigator.clipboard.writeText(qrUrl);
    toast.success('Verification QR Link copied!');
  };

  const handleExportExcel = () => {
    try {
      exportSingleStatementToExcel(statement);
      toast.success('Exported statement summary & transactions to Excel!');
    } catch (err: any) {
      console.error('Excel export error:', err);
      toast.error(err?.message || 'Failed to export Excel');
    }
  };

  const handleSaveAsPdf = async () => {
    setDownloading(true);
    toast.info('Generating official PDF statement...');
    try {
      await generateCleanPdf(statement);
      toast.success('PDF saved successfully!');
    } catch (err: any) {
      console.error('Save PDF Error:', err);
      toast.error(err?.message || 'Failed to generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById('view-statement-pdf-content');
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>EBL Statement - ${statement.accountNo}</title>
          <style>
            body { margin: 0; padding: 0; background: white; }
            @page { size: A4; margin: 0; }
          </style>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body>
          ${printContent.outerHTML}
          <script>
            window.onload = function() {
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl w-[95vw] max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-2xl p-0 overflow-hidden shadow-2xl transition-colors duration-200">
        {/* Top Header Controls Bar - Light / Dark System Aware */}
        <DialogHeader className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                EBL e-Statement Document
              </DialogTitle>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <span>Account: <strong className="text-slate-900 dark:text-slate-200 font-mono">{statement.accountNo}</strong></span>
                <span>•</span>
                <span>Customer: <strong className="text-slate-900 dark:text-slate-200">{statement.customerName}</strong></span>
              </div>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl mr-2">
              <button
                type="button"
                onClick={() => setZoomScale(Math.max(0.6, zoomScale - 0.1))}
                className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono px-2 text-slate-700 dark:text-slate-300">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoomScale(Math.min(1.2, zoomScale + 0.1))}
                className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            <Button
              type="button"
              onClick={copyQrUrl}
              variant="outline"
              size="sm"
              className="text-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Copy className="w-3.5 h-3.5 mr-1.5 text-blue-600 dark:text-blue-400" /> Copy QR URL
            </Button>

            <Button
              type="button"
              onClick={handleExportExcel}
              variant="outline"
              size="sm"
              className="text-xs bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 h-9 rounded-xl font-medium"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 text-emerald-600 dark:text-emerald-400" /> Export Excel
            </Button>

            <Button
              type="button"
              onClick={handlePrint}
              variant="outline"
              size="sm"
              className="text-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5 text-slate-500 dark:text-slate-300" /> Print
            </Button>

            {/* SAVE AS PDF BUTTON */}
            <Button
              type="button"
              onClick={handleSaveAsPdf}
              disabled={downloading}
              size="sm"
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs h-9 rounded-xl shadow-md px-4"
            >
              {downloading ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-4 h-4 animate-spin" /> Generating PDF...
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <FileDown className="w-4 h-4" /> Save as PDF
                </span>
              )}
            </Button>
          </div>
        </DialogHeader>

        {/* Verification Link Indicator Bar */}
        <div className="bg-slate-50/80 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 px-4 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-blue-600 dark:text-blue-400 font-semibold text-[11px] shrink-0">Verification Link:</span>
            <span className="font-mono text-slate-600 dark:text-slate-400 text-[11px] truncate">{qrUrl}</span>
          </div>
          <a
            href={qrUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline text-[11px] flex items-center gap-1 shrink-0 ml-2 font-medium"
          >
            Open Link <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Document Viewport - Theme aware background for A4 sheet pop */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100 dark:bg-slate-950/90 flex justify-center items-start">
          <div
            className="transition-transform duration-200 origin-top shadow-xl rounded-sm"
            style={{ transform: `scale(${zoomScale})` }}
          >
            <StatementPdfTemplate data={statement} containerId="view-statement-pdf-content" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
