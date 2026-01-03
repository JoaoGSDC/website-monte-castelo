export interface ICourse {
  _id?: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  backDescription: string;
  icon?: string;
  video?: string;
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
}

