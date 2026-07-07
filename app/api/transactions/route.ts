import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// This handles fetching the transactions for the table
export async function GET(request: Request) {
  // Check if we are asking for DZD or DIRHAM
  const { searchParams } = new URL(request.url);
  const currency = searchParams.get('currency');

  try {
    const transactions = await prisma.transaction.findMany({
      where: currency ? { currency: currency } : undefined,
      orderBy: { date: 'desc' } // Shows newest transactions at the top
    });
    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}

// This handles saving a brand new transaction to the database
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { currency, type, amount, category, description } = body;

    const newTransaction = await prisma.transaction.create({
      data: {
        currency,
        type,
        amount: parseFloat(amount), // Ensures the amount is saved as a number
        category,
        description,
      }
    });

    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save transaction" }, { status: 500 });
  }
}