"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [formData, setFormData] = useState({
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
      const res = await fetch("http://localhost:8001/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Invalid credentials");
      }

      const data = await res.json();

      const decodedToken = jwtDecode<{ role: string }>(data.data.token);

      login({ token: data.data.token, role: decodedToken.role });

      if (decodedToken.role === "admin") {
        router.push("/admin");
      } else if (decodedToken.role === "user") {
        router.push("/dashboard");
      }
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
          Login
        </h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
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
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
