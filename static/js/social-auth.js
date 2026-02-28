import { auth } from "./firebase-init.js";
import {
    GoogleAuthProvider,
    getRedirectResult,
    signInWithPopup,
    signInWithRedirect
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

function formatGoogleAuthError(error) {
    const code = error?.code || "";

    if (code === "auth/operation-not-allowed") {
        return "Google sign-in is not enabled in Firebase Authentication.";
    }

    if (code === "auth/unauthorized-domain") {
        const host = window.location.hostname;
        return `Unauthorized domain (${host}). Add it in Firebase Authentication > Settings > Authorized domains.`;
    }

    if (code === "auth/popup-blocked") {
        return "Popup was blocked. We will continue with redirect sign-in.";
    }

    if (code === "auth/network-request-failed") {
        return "Network error. Check your internet connection and try again.";
    }

    if (code === "auth/invalid-api-key") {
        return "Invalid Firebase API key in configuration.";
    }

    if (code === "auth/popup-closed-by-user") {
        return "Google sign-in popup was closed before completing sign-in.";
    }

    return "Google sign-in failed. Please try again.";
}

async function handleGoogleAuthResult() {
    try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
            window.location.href = "/home";
        }
    } catch (error) {
        showSocialAuthError(formatGoogleAuthError(error));
    }
}

handleGoogleAuthResult();

const googleLoginBtn = document.getElementById("google-login-btn");
if (googleLoginBtn) {
    googleLoginBtn.addEventListener("click", async (event) => {
        event.preventDefault();

        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });

        try {
            await signInWithPopup(auth, provider);
            window.location.href = "/home";
        } catch (error) {
            if (error?.code === "auth/popup-blocked") {
                showSocialAuthError(formatGoogleAuthError(error));
                await signInWithRedirect(auth, provider);
                return;
            }

            showSocialAuthError(formatGoogleAuthError(error));
        }
    });
}
