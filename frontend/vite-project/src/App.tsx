import { useState, useEffect } from "react";
import axios from "axios";
import { Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [url, setUrl] = useState("");
  const [urls, setUrls] = useState<any[]>([]);
  const [selectedUrl, setSelectedUrl] = useState<any>(null);

  const shortenUrl = async () => {
    await axios.post(
      "http://127.0.0.1:8000/api/urls?original_url=" + url
    );
    setUrl("");
    loadUrls();
  };

  const loadUrls = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/urls");
    setUrls(res.data);
  };

  useEffect(() => {
    loadUrls();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  // 📊 MIXED CHART DATA
  const creationMap: any = {};

  urls.forEach((u) => {
    if (creationMap[u.created_date]) {
      creationMap[u.created_date]++;
    } else {
      creationMap[u.created_date] = 1;
    }
  });

  const labels = Object.keys(creationMap);

  const mixedChartData = {
    labels: labels,
    datasets: [
      {
        type: "line" as const,
        label: "URLs Created",
        data: labels.map((date) => creationMap[date]),
        borderColor: "#2ecc71",
        tension: 0.4,
      },
      {
        type: "bar" as const,
        label: "Clicks",
        data: labels.map((date) =>
          selectedUrl?.click_history[date] || 0
        ),
        backgroundColor: "#3498db",
      },
    ],
  };

  return (
    <div style={{ fontFamily: "Arial", background: "#f4f4f4" }}>

      {/* HEADER */}
      <div style={{ background: "#eaeaea", padding: "15px 40px" }}>
        Easy URL Shortener
      </div>

      {/* HERO */}
      <div style={{
        background: "#2f5c8f",
        color: "white",
        padding: "40px",
        textAlign: "center"
      }}>
        <h2>Simplify your URL</h2>

        <input
          type="text"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ padding: "10px", width: "60%" }}
        />

        <button
          onClick={shortenUrl}
          style={{
            padding: "10px",
            marginLeft: "10px",
            background: "#3fa9f5",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          Shorten
        </button>
      </div>

      {/* TABLE */}
      <div style={{ width: "90%", margin: "20px auto", background: "white", padding: "20px" }}>
        <h3>Recent URLs</h3>

        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Original</th>
              <th>Short</th>
              <th>Date</th>
              <th>Clicks</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {urls.map((item, i) => (
              <tr key={i}>
                <td>{item.original_url}</td>

                <td>
                  <a href={item.short_url} target="_blank">
                    {item.short_url}
                  </a>
                </td>

                <td>{item.created_date}</td>
                <td>{item.clicks}</td>

                <td>

                  {/* GREEN COPY BUTTON */}
                  <button
                    onClick={() => copyToClipboard(item.short_url)}
                    style={{
                      background: "#27ae60",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      marginRight: "8px",
                      cursor: "pointer",
                      borderRadius: "4px"
                    }}
                  >
                    Copy
                  </button>

                  {/* BLUE ANALYTICS BUTTON */}
                  <button
                    onClick={() => setSelectedUrl(item)}
                    style={{
                      background: "#2980b9",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      cursor: "pointer",
                      borderRadius: "4px"
                    }}
                  >
                    Analytics
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📊 MIXED CHART SECTION */}
      <div style={{ width: "90%", margin: "20px auto", background: "white", padding: "20px" }}>
        <h3>Statistics</h3>

        <Chart type="bar" data={mixedChartData} />
      </div>

    </div>
  );
}

export default App;