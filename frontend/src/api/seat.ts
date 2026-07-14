import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
 import { api } from "./axios";
import type { ApiResponse } from "./Movies.type";
import type { Booking, HoldResult, ReleaseResult, SeatMap } from "./seats.type";
 




const withUserHeader = (userId: string | number) => ({
  headers: { "x-user-id": String(userId) },
});

// ---------- GET seat map ----------

export const getSeats = async (movieId: string | number): Promise<ApiResponse<SeatMap>> => {
  const response = await api.get(`/api/movies/${movieId}/seats`);
  return response.data;
};

export const useSeats = (movieId: string | number) => {
  return useQuery({
    queryKey: ["seats", movieId],
    queryFn: () => getSeats(movieId),
    enabled: !!movieId,
   
    refetchInterval: 5000,
  });
};

// ---------- HOLD ----------

export const holdSeats = async (
  movieId: string | number,
  seatIds: string[],
  userId: string | number
): Promise<ApiResponse<HoldResult>> => {
  const response = await api.post(
    `/api/movies/${movieId}/seats/hold`,
    { seatIds },
    withUserHeader(userId)
  );
  return response.data;
};

export const useHoldSeats = (movieId: string | number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ seatIds, userId }: { seatIds: string[]; userId: string | number }) =>
      holdSeats(movieId, seatIds, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seats", movieId] });
    },
  });
};

// ---------- RELEASE ----------

export const releaseSeats = async (
  movieId: string | number,
  seatIds: string[],
  userId: string | number
): Promise<ApiResponse<ReleaseResult>> => {
  const response = await api.post(
    `/api/movies/${movieId}/seats/release`,
    { seatIds },
    withUserHeader(userId)
  );
  return response.data;
};

export const useReleaseSeats = (movieId: string | number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ seatIds, userId }: { seatIds: string[]; userId: string | number }) =>
      releaseSeats(movieId, seatIds, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seats", movieId] });
    },
  });
};

// ---------- BOOK ----------

export const bookSeats = async (
  movieId: string | number,
  seatIds: string[],
  userId: string | number
): Promise<ApiResponse<Booking>> => {
  const response = await api.post(`/api/movies/${movieId}/seats/book`,{ seatIds },
    withUserHeader(userId)
  );
  return response.data;
};

export const useBookSeats = (movieId: string | number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ seatIds, userId }: { seatIds: string[]; userId: string | number }) =>
      bookSeats(movieId, seatIds, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["seats", movieId] });
      queryClient.invalidateQueries({ queryKey: ["bookings", variables.userId] });
    },
  });
};

// ---------- User's bookings ----------

export const getUserBookings = async (
  userId: string | number
): Promise<ApiResponse<Booking[]>> => {
  const response = await api.get(`/api/users/${userId}/bookings`);
  return response.data;
};

export const useUserBookings = (userId: string | number) => {
  return useQuery({
    queryKey: ["bookings", userId],
    queryFn: () => getUserBookings(userId),
    enabled: !!userId,
  });
};


