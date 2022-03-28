import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

const URL = process.env.REACT_APP_API_URL;

function App() {
  const [message, setMessage] = useState("");

  const fetchData = async () => {
    const res = await axios.get(URL);
    setMessage(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);
  return <h1>{message}</h1>;
}

export default App;
