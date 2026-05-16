import TeamCard from "./TeamCard";

const TEAM = [
  {
    index: "01",
    name: "SAHIL SINHA",
    role: "ML ENGINEERING",
    specialty:
      "End-to-end model training · Node.js backend · XGBoost pipeline architecture · FastAPI inference backend· Full orchestration of the ML prediction workflow",
    image: "/team/member1.jpeg",
  },

  {
    index: "02",
    name: "SNEHA KUMARI",
    role: "FULL STACK",
    specialty:
      "Frontend Architecture · Simulation dashboard frontend · Operational UX design · Component architecture",
    image: "/team/member2.jpeg",
  },

  {
    index: "03",
    name: "ATHARV VERMA",
    role: "BACKEND SYSTEMS",
    specialty:
      "Node.js backend · System Integration · MongoDB architecture · REST API development · Simulation dashboard integration · Deployment · Documentation ",
    image: "/team/member3.jpeg",
  },

  {
    index: "04",
    name: "TANAY GUJARATHI",
    role: "UI DESIGN AND FRONTEND ARCHITECTURE",
    specialty:
      "End-to-end frontend development · Clinical UI/UX design · Main monitoring interface · Domain Research for Medical Credibility",
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