import axios from 'axios'

const api = axios.create({ baseURL: '/api/v1' })

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('customer_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('customer_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

export const authApi = {
  register: (data: any) => api.post('/auth/customer/register', data).then(r => r.data),
  login: (data: any) => api.post('/auth/customer/login', data).then(r => r.data),
}
export const customerApi = {
  getProfile: () => api.get('/customers/profile').then(r => r.data),
  updateProfile: (data: any) => api.put('/customers/profile', data).then(r => r.data),
  getCards: () => api.get('/customers/cards').then(r => r.data),
  addCard: (data: any) => api.post('/customers/cards', data).then(r => r.data),
  removeCard: (id: number) => api.delete(`/customers/cards/${id}`).then(r => r.data),
}
export const productApi = {
  getAll: (params?: any) => api.get('/products', { params }).then(r => r.data),
  getOne: (id: number) => api.get(`/products/${id}`).then(r => r.data),
}
export const categoryApi = {
  getAll: () => api.get('/categories').then(r => r.data),
}
export const orderApi = {
  create: (data: any) => api.post('/orders', data).then(r => r.data),
  getMyOrders: () => api.get('/orders/my').then(r => r.data),
  cancel: (id: number) => api.put(`/orders/${id}/cancel`).then(r => r.data),
}
export const paymentApi = {
  create: (data: any) => api.post('/payments', data).then(r => r.data),
}
