import axios from "axios";


const API_URL = 'https://sampink-consults.azurewebsites.net/api';

const API_TOKEN = ''

//const token = localStorage.getItem("token");

const httpOptions = {
  headers: {
 //   Authorization: `Bearer ${token}`,
  },
};

export const postList= async (list: any): Promise<any> => {
  const response = await axios.post<any>(`${API_URL}/backgroundCheck?${API_TOKEN}`, list, httpOptions);
  return response.data;
};

export const getStatus= async (id: string): Promise<any> => {
  console.log(`${API_URL}/backgroundCheckStatus/${id}/${API_TOKEN}`)
  id = "6460fc34-4154-43db-9438-8c5a059304c0" // for testing purposes
  const response = await axios.get<any>(`${API_URL}/backgroundCheckStatus/${id}?${API_TOKEN}`, httpOptions);
  return response.data;
};

export const getData= async (id: string): Promise<any> => {
    const response = await axios.get<any>(`${API_URL}/backgroundCheckResults/${id}?${API_TOKEN}`, httpOptions);
    return response.data;
  };
