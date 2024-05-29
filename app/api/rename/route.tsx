import { NextResponse } from 'next/server';
import { copy } from '@vercel/blob';

export async function PUT(request: Request): Promise<NextResponse> {
    const json = await request.json()

    await copy(json.fromUrl, json.toPathname, { access: 'public' });
    console.log(json.fromUrl, json.toPathname)

    return NextResponse.json({})
}