// This is a placeholder for actual authentication logic
let isLoggedIn = false

export function login() {
  isLoggedIn = true
}

export function logout() {
  isLoggedIn = false
}

export function isAuthenticated() {
  return isLoggedIn
}

