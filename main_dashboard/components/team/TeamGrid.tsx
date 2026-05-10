import TeamCard from "./TeamCard";

const TEAM = [
  {
    index: "01",
    name: "SAHIL SINHA",
    role: "ML ENGINEERING",
    specialty:
      "Predictive modeling · XGBoost · SHAP explainability · inference systems",
    image: "/team/member1.jpeg",
  },

  {
    index: "02",
    name: "SNEHA KUMARI",
    role: "FULL STACK",
    specialty:
      "Next.js · dashboard systems · operational UX · frontend architecture",
    image: "/team/member2.jpeg",
  },

  {
    index: "03",
    name: "ATHARV VERMA",
    role: "BACKEND SYSTEMS",
    specialty:
      "FastAPI · orchestration · realtime telemetry · infrastructure",
    image: "/team/member3.jpeg",
  },

  {
    index: "04",
    name: "TANAY GUJARATHI",
    role: "RESEARCH & DATA",
    specialty:
      "Clinical workflows · ICU systems · datasets · operational validation",
    image: "/team/member4.jpeg",
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
          image={member.image}
        />
      ))}
    </div>
  );
}