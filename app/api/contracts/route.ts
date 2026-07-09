import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { put } from '@vercel/blob';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const clientId = formData.get('clientId') as string;
    const startDate = formData.get('startDate') as string;
    const expirationDate = formData.get('expirationDate') as string;
    const status = formData.get('status') as string;

    // Grab ALL files uploaded to the contract
    const files = formData.getAll('files') as File[];
    const savedFilePaths: string[] = [];

    for (const file of files) {
      if (file && file.size > 0) {
        const safeFilename = file.name.replace(/\s+/g, '_');
        const uniqueName = `${Date.now()}-${safeFilename}`;

        // Upload the file directly to Vercel Blob cloud storage
        const blob = await put(uniqueName, file, {
          access: 'public',
        });

        // Save the permanent cloud URL to your database
        savedFilePaths.push(blob.url);
      }
    }

    const newContract = await prisma.contract.create({
      data: {
        clientId,
        startDate: new Date(startDate),
        expirationDate: new Date(expirationDate),
        status: status || 'Active',
        fileUrls: JSON.stringify(savedFilePaths),
      }
    });

    return NextResponse.json(newContract, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to create contract" }, { status: 500 });
  }
}