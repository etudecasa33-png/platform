import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. GET: Fetches the client data for the profile page
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const client = await prisma.client.findUnique({
      where: { id: resolvedParams.id },
      // CRASH FIX: Removed the "orderBy" sorting. This is the safest way to include relations 
      // without Prisma panicking over missing date columns!
      include: {
        contracts: true,
        documents: true,
        invoices: true
      }
    });
    
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }
    
    return NextResponse.json(client);
  } catch (error) {
    console.error("Failed to fetch client:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// 2. PUT: Updates the client's core details
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    
    const updatedClient = await prisma.client.update({
      where: { id: resolvedParams.id },
      data: {
        name: body.name,
        email: body.email || null,
        phone: body.phone || null,
        address: body.address || null,
        password: body.password || null,
        notes: body.remarques || null // Maps your remarques field to the database
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
    const resolvedParams = await params;
    await prisma.client.delete({
      where: { id: resolvedParams.id }
    });
    return NextResponse.json({ message: "Client deleted completely" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete client" }, { status: 500 });
  }
}