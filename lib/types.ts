export type UserRole = "PATIENT" | "DOCTOR" | "ADMIN";

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  emailVerified: boolean;
  isActive: boolean;
  avatar?: string;
  phone?: string;
  createdAt: Date;
}

export interface DoctorProfile extends UserProfile {
  specialty?: string;
  licenseNumber?: string;
  bio?: string;
}

export interface PatientProfile extends UserProfile {
  dateOfBirth?: Date;
  gender?: "male" | "female";
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  phone?: string;
  location?: string;
  bio?: string;
  specialty?: string;
  licenseNumber?: string;
  dateOfBirth?: string;
  gender?: "male" | "female";
}
