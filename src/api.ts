import axios from 'axios'

const api = axios.create({
  // baseURL: 'http://localhost:5000/',
  baseURL: 'http://localhost:3000',
})

export default async function getPlayers() {
  const res = await api.get('/')
  return res.data
}
