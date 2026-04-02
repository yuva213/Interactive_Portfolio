"use client"
import React, { useEffect, useState } from "react";

export default function DebugPage() {
  const [envs, setEnvs] = useState<any>({});

  useEffect(() => {
    // Only showing public variables and presence of server variables
    setEnvs({
      NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || "Using Default (Nikhil's Server)",
      HAS_RESEND_KEY: "Check Browser Console for API Test",
    });
  }, []);

  const testApi = async () => {
     const res = await fetch("/api/send", { 
        method: "POST", 
        body: JSON.stringify({ email: "test@test.com", fullName: "Test", message: "Short" }) 
     });
     const data = await res.json();
     console.log("API TEST RESULT:", data);
     alert("Check console for API details!");
  }

  return (
    <div className="p-20 text-white">
      <h1 className="text-2xl font-bold mb-4">Production Environment Debug</h1>
      <pre className="bg-zinc-900 p-4 rounded mb-4">
        {JSON.stringify(envs, null, 2)}
      </pre>
      <button 
        onClick={testApi}
        className="bg-blue-600 px-4 py-2 rounded"
      >
        Test Send API (Check Logs)
      </button>
      <p className="mt-4 text-zinc-400">
        If NEXT_PUBLIC_WS_URL is "Using Default", you forgot to add it to Vercel Settings!
      </p>
    </div>
  );
}
