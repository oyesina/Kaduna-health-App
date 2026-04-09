import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, MapPin, ShieldAlert, Clock, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { generateOutbreakAlerts } from "@/src/services/gemini";
import { cn } from "@/lib/utils";

interface Alert {
  district: string;
  disease: string;
  riskLevel: "low" | "medium" | "high";
  description: string;
  actionRequired: string;
}

export default function AlertDashboard() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      // Mock data representing recent health reports from various districts
      const mockData = `
        - Kaduna South: 15 cases of high fever and vomiting in the last 48 hours.
        - Igabi: 8 cases of rapid breathing and chest indrawing in children under 5.
        - Chikun: 20 cases of watery diarrhea reported in Sabon Tasha.
        - Zaria: Normal health trends, 2 isolated malaria cases.
      `;
      
      try {
        const res = await generateOutbreakAlerts(mockData);
        setAlerts(res);
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high": return "bg-red-500";
      case "medium": return "bg-orange-500";
      case "low": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-[#141414]/10 shadow-none rounded-sm bg-[#141414] text-white">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest opacity-60">Active Alerts</span>
                <div className="text-3xl font-serif italic">{alerts.length}</div>
              </div>
              <ShieldAlert className="w-5 h-5 opacity-40" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#141414]/10 shadow-none rounded-sm bg-white">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start text-[#141414]">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest opacity-60">High Risk Areas</span>
                <div className="text-3xl font-serif italic">
                  {alerts.filter(a => a.riskLevel === "high").length}
                </div>
              </div>
              <AlertTriangle className="w-5 h-5 opacity-40" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#141414]/10 shadow-none rounded-sm bg-white">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start text-[#141414]">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest opacity-60">Last Updated</span>
                <div className="text-sm font-mono uppercase tracking-tighter mt-2">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
              <Clock className="w-5 h-5 opacity-40" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-[#141414]/10 shadow-none rounded-sm">
        <CardHeader className="border-b border-[#141414]/5 bg-white/50">
          <CardTitle className="font-serif italic text-xl">Real-time Outbreak Monitor</CardTitle>
          <CardDescription className="font-mono text-[10px] uppercase tracking-wider">
            AI-detected anomalies and potential disease outbreaks across Kaduna State
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            <div className="divide-y divide-[#141414]/5">
              {loading ? (
                <div className="p-12 text-center space-y-4">
                  <div className="w-8 h-8 border-2 border-[#141414] border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="font-mono text-[10px] uppercase tracking-widest opacity-40">Analyzing district data...</p>
                </div>
              ) : alerts.map((alert, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 hover:bg-[#141414]/5 transition-colors group cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-2 h-2 rounded-full", getRiskColor(alert.riskLevel))} />
                      <h3 className="font-serif italic text-lg">{alert.disease}</h3>
                    </div>
                    <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-tighter">
                      {alert.riskLevel} Risk
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest opacity-40">
                        <MapPin className="w-3 h-3" />
                        {alert.district} District
                      </div>
                      <p className="text-sm leading-relaxed opacity-80">{alert.description}</p>
                    </div>
                    
                    <div className="p-4 bg-white border border-[#141414]/10 rounded-sm space-y-2">
                      <div className="text-[10px] font-mono uppercase tracking-widest opacity-40 flex justify-between">
                        Action Required
                        <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                      <p className="text-xs font-medium">{alert.actionRequired}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
