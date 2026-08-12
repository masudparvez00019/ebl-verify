import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Statement from '@/models/Statement';
import User from '@/models/User';

export async function GET() {
  try {
    await connectToDatabase();

    // 1. Total Statements count
    const totalStatements = await Statement.countDocuments();

    // 2. Total Registered Users count
    const totalUsers = await User.countDocuments();

    // 3. Active QR Hashes count
    const activeQrHashes = await Statement.countDocuments({
      qrCodeHash: { $exists: true, $ne: '' },
    });

    // 4. Safe Calculation for total transactions, closing balance, and distinct branches
    const allStatements = await Statement.find({}, 'transactions closingBalance branchName');
    
    let totalTransactions = 0;
    let totalClosingBalanceSum = 0;
    const branchSet = new Set<string>();

    for (const st of allStatements) {
      if (Array.isArray(st.transactions)) {
        totalTransactions += st.transactions.length;
      }
      if (st.branchName && st.branchName.trim()) {
        branchSet.add(st.branchName.trim());
      }
      if (st.closingBalance) {
        const cleaned = String(st.closingBalance).replace(/,/g, '').trim();
        const parsed = parseFloat(cleaned);
        if (!isNaN(parsed)) {
          totalClosingBalanceSum += parsed;
        }
      }
    }

    // 5. Fetch recent 10 statement verification records for live feed
    const recentStatements = await Statement.find()
      .sort({ createdAt: -1 })
      .limit(10);

    return NextResponse.json({
      success: true,
      stats: {
        totalStatements,
        totalUsers,
        activeQrHashes,
        totalTransactions,
        totalClosingBalance: totalClosingBalanceSum.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        totalBranches: branchSet.size,
        dbStatus: 'Connected (MongoDB Atlas)',
      },
      recentStatements,
    });
  } catch (error: any) {
    console.error('GET Dashboard Stats Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch dashboard metrics' },
      { status: 500 }
    );
  }
}

