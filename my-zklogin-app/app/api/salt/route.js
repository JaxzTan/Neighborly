import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { token } = await request.json();

    const saltResponse = await fetch('https://salt.api.mystenlabs.com/get_salt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    if (!saltResponse.ok) {
      const errorText = await saltResponse.text();
      throw new Error(`Mysten Labs salt service failed: ${errorText}`);
    }

    const saltData = await saltResponse.json();
    return NextResponse.json(saltData);

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}