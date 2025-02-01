"use client";

import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";

// React Icons for fields
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
// Social Icons
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

// Validation schema
const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (session) router.push("/dashboard");
  }, [session, status, router]);

  const handleSubmit = async (values, { setSubmitting }) => {
    const res = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });
    if (res.error) {
      toast.error(res.error, { icon: "❌" });
    } else {
      toast.success("Logged in successfully! 🚀");
      router.push("/dashboard");
    }
    setSubmitting(false);
  };

  const handleSocialSignIn = async (provider) => {
    toast.info(`Redirecting to ${provider}...`);
    await signIn(provider, { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-100 via-white to-purple-50 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center text-purple-800">Welcome Back</h1>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4" noValidate>
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
                  <Field id="password" name="password" type={showPassword ? "text" : "password"} placeholder="********" className="flex-1 outline-none" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-none">
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full py-2 bg-purple-600 text-white rounded font-semibold hover:bg-purple-700 transition">
                {isSubmitting ? "Logging in..." : "Log In"}
              </button>
            </Form>
          )}
        </Formik>
        {/* Social Login */}
        <div className="flex flex-col gap-3">
          <button onClick={() => handleSocialSignIn("google")} className="w-full py-2 border border-gray-300 rounded flex items-center justify-center gap-2 hover:bg-gray-50 transition">
            <FcGoogle size={24} />
            Log in with Google
          </button>
          <button onClick={() => handleSocialSignIn("apple")} className="w-full py-2 border border-gray-300 rounded flex items-center justify-center gap-2 hover:bg-gray-50 transition">
            <FaApple size={24} className="text-black" />
            Log in with Apple
          </button>
        </div>
        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-purple-600 hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
