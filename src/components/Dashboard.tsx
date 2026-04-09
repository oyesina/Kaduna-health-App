import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, Map, HeartPulse } from "lucide-react";
import { motion } from "motion/react";

export default function Dashboard() {
  const stats = [
    { label: "CHVs Active", value: "1,240", icon: Users, trend: "+12% this month" },
    { label: "Assessments Today", value: "458", icon: Activity, trend: "85% AI-assisted" },
    { label: "Districts Covered", value: "23", icon: Map, trend: "100% of Kaduna State" },
    { label: "Lives Impacted", value: "12.5k", icon: HeartPulse, trend: "Estimated" },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="font-serif italic text-3xl tracking-tight">Health Overview</h2>
        <p className="font-mono text-[10px] uppercase tracking-widest opacity-50">
          Real-time health monitoring system for Kaduna State
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-[#141414]/10 shadow-none rounded-sm hover:border-[#141414]/30 transition-colors">
              <CardHeader className="pb-2">
                <stat.icon className="w-4 h-4 opacity-40 mb-2" />
                <CardTitle className="font-mono text-[10px] uppercase tracking-widest opacity-60">
                  {stat.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-serif italic mb-1">{stat.value}</div>
                <div className="text-[10px] font-mono opacity-40 uppercase tracking-tighter">
                  {stat.trend}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-[#141414]/10 shadow-none rounded-sm overflow-hidden">
          <CardHeader className="border-b border-[#141414]/5 bg-white/50">
            <CardTitle className="font-serif italic text-xl">Mission Statement</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-sm leading-relaxed opacity-80">
              In 2026, no child in Kaduna State should die from preventable illnesses like malaria or pneumonia due to slow diagnosis. Our AI-enabled tool empowers Community Health Volunteers with professional-grade diagnostic support and real-time outbreak detection.
            </p>
            <div className="pt-4 border-t border-[#141414]/5 flex gap-4">
              <div className="flex-1 text-center">
                <div className="text-xl font-serif italic">24h</div>
                <div className="text-[8px] font-mono uppercase opacity-40">Target Response</div>
              </div>
              <div className="flex-1 text-center border-l border-[#141414]/5">
                <div className="text-xl font-serif italic">92%</div>
                <div className="text-[8px] font-mono uppercase opacity-40">AI Accuracy</div>
              </div>
              <div className="flex-1 text-center border-l border-[#141414]/5">
                <div className="text-xl font-serif italic">Real-time</div>
                <div className="text-[8px] font-mono uppercase opacity-40">Alert Speed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#141414]/10 shadow-none rounded-sm bg-[#141414] text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
          <CardHeader>
            <CardTitle className="font-serif italic text-xl">Quick Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center shrink-0 text-[10px] font-mono">01</div>
              <div className="text-xs opacity-80">Use the <span className="text-white font-bold italic">Diagnostics</span> tab to input symptoms and get immediate treatment recommendations.</div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center shrink-0 text-[10px] font-mono">02</div>
              <div className="text-xs opacity-80">Use the <span className="text-white font-bold italic">Malnutrition</span> tab to scan children using the camera for visual assessment.</div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center shrink-0 text-[10px] font-mono">03</div>
              <div className="text-xs opacity-80">Monitor the <span className="text-white font-bold italic">Outbreak Alerts</span> for real-time risk assessments in your district.</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
