"use server";

import { cookies } from "next/headers";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://buyonmaps-api.onrender.com"; // Fallback for safety

export async function getCounts() {
  const cookieStore = cookies();
  const url = `${BASE_URL}/api/v1/admin/appointments/counts`;
  const token = cookieStore.get("authToken")?.value;

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
    console.log("success");

    return jsonResponse; // Return only the posts array
  } catch (error) {
    console.error("Failed to fetch listings:", error);
    return {};
  }
}

export async function fetchAppointments(
  statusFilter: string,
  page: number = 1,
) {
  const cookieStore = cookies();
  const url = `${BASE_URL}/api/v1/admin/appointments?type=${statusFilter}&page=${page}&limit=10`;
  const token = cookieStore.get("authToken")?.value;

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
    console.log("success");

    return jsonResponse; // Return only the posts array
  } catch (error) {
    console.error("Failed to fetch listings:", error);
    return {};
  }
}
