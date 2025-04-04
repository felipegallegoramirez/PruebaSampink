import axios from "axios";


const API_URL = 'http://127.0.0.1:8000';

 const API_TOKEN = ''

//const token = localStorage.getItem("token");

const httpOptions = {
  headers: {
 //   Authorization: `Bearer ${token}`,
  },
};

export const postList= async (list: any): Promise<any> => {
  const response = await axios.post<any>(`${API_URL}/backgroundCheck/${API_TOKEN}`, list, httpOptions);
  return response.data;
};

export const getStatus= async (id: string): Promise<any> => {
  console.log(`${API_URL}/backgroundCheckStatus/${id}/${API_TOKEN}`)
  const response = await axios.get<any>(`${API_URL}/backgroundCheckStatus/${id}/${API_TOKEN}`, httpOptions);
  return response.data;
};

export const getData= async (id: string): Promise<any> => {
    const response = await axios.get<any>(`${API_URL}/backgroundCheckResults/${id}/${API_TOKEN}`, httpOptions);
    return response.data;
  };
