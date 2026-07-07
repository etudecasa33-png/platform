import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// This connects us to the database we just built
const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. Count total clients and contracts
    const clientsCount = await prisma.client.count();
    const contractsCount = await prisma.contract.count();
    
    // 2. Get all financial transactions
    const transactions = await prisma.transaction.findMany();
    
    // 3. Calculate Dinar (DZD) Balance
    const dzdTransactions = transactions.filter(t => t.currency === 'DZD');
    const totalDzd = dzdTransactions.reduce((total, transaction) => {
      if (transaction.type === 'ENTREE') return total + transaction.amount;
      if (transaction.type === 'SORTIE') return total - transaction.amount;
      return total;
    }, 0);

    // 4. Calculate Dirham Balance
    const dirhamTransactions = transactions.filter(t => t.currency === 'DIRHAM');
    const totalDirham = dirhamTransactions.reduce((total, transaction) => {
      if (transaction.type === 'ENTREE') return total + transaction.amount;
      if (transaction.type === 'SORTIE') return total - transaction.amount;
      return total;
    }, 0);

    // Send the final calculated numbers to the frontend
    return NextResponse.json({
      totalDzd,
      totalDirham,
      clientsCount,
      contractsCount
    });

  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 });
  }
}