import { useState } from "react";
import { Button, Label, TextInput, Card } from "flowbite-react";
import { useAuthStore } from "../store/authStore";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import * as Yup from "yup";
import { toast } from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  // Yup schema
  const schema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),

    password: Yup.string()
      .min(4, "Password must be at least 4 characters")
      .required("Password is required"),
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await schema.validate(form, { abortEarly: false });
      setErrors({});

      const res = await api.post("user/login", form);
      login(res.data);
      toast.success("Logged in successfully!");
      navigate("/chat");

    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors = {};
        err.inner.forEach((e) => {
          validationErrors[e.path] = e.message;
        });
        setErrors(validationErrors);
        return;
      }

      toast.error(err?.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
            Login
          </Button>

          <p className="text-sm text-center">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600">
              Register
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
