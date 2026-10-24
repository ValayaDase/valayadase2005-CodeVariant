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
const REGISTERED_USERS_KEY = "spotwise_registered_users_v1";

let sessionCounter = 1000;
function getNextSessionId(prefix) {
  sessionCounter += 1;
  return `${prefix}_${sessionCounter}`;
}

/**
 * Standard initials generator based on user full name
 * Examples:
 * - "Alex Mercer" => "AM"
 * - "Valaya Dase" => "VD"
 * - "Valay" => "VA"
 * - "John" => "JO"
 * - "Sophia Chen" => "SC"
 */
export function getInitials(name) {
  if (!name || typeof name !== "string") return "SW";
  const clean = name.trim();
  if (!clean) return "SW";
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Derive readable human name from an email username
 * e.g. "valaya.dase@gmail.com" => "Valaya Dase"
 */
export function deriveNameFromEmail(email) {
  if (!email || !email.includes("@")) return "Spotwise Member";
  const username = email.split("@")[0];
  const parts = username.split(/[._-]+/).filter(Boolean);
  if (parts.length === 0) return "Spotwise Member";
  return parts
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

/**
 * Get all registered user accounts from local storage
 */
export function getRegisteredUsers() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn("Error reading registered users:", err);
    return [];
  }
}

/**
 * Save or update a registered user account in local storage
 */
export function saveRegisteredUser(user) {
  if (typeof window === "undefined") return;
  try {
    const existing = getRegisteredUsers();
    const filtered = existing.filter(
      (u) => u.email?.toLowerCase() !== user.email?.toLowerCase()
    );
    filtered.push(user);
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.warn("Error saving registered user:", err);
  }
}

/**
 * Get current session
 */
export function getDemoSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (!session || !session.user) return null;

    // Migrate any past timestamp issue from older code versions
    if (session.expiresAt && session.expiresAt <= 1730086400000) {
      session.expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
      try {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      } catch {}
    }

    // Verify session expiration (30 days)
    if (session.expiresAt && Date.now() > session.expiresAt) {
      clearDemoSession();
      return null;
    }

    // Ensure initials are accurate for the current user's name
    if (session.user.name) {
      session.user.avatarInitials = getInitials(session.user.name);
    }

    return session;
  } catch (err) {
    console.warn("Error reading demo session:", err);
    return null;
  }
}

/**
 * Validate and establish a login session with name or email
 */
export function signInDemo(identifier, password) {
  const clean = (identifier || "").trim();

  if (!clean || !password) {
    return { success: false, error: "Please enter your email or name and password." };
  }

  const cleanLower = clean.toLowerCase();

  // 1. Check demo credentials
  if (
    (cleanLower === DEMO_CREDENTIALS.email.toLowerCase() ||
      cleanLower === DEMO_CREDENTIALS.name.toLowerCase()) &&
    password === DEMO_CREDENTIALS.password
  ) {
    const session = {
      sessionId: getNextSessionId("demo_sess"),
      user: {
        email: DEMO_CREDENTIALS.email,
        name: DEMO_CREDENTIALS.name,
        role: DEMO_CREDENTIALS.role,
        avatarInitials: getInitials(DEMO_CREDENTIALS.name),
      },
      createdAt: Date.now(),
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
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

  // 2. Check registered users in local storage
  const registeredUsers = getRegisteredUsers();
  const matchedUser = registeredUsers.find(
    (u) =>
      u.email?.toLowerCase() === cleanLower ||
      u.name?.toLowerCase() === cleanLower
  );

  if (matchedUser) {
    if (matchedUser.password && matchedUser.password !== password) {
      return { success: false, error: "Incorrect password. Please try again." };
    }

    const session = {
      sessionId: getNextSessionId("user_sess"),
      user: {
        email: matchedUser.email,
        name: matchedUser.name,
        role: matchedUser.role || "Nomad Member",
        avatarInitials: getInitials(matchedUser.name),
      },
      createdAt: Date.now(),
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
      isDemo: false,
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

  // 3. Dynamic sign in: allow user to sign in with their name or email directly
  if (password.length >= 6) {
    const isEmail = clean.includes("@");
    const name = isEmail ? deriveNameFromEmail(clean) : clean;
    const email = isEmail
      ? cleanLower
      : `${cleanLower.replace(/\s+/g, ".")}@spotwise.app`;
    const initials = getInitials(name);

    const userRecord = {
      email,
      name,
      role: "Nomad Member",
      avatarInitials: initials,
      password,
    };
    saveRegisteredUser(userRecord);

    const session = {
      sessionId: getNextSessionId("direct_sess"),
      user: {
        email,
        name,
        role: "Nomad Member",
        avatarInitials: initials,
      },
      createdAt: Date.now(),
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
      isDemo: false,
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
    error: "Invalid credentials. Use demo@spotwise.app and SpotwiseDemo123!, your registered account, or enter your name.",
  };
}

/**
 * Register user in local session and persist registered credentials
 */
export function signUpDemo({ name, email, password, confirmPassword, agreeTerms }) {
  if (!name || name.trim().length < 2) {
    return { success: false, error: "Please enter your full name." };
  }
  const cleanName = name.trim();
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

  const initials = getInitials(cleanName);

  const userRecord = {
    email: cleanEmail,
    name: cleanName,
    role: "Nomad Member",
    avatarInitials: initials,
    password,
  };

  saveRegisteredUser(userRecord);

  const session = {
    sessionId: getNextSessionId("demo_reg"),
    user: {
      email: cleanEmail,
      name: cleanName,
      role: "Nomad Member",
      avatarInitials: initials,
    },
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    isDemo: false,
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
