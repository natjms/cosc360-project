import { apiClient } from "@/lib/api-client";
//import type { Login } from "../types";

export async function createTweetApi(password) {
  const res = await apiClient<Login>("/api/login", {
    method: "POST",
    body: { password },
  });
  return res.data;
}
        
