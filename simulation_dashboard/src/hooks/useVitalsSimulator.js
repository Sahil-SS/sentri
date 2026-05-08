import { useEffect, useRef } from "react";
import { loadCSVData } from "@/lib/dataLoader";
import { sendVitals } from "@/lib/api";
import { useVitals } from "@/context/VitalsContext";

export default function useVitalsSimulator() {
  const {
    selectedPatient,
    setCurrentVitals,
    setAllPatients,
  } = useVitals();

  const datasetRef = useRef([]);
  const indexRef = useRef(0);

  useEffect(() => {
    const init = async () => {
      const data = await loadCSVData();

      datasetRef.current = data;

      const uniquePatients = [
        ...new Set(data.map((row) => row.patient_id)),
      ];

      setAllPatients(uniquePatients);
    };

    init();
  }, []);

  useEffect(() => {
    if (!selectedPatient) return;

    const patientRows = datasetRef.current.filter(
      (row) => row.patient_id === selectedPatient
    );

    indexRef.current = 0;

    const interval = setInterval(async () => {
      if (indexRef.current >= patientRows.length) {
        indexRef.current = 0;
      }

      const row = patientRows[indexRef.current];

      const vitalsPayload = {
        patient_id: row.patient_id,
        timestamp: new Date().toISOString(),
        heart_rate: row.heart_rate,
        spo2: row.spo2,
        temperature: row.temperature,
      };

      setCurrentVitals(vitalsPayload);

      await sendVitals(vitalsPayload);

      indexRef.current++;
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedPatient]);
}