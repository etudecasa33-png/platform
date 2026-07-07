import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile } from 'fs/promises';
import path from 'path';

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
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const safeFilename = file.name.replace(/\s+/g, '_');
        const uniqueName = `${Date.now()}-${safeFilename}`;
        const filepath = path.join(process.cwd(), 'public', 'uploads', uniqueName);
        await writeFile(filepath, buffer);
        savedFilePaths.push(`/uploads/${uniqueName}`);
      }
    }

    const newContract = await prisma.contract.create({
      data: {
        clientId,
        startDate: new Date(startDate),
        expirationDate: new Date(expirationDate),
        status: status || 'Active',
        fileUrls: JSON.stringify(savedFilePaths), // Save infinite files as a JSON string
      }
    });

    return NextResponse.json(newContract, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create contract" }, { status: 500 });
  }
}