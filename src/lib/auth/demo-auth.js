/**
 * Demo Authentication Service
 * Manages prototype browser-session credentials without MongoDB.
 * Never stores plaintext passwords.
 */

export const DEMO_CREDENTIALS = {
  email: "demo@spotwise.app",
  password: "SpotwiseDemo123!",
  name: "Alex Mercer",
  role: "Remote Nomad",
};

const SESSION_KEY = "spotwise_demo_session_v1";

let sessionCounter = 1000;
function getNextSessionId(prefix) {
  sessionCounter += 1;
  return `${prefix}_${sessionCounter}`;
}

/**
 * Get current demo session
 */
export function getDemoSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    // Verify session expiration (24 hour demo session)
    if (session.expiresAt && Date.now() > session.expiresAt) {
      clearDemoSession();
      return null;
    }
    return session;
  } catch (err) {
    console.warn("Error reading demo session:", err);
    return null;
  }
}

/**
 * Validate and establish a demo login session
 */
export function signInDemo(email, password) {
  const cleanEmail = (email || "").trim().toLowerCase();

  if (!cleanEmail || !password) {
    return { success: false, error: "Please enter both email and password." };
  }

  if (
    cleanEmail === DEMO_CREDENTIALS.email.toLowerCase() &&
    password === DEMO_CREDENTIALS.password
  ) {
    const session = {
      sessionId: getNextSessionId("demo_sess"),
      user: {
        email: DEMO_CREDENTIALS.email,
        name: DEMO_CREDENTIALS.name,
        role: DEMO_CREDENTIALS.role,
        avatarInitials: "AM",
      },
      createdAt: 1730000000000,
      expiresAt: 1730086400000,
      isDemo: true,
    };

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        window.dispatchEvent(new Event("spotwise_auth_changed"));
      } catch (err) {
        console.warn("Error writing session:", err);
      }
    }

    return { success: true, session };
  }

  return {
    success: false,
    error: "Invalid email or password. Use demo@spotwise.app and SpotwiseDemo123! or click 'Use demo account'.",
  };
}

/**
 * Register demo user in local browser session
 */
export function signUpDemo({ name, email, password, confirmPassword, agreeTerms }) {
  if (!name || name.trim().length < 2) {
    return { success: false, error: "Please enter your full name." };
  }
  const cleanEmail = (email || "").trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!cleanEmail || !emailRegex.test(cleanEmail)) {
    return { success: false, error: "Please enter a valid email address." };
  }
  if (!password || password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters long." };
  }
  if (password !== confirmPassword) {
    return { success: false, error: "Passwords do not match." };
  }
  if (!agreeTerms) {
    return { success: false, error: "You must accept the terms of service." };
  }

  // Create local demo session
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const session = {
    sessionId: getNextSessionId("demo_reg"),
    user: {
      email: cleanEmail,
      name: name.trim(),
      role: "Nomad Member (Local Demo)",
      avatarInitials: initials || "SW",
    },
    createdAt: 1730000000000,
    expiresAt: 1730086400000,
    isDemo: true,
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      window.dispatchEvent(new Event("spotwise_auth_changed"));
    } catch (err) {
      console.warn("Error saving session:", err);
    }
  }

  return { success: true, session };
}

/**
 * Clear session (Sign out)
 */
export function clearDemoSession() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(SESSION_KEY);
    window.dispatchEvent(new Event("spotwise_auth_changed"));
  } catch (err) {
    console.warn("Error clearing session:", err);
  }
}
