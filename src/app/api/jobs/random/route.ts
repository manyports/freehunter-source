import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { formatJobDescription } from '@/lib/formatJobDescription';

export const maxDuration = 60;

export async function GET() {
  try {
    const client = await MongoClient.connect(process.env.MONGO_URI as string);
    const db = client.db('test');

    const jobs = await db.collection('jobs')
      .find({ status: 'active' })
      .toArray();
    const formattedJobs = jobs.map(job => ({
      ...job,
      description: formatJobDescription(job.description),
      responsibilities: job.description ? 
        formatJobDescription(job.description)
          .split('#### Обязанности')[1]
          ?.split('####')[0]
          ?.trim()
          .split('\n')
          .filter(line => line.trim()) || [] : [],
      requirements: job.description ?
        formatJobDescription(job.description)
          .split('#### Требования')[1]
          ?.split('####')[0]
          ?.trim()
          .split('\n')
          .filter(line => line.trim()) || [] : [],
      benefits: job.description ?
        formatJobDescription(job.description)
          .split('#### Преимущества')[1]
          ?.split('####')[0]
          ?.trim()
          .split('\n')
          .filter(line => line.trim()) || [] : []
    }));

    await client.close();

    return NextResponse.json({ 
      success: true, 
      jobs: formattedJobs 
    });

  } catch (error) {
    console.error('Error fetching random jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
} 