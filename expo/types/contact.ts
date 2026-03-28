export interface Contact {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  position: string;
  website: string;
  address: string;
  notes: string;
  tags: string[];
  imageUri?: string;
  createdAt: number;
  reminderDate?: number;
}

export interface ContactFormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  position: string;
  website: string;
  address: string;
  notes: string;
  tags: string[];
}