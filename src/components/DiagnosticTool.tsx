import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { analyzeSymptoms, DiagnosticResult } from "@/src/services/gemini";
import { Loader2, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Badge } from "@/components/ui/badge";

export default function DiagnosticTool() {
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);

  const handleAnalyze = async () => {
    if (!symptoms.trim()) return;
    setLoading(true);
    try {
      const res = await analyzeSymptoms(symptoms);
      setResult(res);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "bg-red-500";
      case "medium": return "bg-orange-500";
      case "low": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-[#141414]/10 shadow-none rounded-sm">
        <CardHeader className="border-b border-[#141414]/5 bg-white/50">
          <CardTitle className="font-serif italic text-xl">Diagnostic Assistant</CardTitle>
          <CardDescription className="font-mono text-[10px] uppercase tracking-wider">
            Input patient symptoms for AI-powered assessment
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="symptoms" className="font-mono text-[10px] uppercase tracking-widest opacity-60">
              Recorded Symptoms
            </Label>
            <textarea
              id="symptoms"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g., High fever for 2 days, coughing, rapid breathing, loss of appetite..."
              className="w-full min-h-[120px] p-4 bg-[#141414]/5 border border-[#141414]/10 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#141414] font-sans text-sm resize-none"
            />
          </div>
          <Button 
            onClick={handleAnalyze} 
            disabled={loading || !symptoms.trim()}
            className="w-full bg-[#141414] hover:bg-[#141414]/90 text-white font-mono text-xs uppercase tracking-widest h-12 rounded-sm"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Stethoscope className="w-4 h-4 mr-2" />}
            Run Diagnostic Analysis
          </Button>
        </CardContent>
      </Card>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <Card className="border-[#141414]/10 shadow-none rounded-sm overflow-hidden">
              <div className={cn("h-1.5 w-full", getUrgencyColor(result.urgency))} />
              <CardHeader className="bg-white/50">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="font-serif italic text-2xl mb-1">{result.condition}</CardTitle>
                    <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-tighter">
                      Confidence: {(result.confidence * 100).toFixed(0)}%
                    </Badge>
                  </div>
                  <Badge className={cn("font-mono text-[10px] uppercase tracking-widest", getUrgencyColor(result.urgency))}>
                    {result.urgency} Urgency
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-2">
                <div className="p-4 bg-[#141414]/5 rounded-sm border border-[#141414]/5">
                  <h4 className="font-mono text-[10px] uppercase tracking-widest opacity-60 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3" />
                    Recommended Action
                  </h4>
                  <p className="text-sm leading-relaxed">{result.recommendation}</p>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1 p-3 border border-[#141414]/10 rounded-sm flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-full">
                      <Info className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-[10px] font-mono leading-tight">
                      <span className="block opacity-50 uppercase">Protocol</span>
                      REFER TO DISTRICT CLINIC
                    </div>
                  </div>
                  <div className="flex-1 p-3 border border-[#141414]/10 rounded-sm flex items-center gap-3">
                    <div className="p-2 bg-red-50 rounded-full">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    </div>
                    <div className="text-[10px] font-mono leading-tight">
                      <span className="block opacity-50 uppercase">Alert</span>
                      NOTIFY DISTRICT OFFICIAL
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";
