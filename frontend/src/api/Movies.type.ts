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