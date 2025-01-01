import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";

const AccountSection: React.FC = () => {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone_number: "",
    role: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserInfo = async () => {
    try {
      if (!user) {
        setError("You must be logged in to view records.");
        setLoading(false);
        return;
      }
      const response = await fetch("http://localhost:8001/users/info", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user information.");
      }
      const data = await response.json();
      setUserInfo(data.data);
      setFormData({
        name: data.data.name,
        phone_number: data.data.phone_number,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Handle Submit", formData);

      const response = await fetch("http://localhost:8001/users", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update user information.");
      }

      const updatedData = await response.json();
      setUserInfo((prev) => ({
        ...prev,
        name: updatedData.name,
        phone_number: updatedData.phone_number,
      }));
      fetchUserInfo();
      setStatusMessage("Profile updated successfully.");
      setIsEditing(false);
    } catch (error) {
      setStatusMessage("Error updating profile. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-4">My Account</h1>

      {!isEditing ? (
        // View Mode
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-medium">Name</h2>
            <p className="text-gray-600">{userInfo.name}</p>
          </div>
          <div>
            <h2 className="text-lg font-medium">Phone Number</h2>
            <p className="text-gray-600">{userInfo.phone_number}</p>
          </div>
          <div>
            <h2 className="text-lg font-medium">Email</h2>
            <p className="text-gray-600">{userInfo.email}</p>
          </div>
          <div>
            <h2 className="text-lg font-medium">Role</h2>
            <p className="text-gray-600">{userInfo.role}</p>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        // Edit Mode
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-400 rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Phone Number
            </label>
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-400 rounded"
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  name: userInfo.name,
                  phone_number: userInfo.phone_number,
                });
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {statusMessage && (
        <div className="mt-4 text-sm text-green-600">{statusMessage}</div>
      )}
    </div>
  );
};

export default AccountSection;
