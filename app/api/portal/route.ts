import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    // 1. Servir les images (logo & stamp) directement via /api/portal pour éviter l'erreur 307 côté client
    const { searchParams } = new URL(req.url);
    const asset = searchParams.get('asset');

    if (asset && ['logo.png', 'stamp.png', 'stamp1.png', 'logo.PNG', 'stamp.PNG', 'stamp1.PNG'].includes(asset)) {
      const publicDir = path.join(process.cwd(), 'public');
      const candidates = [
        asset,
        asset.toLowerCase(),
        asset === 'stamp1.png' ? 'stamp.png' : asset,
        asset === 'stamp.png' ? 'stamp1.png' : asset,
      ];

      for (const fileName of candidates) {
        const filePath = path.join(publicDir, fileName);
        if (fs.existsSync(filePath)) {
          const fileBuffer = fs.readFileSync(filePath);
          return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
              'Content-Type': 'image/png',
              'Cache-Control': 'public, max-age=86400',
            },
          });
        }
      }
    }

    // 2. Récupération normale des données du client
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