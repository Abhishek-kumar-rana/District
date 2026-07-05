import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export interface CastMember {
  id: number;
  name: string;
  role: string;
  image: string;
}
 
export interface Movie {
  id: number;
  title: string;
  certificate: string;
  languages: string[];
  duration: string;
  releaseDate: string;
  description: string;
  genres: string[];
  bannerImage: string;
  backgroundImage: string;
  cast: CastMember[];
}
 
export type CreateMoviePayload = Partial<Omit<Movie, "id">> & { title: string };
export type UpdateMoviePayload = Partial<Omit<Movie, "id">>;

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  count?: number;
  data: T;
}
 

const moviesApi = axios.create({
  baseURL: "http://localhost:5000/api/movies",
  headers: {
    "Content-Type": "application/json",
  },
});

// Admin actions (create/update/delete) require the acting admin's user id.
// The backend reads this header and looks up the real role from the DB —
// it does not trust a role sent by the client.
const withAdminHeader = (adminId: string | number) => ({
  headers: { "x-user-id": String(adminId) },
});

// ---------- READ ----------

export const getMovies = async (params?: {
  genre?: string;
  language?: string;
  certificate?: string;
  search?: string;
}): Promise<ApiResponse<Movie[]>> => {
  const response = await moviesApi.get("", { params });
  return response.data;
};

export const useMovies = (params?: {
  genre?: string;
  language?: string;
  certificate?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["movies", params],
    queryFn: () => getMovies(params),
  });
};

export const getMovieById = async (id: string | number): Promise<ApiResponse<Movie>> => {
  const response = await moviesApi.get(`/${id}`);
  return response.data;
};

export const useMovie = (id: string | number) => {
  return useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieById(id),
    enabled: !!id,
  });
};

// ---------- CREATE ----------

export const createMovie = async (
  payload: CreateMoviePayload,
  adminId: string | number
): Promise<ApiResponse<Movie>> => {
  const response = await moviesApi.post("", payload, withAdminHeader(adminId));
  return response.data;
};

export const useCreateMovie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      payload,
      adminId,
    }: {
      payload: CreateMoviePayload;
      adminId: string | number;
    }) => createMovie(payload, adminId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
  });
};

// ---------- UPDATE ----------

export const updateMovie = async (
  id: string | number,
  payload: UpdateMoviePayload,
  adminId: string | number
): Promise<ApiResponse<Movie>> => {
  const response = await moviesApi.put(`/${id}`, payload, withAdminHeader(adminId));
  return response.data;
};

export const useUpdateMovie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
      adminId,
    }: {
      id: string | number;
      payload: UpdateMoviePayload;
      adminId: string | number;
    }) => updateMovie(id, payload, adminId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      queryClient.invalidateQueries({ queryKey: ["movie", variables.id] });
    },
  });
};

// ---------- DELETE ----------

export const deleteMovie = async (
  id: string | number,
  adminId: string | number
): Promise<ApiResponse<Movie>> => {
  const response = await moviesApi.delete(`/${id}`, withAdminHeader(adminId));
  return response.data;
};

export const useDeleteMovie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, adminId }: { id: string | number; adminId: string | number }) =>
      deleteMovie(id, adminId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
  });
};