import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../../context/AuthContext";
import Modal from "../components/Modal";

const ReturnSection: React.FC = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      if (!user) {
        setError("You must be logged in to view records.");
        setLoading(false);
        return;
      }

      const res = await fetch(`http://localhost:8001/books/records`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch records.");
      }

      const data = await res.json();

      const records = data.data.map((record: any) => {
        if (record["return_date"]) {
          record.status = "returned";
        } else if (new Date(record.due_date) < new Date()) {
          record.status = "overdue";
        } else {
          record.status = "pending";
        }
        return record;
      });

      setBooks(records);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const handleReturnBook = async (record: any) => {
    try {
      const res = await fetch(`http://localhost:8001/books/return`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          book_id: record.book_id,
          borrowing_id: record.borrowing_id,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to return the book.");
      }

      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.borrowing_id === record.borrowing_id
            ? {
                ...book,
                status: "returned",
                return_date: new Date().toISOString(),
              }
            : book
        )
      );
      setIsModalOpen(false);
    } catch (error: any) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Borrowing Records</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="overflow-auto border border-gray-300 rounded-lg max-h-96">
        <table className="table-auto border-collapse w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Book</th>
              <th className="border px-4 py-2">Author</th>
              <th className="border px-4 py-2">Borrow Date</th>
              <th className="border px-4 py-2">Due Date</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr
                key={book.borrowing_id}
                className={`border ${
                  book.status === "overdue" ? "bg-red-100" : "bg-white"
                }`}
              >
                <td className="border px-4 py-2">{book.book_name}</td>
                <td className="border px-4 py-2">{book.author_name}</td>
                <td className="border px-4 py-2">{book.borrowed_date}</td>
                <td className="border px-4 py-2">{book.due_date}</td>
                <td
                  className={`border px-4 py-2 font-bold ${
                    book.status === "overdue"
                      ? "text-red-600"
                      : book.status === "returned"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {book.status === "returned"
                    ? `Returned at ${new Date(
                        book.return_date
                      ).toLocaleDateString()}`
                    : book.status}
                </td>
                <td className="border px-4 py-2 text-center align-middle">
                  {(book.status === "pending" || book.status === "overdue") && (
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onClick={() => {
                        setSelectedBook(book);
                        setIsModalOpen(true);
                      }}
                    >
                      Return
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Return Confirmation */}
      {isModalOpen && selectedBook && (
        <Modal onClose={() => setIsModalOpen(false)} size="small">
          <div className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">Return Book</h2>
            <p className="text-sm text-gray-600">
              Are you sure you want to mark{" "}
              <strong>{selectedBook.book_name}</strong> as returned?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleReturnBook(selectedBook);
                  setIsModalOpen(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Confirm Return
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ReturnSection;
