export interface JobData {
  title: string;
  company: string;
  location: string;
  salary: string;
  employmentType: string;
  experience: string;
  description: string;
}

export interface JobCardProps {
  jobData: JobData;
}

export interface Preview3DProps {
  jobData: JobData;
} 