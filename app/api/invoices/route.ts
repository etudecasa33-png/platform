import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientId, title, currency, totalAmount, paidAmount } = body;

    const newInvoice = await prisma.invoice.create({
      data: {
        clientId,
        title: title || "Standard Invoice", // <-- Added title!
        currency,
        totalAmount: parseFloat(totalAmount),
        paidAmount: parseFloat(paidAmount),
      }
    });

    return NextResponse.json(newInvoice, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save invoice" }, { status: 500 });
  }
}