import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [state, setState] = useState("Login");
  const { setShowLogin, backendUrl, setToken, setUser } =
    useContext(AppContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState(""); // New state for the new password
  const [isForgotPassword, setIsForgotPassword] = useState(false); // To track if forgot password flow is started
  const [isOtpSent, setIsOtpSent] = useState(false); // To track if OTP is sent
  const [otpTimer, setOtpTimer] = useState(60); // Timer for OTP resend

  // Handle login and registration form submission
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (state === "Login") {
        const { data } = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });
        if (data.success) {
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem("token", data.token);
          setShowLogin(false);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });
        if (data.success) {
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem("token", data.token);
          setShowLogin(false);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Handle forgot password (send OTP)
  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter a valid email.");
      return;
    }

    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/forgot-password",
        { email }
      );
      if (data.success) {
        toast.success("OTP sent to your email");
        setIsOtpSent(true); // Show OTP input after OTP is sent
        startOtpTimer(); // Start the OTP timer
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Start OTP timer countdown
  const startOtpTimer = () => {
    const timer = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle OTP and new password submission
  const handleOtpSubmit = async () => {
    if (otp.length !== 6) {
      toast.error("OTP must be 6 characters long.");
      return;
    }

    if (!newPassword) {
      toast.error("Please enter a new password.");
      return;
    }

    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/reset-password",
        {
          email,
          otp,
          newPassword,
        }
      );

      if (data.success) {
        toast.success("Password reset successful!");
        setIsForgotPassword(false); // Reset the forgot password state to show login form again
        setShowLogin(false); // Close login modal after success
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Function to handle the backspace key event
  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    const otpCopy = otp.split("");
    otpCopy[index] = value;
    setOtp(otpCopy.join(""));

    // Auto focus on the next input automatically
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }

    // Auto focus on the previous input when backspace is pressed
    if (value === "" && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0.2, y: 50 }}
      transition={{ duration: 0.3 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center"
    >
      {/* Render login form if not in forgot password state */}
      {!isForgotPassword ? (
        <form
          onSubmit={onSubmitHandler}
          className="relative bg-white p-10 rounded-xl text-slate-500"
        >
          <h1 className="text-center text-2xl text-neutral-700 font-medium">
            {state === "Login" ? "Login" : "Create Account"}
          </h1>
          <p className="text-sm">Welcome back! Please sign in to continue..</p>

          {/* Login/Signup form */}
          {state !== "Login" && (
            <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-5">
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="outline-none"
                type="text"
                placeholder="Full Name"
                required
              />
            </div>
          )}
          <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="outline-none"
              type="email"
              placeholder="Email id"
              required
              aria-label="Email ID"
            />
          </div>
          <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="outline-none"
              type="password"
              placeholder="Password"
              required
            />
          </div>

          <button className="bg-blue-600 w-full text-white py-2 rounded-full mt-5">
            {state === "Login" ? "Login" : "Create Account"}
          </button>

          {/* Forgot password link */}
          {state === "Login" && (
            <p
              className="mt-5 text-center text-sm text-blue-600 cursor-pointer"
              onClick={() => setIsForgotPassword(true)}
            >
              Forgot password?
            </p>
          )}

          {/* Toggle between Login/Signup */}
          {state === "Login" ? (
            <p className="mt-5 text-center">
              Don't have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => setState("Sign Up")}
              >
                Sign up
              </span>
            </p>
          ) : (
            <p className="mt-5 text-center">
              Already have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => setState("Login")}
              >
                Login
              </span>
            </p>
          )}

          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
            className="absolute top-5 right-5 cursor-pointer"
          />
        </form>
      ) : (
        // Render OTP and new password form if in forgot password state
        <form className="relative bg-white p-10 rounded-xl text-slate-500">
          <h1 className="text-center text-2xl text-neutral-700 font-medium">
            Reset Your Password
          </h1>

          {/* Enter Email Form */}
          {!isOtpSent && (
            <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="outline-none"
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>
          )}

          {/* Button to send OTP */}
          {!isOtpSent && (
            <button
              type="button"
              onClick={handleForgotPassword}
              className="bg-blue-600 w-full text-white py-2 rounded-full mt-4"
            >
              Send OTP
            </button>
          )}

          {/* OTP input form */}
          {isOtpSent && (
            <>
              <div className="flex gap-2 justify-center mt-5">
                {[...Array(6)].map((_, index) => (
                  <input
                    key={index}
                    maxLength={1}
                    type="text"
                    value={otp[index] || ""}
                    onChange={(e) => handleOtpChange(e, index)}
                    className="w-12 h-12 text-center text-xl border border-gray-300 rounded"
                    id={`otp-${index}`}
                  />
                ))}
              </div>

              {/* New password input */}
              <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
                <input
                  onChange={(e) => setNewPassword(e.target.value)}
                  value={newPassword}
                  className="outline-none"
                  type="password"
                  placeholder="Enter your new password"
                  required
                />
              </div>

              <button
                type="button"
                onClick={handleOtpSubmit}
                className="bg-blue-600 w-full text-white py-2 rounded-full mt-4"
              >
                Submit OTP and Reset Password
              </button>

              {/* OTP Timer */}
              <p className="mt-3 text-center text-sm">
                {otpTimer > 0
                  ? `Resend OTP in ${otpTimer}s`
                  : "OTP expired, click to resend"}
              </p>
              {otpTimer === 0 && (
                <div className="text-blue-600 text-center mt-2 flex justify-center items-center">
                  <button type="button" onClick={handleForgotPassword}>
                    Resend OTP
                  </button>
                </div>
              )}
            </>
          )}

          <img
            onClick={() => setIsForgotPassword(false)}
            src={assets.cross_icon}
            alt=""
            className="absolute top-5 right-5 cursor-pointer"
          />
        </form>
      )}
    </motion.div>
  );
};

export default Login;
