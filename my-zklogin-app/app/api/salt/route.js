import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { token } = await request.json();

    // Validate required fields
    if (!token) {
      return NextResponse.json(
        { error: "Missing required field: 'token'" },
        { status: 400 }
      );
    }

    const fetchFn = typeof fetch !== 'undefined' ? fetch : globalThis.fetch;
    const saltResponse = await fetchFn('https://salt.api.mystenlabs.com/get_salt', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        // Add any required API keys here if needed
        // 'Authorization': `Bearer ${process.env.MYSTEN_API_KEY}`
      },
      body: JSON.stringify({ 
        token,
        client_id: process.env.MYSTEN_CLIENT_ID // Use env variable
      }),
    });

    if (!saltResponse.ok)
    {
    const errorData = await saltResponse.json();
    console.error("Mysten Labs API Error:", errorData); // Log details
    throw new Error(errorData.error || "Salt API failed");
    } 

    const saltData = await saltResponse.json();
    return NextResponse.json(saltData);

  } catch (error) {
    console.error('Salt API route error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}