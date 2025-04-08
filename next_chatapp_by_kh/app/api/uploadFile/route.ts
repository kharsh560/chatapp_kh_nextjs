// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false, // Required to handle file streams
  },
};

// Helper function to parse form-data
const parseForm = async (req: NextRequest): Promise<any> => {
  const form = formidable({ 
    multiples: false, 
    uploadDir: './public/uploads', 
    keepExtensions: true 
  });

  return new Promise((resolve, reject) => {
    form.parse(req as any, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { files } = await parseForm(req);
    const file = files?.dp[0]; // assuming input name="dp"

    return NextResponse.json({ 
      success: true, 
      url: `/uploads/${file.newFilename}` 
    });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}
