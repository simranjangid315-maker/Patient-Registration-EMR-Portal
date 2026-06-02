export function registerUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function loginUser(email, password) {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (!storedUser) return false;

  return storedUser.email === email && storedUser.password === password;
}