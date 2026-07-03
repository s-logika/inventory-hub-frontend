const API_URL = process.env.NEXT_PUBLIC_API_URL

export function extractError(data: Record<string, unknown>, fallback: string): string {
  if (data.error) return data.error as string
  if (data.errors) {
    return Array.isArray(data.errors) ? (data.errors as string[]).join(", ") : (data.errors as string)
  }
  return fallback
}

function authHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  return { ok: res.ok, data }
}

export async function registerUser(email: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  return { ok: res.ok, data }
}

export async function getProducts() {
  const res = await fetch(`${API_URL}/api/products/`, { headers: authHeaders() })
  const data = await res.json()
  return { ok: res.ok, data }
}

export async function createProduct(payload: object) {
  const res = await fetch(`${API_URL}/api/products/`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  return { ok: res.ok, data }
}

export async function updateProduct(id: number, payload: object) {
  const res = await fetch(`${API_URL}/api/products/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  return { ok: res.ok, data }
}

export async function deleteProduct(id: number) {
  const res = await fetch(`${API_URL}/api/products/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  })
  const data = await res.json()
  return { ok: res.ok, data }
}

export async function restockProduct(id: number, quantity: number) {
  const res = await fetch(`${API_URL}/api/products/${id}/restock`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ quantity }),
  })
  const data = await res.json()
  return { ok: res.ok, data }
}

export async function createSale(items: { product_id: number; quantity: number }[]) {
  const res = await fetch(`${API_URL}/api/sales/`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ items }),
  })
  const data = await res.json()
  return { ok: res.ok, data }
}

export async function getSales(startDate?: string, endDate?: string) {
  const params = new URLSearchParams()
  if (startDate) params.append("start_date", startDate)
  if (endDate) params.append("end_date", endDate)
  const res = await fetch(`${API_URL}/api/sales/?${params.toString()}`, {
    headers: authHeaders(),
  })
  const data = await res.json()
  return { ok: res.ok, data }
}

export async function getDashboard() {
  const res = await fetch(`${API_URL}/api/dashboard/`, { headers: authHeaders() })
  const data = await res.json()
  return { ok: res.ok, data }
}
