import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { patientService } from "@/src/services/patientService";

export default function PatientRegistration() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    address: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      patientService.savePatient(formData);
      
      toast.success("Patient registered successfully", {
        description: `${formData.name} has been added to the district database.`,
      });
      
      setLoading(false);
      setOpen(false);
      setFormData({ name: "", age: "", gender: "", address: "", phone: "" });
      
      // Trigger a custom event to notify other components that a patient was added
      window.dispatchEvent(new CustomEvent("patient-added"));
    } catch (error) {
      toast.error("Failed to register patient");
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="bg-[#141414] hover:bg-[#141414]/90 text-white font-mono text-[10px] uppercase tracking-widest h-9 rounded-sm px-4" />
        }
      >
        <UserPlus className="w-3.5 h-3.5 mr-2" />
        Register Patient
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-[#141414]/10 rounded-sm">
        <DialogHeader>
          <DialogTitle className="font-serif italic text-xl">New Patient Registration</DialogTitle>
          <DialogDescription className="font-mono text-[10px] uppercase tracking-wider">
            Enter patient details to create a new health record.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right font-mono text-[10px] uppercase opacity-60">
              Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="col-span-3 rounded-sm border-[#141414]/10 bg-[#141414]/5 focus:ring-[#141414]"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="age" className="text-right font-mono text-[10px] uppercase opacity-60">
              Age
            </Label>
            <Input
              id="age"
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="col-span-3 rounded-sm border-[#141414]/10 bg-[#141414]/5 focus:ring-[#141414]"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gender" className="text-right font-mono text-[10px] uppercase opacity-60">
              Gender
            </Label>
            <div className="col-span-3">
              <Select 
                value={formData.gender} 
                onValueChange={(value) => setFormData({ ...formData, gender: value })}
                required
              >
                <SelectTrigger className="rounded-sm border-[#141414]/10 bg-[#141414]/5 focus:ring-[#141414]">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className="border-[#141414]/10 rounded-sm">
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right font-mono text-[10px] uppercase opacity-60">
              Phone
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="col-span-3 rounded-sm border-[#141414]/10 bg-[#141414]/5 focus:ring-[#141414]"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="address" className="text-right font-mono text-[10px] uppercase opacity-60 pt-2">
              Address
            </Label>
            <textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="col-span-3 min-h-[80px] p-2 rounded-sm border border-[#141414]/10 bg-[#141414]/5 focus:outline-none focus:ring-1 focus:ring-[#141414] text-sm resize-none"
              required
            />
          </div>
          <DialogFooter className="pt-4">
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#141414] hover:bg-[#141414]/90 text-white font-mono text-xs uppercase tracking-widest h-11 rounded-sm"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Patient Record
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
