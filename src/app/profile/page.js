// src/app/profile/page.js
"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [profileMsg, setProfileMsg] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });

  useEffect(() => {
    if (session) {
      setProfile({
        name: session.user.name || "",
        email: session.user.email || ""
      });
    }
  }, [session]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    router.push("/auth/login");
    return null;
  }

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/auth/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile)
    });
    const data = await res.json();
    if (res.ok) {
      setProfileMsg("Profile updated successfully");
    } else {
      setProfileMsg(data.message || "Error updating profile");
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordMsg("New passwords do not match");
      return;
    }
    const res = await fetch("/api/auth/change-password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      })
    });
    const data = await res.json();
    if (res.ok) {
      setPasswordMsg("Password updated successfully");
    } else {
      setPasswordMsg(data.message || "Error updating password");
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">Profile Settings</h1>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
          {profileMsg && <p className="text-green-500 mb-2">{profileMsg}</p>}
          <form onSubmit={updateProfile}>
            <label className="block mb-2">
              Name
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                className="w-full p-2 border rounded mt-1"
              />
            </label>
            <label className="block mb-2">
              Email
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                className="w-full p-2 border rounded mt-1"
              />
            </label>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
              Update Profile
            </button>
          </form>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Change Password</h2>
          {passwordMsg && <p className="text-green-500 mb-2">{passwordMsg}</p>}
          <form onSubmit={updatePassword}>
            <label className="block mb-2">
              Current Password
              <input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                className="w-full p-2 border rounded mt-1"
              />
            </label>
            <label className="block mb-2">
              New Password
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className="w-full p-2 border rounded mt-1"
              />
            </label>
            <label className="block mb-2">
              Confirm New Password
              <input
                type="password"
                name="confirmNewPassword"
                value={passwordForm.confirmNewPassword}
                onChange={handlePasswordChange}
                className="w-full p-2 border rounded mt-1"
              />
            </label>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
              Change Password
            </button>
          </form>
        </div>
        <div>
          <button onClick={() => signOut()} className="bg-red-500 text-white p-2 rounded">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
