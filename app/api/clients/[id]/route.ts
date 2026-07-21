import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. GET: Fetches the client data safely
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const clientId = resolvedParams.id;

    // ATTEMPT 1: Try to fetch everything
    try {
      const client = await prisma.client.findUnique({
        where: { id: clientId },
        include: {
          contracts: true,
          documents: true,
          invoices: true
        }
      });
      
      if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });
      return NextResponse.json(client);
      
    } catch (relationError) {
      console.error("Database relation error (Schema mismatch):", relationError);
      
      // ATTEMPT 2: Fallback. Fetch JUST the client profile to prevent the page from crashing
      const fallbackClient = await prisma.client.findUnique({
        where: { id: clientId }
      });

      if (!fallbackClient) return NextResponse.json({ error: "Client not found" }, { status: 404 });

      // Send the client back, but fake empty arrays for the missing relations
      return NextResponse.json({
        ...fallbackClient,
        contracts: [],
        documents: [],
        invoices: []
      });
    }

  } catch (error) {
    console.error("Critical database error:", error);
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
        notes: body.remarques || null 
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