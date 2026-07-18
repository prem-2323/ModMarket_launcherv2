const API_BASE = 'http://localhost:5000/api'

interface ApiResponse<T = any> {
  success: boolean
  message?: string
  token?: string
  user?: T
}

function getToken(): string | null {
  return localStorage.getItem('mm_token')
}

function setToken(token: string): void {
  localStorage.setItem('mm_token', token)
}

function clearToken(): void {
  localStorage.removeItem('mm_token')
}

async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    })
    const data: ApiResponse<T> = await res.json()
    return data
  } catch (err: any) {
    return { success: false, message: err.message || 'Network error' }
  }
}

export const api = {
  register(
    username: string,
    email: string,
    password: string
  ): Promise<ApiResponse<{ id: string; username: string; email: string }>> {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    })
  },

  login(
    email: string,
    password: string
  ): Promise<ApiResponse<{ id: string; username: string; email: string }>> {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  getProfile(): Promise<
    ApiResponse<{
      id: string
      username: string
      email: string
      avatar?: string
      role: string
      createdAt: string
    }>
  > {
    return request('/auth/profile')
  },

  updateProfile(updates: {
    username?: string
    avatar?: string
  }): Promise<ApiResponse<{ id: string; username: string; email: string; avatar?: string; role: string }>> {
    return request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  },

  isAuthenticated(): boolean {
    return !!getToken()
  },

  async loginAndSave(email: string, password: string): Promise<boolean> {
    const res = await this.login(email, password)
    if (res.success && res.token) {
      setToken(res.token)
      return true
    }
    return false
  },

  async registerAndSave(
    username: string,
    email: string,
    password: string
  ): Promise<boolean> {
    const res = await this.register(username, email, password)
    if (res.success && res.token) {
      setToken(res.token)
      return true
    }
    return false
  },

  logout(): void {
    clearToken()
  },
}
