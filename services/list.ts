import axios from "axios";

const API_URL = '';

//const token = localStorage.getItem("token");

const httpOptions = {
  headers: {
 //   Authorization: `Bearer ${token}`,
  },
};

export const postList= async (list: any): Promise<boolean> => {
  const response = await axios.post<boolean>(`${API_URL}/`, list, httpOptions);
  return response.data;
};

export const getList= async (id: string): Promise<any> => {
  const response = await axios.get<any>(`${API_URL}/unique/${id}`, httpOptions);
  return response.data;
};

export const deleteList= async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`, httpOptions);
};

export const getLists = async (): Promise<any[]> => {
  const response = await axios.get<any[]>(`${API_URL}/`, httpOptions);
  return response.data;
};

export const putList= async (list: any, id: string): Promise<void> => {
  await axios.put(`${API_URL}/${id}`, list, httpOptions);
};

