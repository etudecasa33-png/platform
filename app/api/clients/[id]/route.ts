import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. GET: Fetches the client data for the profile page
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const unwrappedParams = await params;
    const client = await prisma.client.findUnique({
      where: { id: unwrappedParams.id },
      include: {
        // FIXED: Changed 'createdAt' to 'startDate' because Contracts don't have a createdAt column!
        contracts: { orderBy: { startDate: 'desc' } },
        documents: { orderBy: { createdAt: 'desc' } },
        invoices: { orderBy: { createdAt: 'desc' } }
      }
    });
    if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });
    return NextResponse.json(client);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch client" }, { status: 500 });
  }
}

// 2. PUT: Updates the client's core details
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const unwrappedParams = await params;
    const body = await request.json();
    
    const updatedClient = await prisma.client.update({
      where: { id: unwrappedParams.id },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        address: body.address
      }
    });
    return NextResponse.json(updatedClient, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update client" }, { status: 500 });
  }
}

// 3. DELETE: Removes the client and ALL their connected data
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const unwrappedParams = await params;
    await prisma.client.delete({
      where: { id: unwrappedParams.id }
    });
    return NextResponse.json({ message: "Client deleted completely" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete client" }, { status: 500 });
  }
}