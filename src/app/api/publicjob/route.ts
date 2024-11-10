import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const jobData = await request.json();
    const client = await MongoClient.connect(process.env.MONGO_URI as string);

    const db = client.db('test'); 

    const jobDocument = {
      ...jobData,
      createdAt: new Date(),
      status: 'active'
    };

    const result = await db.collection('jobs').insertOne(jobDocument);

    await client.close();

    return NextResponse.json({ 
      success: true, 
      jobId: result.insertedId 
    });

  } catch (error) {
    console.error('Error publishing job:', error);
    return NextResponse.json(
      { error: 'Failed to publish job' },
      { status: 500 }
    );
  }
} 