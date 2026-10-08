import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    
    // Permanently delete the log from the database
    await prisma.auditLog.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: "History log permanently deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete history log" }, { status: 500 });
  }
}