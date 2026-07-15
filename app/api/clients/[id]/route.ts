import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all clients
export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(clients);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 });
  }
}

// POST: Create a NEW client
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newClient = await prisma.client.create({
      data: {
        name: body.name,
        email: body.email || null,
        phone: body.phone || null,
        address: body.address || null,
        password: body.password || null, // Restored!
        notes: body.remarques || null    // Restored! (If your schema uses 'remarques' instead of 'notes', change it here)
      }
    });
    
    return NextResponse.json(newClient, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 });
  }
}