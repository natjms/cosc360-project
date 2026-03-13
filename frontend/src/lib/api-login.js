

  // 1. Build heade
  const headers = {
    "Content-Type": "application/json",
  };

  // 2. Auto-attach auth from localStorage
  const userId = localStorage.getItem("userId");
  if (userId) {
    headers["X-User-Id"] = userId;   // e.g. "a1b2c3d4-..."
  }

  // 3. Fire the actual fetch
  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // 4. Parse response
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data;