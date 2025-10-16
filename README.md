# C2PA Badge Remover

A Next.js application that removes C2PA (Coalition for Content Provenance and Authenticity) metadata from images, including the CR (Content Credentials) badge that appears on platforms like LinkedIn.

## Overview

This tool allows you to upload images that contain C2PA metadata (commonly found in AI-generated images from tools like OpenAI's DALL-E) and removes all metadata, resulting in a clean image without the Content Credentials badge.

## Features

- 🖼️ **Image Upload**: Upload any image with C2PA metadata
- 🔒 **Metadata Removal**: Strips all EXIF, IPTC, XMP, and C2PA metadata
- 👁️ **Live Preview**: Compare original and cleaned images side-by-side
- 📥 **Download**: Download the cleaned image with one click
- 🎨 **Modern UI**: Clean, responsive interface with dark mode support

## Tech Stack

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Sharp** for image processing

## Getting Started

### Prerequisites

- Node.js 18+ installed
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd c2pa-remover
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Upload an Image**: Click the file upload button and select an image with C2PA metadata
2. **Process**: Click "Remove C2PA Metadata" to strip the metadata
3. **Download**: Once processed, download the cleaned image using the Download button

## API Endpoint

The application exposes a REST API endpoint for programmatic access:

### POST `/api/remove-c2pa`

Removes C2PA metadata from an uploaded image.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: Form data with `image` field containing the image file

**Response:**
- Content-Type: Same as the uploaded image (e.g., `image/png`, `image/jpeg`)
- Body: Binary image data with metadata removed

**Example using curl:**
```bash
curl -X POST http://localhost:3000/api/remove-c2pa \
  -F "image=@/path/to/your/image.png" \
  --output cleaned-image.png
```

### GET `/api/remove-c2pa`

Returns API status information.

**Response:**
```json
{
  "message": "C2PA Removal API is running",
  "usage": "POST an image file with form-data key \"image\""
}
```

## How It Works

The application uses [Sharp](https://sharp.pixelplumbing.com/), a high-performance Node.js image processing library, to:

1. Parse the uploaded image buffer
2. Process the image with `withMetadata({})` to strip all metadata
3. Return the cleaned image buffer

The C2PA metadata, along with all other metadata (EXIF, IPTC, XMP), is completely removed while preserving the visual quality of the image.

## Project Structure

```
c2pa-remover/
├── app/
│   ├── api/
│   │   └── remove-c2pa/
│   │       └── route.ts          # API endpoint for metadata removal
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page with upload UI
├── public/                       # Static assets
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies
└── tsconfig.json                 # TypeScript configuration
```

## Development

### Build for Production

```bash
pnpm build
```

### Start Production Server

```bash
pnpm start
```

### Lint

```bash
pnpm lint
```

## Deployment

This Next.js application can be deployed to:

- **Vercel** (recommended): One-click deployment with `vercel` command
- **Docker**: Build and run as a containerized application
- **Node.js Server**: Run on any server that supports Node.js

### Deploy to Vercel

```bash
pnpm install -g vercel
vercel
```

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Disclaimer

This tool is intended for legitimate purposes such as:
- Removing metadata from your own AI-generated images
- Privacy protection for images you own
- Preparing images for specific platforms that don't require provenance data

Please respect copyright and content provenance requirements in your jurisdiction.
