import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const cookieStore = await cookies();
    const clientId = cookieStore.get('client_auth')?.value;

    if (!clientId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const client = await prisma.client.findUnique({
      where: { id: clientId },
      include: { 
        contracts: { orderBy: { expirationDate: 'asc' } },
        documents: { orderBy: { createdAt: 'desc' } },
        invoices: { orderBy: { createdAt: 'desc' } } // <-- ADDED THIS LINE!
      }
    });

    return NextResponse.json(client);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch portal data" }, { status: 500 });
  }
}