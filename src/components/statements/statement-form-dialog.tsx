'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  FileText,
  Plus,
  Trash2,
  Loader2,
  Sparkles,
  User,
  MapPin,
  CreditCard,
  Calendar,
  Building,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StatementData } from './statement-pdf-template';

interface StatementFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  statementToEdit?: StatementData | null;
  onSuccess: () => void;
}

export default function StatementFormDialog({
  open,
  onOpenChange,
  statementToEdit,
  onSuccess,
}: StatementFormDialogProps) {
  const [loading, setLoading] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [branchName, setBranchName] = useState('Gulshan North Branch');
  const [branchAddress, setBranchAddress] = useState(
    'Holding No. 175, Gulshan Avenue, Gulshan-2, Dhaka-1212'
  );
  const [accountNo, setAccountNo] = useState('');
  const [productName, setProductName] = useState('EBL Power Savings');
  const [periodFrom, setPeriodFrom] = useState('');
  const [periodTo, setPeriodTo] = useState('');
  const [page, setPage] = useState('1');
  const [currencyName, setCurrencyName] = useState('BANGLADESH TAKA');
  const [branchCode, setBranchCode] = useState('127');
  const [customerId, setCustomerId] = useState('');
  const [closingBalance, setClosingBalance] = useState('0.00');

  const [transactions, setTransactions] = useState<
    { trnDate: string; description: string; reference: string; debits: string; credits: string; balance: string }[]
  >([]);

  useEffect(() => {
    if (statementToEdit) {
      setCustomerName(statementToEdit.customerName || '');
      setCustomerAddress(statementToEdit.customerAddress || '');
      setBranchName(statementToEdit.branchName || 'Gulshan North Branch');
      setBranchAddress(
        statementToEdit.branchAddress || 'Holding No. 175, Gulshan Avenue, Gulshan-2, Dhaka-1212'
      );
      setAccountNo(statementToEdit.accountNo || '');
      setProductName(statementToEdit.productName || 'EBL Power Savings');
      setPeriodFrom(statementToEdit.periodFrom || '');
      setPeriodTo(statementToEdit.periodTo || '');
      setPage(statementToEdit.page || '1');
      setCurrencyName(statementToEdit.currencyName || 'BANGLADESH TAKA');
      setBranchCode(statementToEdit.branchCode || '127');
      setCustomerId(statementToEdit.customerId || '');
      setClosingBalance(statementToEdit.closingBalance || '0.00');
      setTransactions(statementToEdit.transactions || []);
    } else {
      resetForm();
    }
  }, [statementToEdit, open]);

  const resetForm = () => {
    setCustomerName('');
    setCustomerAddress('');
    setBranchName('Gulshan North Branch');
    setBranchAddress('Holding No. 175, Gulshan Avenue, Gulshan-2, Dhaka-1212');
    setAccountNo('');
    setProductName('EBL Power Savings');
    setPeriodFrom('');
    setPeriodTo('');
    setPage('1');
    setCurrencyName('BANGLADESH TAKA');
    setBranchCode('127');
    setCustomerId('');
    setClosingBalance('0.00');
    setTransactions([]);
  };

  const fillSamplePdfData = () => {
    setCustomerName('ZAKIR HOSSAIN');
    setCustomerAddress('HOUSE-16, L/16, SOUTH BANASREE GORAN DHAKA');
    setBranchName('Gulshan North Branch');
    setBranchAddress('Holding No. 175, Gulshan Avenue, Gulshan-2, Dhaka-1212');
    setAccountNo('1271440016276');
    setProductName('EBL Power Savings');
    setPeriodFrom('10-AUG-2026');
    setPeriodTo('10-AUG-2026');
    setPage('1');
    setCurrencyName('BANGLADESH TAKA');
    setBranchCode('127');
    setCustomerId('3665524');
    setClosingBalance('150,000.00');
    setTransactions([
      {
        trnDate: '10-AUG-2026',
        description: 'ONLINE DEPOSIT TRANSFER',
        reference: 'FT26223X9901',
        debits: '',
        credits: '50,000.00',
        balance: '150,000.00',
      },
    ]);
    toast.info('Sample PDF data populated!');
  };

  const addTransactionRow = () => {
    setTransactions([
      ...transactions,
      { trnDate: '', description: '', reference: '', debits: '', credits: '', balance: '' },
    ]);
  };

  const removeTransactionRow = (index: number) => {
    setTransactions(transactions.filter((_, i) => i !== index));
  };

  const updateTransactionRow = (index: number, field: string, value: string) => {
    const updated = [...transactions];
    updated[index] = { ...updated[index], [field]: value };
    setTransactions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || !accountNo) {
      toast.error('Please enter Customer Name and Account Number');
      return;
    }

    setLoading(true);

    try {
      const isEdit = !!statementToEdit?._id;
      const url = isEdit ? `/api/statements/${statementToEdit._id}` : '/api/statements';
      const method = isEdit ? 'PUT' : 'POST';

      const payload = {
        customerName,
        customerAddress,
        branchName,
        branchAddress,
        accountNo,
        productName,
        periodFrom,
        periodTo,
        page,
        currencyName,
        branchCode,
        customerId,
        closingBalance,
        transactions,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save statement');
      }

      toast.success(isEdit ? 'Statement updated successfully!' : 'New statement created!');
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              {statementToEdit ? 'Edit Account Statement' : 'Add New EBL Account Statement'}
            </DialogTitle>
            <Button
              type="button"
              onClick={fillSamplePdfData}
              variant="outline"
              size="sm"
              className="text-xs bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/60"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1" /> Auto-Fill PDF Sample
            </Button>
          </div>
          <DialogDescription className="text-xs text-slate-500">
            Fill in account details and transaction entries matching the official EBL e-statement format.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          {/* Customer & Branch Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-500" /> Customer & Branch Info
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Customer Name *</Label>
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="ZAKIR HOSSAIN"
                  required
                  className="text-xs h-9 bg-slate-50 dark:bg-slate-950"
                />
              </div>

              <div>
                <Label className="text-xs">Customer Address</Label>
                <Input
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="HOUSE-16, L/16, SOUTH BANASREE GORAN DHAKA"
                  className="text-xs h-9 bg-slate-50 dark:bg-slate-950"
                />
              </div>

              <div>
                <Label className="text-xs">Branch Name</Label>
                <Input
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  placeholder="Gulshan North Branch"
                  className="text-xs h-9 bg-slate-50 dark:bg-slate-950"
                />
              </div>

              <div>
                <Label className="text-xs">Branch Address</Label>
                <Input
                  value={branchAddress}
                  onChange={(e) => setBranchAddress(e.target.value)}
                  placeholder="Holding No. 175, Gulshan Avenue, Gulshan-2, Dhaka-1212"
                  className="text-xs h-9 bg-slate-50 dark:bg-slate-950"
                />
              </div>
            </div>
          </div>

          {/* Account Details Section */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-blue-500" /> Account Specifications
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <Label className="text-xs">Account No *</Label>
                <Input
                  value={accountNo}
                  onChange={(e) => setAccountNo(e.target.value)}
                  placeholder="1271440016276"
                  required
                  className="text-xs h-9 font-mono bg-slate-50 dark:bg-slate-950"
                />
              </div>

              <div>
                <Label className="text-xs">Product Name</Label>
                <Input
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="EBL Power Savings"
                  className="text-xs h-9 bg-slate-50 dark:bg-slate-950"
                />
              </div>

              <div>
                <Label className="text-xs">Customer ID</Label>
                <Input
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  placeholder="3665524"
                  className="text-xs h-9 font-mono bg-slate-50 dark:bg-slate-950"
                />
              </div>

              <div>
                <Label className="text-xs">Period From</Label>
                <Input
                  value={periodFrom}
                  onChange={(e) => setPeriodFrom(e.target.value)}
                  placeholder="10-AUG-2026"
                  className="text-xs h-9 font-mono bg-slate-50 dark:bg-slate-950"
                />
              </div>

              <div>
                <Label className="text-xs">Period To</Label>
                <Input
                  value={periodTo}
                  onChange={(e) => setPeriodTo(e.target.value)}
                  placeholder="10-AUG-2026"
                  className="text-xs h-9 font-mono bg-slate-50 dark:bg-slate-950"
                />
              </div>

              <div>
                <Label className="text-xs">Branch Code</Label>
                <Input
                  value={branchCode}
                  onChange={(e) => setBranchCode(e.target.value)}
                  placeholder="127"
                  className="text-xs h-9 font-mono bg-slate-50 dark:bg-slate-950"
                />
              </div>

              <div>
                <Label className="text-xs">Currency Name</Label>
                <Input
                  value={currencyName}
                  onChange={(e) => setCurrencyName(e.target.value)}
                  placeholder="BANGLADESH TAKA"
                  className="text-xs h-9 bg-slate-50 dark:bg-slate-950"
                />
              </div>

              <div>
                <Label className="text-xs">Closing Balance</Label>
                <Input
                  value={closingBalance}
                  onChange={(e) => setClosingBalance(e.target.value)}
                  placeholder="0.00"
                  className="text-xs h-9 font-mono font-semibold bg-slate-50 dark:bg-slate-950"
                />
              </div>
            </div>
          </div>

          {/* Transactions List Manager */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-500" /> Transactions List ({transactions.length})
              </h3>
              <Button
                type="button"
                onClick={addTransactionRow}
                size="sm"
                variant="outline"
                className="text-xs h-8 bg-slate-100 dark:bg-slate-800"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Transaction Row
              </Button>
            </div>

            {transactions.length > 0 ? (
              <div className="space-y-2">
                {transactions.map((tx, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2"
                  >
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                      <span>Row #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeTransactionRow(idx)}
                        className="text-red-500 hover:text-red-600 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs">
                      <div>
                        <Input
                          placeholder="TRN DATE"
                          value={tx.trnDate}
                          onChange={(e) => updateTransactionRow(idx, 'trnDate', e.target.value)}
                          className="h-8 text-xs font-mono"
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          placeholder="DESCRIPTION"
                          value={tx.description}
                          onChange={(e) => updateTransactionRow(idx, 'description', e.target.value)}
                          className="h-8 text-xs"
                        />
                      </div>
                      <div>
                        <Input
                          placeholder="REFERENCE"
                          value={tx.reference}
                          onChange={(e) => updateTransactionRow(idx, 'reference', e.target.value)}
                          className="h-8 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <Input
                          placeholder="DEBITS"
                          value={tx.debits}
                          onChange={(e) => updateTransactionRow(idx, 'debits', e.target.value)}
                          className="h-8 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <Input
                          placeholder="CREDITS / BALANCE"
                          value={tx.credits || tx.balance}
                          onChange={(e) => {
                            updateTransactionRow(idx, 'credits', e.target.value);
                            updateTransactionRow(idx, 'balance', e.target.value);
                          }}
                          className="h-8 text-xs font-mono font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-400">
                No transactions added yet. Click &quot;Add Transaction Row&quot; above.
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="text-xs h-9 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs h-9 rounded-xl shadow-md"
            >
              {loading ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving Statement...
                </span>
              ) : (
                <span>{statementToEdit ? 'Update Statement' : 'Save New Statement'}</span>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
