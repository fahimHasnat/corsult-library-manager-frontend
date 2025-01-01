import React, { useEffect, useState, useCallback } from "react";
import Modal from "./Modal";
import { useAuth } from "../../../context/AuthContext";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedAvailability, setSelectedAvailability] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState({
    id: Number,
    title: "",
    author: "",
    isbn: "",
    category: "",
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [newBook, setNewBook] = useState({
    name: "",
    author: "",
    isbn: "",
    category: "",
  });

  const [authors, setAuthors] = useState<string[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [availabilityFilters, setAvailability] = useState<
    { key: string; value: string }[]
  >([]);
  const [categoriesMap, setCategoriesMap] = useState<Record<string, number>>(
    {}
  );
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [bookHistory, setBookHistory] = useState([]);

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
          setError("You must be logged in to view books");
          setLoading(false);
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

  const handleCreateBook = async () => {
    console.log("Creating book with data:", newBook);
    try {
      if (!(newBook.category in categoriesMap)) {
        throw new Error(
          `Category "${newBook.category}" not found in categoriesMap`
        );
      }
      const response = await fetch("http://localhost:8001/books", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newBook.name,
          author: newBook.author,
          isbn: newBook.isbn,
          category: categoriesMap[newBook.category],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create the book");
      }

      const result = await response.json();
      console.log("Book created successfully:", result);

      fetchBooks();

      setIsModalOpen(false);

      setNewBook({
        name: "",
        author: "",
        isbn: "",
        category: "",
      });
    } catch (error) {
      console.error("Error creating the book:", error);
      alert("An error occurred while creating the book. Please try again.");
    }
  };

  const handleEditBook = (book: any) => {
    setBookToEdit(book);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    console.log("handleEditSubmit", bookToEdit);

    const res = await fetch(`http://localhost:8001/books/${bookToEdit.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: bookToEdit.title,
        author: bookToEdit.author,
        isbn: bookToEdit.isbn,
        category: categoriesMap[bookToEdit.category],
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to edit book");
    }

    setIsEditModalOpen(false);
  };

  const handleDeleteBook = async (id: number) => {
    console.log("Deleting book", id);

    try {
      const response = await fetch(`http://localhost:8001/books/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete the book");
      }

      console.log("Book deleted successfully:", id);

      fetchBooks();
    } catch (error) {
      console.error("Error deleting the book:", error);
      alert("An error occurred while deleting the book. Please try again.");
    }
  };

  const handleHistory = async (book: any) => {
    const response = await fetch(
      `http://localhost:8001/books/borrowing-records/${book.id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to edit book");
    }
    const res = await response.json();

    setBookHistory(res.data);
    setHistoryModalOpen(true);
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
                  {/* Action buttons */}
                  <button
                    className="p-1 rounded-full text-blue-500 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    title="Edit Book"
                    onClick={() => handleEditBook(book)}
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
                        d="M11 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-5M16 3.51a2.012 2.012 0 012.828 0l1.658 1.66a2.012 2.012 0 010 2.828l-6.732 6.732a2.012 2.012 0 01-1.414.586H11.5a1 1 0 01-1-1v-2.414c0-.379.152-.74.414-1.001l6.732-6.732z"
                      />
                    </svg>
                  </button>
                  <button
                    className="p-1 rounded-full text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300"
                    title="Delete Book"
                    onClick={() => handleDeleteBook(book.id)}
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-3h4m-4 0a1 1 0 00-1-1h-2a1 1 0 00-1 1h0m6 0a1 1 0 011 1h0m0 0h2a1 1 0 011 1h0m0 0l-.217 3.283m-.354 5.716L13 20m-2-3l1-8m2 8l-1-8"
                      />
                    </svg>
                  </button>
                  <button
                    className="p-1 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    title="View History"
                    onClick={() => handleHistory(book)}
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
                        d="M12 8v4l3 3m1-10a9 9 0 11-6 2.285M12 1v3m9 9h-3M4 12H1m15.364 6.364l-2.121-2.121M6.343 6.343L4.222 4.222"
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

      {/* Create Book Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Create Book
        </button>
      </div>

      {/* Modal for Create Book */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Create New Book
            </h2>

            <div className="space-y-4">
              {/* Book Name */}
              <div>
                <label
                  htmlFor="book-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Book Name
                </label>
                <input
                  id="book-name"
                  type="text"
                  className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                  placeholder="Enter book name"
                  value={newBook.name}
                  onChange={(e) =>
                    setNewBook((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>

              {/* Author */}
              <div>
                <label
                  htmlFor="author"
                  className="block text-sm font-medium text-gray-700"
                >
                  Author
                </label>
                <input
                  id="author"
                  type="text"
                  className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                  placeholder="Enter author name"
                  value={newBook.author}
                  onChange={(e) =>
                    setNewBook((prev) => ({ ...prev, author: e.target.value }))
                  }
                />
              </div>

              {/* ISBN */}
              <div>
                <label
                  htmlFor="isbn"
                  className="block text-sm font-medium text-gray-700"
                >
                  ISBN
                </label>
                <input
                  id="isbn"
                  type="text"
                  className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                  placeholder="Enter ISBN number"
                  value={newBook.isbn}
                  onChange={(e) =>
                    setNewBook((prev) => ({ ...prev, isbn: e.target.value }))
                  }
                />
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                <select
                  id="category"
                  className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                  value={newBook.category}
                  onChange={(e) =>
                    setNewBook((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBook}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Create Book
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* History Modal */}
      {historyModalOpen && (
        <Modal
          onClose={() => setHistoryModalOpen(false)}
          size="max-w-4xl w-full h-auto"
        >
          <div className="space-y-4 text-gray-800 max-w-4xl w-full mx-auto p-6 bg-white rounded-lg shadow-lg relative">
            {/* Close Button */}
            <button
              onClick={() => setHistoryModalOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl font-bold"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Borrowing History
            </h2>

            {bookHistory.length > 0 ? (
              <div className="overflow-x-auto max-h-[400px]">
                <table className="min-w-full table-auto border-collapse border border-gray-300">
                  <thead className="bg-gray-200 sticky top-0">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2">Name</th>
                      <th className="border border-gray-300 px-4 py-2">
                        Email
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Borrowed Date
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Due Date
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Return Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookHistory.map(
                      (
                        historyItem: {
                          name: string;
                          email: string;
                          borrowed_date: string;
                          due_date: string;
                          return_date: string;
                        },
                        index
                      ) => (
                        <tr key={index} className="hover:bg-gray-100">
                          <td className="border border-gray-300 px-4 py-2">
                            {historyItem.name}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {historyItem.email}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {historyItem.borrowed_date}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {historyItem.due_date}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {historyItem.return_date || "Not returned yet"}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No history available for this book.</p>
            )}
          </div>
        </Modal>
      )}

      {isEditModalOpen && bookToEdit && (
        <Modal onClose={() => setIsEditModalOpen(false)}>
          <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-md mx-auto  text-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Edit Book
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="bookTitle"
                  className="block text-sm font-medium text-gray-700"
                >
                  Book Name
                </label>
                <input
                  id="bookTitle"
                  type="text"
                  className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter book name"
                  value={bookToEdit.title}
                  onChange={(e) =>
                    setBookToEdit((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="author"
                  className="block text-sm font-medium text-gray-700"
                >
                  Author
                </label>
                <input
                  id="author"
                  type="text"
                  className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter author name"
                  value={bookToEdit.author}
                  onChange={(e) =>
                    setBookToEdit((prev) => ({
                      ...prev,
                      author: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="isbn"
                  className="block text-sm font-medium text-gray-700"
                >
                  ISBN Number
                </label>
                <input
                  id="isbn"
                  type="text"
                  className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter ISBN number"
                  value={bookToEdit.isbn}
                  onChange={(e) =>
                    setBookToEdit((prev) => ({ ...prev, isbn: e.target.value }))
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                <select
                  id="category"
                  className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={bookToEdit.category}
                  onChange={(e) =>
                    setBookToEdit((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-6 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition focus:outline-none"
              >
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboard;
