import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
 

const api = axios.create({
  baseURL: "http://localhost:5000/api/movies",
  
  headers: {
      "Content-Type": "application/json",
    },
});

export const getMovie = async (id: string) => {
  const response = await api.get(`/${id}`);
  console.log("API Response:", response.data); 
  return response.data;
};


export const useData = (id: string) => {
  console.log("button clicked");
  return useQuery({
    queryKey: ['data', id],
    queryFn: () => getMovie(id),
   })
}

// ////////////////////







export const getMovies = async () => {
    const response = await api.get("");
    console.log("Movie API Response:", response.data); 
    return response.data;
};

export const useMovies = () => {
    return useQuery({
        queryKey: ['movies'],
        queryFn: () => getMovies(),
    });
};  

///////////////////////////

const api2 = axios.create({
  baseURL: "http://localhost:5000/api/users",
  
  headers: {
    "Content-Type": "application/json",
  },
});
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  count?: number;
  data: T;
}
export interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
}
export const loginReq = async (payload:{email:string,password:string}): Promise<ApiResponse<User>> => {
  const response = await api2.post("/login", payload);
  console.log("login api response : ",response);
  return response.data;
};

export interface RegisterPayload {
  name?: string;
  email: string;
  password: string;
  role?: "user" | "admin";
}


export const registerUser = async (
  payload: RegisterPayload
): Promise<ApiResponse<User>> => {
  const response = await api2.post("", payload);
  return response.data;
};
 
export const useRegisterUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RegisterPayload) => registerUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};






 