import { auth } from "./firebase-init.js";
import {
    GoogleAuthProvider,
    signInWithPopup
} from "firebase/auth";

function showSocialAuthError(message) {
    const errorBox = document.getElementById("social-auth-error");
    if (!errorBox) {
        alert(message);
        return;
    }

    errorBox.textContent = message;
    errorBox.classList.remove("d-none");
}

const googleLoginBtn = document.getElementById("google-login-btn");
if (googleLoginBtn) {
    googleLoginBtn.addEventListener("click", async (event) => {
        event.preventDefault();

        const provider = new GoogleAuthProvider();

        try {
            await signInWithPopup(auth, provider);
            window.location.href = "/home";
        } catch (error) {
            showSocialAuthError("Google sign-in failed. Please try again.");
        }
    });
}
