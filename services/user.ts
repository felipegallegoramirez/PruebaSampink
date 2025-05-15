import axios from "axios";


const API_URL = 'https://sampink-consults.azurewebsites.net/api';

const API_TOKEN = ''

//const token = localStorage.getItem("token");

const httpOptions = {
  headers: {
 //   Authorization: `Bearer ${token}`,
  },
};

export const login= async (data: any): Promise<any> => {
  const response = await axios.post<any>(`${API_URL}/getUserId?${API_TOKEN}`, data, httpOptions);
  return response.data;
};

export const register= async (data: any): Promise<any> => {
    const response = await axios.post<any>(`${API_URL}/registerUser?${API_TOKEN}`, data, httpOptions);
    return response.data;
};

