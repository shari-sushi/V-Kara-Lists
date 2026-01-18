import axios from "axios"
import { domain } from "@/../env"

export const axiosClientVcontents = axios.create({
  baseURL: `${domain.backendHost}/vcontents`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})
