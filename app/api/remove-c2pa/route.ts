import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

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

    // Process the image with sharp to remove all metadata (including C2PA/CR badge)
    // The withMetadata(false) or lack of withMetadata() will strip all metadata
    const processedImage = await sharp(buffer)
      .withMetadata({}) // Remove all metadata including EXIF, IPTC, XMP, and C2PA
      .toBuffer();

    // Determine the content type based on the original file
    const contentType = file.type || 'image/png';

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
      { error: 'Failed to process image' },
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
