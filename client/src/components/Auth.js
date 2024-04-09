import React, { useState } from "react";
import { useCookies } from "react-cookie";
import logo from "../Logo.png";

const Auth = () => {
  const [, setCookie] = useCookies(null);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);

  //viewLogin is defined to toggle between login and signup views.
  // It sets error to null and updates the isLogin state.
  const viewLogin = (status) => {
    setError(null);
    setIsLogin(status);
  };

  //function handleSubmit is defined to handle form submissions.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username === null || username.trim().length === 0) {
      return setError("Username is required");
    } else if (password === null || password.trim().length === 0) {
      return setError("Password is required");
    } else if (
      !isLogin &&
      (confirmPassword === null || confirmPassword.trim().length === 0)
    ) {
      return setError("Confirm password");
    } else if (!isLogin && password !== confirmPassword) {
      return setError("Invalid password confirmation");
    } else {
      setError(null);
      const endpoint = isLogin ? "login" : "signup";

      // It sends a POST request to the backend API with username and password in the body.
      // The URL is constructed using REACT_APP_API_BASE_URL environment variable.
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}auth/${endpoint}`,
          {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ username, password }),
          }
        );

        // It parses the JSON response from the server.
        // If the response status is 200, it sets cookies with user information and authentication token.
        // If there's an error, it sets the error message.
        const res = await response.json();
        if (response.status === 200) {
          setCookie("Username", res.username);
          setCookie("UserId", res.id);
          setCookie("AuthToken", res.token);
        } else setError(res.message);
      } catch (error) {
        setError("Something went wrong");
      }
    }
  };
  return (
    <div className="auth-container">
      <div className="auth-container-box">
        <img className="TaskZilla_logo" src={logo} alt="TaskZilla Logo" />
        <form method="POST">
          {error && (
            <div
              style={{
                backgroundColor: "rgba(255,0, 0,0.2)",
                paddingInline: 20,
                paddingBlock: 5,
                borderRadius: 5,
              }}
            >
              {error}
            </div>
          )}
          <input
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}
          <input type="submit" className="create" onClick={handleSubmit} />
        </form>

        <div className="auth-options">
          <button
            onClick={() => viewLogin(false)}
            style={{
              backgroundColor: !isLogin ? "#53724A" : "#CFD8BF",
            }}
          >
            Sign Up
          </button>
          <button
            onClick={() => viewLogin(true)}
            style={{
              backgroundColor: isLogin ? "#53724A" : "#CFD8BF",
            }}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
