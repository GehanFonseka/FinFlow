import { useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
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
          navigate("/login");
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
    <div className="flex h-screen items-center justify-center">
      <Card className="w-96 rounded-none">
        <div className="flex h-14 w-full items-center justify-center bg-black text-[20px] font-bold text-white">
          Create New Account
        </div>
        <CardBody className="mt-4 flex flex-col gap-5">
          <div>
            <Input
              required
              name="name"
              label="Full Name"
              type="text"
              size="lg"
              className="custom-input-focus"
              value={formData.name}
              onChange={handleChange}
            />
            {formErrors.name && (
              <Typography variant="small" className="mt-1 text-xs text-red-500">
                {formErrors.name}
              </Typography>
            )}
          </div>

          <div>
            <Input
              required
              name="email"
              label="Email"
              type="email"
              size="lg"
              className="custom-input-focus"
              value={formData.email}
              onChange={handleChange}
            />
            {formErrors.email && (
              <Typography variant="small" className="mt-1 text-xs text-red-500">
                {formErrors.email}
              </Typography>
            )}
          </div>

          <div>
            <Input
              required
              name="password"
              type="password"
              label="Password"
              size="lg"
              className="custom-input-focus"
              value={formData.password}
              onChange={handleChange}
            />
            {formErrors.password && (
              <Typography variant="small" className="mt-1 text-xs text-red-500">
                {formErrors.password}
              </Typography>
            )}
          </div>
        </CardBody>

        <CardFooter className="pt-0">
          <Button
            className="bg-[#25C935]"
            fullWidth
            onClick={handleSubmit}
            disabled={Object.values(formErrors).some((error) => error !== "")}
          >
            Sign Up
          </Button>

          <Typography variant="small" className="mt-5 flex justify-center">
            Already have an account?
            <Typography
              as="a"
              href="/login"
              variant="small"
              color="blue-gray"
              className="ml-1 font-bold"
            >
              Log in
            </Typography>
          </Typography>
        </CardFooter>
      </Card>
    </div>
  );
};
