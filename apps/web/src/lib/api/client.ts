const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export class ApiError extends Error {
  statusCode: number
  
  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    this.name = "ApiError"
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE}${endpoint}`
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })

  if (!response.ok) {
    let message = "An error occurred"
    try {
      const errorData = await response.json()
      message = errorData.detail || errorData.message || message
    } catch {
      message = response.statusText
    }
    throw new ApiError(message, response.status)
  }

  return response.json() as Promise<T>
}
