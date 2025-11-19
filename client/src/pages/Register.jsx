import { useState } from "react";
import { Button, TextInput, Label, Card } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import * as Yup from "yup";
import { toast } from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  // Yup validation schema
  const schema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .required("Name is required"),

    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),

    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await schema.validate(form, { abortEarly: false });
      setErrors({}); 

      await api.post("/user/register", form);

      toast.success("Registration successful!");
      navigate("/");

    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors = {};
        err.inner.forEach((e) => {
          validationErrors[e.path] = e.message;
        });
        setErrors(validationErrors);
        return;
      }

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Registration failed!";

      toast.error(message);
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Register</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Name */}
          <div>
            <Label value="Full Name" />
            <TextInput
              name="name"
              onChange={handleChange}
              placeholder="Name"
              color={errors.name ? "failure" : "gray"}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label value="Email" />
            <TextInput
              name="email"
              type="email"
              onChange={handleChange}
              placeholder="Email"
              color={errors.email ? "failure" : "gray"}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <Label value="Password" />
            <TextInput
              name="password"
              type="password"
              onChange={handleChange}
              placeholder="Password"
              color={errors.password ? "failure" : "gray"}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <Button type="submit" className="mt-2 text-white bg-black hover:bg-gray-800 transition duration-300 cursor-pointer">
            Register
          </Button>

          <p className="text-sm text-center">
            Already have an account?{" "}
            <Link to="/" className="text-blue-600">
              Login
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
