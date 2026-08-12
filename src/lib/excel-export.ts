import * as XLSX from 'xlsx';
import { StatementData } from '@/components/statements/statement-pdf-template';
import { getAppUrl } from '@/lib/utils';

/**
 * Export a list of statement records to an Excel (.xlsx) file
 */
export function exportStatementsToExcel(statements: StatementData[], customFilename?: string) {
  if (!statements || statements.length === 0) {
    throw new Error('No statement data available to export');
  }

  const appUrl = typeof window !== 'undefined' ? getAppUrl() : '';

  // Transform statement objects into clean Excel row objects
  const rows = statements.map((st, index) => {
    // Calculate total debits & credits count or sum if needed
    const totalTransactions = st.transactions?.length || 0;
    const verifyUrl = `${appUrl}/ebl-cert-portal-flat/verify.php?qr=${st.qrCodeHash || ''}`;

    return {
      'SL': index + 1,
      'Customer Name': st.customerName || 'N/A',
      'Account Number': st.accountNo || 'N/A',
      'Customer ID': st.customerId || 'N/A',
      'Product / Account Type': st.productName || 'N/A',
      'Branch Name': st.branchName || 'N/A',
      'Branch Code': st.branchCode || 'N/A',
      'Closing Balance': st.closingBalance || '0.00',
      'Currency': st.currencyName || 'BANGLADESH TAKA',
      'Period From': st.periodFrom || 'N/A',
      'Period To': st.periodTo || 'N/A',
      'Total Transactions': totalTransactions,
      'QR Code Hash': st.qrCodeHash || 'N/A',
      'Live Verification URL': verifyUrl,
    };
  });

  // Create Excel Worksheet
  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Set intelligent column widths
  const columnWidths = [
    { wch: 5 },   // SL
    { wch: 26 },  // Customer Name
    { wch: 18 },  // Account Number
    { wch: 14 },  // Customer ID
    { wch: 28 },  // Product / Account Type
    { wch: 22 },  // Branch Name
    { wch: 12 },  // Branch Code
    { wch: 16 },  // Closing Balance
    { wch: 18 },  // Currency
    { wch: 14 },  // Period From
    { wch: 14 },  // Period To
    { wch: 18 },  // Total Transactions
    { wch: 32 },  // QR Code Hash
    { wch: 45 },  // Verification URL
  ];
  worksheet['!cols'] = columnWidths;

  // Create Excel Workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'EBL Statements');

  // Format timestamp for filename
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const filename = customFilename || `EBL_Verification_Statements_${dateStr}.xlsx`;

  // Download File
  XLSX.writeFile(workbook, filename);
}

/**
 * Export a single detailed statement including transaction breakdown to Excel
 */
export function exportSingleStatementToExcel(statement: StatementData) {
  if (!statement) {
    throw new Error('Statement data missing');
  }

  const appUrl = typeof window !== 'undefined' ? getAppUrl() : '';
  const verifyUrl = `${appUrl}/ebl-cert-portal-flat/verify.php?qr=${statement.qrCodeHash || ''}`;

  // Summary sheet data
  const summaryRows = [
    { Property: 'Customer Name', Value: statement.customerName },
    { Property: 'Account Number', Value: statement.accountNo },
    { Property: 'Customer ID', Value: statement.customerId },
    { Property: 'Branch Name', Value: `${statement.branchName} (${statement.branchCode})` },
    { Property: 'Product Name', Value: statement.productName },
    { Property: 'Statement Period', Value: `${statement.periodFrom} to ${statement.periodTo}` },
    { Property: 'Currency', Value: statement.currencyName },
    { Property: 'Closing Balance', Value: statement.closingBalance },
    { Property: 'QR Code Hash', Value: statement.qrCodeHash },
    { Property: 'Verification Link', Value: verifyUrl },
  ];

  const summarySheet = XLSX.utils.json_to_sheet(summaryRows);
  summarySheet['!cols'] = [{ wch: 22 }, { wch: 50 }];

  // Transactions sheet data
  const txnRows = (statement.transactions || []).map((t, idx) => ({
    '#': idx + 1,
    'Transaction Date': t.trnDate,
    'Description': t.description,
    'Reference': t.reference,
    'Debits (BDT)': t.debits || '0.00',
    'Credits (BDT)': t.credits || '0.00',
    'Balance (BDT)': t.balance || '0.00',
  }));

  const txnSheet = XLSX.utils.json_to_sheet(txnRows);
  txnSheet['!cols'] = [
    { wch: 5 },
    { wch: 16 },
    { wch: 35 },
    { wch: 18 },
    { wch: 14 },
    { wch: 14 },
    { wch: 16 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Account Summary');
  XLSX.utils.book_append_sheet(workbook, txnSheet, 'Transactions');

  const cleanAcc = (statement.accountNo || 'statement').replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `EBL_Statement_${cleanAcc}.xlsx`;

  XLSX.writeFile(workbook, filename);
}
