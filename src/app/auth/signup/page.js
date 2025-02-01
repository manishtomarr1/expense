"use client";

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";

// React Icons for fields
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
// React Icons for social buttons
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

// Yup validation schema
const SignUpSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to sign up");
      }
      toast.success("User registered successfully! 🎉");
      resetForm();
      router.push("/auth/login");
    } catch (error) {
      toast.error(error.message || "Sign up failed 😢");
    }
    setSubmitting(false);
  };

  const handleSocialSignIn = async (provider) => {
    toast.info(`Redirecting to ${provider}...`);
    await signIn(provider, { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 via-white to-blue-50 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center text-blue-800">Create an Account</h1>
        <Formik
          initialValues={{ name: "", email: "", password: "", confirmPassword: "" }}
          validationSchema={SignUpSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4" noValidate>
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-gray-700 font-medium mb-1">Name</label>
                <div className="flex items-center border rounded px-3 py-2">
                  <FaUser className="text-gray-400 mr-2" />
                  <Field id="name" name="name" type="text" placeholder="John Doe" className="flex-1 outline-none" />
                </div>
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email</label>
                <div className="flex items-center border rounded px-3 py-2">
                  <FaEnvelope className="text-gray-400 mr-2" />
                  <Field id="email" name="email" type="email" placeholder="you@example.com" className="flex-1 outline-none" />
                </div>
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-gray-700 font-medium mb-1">Password</label>
                <div className="flex items-center border rounded px-3 py-2">
                  <FaLock className="text-gray-400 mr-2" />
                  <Field
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    className="flex-1 outline-none"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-none">
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-1">Confirm Password</label>
                <div className="flex items-center border rounded px-3 py-2">
                  <FaLock className="text-gray-400 mr-2" />
                  <Field
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="********"
                    className="flex-1 outline-none"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="focus:outline-none">
                    {showConfirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              {/* Submit Button */}
              <button type="submit" disabled={isSubmitting} className="w-full py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition">
                {isSubmitting ? "Signing up..." : "Sign Up"}
              </button>
            </Form>
          )}
        </Formik>
        {/* Social Sign Up */}
        <div className="flex flex-col gap-3">
          <button onClick={() => handleSocialSignIn("google")} className="w-full py-2 border border-gray-300 rounded flex items-center justify-center gap-2 hover:bg-gray-50 transition">
            <FcGoogle size={24} />
            Sign up with Google
          </button>
          <button onClick={() => handleSocialSignIn("apple")} className="w-full py-2 border border-gray-300 rounded flex items-center justify-center gap-2 hover:bg-gray-50 transition">
            <FaApple size={24} className="text-black" />
            Sign up with Apple
          </button>
        </div>
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-blue-600 hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
}
