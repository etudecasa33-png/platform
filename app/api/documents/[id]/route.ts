import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

// MODIFY DOCUMENT (And its files)
export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const formData = await request.formData();

    const title = formData.get('title') as string;
    const details = formData.get('details') as string | null;
    const dateStr = formData.get('date') as string | null;

    // 1. Keep the old files they didn't delete
    const retainedFilesStr = formData.get('retainedFiles') as string;
    let finalFilePaths: string[] = retainedFilesStr ? JSON.parse(retainedFilesStr) : [];

    // 2. Save any new files
    const files = formData.getAll('files') as File[];
    for (const file of files) {
      if (file && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const safeFilename = file.name.replace(/\s+/g, '_');
        const uniqueName = `${Date.now()}-${safeFilename}`;
        const filepath = path.join(process.cwd(), 'public', 'uploads', uniqueName);
        await writeFile(filepath, buffer);
        finalFilePaths.push(`/uploads/${uniqueName}`);
      }
    }

    const updatedDocument = await prisma.clientDocument.update({
      where: { id: params.id },
      data: {
        title,
        details,
        date: dateStr ? new Date(dateStr) : null,
        fileUrls: JSON.stringify(finalFilePaths)
      }
    });

    return NextResponse.json(updatedDocument);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update document" }, { status: 500 });
  }
}

// DELETE DOCUMENT
export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    await prisma.clientDocument.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Document deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete document" }, { status: 500 });
  }
}