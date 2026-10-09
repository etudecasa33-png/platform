import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { name, idNumber, amount, currency, itemDescription } = await request.json();

    // We use a Prisma Transaction so if one thing fails, everything cancels (no corrupted data)
    const result = await prisma.$transaction(async (tx) => {
      
      // 1. Create the Client in the CRM
      const client = await tx.client.create({
        data: { 
          name, 
          notes: `Client ID Number: ${idNumber}` 
        }
      });

      // 2. Create the Financial Transaction in the Ledger (DZD or DIRHAM)
      const newTx = await tx.transaction.create({
        data: {
          type: 'ENTREE',
          amount: parseFloat(amount),
          currency: currency,
          category: 'Vehicle Purchase',
          description: itemDescription,
          status: 'ACTIVE'
        }
      });

      // 3. Auto-Generate the Invoice (Sequential Numbering)
      const tempInvoice = await tx.invoice.create({
        data: {
          clientId: client.id,
          transactionId: newTx.id,
          title: 'Vehicle Purchase Invoice',
          totalAmount: parseFloat(amount),
          paidAmount: parseFloat(amount), // Assuming fully paid upfront
          currency: currency,
          // We save the specific details here so the Invoice can read them!
          metadata: { idNumber, itemDescription } 
        }
      });
      
      // Format the number to #00001
      const invoiceNumber = `#${String(tempInvoice.sequenceNum).padStart(5, '0')}`;
      await tx.invoice.update({
        where: { id: tempInvoice.id },
        data: { invoiceNumber }
      });

      // 4. Auto-Generate the Receipt Voucher
      const voucherNumber = `VOU-${Date.now().toString().slice(-6)}`;
      await tx.voucher.create({
        data: {
          voucherNumber,
          clientId: client.id,
          transactionId: newTx.id
        }
      });

      // 5. Permanent Audit Log
      await tx.auditLog.create({
        data: { 
          action: "CREATE", 
          transactionId: newTx.id, 
          newData: newTx as any, 
          performedBy: "System (Client Onboarding)" 
        }
      });

      return { client, invoiceNumber, voucherNumber };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json({ error: "Failed to create client and documents" }, { status: 500 });
  }
}