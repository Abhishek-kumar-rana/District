import { useNavigate } from "react-router-dom";
import {  type User } from "../api/api";

import MovieForm from "./Movieform";
import type { MovieFormPayload } from "./Movieform";
import { useCreateMovie } from "../api/Movies";

export default function AddMovie() {
  const navigate = useNavigate();
  const createMovie = useCreateMovie();

  const getCurrentUser = (): User | null => {
  const raw = localStorage.getItem("currentUser");
  return raw ? JSON.parse(raw) : null;
};
  const currentUser = getCurrentUser();

  if (!currentUser || currentUser.role !== "admin") {
    return <h2 className="text-center mt-40 text-xl font-semibold">Access denied. Admins only.</h2>;
  }

  const handleCreate = (payload: MovieFormPayload) => {
    createMovie.mutate(
      { payload, adminId: currentUser.id },
      {
        onSuccess: (response) => navigate(`/movies/${response.data.id}`),
      }
    );
  };

  return (
    <div className="mt-32 max-w-xl mx-auto px-4 pb-16">
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Movie</h2>

      <MovieForm
        submitLabel={createMovie.isPending ? "Creating..." : "Create Movie"}
        isSubmitting={createMovie.isPending}
        onSubmit={handleCreate}
      />

      {createMovie.isError && (
        <p className="text-red-500 text-sm text-center mt-3">
          Failed to create movie. Please try again.
        </p>
      )}
    </div>
  );
}