// Save user data and token to localStorage
export const setUser = (data) => {
  localStorage.setItem("user", JSON.stringify(data));
  localStorage.setItem("token", data.token);
};

// Get token for Axios interceptor
export const getToken = () => {
  return localStorage.getItem("token");
};

// Get current logged in user
export const getUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (err) {
    console.error("Error reading user data:", err);
    return null;
  }
};


// Logout
export const logoutUser = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};
