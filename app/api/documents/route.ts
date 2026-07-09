import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { put } from '@vercel/blob';

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

    // Loop through and save every single file to Vercel Blob
    for (const file of files) {
      if (file && file.size > 0) {
        const safeFilename = file.name.replace(/\s+/g, '_');
        const uniqueName = `${Date.now()}-${safeFilename}`;
        
        // Upload the file directly to Vercel Blob cloud storage
        const blob = await put(uniqueName, file, {
          access: 'public',
        });

        // Save the permanent cloud URL
        savedFilePaths.push(blob.url);
      }
    }

    const newDocument = await prisma.clientDocument.create({
      data: {
        clientId,
        title,
        details,
        date: dateStr ? new Date(dateStr) : null,
        // Compress all the file URLs into a single string to save to the database safely
        fileUrls: JSON.stringify(savedFilePaths), 
      }
    });

    return NextResponse.json(newDocument, { status: 201 });
  } catch (error) {
    console.error("Document upload error:", error);
    return NextResponse.json({ error: "Failed to upload documents" }, { status: 500 });
  }
}