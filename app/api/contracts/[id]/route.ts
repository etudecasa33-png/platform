import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

// MODIFY CONTRACT (And its files)
export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const formData = await request.formData();

    const startDate = formData.get('startDate') as string;
    const expirationDate = formData.get('expirationDate') as string;
    const status = formData.get('status') as string;

    // 1. Get the files the user DID NOT delete during editing
    const retainedFilesStr = formData.get('retainedFiles') as string;
    let finalFilePaths: string[] = retainedFilesStr ? JSON.parse(retainedFilesStr) : [];

    // 2. Grab any BRAND NEW files they just added
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

    const updatedContract = await prisma.contract.update({
      where: { id: params.id },
      data: {
        startDate: new Date(startDate),
        expirationDate: new Date(expirationDate),
        status: status,
        fileUrls: JSON.stringify(finalFilePaths) // Save the merged files
      }
    });

    return NextResponse.json(updatedContract);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update contract" }, { status: 500 });
  }
}

// DELETE CONTRACT
export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    await prisma.contract.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Contract deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete contract" }, { status: 500 });
  }
}