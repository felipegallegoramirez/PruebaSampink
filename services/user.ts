import axios from "axios";


const API_URL = 'https://sampink-background-check.azurewebsites.net/api';

const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN || '';

//const token = localStorage.getItem("token");

const httpOptions = {
  headers: {
 //   Authorization: `Bearer ${token}`,
  },
};

export const login= async (data: any): Promise<any> => {
  const response = await axios.post<any>(`${API_URL}/login?${API_TOKEN}`, data, httpOptions);
  return response.data;
};

export const register= async (data: any): Promise<any> => {
    const response = await axios.post<any>(`${API_URL}/registerUser?${API_TOKEN}`, data, httpOptions);
    return response.data;
};

