import { useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import axiosClient from "../../axios-client";

export const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSignUpSuccess = () => {
    // After successful signup
    navigate('/auth/login');
  };

  // Regex Patterns
  const nameRegex = /^[a-zA-Z\s]{3,}$/; // Only letters & spaces, min 3 chars
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Standard email validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/; // Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char

  const validateField = (name, value) => {
    if (value.trim() === "") return `${name.replace("_", " ")} is required`;

    switch (name) {
      case "name":
        return nameRegex.test(value)
          ? ""
          : "Name must be at least 3 letters & contain only alphabets";
      case "email":
        return emailRegex.test(value) ? "" : "Enter a valid email address";
      case "password":
        return passwordRegex.test(value)
          ? ""
          : "Password must be 8+ chars, with uppercase, lowercase, number & special char";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(name, value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submitting
    const newFormErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      newFormErrors[key] = validateField(key, value);
    });

    if (Object.values(newFormErrors).some((error) => error !== "")) {
      setFormErrors(newFormErrors);
      return;
    }

    try {
      const response = await axiosClient.post("/auth/register", formData);
      if (response.status === 201) {
        Swal.fire({
          text: "User registered successfully",
          icon: "success",
        }).then(() => {
          navigate("/auth/login");
        });

        setFormData({
          name: "",
          email: "",
          password: "",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Registration failed",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Error registering user",
        icon: "error",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Card className="w-96 shadow-xl bg-white/95 backdrop-blur-sm">
        {/* Header */}
        <div className="w-full bg-gradient-to-r from-black to-gray-800 h-14 text-white text-[20px] flex justify-center items-center font-bold rounded-t-lg">
          Create New Account
        </div>

        <form onSubmit={handleSubmit} className="mt-8">
          <CardBody className="flex flex-col gap-6 px-6">
            {/* Full Name Input */}
            <div className="space-y-1">
              <Input
                required
                name="name"
                label="Full Name"
                type="text"
                size="lg"
                className="!border-2 !border-gray-200 focus:!border-[#25C935]"
                labelProps={{
                  className: "text-gray-700 font-medium",
                }}
                containerProps={{
                  className: "min-w-full",
                }}
                value={formData.name}
                onChange={handleChange}
              />
              {formErrors.name && (
                <p className="text-red-500 text-xs font-medium pl-1">
                  {formErrors.name}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div className="space-y-1">
              <Input
                required
                name="email"
                label="Email"
                type="email"
                size="lg"
                className="!border-2 !border-gray-200 focus:!border-[#25C935]"
                labelProps={{
                  className: "text-gray-700 font-medium",
                }}
                containerProps={{
                  className: "min-w-full",
                }}
                value={formData.email}
                onChange={handleChange}
              />
              {formErrors.email && (
                <p className="text-red-500 text-xs font-medium pl-1">
                  {formErrors.email}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <Input
                required
                name="password"
                type="password"
                label="Password"
                size="lg"
                className="!border-2 !border-gray-200 focus:!border-[#25C935]"
                labelProps={{
                  className: "text-gray-700 font-medium",
                }}
                containerProps={{
                  className: "min-w-full",
                }}
                value={formData.password}
                onChange={handleChange}
              />
              {formErrors.password && (
                <p className="text-red-500 text-xs font-medium pl-1">
                  {formErrors.password}
                </p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600 font-medium mb-2">Password must have:</p>
              <ul className="text-xs text-gray-500 space-y-1 list-disc list-inside">
                <li>At least 8 characters</li>
                <li>One uppercase letter</li>
                <li>One lowercase letter</li>
                <li>One number</li>
                <li>One special character</li>
              </ul>
            </div>
          </CardBody>

          <CardFooter className="pt-0 px-6 pb-8">
            <Button
              type="submit"
              disabled={Object.values(formErrors).some((error) => error !== "")}
              className="bg-gradient-to-r from-[#25C935] to-[#1ea32b] w-full py-3 text-base font-semibold shadow-md hover:shadow-lg hover:from-[#1ea32b] hover:to-[#25C935] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sign Up
            </Button>

            <Typography variant="small" className="mt-6 flex justify-center text-gray-600">
              Already have an account?
              <Link
                to="/auth/login"
                className="ml-1 font-bold text-[#25C935] hover:text-[#1ea32b] transition-colors"
              >
                Log in
              </Link>
            </Typography>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
