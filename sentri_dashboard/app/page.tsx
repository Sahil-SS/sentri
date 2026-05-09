import { useState } from 'react';
import { Topbar } from './components/Topbar';
import { PatientRail } from './components/PatientRail';
import { StatusBand } from './components/StatusBand';
import { ThreatArc } from './components/ThreatArc';
import { InferencePanel } from './components/InferencePanel';
import { VitalStream } from './components/VitalStream';
import { TemporalTable } from './components/TemporalTable';
import { HistoryBrief } from './components/HistoryBrief';
import { TimelineAnchor } from './components/TimelineAnchor';
import { ShortcutBar } from './components/ShortcutBar';
import { ImmersiveGraphs } from './components/ImmersiveGraphs';

// Mock patient data
const mockPatients = [
  {
    id: 'P-001',
    name: 'KUMAR, RAJESH M',
    sex: 'M',
    age: 67,
    bed: '12',
    admissionDate: '07MAY26 14:33',
    riskScore: 78,
    trends: { hr: 'up' as const, temp: 'up' as const, spo2: 'down' as const }
  },
  {
    id: 'P-002',
    name: 'MEHTA, SUNITA F',
    sex: 'F',
    age: 54,
    bed: '08',
    admissionDate: '06MAY26 09:12',
    riskScore: 45,
    trends: { hr: 'up' as const, temp: 'stable' as const, spo2: 'stable' as const }
  },
  {
    id: 'P-003',
    name: 'PILLAI, ARJUN M',
    sex: 'M',
    age: 41,
    bed: '15',
    admissionDate: '05MAY26 18:45',
    riskScore: 22,
    trends: { hr: 'stable' as const, temp: 'stable' as const, spo2: 'stable' as const }
  },
  {
    id: 'P-004',
    name: 'NAIR, VIDYA F',
    sex: 'F',
    age: 58,
    bed: '03',
    admissionDate: '08MAY26 06:22',
    riskScore: 18,
    trends: { hr: 'stable' as const, temp: 'stable' as const, spo2: 'stable' as const }
  },
  {
    id: 'P-005',
    name: 'SHARMA, PRIYA F',
    sex: 'F',
    age: 72,
    bed: '11',
    admissionDate: '07MAY26 22:15',
    riskScore: 61,
    trends: { hr: 'up' as const, temp: 'up' as const, spo2: 'down' as const }
  },
  {
    id: 'P-006',
    name: 'REDDY, KIRAN M',
    sex: 'M',
    age: 45,
    bed: '19',
    admissionDate: '06MAY26 11:30',
    riskScore: 14,
    trends: { hr: 'stable' as const, temp: 'stable' as const, spo2: 'stable' as const }
  },
  {
    id: 'P-007',
    name: 'BOSE, TARUN M',
    sex: 'M',
    age: 66,
    bed: '07',
    admissionDate: '08MAY26 02:45',
    riskScore: 39,
    trends: { hr: 'up' as const, temp: 'up' as const, spo2: 'stable' as const }
  },
  {
    id: 'P-008',
    name: 'IYER, MEERA F',
    sex: 'F',
    age: 52,
    bed: '14',
    admissionDate: '05MAY26 15:20',
    riskScore: 11,
    trends: { hr: 'stable' as const, temp: 'stable' as const, spo2: 'stable' as const }
  }
];

// Generate vital stream data
const generateVitalData = (baseline: number, trend: 'up' | 'down' | 'stable', points: number = 20) => {
  const data = [];
  let value = baseline;
  const now = new Date();

  for (let i = 0; i < points; i++) {
    const time = new Date(now.getTime() - (points - i) * 18 * 60 * 1000);
    const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

    // Add variation based on trend
    if (trend === 'up') {
      value += Math.random() * 2 + 0.5;
    } else if (trend === 'down') {
      value -= Math.random() * 2 + 0.5;
    } else {
      value += (Math.random() - 0.5) * 1.5;
    }

    data.push({ time: timeStr, value: Math.round(value * 10) / 10 });
  }

  return data;
};

const getSeverity = (score: number): 'stable' | 'elevated' | 'critical' => {
  if (score >= 60) return 'critical';
  if (score >= 30) return 'elevated';
  return 'stable';
};

export default function App() {
  const [selectedPatientId, setSelectedPatientId] = useState('P-001');

  const selectedPatient = mockPatients.find((p) => p.id === selectedPatientId)!;
  const severity = getSeverity(selectedPatient.riskScore);

  // Mock vital data for selected patient
  const hrData = generateVitalData(80, selectedPatient.trends.hr, 20);
  const spo2Data = generateVitalData(98, selectedPatient.trends.spo2, 20);
  const tempData = generateVitalData(37.2, selectedPatient.trends.temp, 20);
  const respData = generateVitalData(16, selectedPatient.trends.hr, 20);
  const sbpData = generateVitalData(120, selectedPatient.trends.hr === 'up' ? 'down' : 'stable', 20);

  const currentHR = Math.round(hrData[hrData.length - 1].value);
  const currentSpO2 = Math.round(spo2Data[spo2Data.length - 1].value);
  const currentTemp = tempData[tempData.length - 1].value;
  const currentResp = Math.round(respData[respData.length - 1].value);
  const currentSBP = Math.round(sbpData[sbpData.length - 1].value);

  // Mock inference data
  const inferenceDrivers = [
    { label: 'HR_SLOPE', percentage: 31 },
    { label: 'SPO2_SLOPE', percentage: 22 },
    { label: 'TEMP_ACCEL', percentage: 16 },
    { label: 'DIABETES', percentage: 11 },
    { label: 'RESP_SLOPE', percentage: 8 }
  ];

  // Mock temporal analysis data
  const temporalRows = [
    { param: 'HR', slope: '+4.4/h', accel: 'ACC' as const, deltaBase: '+22BPM', severity: 'critical' as const },
    { param: 'SPO2', slope: '-1.0/h', accel: 'ACC' as const, deltaBase: '-5PCT', severity: 'critical' as const },
    { param: 'TEMP', slope: '+0.28/h', accel: 'STB' as const, deltaBase: '+1.2°C', severity: 'elevated' as const },
    { param: 'RESP', slope: '+1.6/h', accel: 'ACC' as const, deltaBase: '+8RPM', severity: 'elevated' as const },
    { param: 'SBP', slope: '-2.0/h', accel: 'STB' as const, deltaBase: '-12MM', severity: 'stable' as const }
  ];

  // Mock timeline events
  const timelineEvents = [
    { time: '08:00', label: 'ADMITTED', type: 'admission' as const, details: '' },
    { time: '08:42', label: 'ELEV/47', type: 'elevated' as const, details: 'ALERT#1' },
    { time: '10:08', label: 'CRIT/78', type: 'critical' as const, details: 'ALERT#3' }
  ];

  const alertMessage = severity === 'critical'
    ? 'CRITICAL · HR +22 FROM BASELINE · SPO2 DECLINING · TEMP RISING · ALERT AT 10:22:08'
    : severity === 'elevated'
    ? 'ELEVATED · HR RISING / SPO2 DECLINING · PERSISTED 2 CYCLES · 10:17:44'
    : undefined;

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden" style={{ background: 'var(--s00)' }}>
      {/* Topbar */}
      <Topbar />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Patient Rail - 28% */}
        <PatientRail
          patients={mockPatients}
          selectedPatientId={selectedPatientId}
          onPatientSelect={setSelectedPatientId}
        />

        {/* Command Canvas - 72% */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Zone A - Status Band */}
          <StatusBand
            patientId={selectedPatient.id}
            patientName={selectedPatient.name}
            age={selectedPatient.age}
            bed={selectedPatient.bed}
            admissionDate={selectedPatient.admissionDate}
            riskScore={selectedPatient.riskScore}
            severity={severity}
            alertMessage={alertMessage}
          />

          {/* Zone B - Primary Canvas */}
          <div className="flex-1 overflow-auto" style={{ background: 'var(--s00)' }}>
            <div className="p-[var(--sp3)] space-y-[var(--sp3)]">
              {/* Row 1 - Threat Arc + Inference + Vital Streams */}
              <div className="bg-[var(--s01)] border border-[var(--l01)] p-[var(--sp3)]">
                <div className="grid grid-cols-[280px_320px_1fr] gap-[var(--sp3)]">
                  {/* Threat Arc */}
                  <div className="flex flex-col justify-center">
                    <ThreatArc riskScore={selectedPatient.riskScore} severity={severity} />
                  </div>

                  {/* Inference Panel */}
                  <div className="flex flex-col justify-center">
                    <InferencePanel
                      drivers={inferenceDrivers}
                      confidence={87.4}
                      window="6 RDG / 6HR"
                      updated={new Date().toLocaleTimeString('en-US', { hour12: false })}
                    />
                  </div>

                  {/* Vital Streams */}
                  <div className="border-l border-[var(--l00)] pl-[var(--sp3)]">
                    <div
                      className="text-[10px] uppercase tracking-[0.06em] mb-[var(--sp2)]"
                      style={{
                        fontFamily: 'var(--f-cond)',
                        color: 'var(--t00)',
                        borderBottom: '1px solid var(--l00)',
                        paddingBottom: 'var(--sp1)'
                      }}
                    >
                      VITAL STREAM CHARTS
                    </div>

                    <VitalStream
                      label="HR"
                      unit="BPM"
                      currentValue={currentHR}
                      trend={selectedPatient.trends.hr}
                      severity={severity}
                      data={hrData}
                      baseline={80}
                    />

                    <VitalStream
                      label="SPO2"
                      unit="PCT"
                      currentValue={currentSpO2}
                      trend={selectedPatient.trends.spo2}
                      severity={severity}
                      data={spo2Data}
                      baseline={98}
                    />

                    <VitalStream
                      label="TEMP"
                      unit="°C"
                      currentValue={currentTemp}
                      trend={selectedPatient.trends.temp}
                      severity={severity}
                      data={tempData}
                      baseline={37.0}
                    />

                    <VitalStream
                      label="RESP"
                      unit="RPM"
                      currentValue={currentResp}
                      trend={selectedPatient.trends.hr}
                      severity={selectedPatient.trends.hr === 'up' ? 'elevated' : 'stable'}
                      data={respData}
                      baseline={16}
                    />

                    <VitalStream
                      label="SBP"
                      unit="MM"
                      currentValue={currentSBP}
                      trend={selectedPatient.trends.hr === 'up' ? 'down' : 'stable'}
                      severity="stable"
                      data={sbpData}
                      baseline={120}
                    />
                  </div>
                </div>
              </div>

              {/* Row 2 - Temporal Analysis + History Brief */}
              <div className="grid grid-cols-[1fr_1fr] gap-[var(--sp3)]">
                <TemporalTable window="6 RDG  ·  6HR EQUIV" rows={temporalRows} />
                <HistoryBrief
                  age={selectedPatient.age}
                  diabetes={true}
                  bmi={29.1}
                  smoker={false}
                  htn={true}
                  surgery={false}
                  hr0={80}
                  sbp0={120}
                  dbp0={80}
                  source="PDF UPLOAD"
                  processedDate="07MAY26 14:41"
                />
              </div>

              {/* Row 3 - Immersive Graphs */}
              <ImmersiveGraphs
                data={hrData.map((item, i) => ({
                  time: item.time,
                  hr: Math.round(hrData[i].value),
                  spo2: Math.round(spo2Data[i].value),
                  temp: tempData[i].value,
                  resp: Math.round(respData[i].value),
                  sbp: Math.round(sbpData[i].value)
                }))}
                severity={severity}
                patientName={selectedPatient.name}
              />
            </div>
          </div>

          {/* Zone C - Timeline Anchor */}
          <TimelineAnchor events={timelineEvents} />
        </div>
      </div>

      {/* Shortcut Bar */}
      <ShortcutBar />
    </div>
  );
}
