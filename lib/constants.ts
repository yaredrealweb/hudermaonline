export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: "/api/auth/signup",
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    VERIFY_EMAIL: "/api/auth/verify-email",
    PROFILE: "/api/auth/profile",
    USERS: "/api/auth/users",
  },
} as const;

export const ROUTES = {
  PUBLIC: {
    HOME: "/",
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    VERIFY_EMAIL: "/auth/verify-email",
    UNAUTHORIZED: "/unauthorized",
  },
  PROTECTED: {
    DASHBOARD: "/dashboard",
    DOCTOR_DASHBOARD: "/dashboard/doctor",
    PATIENT_DASHBOARD: "/dashboard/patient",
    ADMIN_DASHBOARD: "/dashboard/admin",
    PROFILE: "/dashboard/profile",
    SETTINGS: "/dashboard/settings",
  },
} as const;

export const USER_ROLES = ["PATIENT", "DOCTOR", "ADMIN"] as const;

export const EMAIL_TEMPLATES = (
  verifyUrl: string
) => `<div style=" font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 50px 20px; text-align: center;">

  <div style="margin-bottom: 40px;">
    <h1 style="font-size: 28px; font-weight: 800; margin: 0; letter-spacing: -0.6px; ">Identity Verification</h1>
    <p style="font-size: 15px; color: #3b82f6; margin-top: 10px; text-transform: uppercase; letter-spacing: 2px; font-weight: 500;">
      Patient Consultation System
    </p>
  </div>

  <div style="max-width: 440px; margin: 0 auto; padding: 48px 36px;">
    <p style="font-size: 16px; line-height: 1.7;  margin-bottom: 36px;">
      To ensure the security of your medical records, please verify your digital identity to access your dashboard.
    </p>

    <a href="${verifyUrl}" style="display: inline-block; background: linear-gradient(90deg, #3b82f6, #60a5fa); color: white; padding: 18px 48px; border-radius: 12px; font-weight: 700; text-decoration: none; font-size: 15px; text-transform: uppercase; letter-spacing: 1.6px; box-shadow: 0 8px 32px rgba(59, 130, 246, 0.45); transition: all 0.3s ease;">
      Verify Account
    </a>

    <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #1e40af33; font-size: 13px; color: #94a3b8;">
      This secure link will expire in <strong style="">24 hours</strong>.
    </div>
  </div>
</div>`;
