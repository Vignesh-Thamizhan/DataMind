export default function InsightsPanel({ insights }) {
  if (!insights) return null;

  return (
    <div>
      <h3>Insights</h3>
      <ul>
        {insights.map((i, idx) => (
          <li key={idx}>{i}</li>
        ))}
      </ul>
    </div>
  );
}