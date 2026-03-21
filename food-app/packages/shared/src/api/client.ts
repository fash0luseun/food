type TokenGetter = () => Promise<string | null>

let getToken: TokenGetter = async () => null
let baseUrl = ''

export function setTokenGetter(fn: TokenGetter) {
  getToken = fn
}

export function setBaseUrl(url: string) {
  baseUrl = url
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' })) as { error?: string }
    throw new Error(error.error ?? 'Request failed')
  }
  return res.json() as Promise<T>
}
