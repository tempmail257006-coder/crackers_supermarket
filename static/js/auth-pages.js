import { auth } from "./firebase-init.js";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "firebase/auth";

function showAuthError(message) {
    const errorBox = document.getElementById("auth-error");
    if (!errorBox) {
        return;
    }

    errorBox.textContent = message;
    errorBox.classList.remove("d-none");
}

function clearAuthError() {
    const errorBox = document.getElementById("auth-error");
    if (!errorBox) {
        return;
    }

    errorBox.textContent = "";
    errorBox.classList.add("d-none");
}

const loginForm = document.getElementById("login-form");
if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        clearAuthError();

        const email = loginForm.elements.email.value.trim();
        const password = loginForm.elements.password.value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = "/home";
        } catch (error) {
            showAuthError("Email or password is incorrect");
        }
    });
}

const registerForm = document.getElementById("register-form");
if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        clearAuthError();

        const email = registerForm.elements.email.value.trim();
        const password = registerForm.elements.password.value;

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            window.location.href = "/home";
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                showAuthError("User already exists. Please sign in");
                return;
            }

            showAuthError("Unable to sign up. Please try again");
        }
    });
}
