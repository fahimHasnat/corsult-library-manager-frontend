"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8001/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Something went wrong");
      }

      const data = await res.json();

      login(data.data);

      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg border border-gray-300"
      >
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
          Sign Up
        </h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-800">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-800">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-800">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full p-3 bg-black text-white rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
