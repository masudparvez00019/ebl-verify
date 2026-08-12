import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Statement from '@/models/Statement';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const qrParam = searchParams.get('qr') || searchParams.get('q') || '';

    if (!qrParam || !qrParam.trim()) {
      return NextResponse.json({ error: 'QR parameter is required' }, { status: 400 });
    }

    await connectToDatabase();

    // Clean query in case full URL was passed: extract qr= parameter or hash
    let hash = qrParam.trim();
    if (hash.includes('qr=')) {
      hash = hash.split('qr=')[1]?.split('&')[0] || hash;
    } else if (hash.includes('q=')) {
      hash = hash.split('q=')[1]?.split('&')[0] || hash;
    }

    const statement = await Statement.findOne({
      qrCodeHash: { $regex: new RegExp(`^${hash}$`, 'i') },
    });

    if (!statement) {
      return NextResponse.json({ error: 'Document not found or invalid' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      statement: {
        _id: statement._id,
        qrCodeHash: statement.qrCodeHash,
        customerName: statement.customerName,
        accountNo: statement.accountNo,
        productName: statement.productName,
        periodFrom: statement.periodFrom,
        periodTo: statement.periodTo,
        closingBalance: statement.closingBalance,
        transactions: statement.transactions,
        createdAt: statement.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Verification API Error:', error);
    return NextResponse.json({ error: error?.message || 'Verification process failed' }, { status: 500 });
  }
}
