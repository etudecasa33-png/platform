import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  
  // We must delete BOTH keys to be completely safe!
  cookieStore.delete('admin_auth');
  cookieStore.delete('client_auth'); 
  
  return NextResponse.json({ success: true });
}