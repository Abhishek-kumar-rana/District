import { useMutation,    useQuery,    useQueryClient } from "@tanstack/react-query";
import { api } from "./axios";
import type { ApiResponse } from "./Movies.type";



 
export interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin"|"superadmin";
  createdAt: string;
}



 

// ////////////////////







 
///////////////////////////

 
export const loginReq = async (payload:{email:string,password:string}): Promise<ApiResponse<User>> => {
  const response = await api.post("/api/users/login", payload);
  console.log("login api response : ",response);
  return response.data;
};

export interface RegisterPayload {
  name?: string;
  email: string;
  password: string;
  role?: "user" | "admin" ;
}


////////   Register
export const registerUser = async (payload: RegisterPayload): Promise<ApiResponse<User>> => {

  const response = await api.post("/api/users", payload);
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


////////// Get Bookings

 const getBookings = async (id:string|Number|undefined) => {
    const response = await api.get(`/users/${id}/bookings`);
    console.log("Movie API Response:", response.data); 
    return response.data;
};

export const UseBookings = (id:string|Number|undefined) => {
    return useQuery({
        queryKey: ['movies'],
        queryFn: () => getBookings(id),
    });
};  





 