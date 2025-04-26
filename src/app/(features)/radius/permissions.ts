"use server";

import { cookies } from "next/headers";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://buyonmaps-api.onrender.com"; // Fallback for safety

export async function fetchPermission() {
  const cookieStore = cookies();
  const url = `${BASE_URL}/api/v1/admin/settings`;
  const token = cookieStore.get("authToken")?.value;

  if (!token) {
    throw new Error("Authentication token not found");
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const jsonResponse = await response.json();
    // console.log("success");

    return jsonResponse; // Return only the posts array
  } catch (error) {
    // console.error("Failed to fetch Banners:", error);
    return {};
  }
}

// Type definition for the request body
interface EditSettingsData {
  id: string;
  timeslot: number;
  posts: number;
  radius: number;
}

export async function editSettings(data: EditSettingsData) {
  const cookieStore = cookies();
  const url = `${BASE_URL}/api/v1/admin/settings/edit`;
  const token = cookieStore.get("authToken")?.value;

  if (!token) {
    throw new Error("Authentication token not found");
  }

  try {
    const response = await fetch(url, {
      method: "POST", // Changed from GET to POST
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // Adding the request body
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const jsonResponse = await response.json();
    // console.log("Settings updated successfully");
    return jsonResponse;
  } catch (error) {
    // console.error("Failed to edit settings:", error);
    return {};
  }
}
