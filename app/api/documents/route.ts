import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const clientId = formData.get('clientId') as string;
    const title = formData.get('title') as string;
    const details = formData.get('details') as string | null;
    const dateStr = formData.get('date') as string | null;
    
    // Grab ALL files uploaded, no matter how many!
    const files = formData.getAll('files') as File[];
    const savedFilePaths: string[] = [];

    // Loop through and save every single file
    for (const file of files) {
      if (file && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const safeFilename = file.name.replace(/\s+/g, '_');
        const uniqueName = `${Date.now()}-${safeFilename}`;
        const filepath = path.join(process.cwd(), 'public', 'uploads', uniqueName);
        
        await writeFile(filepath, buffer);
        savedFilePaths.push(`/uploads/${uniqueName}`);
      }
    }

    const newDocument = await prisma.clientDocument.create({
      data: {
        clientId,
        title,
        details,
        date: dateStr ? new Date(dateStr) : null,
        // We compress all the file URLs into a single string to save to the database safely
        fileUrls: JSON.stringify(savedFilePaths), 
      }
    });

    return NextResponse.json(newDocument, { status: 201 });
  } catch (error) {
    console.error("Document upload error:", error);
    return NextResponse.json({ error: "Failed to upload documents" }, { status: 500 });
  }
}