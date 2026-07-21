import React, { createContext, useContext, useState } from "react";
import type { PacienteContextValue } from "@/types/types";

const PacienteContext = createContext<PacienteContextValue | undefined>(undefined);

export const PacienteProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {

    const [pacienteId, setPacienteId] = useState<string>();

    return (
        <PacienteContext.Provider
            value={{
                pacienteId,
                setPacienteId,
            }}
        >
            {children}
        </PacienteContext.Provider>
    );
};

export const usePaciente = () => {
    const context = useContext(PacienteContext);

    if (!context) {
        throw new Error("usePaciente debe usarse dentro de PacienteProvider");
    }

    return context;
};