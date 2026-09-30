export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  qualification: string;
  experience: number; // in years
  rating: number;
  reviewsCount: number;
  consultationFee: number;
  nextAvailable: string;
  availableToday: boolean;
  online: boolean;
  image: string;
  hospitalDepartment: string;
  languages: string[];
  gender: 'Male' | 'Female' | 'Other';
  consultationType: ('In-Person' | 'Video Consultation')[];
  about: string;
  education: { degree: string; institution: string; year: string }[];
  experienceList: { role: string; hospital: string; duration: string }[];
  availableSlots: { date: string; slots: string[] }[];
}

export interface Department {
  id: string;
  name: string;
  iconName: string;
  shortDesc: string;
  longDesc: string;
  headOfDept: string;
  bedCapacity: number;
  surgeriesCompleted: number;
  doctorsCount: number;
  keyProcedures: string[];
  image: string;
}

export interface MedicalService {
  id: string;
  title: string;
  category: string;
  description: string;
  iconName: string;
  features: string[];
  turnaroundTime: string;
  operatingHours: string;
}

export interface HealthPackage {
  id: string;
  name: string;
  targetGroup: string;
  price: number;
  originalPrice: number;
  testsCount: number;
  popular?: boolean;
  description: string;
  features: string[];
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  department: string;
  date: string;
  timeSlot: string;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
  reason: string;
  consultationType: 'In-Person' | 'Video Consultation';
  hospitalLocation: string;
  createdAt: string;
  notes?: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  visitDate: string;
  doctorName: string;
  department: string;
  diagnosis: string;
  treatment: string;
  vitalSigns: {
    bp: string;
    pulse: string;
    temp: string;
    weight: string;
  };
  attachments: { name: string; size: string; type: string }[];
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  doctorName: string;
  department: string;
  diagnosis: string;
  medicines: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }[];
}

export interface LabReport {
  id: string;
  patientId: string;
  testName: string;
  category: string;
  date: string;
  doctorName: string;
  status: 'Completed' | 'Processing' | 'Pending';
  resultSummary?: string;
  normalRange?: string;
  flag?: 'Normal' | 'Elevated' | 'Low';
  reportUrl?: string;
}

export interface BillInvoice {
  id: string;
  patientId: string;
  patientName: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  service: string;
  amount: number;
  paidAmount: number;
  status: 'Paid' | 'Outstanding' | 'Processing';
  items: {
    description: string;
    qty: number;
    unitPrice: number;
    total: number;
  }[];
}

export interface HealthArticle {
  id: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  authorRole: string;
  image: string;
  shortDesc: string;
  content: string[];
}

export interface Testimonial {
  id: string;
  patientName: string;
  treatment: string;
  rating: number;
  review: string;
  avatar: string;
  date: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  phone?: string;
  age?: number;
  gender?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  allergies?: string[];
  avatar?: string;
  specialty?: string; // for doctor
  department?: string; // for doctor or admin
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'appointment' | 'lab' | 'billing' | 'system';
  link?: string;
}
