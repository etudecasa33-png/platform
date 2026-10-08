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
      where: {
        status: "ACTIVE", // <-- MODIFICATION : Ignore les transactions supprimées (Soft Delete)
        ...(currency ? { currency: currency } : {})
      },
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

    // Utilisation de $transaction pour garantir que tout est sauvegardé en même temps
    const result = await prisma.$transaction(async (tx) => {
      
      // 1. Créer la transaction financière (toujours ACTIVE par défaut)
      const newTransaction = await tx.transaction.create({
        data: {
          currency,
          type,
          amount: parseFloat(amount),
          category,
          description,
          status: "ACTIVE"
        }
      });

      // 2. Créer le journal d'audit (Historique permanent de la création)
      await tx.auditLog.create({
        data: {
          action: "CREATE",
          transactionId: newTransaction.id,
          newData: newTransaction as any,
          performedBy: "Admin User"
        }
      });

      // 3. Génération du numéro de facture séquentiel unique (ex: #00001)
      const tempInvoice = await tx.invoice.create({
        data: {
          transactionId: newTransaction.id,
          // La base de données va générer automatiquement le `sequenceNum`
        }
      });

      const formattedNumber = `#${String(tempInvoice.sequenceNum).padStart(5, '0')}`;

      // Met à jour la facture avec le numéro formaté
      await tx.invoice.update({
        where: { id: tempInvoice.id },
        data: { invoiceNumber: formattedNumber }
      });

      return newTransaction;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de la transaction:", error);
    return NextResponse.json({ error: "Failed to save transaction" }, { status: 500 });
  }
}