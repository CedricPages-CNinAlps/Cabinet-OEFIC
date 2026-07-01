const API_BASE = '/api'

function getToken(): string | null {
  return localStorage.getItem('oefic_admin_token')
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  auth = false
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }
  if (auth) {
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error((err as { error: string }).error || 'Erreur réseau')
  }
  return res.json() as Promise<T>
}

export function useApi() {
  return {
    get: <T>(path: string) => request<T>('GET', path),
    post: <T>(path: string, body: unknown, auth = false) =>
      request<T>('POST', path, body, auth),
    put: <T>(path: string, body: unknown, auth = true) =>
      request<T>('PUT', path, body, auth),
    del: <T>(path: string, auth = true) => request<T>('DELETE', path, undefined, auth)
  }
}
