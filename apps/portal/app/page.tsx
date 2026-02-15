import { getHealth } from "../src/lib/api";

export default async function Home() {
  const health = await getHealth();

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>Gridbox Platform Next</h1>
      <p>API health:</p>
      <pre>{JSON.stringify(health, null, 2)}</pre>
    </main>
  );
}


