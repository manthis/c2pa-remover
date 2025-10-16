import { NextRequest, NextResponse } from 'next/server';
import { PNG } from 'pngjs';
import jpeg from 'jpeg-js';

// Force Node.js runtime
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Convert the file to a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let processedImage: Buffer;
    let contentType: string;

    // Detect image type and process accordingly
    if (file.type === 'image/png' || (buffer[0] === 0x89 && buffer[1] === 0x50)) {
      // Process PNG - decode and re-encode to strip metadata
      const png = PNG.sync.read(buffer);
      // Re-encode without any metadata - this strips all metadata chunks
      processedImage = PNG.sync.write(png);
      contentType = 'image/png';
    } else if (file.type === 'image/jpeg' || (buffer[0] === 0xFF && buffer[1] === 0xD8)) {
      // Process JPEG - decode and re-encode to strip metadata
      const rawImageData = jpeg.decode(buffer, { useTArray: true });
      processedImage = jpeg.encode(rawImageData, 95).data;
      contentType = 'image/jpeg';
    } else {
      return NextResponse.json(
        { error: 'Unsupported image format. Please use PNG or JPEG.' },
        { status: 400 }
      );
    }

    // Return the cleaned image (convert Buffer to Uint8Array for Response)
    return new Response(new Uint8Array(processedImage), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="cleaned-${file.name}"`,
      },
    });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: 'Failed to process image', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// Also support GET requests to check if the API is working
export async function GET() {
  return NextResponse.json({
    message: 'C2PA Removal API is running',
    usage: 'POST an image file with form-data key "image"',
  });
}
