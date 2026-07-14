import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json();
    const unwrappedParams = await params;
    
    const updatedInvoice = await prisma.invoice.update({
      where: { id: unwrappedParams.id },
      data: {
        title: body.title,
        totalAmount: parseFloat(body.totalAmount),
        paidAmount: parseFloat(body.paidAmount),
        currency: body.currency
      }
    });

    return NextResponse.json(updatedInvoice, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update invoice" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const unwrappedParams = await params;
    await prisma.invoice.delete({
      where: { id: unwrappedParams.id }
    });

    return NextResponse.json({ message: "Invoice deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete invoice" }, { status: 500 });
  }
}