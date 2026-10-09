import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 1. THIS BRINGS ALL YOUR PREVIOUS CLIENTS BACK TO THE CRM WITH THEIR INVOICES
export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: 'desc' },
      include: { invoices: true } // <-- THIS LINE IS NEW! It fetches the documents.
    });
    return NextResponse.json(clients);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 });
  }
}

// 2. THIS FIXES LOGIN AND SAFELY GENERATES INVOICES
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Ensure email and password exist so the client can log in
    const email = data.email || `${data.name.toLowerCase().replace(/\s+/g, '')}@client.automondo.net`;
    const password = data.password || Math.random().toString(36).slice(-8);

    // If the CRM form sends an amount and item, we generate the full Invoice & Receipt
    if (data.amount && data.itemDescription) {
      const result = await prisma.$transaction(async (tx) => {
        
        // Create client with login credentials
        const client = await tx.client.create({
          data: { 
            name: data.name, 
            email: email,
            password: password,
            phone: data.phone || '',
            notes: data.idNumber ? `ID: ${data.idNumber}` : '' 
          }
        });

        const newTx = await tx.transaction.create({
          data: {
            type: 'ENTREE',
            amount: parseFloat(data.amount),
            currency: data.currency || 'DZD',
            category: 'Vehicle Purchase',
            description: data.itemDescription,
            status: 'ACTIVE'
          }
        });

        const tempInvoice = await tx.invoice.create({
          data: {
            clientId: client.id,
            transactionId: newTx.id,
            title: 'Vehicle Purchase Invoice',
            totalAmount: parseFloat(data.amount),
            paidAmount: parseFloat(data.amount),
            currency: data.currency || 'DZD',
            metadata: { idNumber: data.idNumber, itemDescription: data.itemDescription } 
          }
        });
        
        const invoiceNumber = `#${String(tempInvoice.sequenceNum).padStart(5, '0')}`;
        await tx.invoice.update({
          where: { id: tempInvoice.id },
          data: { invoiceNumber }
        });

        const voucherNumber = `VOU-${Date.now().toString().slice(-6)}`;
        await tx.voucher.create({
          data: {
            voucherNumber,
            clientId: client.id,
            transactionId: newTx.id
          }
        });

        await tx.auditLog.create({
          data: { action: "CREATE", transactionId: newTx.id, newData: newTx as any, performedBy: "System (Client Onboarding)" }
        });

        return { client, invoiceNumber, voucherNumber };
      });
      
      return NextResponse.json(result, { status: 201 });
      
    } else {
      
      // If you are just adding a standard client from the CRM without invoice info
      const client = await prisma.client.create({
        data: { 
          name: data.name,
          email: email,
          password: password,
          phone: data.phone || '',
          notes: data.notes || ''
        }
      });
      return NextResponse.json(client, { status: 201 });
    }
    
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 });
  }
}