import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// UPDATE (Modify)
export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    // THIS IS THE FIX: Next.js 15 requires us to 'await' the params
    const params = await context.params; 
    const body = await request.json();
    
    const updatedTransaction = await prisma.transaction.update({
      where: { id: params.id },
      data: {
        type: body.type,
        amount: parseFloat(body.amount),
        category: body.category,
        description: body.description,
      }
    });

    return NextResponse.json(updatedTransaction);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update transaction" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    // THIS IS THE FIX: Next.js 15 requires us to 'await' the params
    const params = await context.params; 
    
    await prisma.transaction.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: "Transaction deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 });
  }
}