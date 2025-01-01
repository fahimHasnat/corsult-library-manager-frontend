import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedAvailability, setSelectedAvailability] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1); // Store totalPages here

  const [authors, setAuthors] = useState<string[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [availabilityFilters, setAvailability] = useState<
    { key: string; value: string }[]
  >([]);
  const [categoriesMap, setCategoriesMap] = useState<
    { id: number; name: string }[]
  >([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookToBorrow, setBookToBorrow] = useState<any>(null);
  const [dueDate, setDueDate] = useState<string | null>(null);
  const router = useRouter();
  const fetchBooks = useCallback(
    async (
      query = "",
      author = "",
      category = "",
      availability = "",
      page = 1
    ) => {
      setLoading(true);
      try {
        if (!user) {
          // setError("You must be logged in to view books");
          // setLoading(false);
          router.push("/login");
          return;
        }

        const params = new URLSearchParams();
        if (query) params.append("search", query);
        if (author) params.append("author", author);
        if (category) params.append("category", category);
        if (availability) params.append("availability", availability);
        params.append("page", page.toString());
        params.append("limit", itemsPerPage.toString());

        const res = await fetch(
          `http://localhost:8001/books?${params.toString()}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${user.token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch books");
        }

        const data = await res.json();
        setBooks(data.data);
        setTotalPages(Math.ceil(data.total / itemsPerPage));
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const fetchFilters = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8001/books/filters", {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch filters");
      }

      const jsonRes = await response.json();

      const authorsData = jsonRes.data.authors;
      const categoriesData = jsonRes.data.categories;
      const availabilityFilters = [
        { key: "Available", value: "true" },
        { key: "Not Available", value: "false" },
      ];

      setAuthors(authorsData);
      setCategories(categoriesData);
      setAvailability(availabilityFilters);
      setCategoriesMap(jsonRes.data.categories_map);
    } catch (error: any) {
      setError(error.message);
    }
  }, [user]);

  useEffect(() => {
    fetchBooks(
      searchQuery,
      selectedAuthor,
      selectedCategory,
      selectedAvailability,
      currentPage
    );
    fetchFilters();
  }, [
    currentPage,
    selectedAuthor,
    selectedCategory,
    selectedAvailability,
    fetchBooks,
    fetchFilters,
  ]);

  const handleSearchAndFilter = () => {
    setCurrentPage(1);
    fetchBooks(
      searchQuery,
      selectedAuthor,
      selectedCategory,
      selectedAvailability,
      1
    );
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleBorrowClick = (book: any) => {
    setBookToBorrow(book);
    setIsModalOpen(true);
  };

  const handleBorrowBook = async () => {
    if (!bookToBorrow || !dueDate) {
      alert("Please select a book and date!");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8001/books/borrow`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ book_id: bookToBorrow.id, due_date: dueDate }),
      });

      if (!res.ok) {
        throw new Error("Failed to borrow book");
      }

      setIsModalOpen(false);
      fetchBooks();
    } catch (error) {
      alert("Error borrowing the book");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Search and Filters */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search books..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearchAndFilter();
            }
          }}
          className="w-full sm:w-auto flex-1 border rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={selectedAuthor}
          onChange={(e) => setSelectedAuthor(e.target.value)}
          className="w-full sm:w-auto flex-1 border rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Authors</option>
          {authors.map((author) => (
            <option key={author} value={author}>
              {author}
            </option>
          ))}
        </select>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-auto flex-1 border rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          value={selectedAvailability}
          onChange={(e) => setSelectedAvailability(e.target.value)}
          className="w-full sm:w-auto flex-1 border rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Availability</option>
          {availabilityFilters.map((availability) => (
            <option key={availability.key} value={availability.value}>
              {availability.key}
            </option>
          ))}
        </select>
        <button
          onClick={handleSearchAndFilter}
          className="w-full sm:w-auto bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Search
        </button>
      </div>

      {/* Book List */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse bg-white shadow-lg rounded-lg">
          <thead className="bg-blue-600 text-white text-xs">
            <tr>
              <th className="px-2 py-1 border">Book Name</th>
              <th className="px-2 py-1 border">Author</th>
              <th className="px-2 py-1 border">Category</th>
              <th className="px-2 py-1 border">ISBN</th>
              <th className="px-2 py-1 border">Availability</th>
              <th className="px-2 py-1 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id} className="hover:bg-gray-100 text-xs">
                <td className="px-2 py-1 border text-gray-700">{book.title}</td>
                <td className="px-2 py-1 border text-gray-700">
                  {book.author}
                </td>
                <td className="px-2 py-1 border text-gray-700">
                  {book.category}
                </td>
                <td className="px-2 py-1 border text-gray-700">{book.isbn}</td>
                <td className="px-2 py-1 border">
                  {book.availability ? (
                    <span className="text-green-500 font-semibold">
                      Available
                    </span>
                  ) : (
                    <span className="text-red-500 font-semibold">
                      Not Available
                    </span>
                  )}
                </td>
                <td className="px-2 py-1 border flex items-center justify-center space-x-2">
                  {/* Borrow Book button */}
                  <button
                    className={`p-1 rounded-full ${
                      book.availability
                        ? "text-blue-500 hover:bg-blue-100 focus:ring-2 focus:ring-blue-300"
                        : "text-gray-500 cursor-not-allowed"
                    }`}
                    title={
                      book.availability ? "Borrow Bookssss" : "Book Unavailable"
                    }
                    onClick={
                      book.availability
                        ? () => handleBorrowClick(book)
                        : undefined
                    }
                    disabled={!book.availability}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center items-center space-x-2">
        <button
          onClick={handlePreviousPage}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-4 py-2 rounded-lg ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={handleNextPage}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-bold mb-2">Set Due Date</h2>
            <input
              type="date"
              className="border p-2 w-full"
              value={dueDate ?? ""}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleBorrowBook}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
