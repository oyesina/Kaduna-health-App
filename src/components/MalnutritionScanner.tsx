import React, { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { detectMalnutrition, MalnutritionResult } from "@/src/services/gemini";
import { Loader2, Camera, RefreshCw, AlertTriangle, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function MalnutritionScanner() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MalnutritionResult | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setIsCameraOpen(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL("image/jpeg");
        setImage(dataUrl);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const base64 = image.split(",")[1];
      const res = await detectMalnutrition(base64);
      setResult(res);
    } catch (error) {
      console.error("Malnutrition detection failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "severe": return "text-red-600 bg-red-50 border-red-200";
      case "moderate": return "text-orange-600 bg-orange-50 border-orange-200";
      case "mild": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "normal": return "text-green-600 bg-green-50 border-green-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-[#141414]/10 shadow-none rounded-sm overflow-hidden">
        <CardHeader className="border-b border-[#141414]/5 bg-white/50">
          <CardTitle className="font-serif italic text-xl">Malnutrition Scanner</CardTitle>
          <CardDescription className="font-mono text-[10px] uppercase tracking-wider">
            Visual AI assessment for early detection of malnutrition
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="aspect-video bg-[#141414] relative flex items-center justify-center overflow-hidden">
            {isCameraOpen ? (
              <>
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute inset-0 border-2 border-white/20 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/40 rounded-full" />
                </div>
                <Button 
                  onClick={captureImage}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-white text-[#141414] hover:bg-white/90 p-0 shadow-2xl"
                >
                  <div className="w-12 h-12 rounded-full border-2 border-[#141414]" />
                </Button>
              </>
            ) : image ? (
              <>
                <img src={image} alt="Captured" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button size="icon" variant="secondary" onClick={() => setImage(null)} className="rounded-full bg-white/80 backdrop-blur-sm">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto">
                  <Camera className="w-8 h-8 text-white/40" />
                </div>
                <Button onClick={startCamera} variant="secondary" className="font-mono text-[10px] uppercase tracking-widest">
                  Open Camera
                </Button>
              </div>
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />
          
          <div className="p-6">
            <Button 
              onClick={handleAnalyze} 
              disabled={loading || !image}
              className="w-full bg-[#141414] hover:bg-[#141414]/90 text-white font-mono text-xs uppercase tracking-widest h-12 rounded-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Camera className="w-4 h-4 mr-2" />}
              Analyze Image
            </Button>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <Card className="border-[#141414]/10 shadow-none rounded-sm">
              <CardHeader className="bg-white/50">
                <div className="flex justify-between items-center">
                  <CardTitle className="font-serif italic text-xl">Assessment Result</CardTitle>
                  <Badge className={cn("font-mono text-[10px] uppercase tracking-widest border", getStatusColor(result.status))}>
                    {result.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h4 className="font-mono text-[10px] uppercase tracking-widest opacity-60">Observed Indicators</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.indicators.map((indicator, i) => (
                      <div key={i} className="px-3 py-1.5 bg-[#141414]/5 border border-[#141414]/10 rounded-sm text-xs flex items-center gap-2">
                        <div className="w-1 h-1 bg-[#141414] rounded-full" />
                        {indicator}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-white border border-[#141414]/10 rounded-sm">
                  <h4 className="font-mono text-[10px] uppercase tracking-widest opacity-60 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3" />
                    Care Recommendation
                  </h4>
                  <p className="text-sm leading-relaxed">{result.recommendation}</p>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-mono opacity-40 uppercase tracking-tighter">
                  <CheckCircle className="w-3 h-3" />
                  AI analysis is a support tool. Always confirm with physical measurements (MUAC).
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
