import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const asset = searchParams.get('asset');

  // --- NOUVEAU: Bypass 307 redirect for public images in Client Portal ---
  if (asset && ['logo.png', 'stamp.png', 'stamp1.png'].includes(asset)) {
    const filePath = path.join(process.cwd(), 'public', asset);
    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      return new NextResponse(fileBuffer, {
        headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' },
      });
    }
  }

  // ... Khalli l'ba9i te3 l'code te3 GET kima rah exactement ...
const prisma = new PrismaClient();

export async function GET() {
  try {
    const cookieStore = await cookies();
    const clientId = cookieStore.get('client_auth')?.value;

    if (!clientId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const client = await prisma.client.findUnique({
      where: { id: clientId },
      include: { 
        contracts: { orderBy: { expirationDate: 'asc' } },
        documents: { orderBy: { createdAt: 'desc' } },
        invoices: { orderBy: { createdAt: 'desc' } } // <-- ADDED THIS LINE!
      }
    });

    return NextResponse.json(client);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch portal data" }, { status: 500 });
  }
}