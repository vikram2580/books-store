/* eslint-disable no-unused-vars */
import "./App.css";
import Header from "./components/header";
import Hero from "./components/hero";
import BooksList from "./pages/bookList";
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddBook from "./components/addBook";
import { fetchAuthSession } from "aws-amplify/auth";

const App = () => {


  const getUserInfo = async () => {
    try {
      const user = await Amplify.getConfig(); // Get user info
      // console.log('First Name:', firstName);
      console.log("Last Name:", user);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };
  getUserInfo();

  const getIdToken = async () => {
    const session = await fetchAuthSession();
    return session?.tokens.idToken.toString() ?? "";
  };

  const token = getIdToken();
  return (
    <Authenticator
      className="pt-35 pb-25"
      signUpAttributes={["family_name", "given_name"]}
      formFields={{
        signUp: {
          family_name: {
            label: "Family Name",
            placeholder: "Enter your Family Name",
            isRequired: true,
            order: 2,
          },
          given_name: {
            label: "Given Name",
            placeholder: "Enter your Given Name",
            isRequired: true,
            order: 1,
          },
          email: {
            label: "Email",
            placeholder: "Enter your Email",
            isRequired: true,
            order: 3,
          },
          password: {
            label: "Password",
            placeholder: "Enter your Password",
            isRequired: true,
            order: 4,
          },
          confirm_password: {
            label: "Confirm Password",
            placeholder: "Please confirm your Password",
            isRequired: true,
            order: 5,
          },
        },
      }}
    >
      {({ signOut, user }) => (
        // <main className="bg-gradient-to-br from-purple-200 to-indigo-400 pt-10">
        //   <Header signout={signOut} />
        //   <Hero />
        //   <BooksList />
        // </main>
        <Router>
          <Header signout={signOut} />
          <main className="bg-gradient-to-br from-purple-200 to-indigo-400 pt-10">
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Hero token={token} />
                    <BooksList token={token} />
                  </>
                }
              />
              <Route path="/add-book" element={<AddBook />} />
              <Route path="/edit-book/:id" element={<AddBook />} />
            </Routes>
          </main>
        </Router>
      )}
    </Authenticator>
  );
};

export default App;
