import { NextResponse } from 'next/server';

// This route redirects to the correct endpoint at /api/forms/triagem-ambiental
// This is a temporary fix for any cached or misdirected requests

export async function GET(req: Request) {
  const url = new URL(req.url);
  const newUrl = new URL(
    `/api/forms/triagem-ambiental${url.search}`,
    url.origin
  );

  try {
    const response = await fetch(newUrl.toString(), {
      method: 'GET',
      headers: req.headers,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error redirecting GET request:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  const newUrl = new URL(
    `/api/forms/triagem-ambiental${url.search}`,
    url.origin
  );

  try {
    const body = await req.json();

    const response = await fetch(newUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...Object.fromEntries(req.headers.entries()),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error redirecting POST request:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const url = new URL(req.url);
  const newUrl = new URL(
    `/api/forms/triagem-ambiental${url.search}`,
    url.origin
  );

  try {
    const body = await req.json();

    const response = await fetch(newUrl.toString(), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...Object.fromEntries(req.headers.entries()),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error redirecting PUT request:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const newUrl = new URL(
    `/api/forms/triagem-ambiental${url.search}`,
    url.origin
  );

  try {
    const response = await fetch(newUrl.toString(), {
      method: 'DELETE',
      headers: req.headers,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error redirecting DELETE request:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
