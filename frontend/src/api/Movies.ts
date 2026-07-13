import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./axios";
import type { ApiResponse, CreateMoviePayload, Movie, UpdateMoviePayload } from "./Movies.type";
import { saveMovieOffline } from "../offlineDB";
import { notify } from "../utils/Notification";


 


 
const withAdminHeader = (adminId: string | number) => ({
  headers: { "x-user-id": String(adminId) },
});

// ---------- READ ----------

// export const getMovies = async (params?: {
//   genre?: string;
//   language?: string;
//   certificate?: string;
//   search?: string;
// }): Promise<ApiResponse<Movie[]>> => {
//   const response = await api.get("/api/movies", { params });
//   return response.data;
// };

// export const useMovies = (params?: {
//   genre?: string;
//   language?: string;
//   certificate?: string;
//   search?: string;
// }) => {
//   return useQuery({
//     queryKey: ["movies", params],
//     queryFn: () => getMovies(params),
//   });
// };

// get all movies 

 const getMovies = async () => {
    const response = await api.get("/api/movies");
    console.log("Movie API Response:", response.data); 
    return response.data;
};

export const useMovies = () => {
    return useQuery({
        queryKey: ['movies'],
        queryFn: () => getMovies(),
    });
};  


//// get single movie


export const getMovieById = async (id: string | number): Promise<ApiResponse<Movie>> => {
  const response = await api.get(`/api/movies/${id}`);
  return response.data;
};

export const useMovie = (id: string | number) => {
  return useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieById(id),
    enabled: !!id,
  });
};


//  const getMovie = async (id: string) => {
//   const response = await api.get(`/api/movies/${id}`);
//   console.log("API Response:", response.data); 
//   return response.data;
// };


// export const useData = (id: string) => {
//   console.log("button clicked");
//   return useQuery({
//     queryKey: ['data', id],
//     queryFn: () => getMovie(id),
//    })
// }









// ---------- CREATE ----------

// export const createMovie = async (
//   payload: CreateMoviePayload,
//   adminId: string | number
// ): Promise<ApiResponse<Movie>> => {
//   console.log(payload);
//   const response = await api.post("/api/movies", payload, withAdminHeader(adminId));
//   return response.data;
// };


export const createMovie = async (
  payload: CreateMoviePayload,
  adminId: string | number
) => {
  console.log("create movie is called..")
  try {
    if (!navigator.onLine) {

      await saveMovieOffline(payload, adminId);
      // if(Notification.permission==="granted"){
      //   new Notification("District",{
      //     body:`"${payload.title}" saved locally. It will sync automatically when you are online`,
      //     icon: "/icon-png",
      //   })
      // }
      // notify(payload.title,"saved locally. It will sync automatically when you are online")
      const registration = await navigator.serviceWorker.ready;

      if ("sync" in registration) {
        await (registration as any).sync.register("sync-new-movies");
      }

      return {
        success: true,
        message: "Movie saved offline",
        data: payload,
      };
    }
    else{
      const response = await api.post( "/api/movies",  payload, withAdminHeader(adminId)
    );

    return response.data;
    }
    
  } catch (err) {
     
    alert(err);
    
  }
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
  const response = await api.put(`/api/movies/${id}`, payload, withAdminHeader(adminId));
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
  const response = await api.delete(`/api/movies/${id}`, withAdminHeader(adminId));
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