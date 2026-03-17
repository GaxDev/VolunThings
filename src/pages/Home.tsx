import { useEffect, useState } from "react";
import api from "../api/axios";

export interface User {
  id: number,
  name: string
}

const Home = () => {
  const [data, setData] = useState<User[]>([]);

  useEffect(() => {
    api.get('/api/users')
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container mt-4">
      <div className="card shadow p-4">
        <h1 className="text-primary">Home</h1>
        {data.map((user) => (
          <p key={user.id}>{user.name}</p>
        ))}
      </div>
    </div>
  );
};

export default Home;