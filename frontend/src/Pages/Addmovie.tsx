import { useNavigate } from "react-router-dom";
 
import MovieForm from "./MovieForm";
import type { MovieFormPayload } from "./MovieForm";
import { useCreateMovie } from "../api/Movies";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import { notify } from "../utils/Notification";
 
export default function AddMovie() {
  const navigate = useNavigate();
  const createMovie = useCreateMovie();

  const {getCurrentUser,getPermissions}=useAuth();

  const permissions=getPermissions();

  
  const currentUser = getCurrentUser();

  const permission =   Notification.requestPermission();
  
  useEffect(() => {
    permission;
 
}, []);
     

  if (!currentUser || !permissions.includes("CREATE") ) {
    return <h2 className="text-center mt-60 mb-60 text-xl font-semibold">Access denied. Admins only.</h2>;
  }

 

  const handleCreate = (payload: MovieFormPayload) => {
    createMovie.mutate(
      { payload, adminId: currentUser.id },
      {
        onSuccess: (response) => {
          
          if(!navigator.onLine){
            notify(response.data.title,"movie is saved offline, waiting for the internet to be sync.");
            console.log("omg.........")
            navigate(`/movies`);
          }
            // else navigate(`/movies/${response.data.id}`);
        },
      }
    );
  };

  return (
    <div className=" p-4 max-w-xl mx-auto lg:mt-30 mt-50 mb-10">
      <h2 className="text-2xl font-bold mb-6 text-center border-b">Add New Movie</h2>

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