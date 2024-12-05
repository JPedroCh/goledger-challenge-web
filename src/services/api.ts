import axios from "axios";
import { baseUrl } from "../constants/baseUrl";

const api = axios.create({
  baseURL: `${baseUrl}/api/`,
});

export default api;
