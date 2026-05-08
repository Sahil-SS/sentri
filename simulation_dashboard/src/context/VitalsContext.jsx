import { createContext, useContext, useState } from "react";

const VitalsContext = createContext();

export const VitalsProvider = ({ children }) => {
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [currentVitals, setCurrentVitals] = useState(null);

  const [allPatients, setAllPatients] = useState([]);

  return (
    <VitalsContext.Provider
      value={{
        selectedPatient,
        setSelectedPatient,
        currentVitals,
        setCurrentVitals,
        allPatients,
        setAllPatients,
      }}
    >
      {children}
    </VitalsContext.Provider>
  );
};

export const useVitals = () => useContext(VitalsContext);