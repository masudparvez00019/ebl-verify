import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectToDatabase } from '@/lib/db';
import Statement from '@/models/Statement';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    let filter = {};
    if (query) {
      filter = {
        $or: [
          { customerName: { $regex: query, $options: 'i' } },
          { accountNo: { $regex: query, $options: 'i' } },
          { customerId: { $regex: query, $options: 'i' } },
          { qrCodeHash: { $regex: query, $options: 'i' } },
        ],
      };
    }

    const statements = await Statement.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ statements });
  } catch (error: any) {
    console.error('GET Statements Error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to fetch statements' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.customerName || !body.accountNo) {
      return NextResponse.json(
        { error: 'Customer Name and Account Number are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Generate unique 64-char (32 byte) Hex QR Hash code
    const qrCodeHash = crypto.randomBytes(32).toString('hex').toUpperCase();

    const newStatement = await Statement.create({
      ...body,
      qrCodeHash,
    });

    return NextResponse.json({
      message: 'Statement created successfully',
      statement: newStatement,
    });
  } catch (error: any) {
    console.error('Create Statement Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create statement' },
      { status: 500 }
    );
  }
}
