import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// FETCH Client + Contracts + Documents
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const client = await prisma.client.findUnique({
      where: { id: params.id },
      include: { 
        contracts: { orderBy: { expirationDate: 'asc' } },
        documents: { orderBy: { createdAt: 'desc' } } // We added Documents here!
      } 
    });
    if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });
    return NextResponse.json(client);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch client" }, { status: 500 });
  }
}

// UPDATE Client
export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const body = await request.json();
    const updatedClient = await prisma.client.update({
      where: { id: params.id },
      data: { 
        name: body.name, 
        phone: body.phone, 
        email: body.email, 
        address: body.address, 
        notes: body.notes,
        password: body.password // <-- ADD THIS LINE to your existing file!
      }
    });
    return NextResponse.json(updatedClient);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update client" }, { status: 500 });
  }
}

// DELETE Client (This will automatically delete all their contracts and files too!)
export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    await prisma.client.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Client deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete client" }, { status: 500 });
  }
}