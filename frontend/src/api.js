import axios from 'axios'

const withAuth = (instance) => {
  instance.interceptors.request.use(config => {
    const token = localStorage.getItem('cj_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })
  return instance
}

export const authAPI = axios.create({ baseURL: 'http://localhost:3001' })
export const problemsAPI = withAuth(axios.create({ baseURL: 'http://localhost:3002' }))
export const submissionsAPI = withAuth(axios.create({ baseURL: 'http://localhost:3003' }))
