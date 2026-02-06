import { PatientList } from "@/features/doctor/patient";

export default function DoctorPatientsPage() {
  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Patients</h1>
        <p className="text-slate-400">
          Manage and view details of all your associated patients.
        </p>
      </div>
      <PatientList />
    </div>
  );
}
