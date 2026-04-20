const AUTH_KEY = "isLoggedIn";

export function isLoggedIn() {
    return localStorage.getItem(AUTH_KEY) === "true";
}

export function setLoggedIn(value) {
    localStorage.setItem(AUTH_KEY, value ? "true" : "false");
}
