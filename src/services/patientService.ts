import { DiagnosticResult } from "./gemini";

export interface DiagnosticRecord extends DiagnosticResult {
  id: string;
  timestamp: string;
  symptoms: string;
}

export interface Patient {
  id: string;
  name: string;
  age: string;
  gender: string;
  address: string;
  phone: string;
  registeredAt: string;
  diagnostics?: DiagnosticRecord[];
}

const STORAGE_KEY = "kaduna_health_patients";

export const patientService = {
  getPatients: (): Patient[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  getPatient: (id: string): Patient | undefined => {
    return patientService.getPatients().find(p => p.id === id);
  },

  savePatient: (patient: Omit<Patient, "id" | "registeredAt" | "diagnostics">): Patient => {
    const patients = patientService.getPatients();
    const newPatient: Patient = {
      ...patient,
      id: crypto.randomUUID(),
      registeredAt: new Date().toISOString(),
      diagnostics: [],
    };
    const updatedPatients = [newPatient, ...patients];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPatients));
    return newPatient;
  },

  addDiagnosticRecord: (patientId: string, symptoms: string, result: DiagnosticResult): void => {
    const patients = patientService.getPatients();
    const patientIndex = patients.findIndex(p => p.id === patientId);
    
    if (patientIndex !== -1) {
      const record: DiagnosticRecord = {
        ...result,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        symptoms,
      };
      
      if (!patients[patientIndex].diagnostics) {
        patients[patientIndex].diagnostics = [];
      }
      
      patients[patientIndex].diagnostics!.unshift(record);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
    }
  },

  deletePatient: (id: string): void => {
    const patients = patientService.getPatients();
    const updatedPatients = patients.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPatients));
  },
};
