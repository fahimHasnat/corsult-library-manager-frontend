import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";

interface User {
  id: number;
  name: string;
  email: string;
  borrow_count: number;
  overdue_count: number;
}

const UsersSection: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    console.log("user", user);

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8001/books/user-report", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data.data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse bg-white shadow-md rounded-lg">
          <thead className="bg-blue-700 text-white text-sm">
            <tr>
              <th className="px-3 py-2 border text-left">Name</th>
              <th className="px-3 py-2 border text-left">Email</th>
              <th className="px-3 py-2 border text-center">Borrow Count</th>
              <th className="px-3 py-2 border text-center">Overdue Count</th>
            </tr>
          </thead>
          <tbody>
            {users.map((item) => (
              <tr key={item.id} className="hover:bg-gray-100 text-sm">
                <td className="px-3 py-2 border text-gray-700">{item.name}</td>
                <td className="px-3 py-2 border text-gray-700">{item.email}</td>
                <td className="px-3 py-2 border text-center text-gray-700">
                  {item.borrow_count}
                </td>
                <td className="px-3 py-2 border text-center text-gray-700">
                  {item.overdue_count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersSection;
