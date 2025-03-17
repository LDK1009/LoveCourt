import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`, // 여기에 실제 API의 base URL을 입력하세요
});

export default api;
