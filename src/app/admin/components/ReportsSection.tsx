import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
interface Borrowing {
  id: number;
  name: string;
  email: string;
  bookName: string;
  borrowDate: string;
  dueDate: string;
  overdue: boolean;
}

const ReportsSection: React.FC = () => {
  const { user } = useAuth();
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveBorrowings = async () => {
    try {
      const res = await fetch("http://localhost:8001/books/borrowing-report", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch active borrowings");
      }

      const data = await res.json();
      console.log(data);

      setBorrowings(data.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveBorrowings();
  }, []);

  if (loading) return <div>Loading active borrowings...</div>;

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Title */}
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">
        Active Borrowings
      </h1>

      {/* Borrowings Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse bg-white shadow-md rounded-lg">
          <thead className="bg-blue-700 text-white text-sm">
            <tr>
              <th className="px-3 py-2 border text-left">Name</th>
              <th className="px-3 py-2 border text-left">Email</th>
              <th className="px-3 py-2 border text-left">Book Name</th>
              <th className="px-3 py-2 border text-left">Borrow Date</th>
              <th className="px-3 py-2 border text-left">Due Date</th>
              <th className="px-3 py-2 border text-center">Overdue</th>
            </tr>
          </thead>
          <tbody>
            {borrowings.map((borrowing) => (
              <tr
                key={borrowing.id}
                className={`hover:bg-gray-100 ${
                  borrowing.overdue ? "bg-red-50" : ""
                }`}
              >
                <td className="px-3 py-2 border text-gray-700 text-sm">
                  {borrowing.name}
                </td>
                <td className="px-3 py-2 border text-gray-700 text-sm">
                  {borrowing.email}
                </td>
                <td className="px-3 py-2 border text-gray-700 text-sm">
                  {borrowing.bookName}
                </td>
                <td className="px-3 py-2 border text-gray-700 text-sm">
                  {new Date(borrowing.borrowDate).toLocaleDateString()}
                </td>
                <td className="px-3 py-2 border text-gray-700 text-sm">
                  {new Date(borrowing.dueDate).toLocaleDateString()}
                </td>
                <td className="px-3 py-2 border text-center text-sm">
                  {borrowing.overdue ? (
                    <span className="text-red-600 font-semibold">Overdue</span>
                  ) : (
                    <span className="text-green-600 font-semibold">
                      Pending
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsSection;
