import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: number;
  role: string;
  email: string;
}

const useUserRole = (): string | null => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        setRole(decodedToken.role);
      } catch (error) {
        console.error("Error decoding token:", error);
        setRole(null);
      }
    }
  }, []);

  return role;
};

export default useUserRole;
