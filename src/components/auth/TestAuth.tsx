import { useAuth } from "../../context/AuthContext";

import Sidebar from "../../app/layouts/Sidebar";

export default function TestAuth() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Sidebar />
      <h1>Auth Test</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
