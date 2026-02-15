// components/ProtectedRoute.js

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function ProtectedRoute({ children, role }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const now = Math.floor(Date.now() / 1000);

      // Check token expiry
      if (payload.exp && payload.exp < now) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      // Check role authorization
      if (role && payload.role !== role) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      setAllowed(true);
    } catch (err) {
      console.error("Token parsing error:", err);
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [router, role]);

  if (!allowed) {
    return (
      <div style={styles.container}>
        <div style={styles.spinner} />
        <p style={styles.text}>Verifying access...</p>
      </div>
    );
  }

  return children;
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    gap: "16px",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #e2e8f0",
    borderTop: "4px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  text: {
    color: "#64748b",
    fontSize: "14px",
    fontFamily: "sans-serif",
  },
};