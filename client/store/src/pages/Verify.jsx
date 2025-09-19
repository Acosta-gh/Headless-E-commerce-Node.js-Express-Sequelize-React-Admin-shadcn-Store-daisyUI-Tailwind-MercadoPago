import React from "react";
import { useSearchParams } from "react-router-dom";
import useVerifyAccount from "@/hooks/useVerifyAccount";

export default function VerifyAccount() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { status, message } = useVerifyAccount(token);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card max-w-md w-full bg-base-100 shadow-lg p-6 text-center">
        <h1 className="text-xl font-bold mb-4">Confirmación de cuenta</h1>
        <p className={`mb-2 ${status === "success" ? "text-green-600" : "text-red-600"}`}>
          Cuenta {status === "success" ? "verificada con éxito" : "no pudo ser verificada"}.
        </p>
        {status === "checking" && <span className="loading loading-spinner loading-md"></span>}
      </div>
    </div>
  );
}
