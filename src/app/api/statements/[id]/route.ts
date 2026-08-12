import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Statement from '@/models/Statement';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const statement = await Statement.findById(id);

    if (!statement) {
      return NextResponse.json({ error: 'Statement not found' }, { status: 404 });
    }

    return NextResponse.json({ statement });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    await connectToDatabase();
    const updatedStatement = await Statement.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedStatement) {
      return NextResponse.json({ error: 'Statement not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Statement updated successfully',
      statement: updatedStatement,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const deleted = await Statement.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Statement not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Statement deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}
