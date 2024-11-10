import { AssemblyAI } from 'assemblyai';
import { NextResponse } from 'next/server';

export const maxDuration = 60;

const client = new AssemblyAI({
  apiKey: process.env.TRS_API_KEY
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as Blob;

    if (!audioFile) {
      console.error('No audio file in request');
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    console.log(`Received audio file of size: ${audioFile.size} bytes`);
    const transcript = await client.transcripts.transcribe({
      audio: audioFile,
      language_code: "ru",
    });

    console.log('AssemblyAI Response:', transcript); 
    if (!transcript) {
      return NextResponse.json(
        { error: 'No transcript returned' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      text: transcript.text,
      status: transcript.status,
      id: transcript.id,
    });
  } catch (error) {
    console.error('Detailed transcription error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Transcription failed',
        details: error
      },
      { status: 500 }
    );
  }
} 