export default function DataPreview({ data }) {
  if (!data) return null;

  return (
    <table>
      <thead>
        <tr>
          {Object.keys(data[0]).map((col) => (
            <th key={col}>{col}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.slice(0, 10).map((row, i) => (
          <tr key={i}>
            {Object.values(row).map((val, j) => (
              <td key={j}>{val}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}