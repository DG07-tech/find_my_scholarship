import { jwtDecode } from "jwt-decode";

export const getCookie = (name) => {
  const cookies = document.cookie.split("; ").filter(Boolean);
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split("=");
    if (key === name) return value;
  }
  return null;
};

export const getAuthState = () => {
  const token = getCookie("token");
  const role = getCookie("role");

  if (!token) {
    return { token: null, role: null, user: null };
  }

  try {
    const decoded = jwtDecode(token);
    return {
      token,
      role,
      user: decoded,
    };
  } catch {
    return { token: null, role: null, user: null };
  }
};
