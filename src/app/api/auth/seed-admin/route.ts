import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    await connectToDatabase();

    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return NextResponse.json({
        message: 'Admin already exists',
        admin: {
          id: existingAdmin._id,
          name: existingAdmin.name,
          email: existingAdmin.email,
          role: existingAdmin.role,
        },
      });
    }

    const defaultEmail = 'admin@eblverify.com';
    const defaultPassword = 'Admin@123456';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const newAdmin = await User.create({
      name: 'System Admin',
      email: defaultEmail,
      password: hashedPassword,
      role: 'admin',
      avatar: '',
    });

    return NextResponse.json({
      message: 'Default Admin created successfully',
      credentials: {
        email: defaultEmail,
        password: defaultPassword,
      },
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (error: any) {
    console.error('Seed Admin Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to seed admin user' },
      { status: 500 }
    );
  }
}
