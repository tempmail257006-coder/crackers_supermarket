import { auth } from "./firebase-init.js";
import {
    onAuthStateChanged,
    signOut
} from "firebase/auth";

const protectedRoutes = new Set(["/home"]);
const authRoutes = new Set(["/login", "/register"]);

function setNavAuthState(user) {
    const navUserItem = document.getElementById("nav-user-item");
    const navUserLabel = document.getElementById("nav-user-label");
    const navLoginItem = document.getElementById("nav-login-item");
    const navLogoutItem = document.getElementById("nav-logout-item");

    if (!navLoginItem || !navLogoutItem || !navUserItem || !navUserLabel) {
        return;
    }

    if (user) {
        navLoginItem.classList.add("d-none");
        navLogoutItem.classList.remove("d-none");
        navUserItem.classList.remove("d-none");
        navUserLabel.textContent = `Hello, ${user.email}`;
        return;
    }

    navLoginItem.classList.remove("d-none");
    navLogoutItem.classList.add("d-none");
    navUserItem.classList.add("d-none");
    navUserLabel.textContent = "";
}

async function handleLogout(event) {
    event.preventDefault();

    try {
        await signOut(auth);
    } finally {
        window.location.href = "/login";
    }
}

const logoutLink = document.getElementById("logout-link");
if (logoutLink) {
    logoutLink.addEventListener("click", handleLogout);
}

onAuthStateChanged(auth, (user) => {
    const currentPath = window.location.pathname;
    setNavAuthState(user);

    if (!user && protectedRoutes.has(currentPath)) {
        window.location.href = "/login";
        return;
    }

    if (user && authRoutes.has(currentPath)) {
        window.location.href = "/home";
    }
});
