import TeamCard from "./TeamCard";

const TEAM = [
  {
    index: "01",
    name: "TEAM MEMBER",
    role: "ML ENGINEERING",
    specialty:
      "Predictive modeling · XGBoost · SHAP explainability · inference systems",
  },

  {
    index: "02",
    name: "TEAM MEMBER",
    role: "FULL STACK",
    specialty:
      "Next.js · dashboard systems · operational UX · frontend architecture",
  },

  {
    index: "03",
    name: "TEAM MEMBER",
    role: "BACKEND SYSTEMS",
    specialty:
      "FastAPI · orchestration · realtime telemetry · infrastructure",
  },

  {
    index: "04",
    name: "TEAM MEMBER",
    role: "RESEARCH & DATA",
    specialty:
      "Clinical workflows · ICU systems · datasets · operational validation",
  },
];

export default function TeamGrid() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit,minmax(280px,1fr))",
        gap: 22,
      }}
    >
      {TEAM.map((member) => (
        <TeamCard
          key={member.index}
          index={member.index}
          name={member.name}
          role={member.role}
          specialty={member.specialty}
        />
      ))}
    </div>
  );
}