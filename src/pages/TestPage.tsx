import { API_ENDPOINTS } from "../config/api";
import axios from "axios";
import { useEffect, useState } from "react";

const TestPage = () => {
  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.TEST, {
          headers: { accept: "*/*" },
        });
        setData(response.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error fetching data");
        }
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>TestPage</h2>
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      <pre>{data ? JSON.stringify(data, null, 2) : "Loading..."}</pre>
    </div>
  );
};

export default TestPage;
