import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;
    const cookieStore = await cookies();
    
    // 1. CHECK IF IT IS THE ADMIN (YOU)
    const ADMIN_USERNAME = "automondo";
    const ADMIN_PASSWORD = "taki123456789"; 

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      cookieStore.set('admin_auth', 'true', { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 });
      return NextResponse.json({ role: 'admin' });
    }

    // 2. CHECK IF IT IS A CLIENT (Using their Email as Username)
    const client = await prisma.client.findFirst({
      where: { email: username, password: password }
    });

    if (client && client.password) {
      // Give the client a completely different security key locked to their ID!
      cookieStore.set('client_auth', client.id, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 });
      return NextResponse.json({ role: 'client' });
    }

    return NextResponse.json({ error: "Incorrect username or password" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}