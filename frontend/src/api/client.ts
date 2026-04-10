import axios from 'axios'

/** Base URL for JSON API. Override with `VITE_API_BASE_URL` (e.g. in `.env.local`). */
const baseURL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api'

export const apiClient = axios.create({
  baseURL,
})
