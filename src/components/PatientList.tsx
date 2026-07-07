import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { patientService, Patient } from "@/src/services/patientService";
import { User, Phone, MapPin, Calendar, Trash2, Search, History, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

export default function PatientList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedPatientId, setExpandedPatientId] = useState<string | null>(null);

  const loadPatients = () => {
    setPatients(patientService.getPatients());
  };

  useEffect(() => {
    loadPatients();
    
    // Listen for new registrations
    window.addEventListener("patient-added", loadPatients);
    return () => window.removeEventListener("patient-added", loadPatients);
  }, []);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the record for ${name}?`)) {
      patientService.deletePatient(id);
      loadPatients();
      toast.info("Patient record removed");
    }
  };

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-serif italic text-2xl">Patient Records</h2>
          <p className="font-mono text-[10px] uppercase tracking-wider opacity-60">
            Manage and access registered patient information
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
          <Input
            placeholder="Search by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 rounded-sm border-[#141414]/10 bg-white focus:ring-[#141414]"
          />
        </div>
      </div>

      <Card className="border-[#141414]/10 shadow-none rounded-sm overflow-hidden">
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            {filteredPatients.length === 0 ? (
              <div className="p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#141414]/5 flex items-center justify-center mx-auto">
                  <User className="w-6 h-6 opacity-20" />
                </div>
                <p className="font-mono text-[10px] uppercase tracking-widest opacity-40">
                  {searchTerm ? "No patients match your search" : "No patients registered yet"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#141414]/5">
                {filteredPatients.map((patient) => (
                  <div key={patient.id} className="p-6 hover:bg-[#141414]/5 transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#141414] text-white flex items-center justify-center font-serif italic text-xl">
                          {patient.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-serif italic text-xl">{patient.name}</h3>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-tighter">
                              Age: {patient.age}
                            </Badge>
                            <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-tighter">
                              {patient.gender}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(patient.id, patient.name)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="flex items-center gap-3 text-sm opacity-80">
                        <Phone className="w-4 h-4 opacity-40" />
                        {patient.phone}
                      </div>
                      <div className="flex items-center gap-3 text-sm opacity-80">
                        <MapPin className="w-4 h-4 opacity-40" />
                        {patient.address}
                      </div>
                      <div className="flex items-center gap-3 text-sm opacity-80">
                        <Calendar className="w-4 h-4 opacity-40" />
                        Registered: {new Date(patient.registeredAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Diagnostic History Section */}
                    <div className="mt-6 border-t border-[#141414]/5 pt-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedPatientId(expandedPatientId === patient.id ? null : patient.id)}
                        className="font-mono text-[10px] uppercase tracking-widest opacity-60 hover:opacity-100 p-0 h-auto"
                      >
                        <History className="w-3.5 h-3.5 mr-2" />
                        Diagnostic History ({patient.diagnostics?.length || 0})
                        {expandedPatientId === patient.id ? (
                          <ChevronUp className="w-3 h-3 ml-2" />
                        ) : (
                          <ChevronDown className="w-3 h-3 ml-2" />
                        )}
                      </Button>

                      <AnimatePresence>
                        {expandedPatientId === patient.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-3 mt-4">
                              {!patient.diagnostics || patient.diagnostics.length === 0 ? (
                                <p className="text-xs italic opacity-40 py-2">No diagnostic records found for this patient.</p>
                              ) : (
                                patient.diagnostics.map((record) => (
                                  <div key={record.id} className="p-4 bg-[#141414]/5 rounded-sm border border-[#141414]/5 space-y-2">
                                    <div className="flex justify-between items-start">
                                      <div className="font-serif italic text-base">{record.condition}</div>
                                      <Badge 
                                        className={cn(
                                          "font-mono text-[9px] uppercase tracking-tighter",
                                          record.urgency === "high" ? "bg-red-500" : 
                                          record.urgency === "medium" ? "bg-orange-500" : "bg-blue-500"
                                        )}
                                      >
                                        {record.urgency}
                                      </Badge>
                                    </div>
                                    <p className="text-xs opacity-80 line-clamp-2">
                                      <span className="font-mono uppercase text-[9px] opacity-40 block mb-1">Symptoms</span>
                                      {record.symptoms}
                                    </p>
                                    <div className="flex justify-between items-center pt-2 text-[9px] font-mono opacity-40 uppercase">
                                      <div className="flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        Confidence: {(record.confidence * 100).toFixed(0)}%
                                      </div>
                                      <div>{new Date(record.timestamp).toLocaleString()}</div>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
