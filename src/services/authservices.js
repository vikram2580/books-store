import { a } from "aws-amplify";

// Signup Function
export const signUp = async (email, password) => {
  try {
    const { user } = await Auth.signUp({
      username: email,
      password,
      attributes: { email },
    });
    console.log("Signup successful:", user);
    alert("Check your email for verification!");
  } catch (error) {
    console.error("Signup error:", error.message);
  }
};

// Confirm Signup Function
export const confirmSignUp = async (email, code) => {
  try {
    await Auth.confirmSignUp(email, code);
    alert("Email verified! You can now log in.");
  } catch (error) {
    console.error("Confirmation error:", error.message);
  }
};

// Login Function
export const signIn = async (email, password) => {
  try {
    const user = await Auth.signIn(email, password);
    console.log("Login successful:", user);
    return user.signInUserSession.idToken.jwtToken;
  } catch (error) {
    console.error("Login error:", error.message);
  }
};

// Logout Function
export const signOut = async () => {
  try {
    await Auth.signOut();
    alert("Logged out!");
  } catch (error) {
    console.error("Logout error:", error.message);
  }
};
