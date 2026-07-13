import { useParams, useNavigate } from "react-router-dom";
import { useMovie, useUpdateMovie, useDeleteMovie } from "../api/Movies";
import MovieForm from "./MovieForm";
import type { MovieFormPayload } from "./MovieForm";
import { useAuth } from "../hooks/useAuth";
 

export default function EditMovie() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, error } = useMovie(id!);
  const updateMovie = useUpdateMovie();
  const deleteMovie = useDeleteMovie();

  const {getCurrentUser,getPermissions} =useAuth();

  

  const currentUser = getCurrentUser();
  const permissions=getPermissions();

   
  if (!currentUser || !permissions?.includes("UPDATE")) {
    return <h2 className="text-center mt-60 mb-60 text-xl font-semibold">Access denied. Super Admins only.</h2>;
  }

  if (isLoading) return <h2 className="text-center h-screen mt-60">Loading...</h2>;
  if (error) return <h2 className="text-center h-screen mt-60">Something went wrong</h2>;

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
    <div className=" bg-gradient-to-b from-white to-violet-100">
      <div className="mt-50 lg:mt-32 max-w-xl mx-auto px-4 pb-16   ">
      <h2 className="text-2xl font-bold mb-6 text-center border-b">Edit Movie</h2>

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

      <div>
        {permissions.includes("DELETE")?(
          <>
          <button
        onClick={handleDelete}
        disabled={deleteMovie.isPending}
        className="mt-6 w-full px-6 py-2 bg-red-600 disabled:opacity-50 text-white text-lg font-bold rounded-lg cursor-pointer"
      >
        {deleteMovie.isPending ? "Deleting..." : "Delete Movie"}
      </button>

      {deleteMovie.isError && (
        <p className="text-red-500 text-sm text-center mt-3">
          Failed to delete movie. Please try again.
        </p>
      )}
          </>
        ):("")}
      </div>
    </div>
    </div>
  );
}