import React, { useRef, useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../../axios-client";
import { useStateContext } from "../contexts/NavigationContext";

export const Login = () => {
  const { setUser, setToken } = useStateContext();
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const emailRef = useRef();
  const passwordRef = useRef();

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState("");

  const validate = (loginData) => {
    const errors = {};
    if (!loginData.email) {
      errors.email = "Email is required";
    }
    if (!loginData.password) {
      errors.password = "Password is required";
    }
    setFormErrors(errors);
    return errors;
  };

  const handleLoginSuccess = () => {
    // After successful login
    navigate('/dashboard');
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const loginData = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    const validationErrors = validate(loginData);

    if (Object.keys(validationErrors).length === 0) {
      setErrors("");
      axiosClient
        .post("/auth/login", loginData)
        .then(({ data }) => {
          setUser(data.user);
          setToken(data.token);
          handleLoginSuccess();
        })
        .catch((err) => {
          // ensure a safe string is shown to the user (never render raw objects)
          const response = err?.response;
          console.log(response || err);
          let message = "Error logging in";
          if (response) {
            // prioritize common fields, then stringify any objects
            if (typeof response.data === "string") {
              message = response.data;
            } else if (response.data?.message) {
              message = response.data.message;
            } else if (response.data?.error) {
              const errField = response.data.error;
              if (typeof errField === "string") message = errField;
              else if (errField?.message) message = errField.message;
              else {
                try {
                  message = JSON.stringify(errField);
                } catch {
                  message = "Server returned an error";
                }
              }
            } else {
              message = `Server responded with status ${response.status}`;
            }
          } else if (err?.message) {
            message = err.message;
          }
          setAlertMessage(String(message));
          setShowAlert(true);
        });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Card className="w-96 shadow-xl bg-white/95 backdrop-blur-sm">
        <div className="w-full bg-gradient-to-r from-black to-gray-800 h-14 text-white text-[20px] flex justify-center items-center font-bold rounded-t-lg">
          Sign In
        </div>

        <form onSubmit={(e) => handleLogin(e)} className="mt-8">
          <CardBody className="flex flex-col gap-4 px-6">
            {showAlert && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-700">{alertMessage}</p>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <Input
                label="Email"
                name="email"
                size="lg"
                className="!border-2 !border-gray-200 focus:!border-[#25C935]"
                labelProps={{
                  className: "text-gray-700 font-medium",
                }}
                containerProps={{
                  className: "min-w-full",
                }}
                inputRef={emailRef}
              />
              {formErrors.email && (
                <p className="text-red-500 text-xs font-medium pl-1">
                  {formErrors.email}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Input
                type="password"
                label="Password"
                name="password"
                size="lg"
                className="!border-2 !border-gray-200 focus:!border-[#25C935]"
                labelProps={{
                  className: "text-gray-700 font-medium",
                }}
                containerProps={{
                  className: "min-w-full",
                }}
                inputRef={passwordRef}
              />
              {formErrors.password && (
                <p className="text-red-500 text-xs font-medium pl-1">
                  {formErrors.password}
                </p>
              )}
            </div>
          </CardBody>

          <CardFooter className="pt-0 px-6 pb-8">
            <Button
              type="submit"
              className="bg-gradient-to-r from-[#25C935] to-[#1ea32b] w-full py-3 text-base font-semibold shadow-md hover:shadow-lg hover:from-[#1ea32b] hover:to-[#25C935] transition-all duration-300"
            >
              Sign In
            </Button>

            <Typography variant="small" className="mt-6 flex justify-center text-gray-600">
              Don&apos;t have an account?
              <Link
                to="/auth/signup"
                className="ml-1 font-bold text-[#25C935] hover:text-[#1ea32b] transition-colors"
              >
                Sign up
              </Link>
            </Typography>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
