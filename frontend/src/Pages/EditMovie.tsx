import { useParams, useNavigate } from "react-router-dom";
import { useMovie, useUpdateMovie, useDeleteMovie } from "../api/Movies";
import MovieForm from "./Movieform";
import type { MovieFormPayload } from "./Movieform";
import type { User } from "../api/api";

export default function EditMovie() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, error } = useMovie(id!);
  const updateMovie = useUpdateMovie();
  const deleteMovie = useDeleteMovie();

  const getCurrentUser = (): User | null => {
  const raw = localStorage.getItem("currentUser");
  return raw ? JSON.parse(raw) : null;
};

  const currentUser = getCurrentUser();

  // Simple client-side gate. The backend also re-checks the admin role on
  // every request, so this is just for a decent UX — not the real security
  // boundary.
  if (!currentUser || currentUser.role !== "admin") {
    return <h2 className="text-center mt-40 text-xl font-semibold">Access denied. Admins only.</h2>;
  }

  if (isLoading) return <h2 className="text-center mt-40">Loading...</h2>;
  if (error) return <h2 className="text-center mt-40">Something went wrong</h2>;

  const handleUpdate = (payload: MovieFormPayload) => {
    updateMovie.mutate(
      { id: id!, payload, adminId: currentUser.id },
      {
        onSuccess: () => navigate(`/movies/${id}`),
      }
    );
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Delete this movie? This action cannot be undone."
    );
    if (!confirmed) return;

    deleteMovie.mutate(
      { id: id!, adminId: currentUser.id },
      {
        onSuccess: () => navigate("/movies"),
      }
    );
  };

  return (
    <div className="mt-32 max-w-xl mx-auto px-4 pb-16">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Movie</h2>

      <MovieForm
        initialValues={data?.data}
        submitLabel={updateMovie.isPending ? "Saving..." : "Save Changes"}
        isSubmitting={updateMovie.isPending}
        onSubmit={handleUpdate}
      />

      {updateMovie.isError && (
        <p className="text-red-500 text-sm text-center mt-3">
          Failed to save changes. Please try again.
        </p>
      )}

      <button
        onClick={handleDelete}
        disabled={deleteMovie.isPending}
        className="mt-6 w-full px-6 py-2 bg-red-600 disabled:opacity-50 text-white text-lg font-bold rounded-lg"
      >
        {deleteMovie.isPending ? "Deleting..." : "Delete Movie"}
      </button>

      {deleteMovie.isError && (
        <p className="text-red-500 text-sm text-center mt-3">
          Failed to delete movie. Please try again.
        </p>
      )}
    </div>
  );
}