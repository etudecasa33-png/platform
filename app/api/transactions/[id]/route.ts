import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    
    // 1. Récupérer l'ancienne transaction pour l'historique
    const oldTransaction = await prisma.transaction.findUnique({ where: { id: resolvedParams.id } });

    // 2. Mettre à jour la transaction
    const updatedTransaction = await prisma.transaction.update({
      where: { id: resolvedParams.id },
      data: {
        type: body.type,
        amount: parseFloat(body.amount),
        category: body.category,
        description: body.description
      }
    });

    // 3. Créer le journal d'audit
    await prisma.auditLog.create({
      data: {
        action: "UPDATE",
        transactionId: resolvedParams.id,
        previousData: oldTransaction as any,
        newData: updatedTransaction as any,
        performedBy: "Admin User"
      }
    });

    return NextResponse.json(updatedTransaction);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    // Récupération de la raison (si envoyée par le frontend)
    const body = await request.json().catch(() => ({ reason: "Deleted by Admin" }));

    // 1. Récupérer la transaction existante
    const transaction = await prisma.transaction.findUnique({ where: { id: resolvedParams.id } });

    if (!transaction) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // 2. Soft Delete : On change le statut, on ne la supprime pas
    const deletedTransaction = await prisma.transaction.update({
      where: { id: resolvedParams.id },
      data: {
        status: "DELETED",
        deletedAt: new Date(),
        deleteReason: body.reason
      }
    });

    // 3. Créer le journal d'audit de suppression
    await prisma.auditLog.create({
      data: {
        action: "DELETE",
        transactionId: resolvedParams.id,
        previousData: transaction as any,
        newData: { status: "DELETED", reason: body.reason },
        performedBy: "Admin User"
      }
    });

    return NextResponse.json({ message: "Transaction soft-deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}