/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import DiagnosticTool from "./components/DiagnosticTool";
import MalnutritionScanner from "./components/MalnutritionScanner";
import AlertDashboard from "./components/AlertDashboard";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "diagnostics":
        return <DiagnosticTool />;
      case "malnutrition":
        return <MalnutritionScanner />;
      case "alerts":
        return <AlertDashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        {renderContent()}
      </Layout>
      <Toaster position="top-right" />
    </>
  );
}

