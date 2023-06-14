import axios from 'axios'

const api = axios.create({
  baseURL: 'https://odd-gold-newt-slip.cyclic.app/',
})

export default async function getPlayers() {
  const res = await api.get('/')
  return res.data
}
