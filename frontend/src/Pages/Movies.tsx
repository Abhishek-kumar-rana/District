 

import { useEffect, useState } from 'react';
import {  useMovies } from '../api/Movies';
import { NavLink } from 'react-router-dom';
import { deletePendingMovie, getPendingMovies } from '../utils/offlineDB';


function Movies() {

  const [pendingMovies, setPendingMovies] = useState<any[]>([]);

  async function loadPendingMovies() {
     const data = await getPendingMovies(); 
     console.log("Pending Movies:", data); 
     setPendingMovies(data); 
    }
 
  useEffect(() => { 
    console.log("useEffect ran"); 
    loadPendingMovies(); 
  }, []);

  const { data, isLoading, error } = useMovies();
const handleDeletePendingMovie = async (id: number) => {
  await deletePendingMovie(id);

  setPendingMovies((prev) =>
    prev.filter((movie) => movie.id !== id)
  );
};
  console.log("Movies Data:", data);
  
  if (isLoading) return <h2 className='h-screen mt-50 text-4xl'>Loading...</h2>;

  if (error) return <h2 className='h-screen mt-50 text-4xl'>Something went wrong</h2>;

  return (
    <>
    <div className=" mt-30 md:mt-40 lg:mt-20 mb-100  ">
      
       <div className="lg:max-w-7xl mx-auto  pt-8   ">
              <div>
                  {pendingMovies.length > 0 && (

            <div className="mb-12 rounded-2xl border mt-10 lg:mt-0    p-6">

              <h2 className="mb-5  font-bold  ">

                Pending Offline Movies

              </h2>

              <div className="space-y-4">

                {pendingMovies.map((item) => (

                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl bg-white p-4 shadow"
                  >

                    <div>

                      <h3 className="font-bold text-lg">

                        {item.movie.title}

                      </h3>

                      <p className="text-sm text-gray-500">

                        Saved locally

                      </p>

                      <p className="text-xs text-yellow-600">

                        Will sync automatically

                      </p>

                    </div>

                    <button
                      onClick={() => handleDeletePendingMovie(item.id)}
                      className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                    >

                      Delete

                    </button>

                  </div>

                ))}

              </div>

            </div>

          )}
              </div>
                          <div  >
                              <p className="text-2xl mt-10 pl-2 font-bold">Top movies near you</p>
                          </div>
                          
                              <div className="flex gap-3 md:gap-6 flex-wrap w-fit  justify-center md:justify-center sm:justify-evenly lg:justify-start   items-center mt-6  [&::-webkit-scrollbar]:hidden">
                                  {data?.data.map((movie: any) => (
                                  <NavLink key={movie.id} to={`/movies/${movie.id}`} className="lg:w-[13rem] lg:h-[23rem] h-[20rem] w-[9rem]  md:w-[13rem] bg-white rounded-xl  border border-gray-200 overflow-hidden">
                                    <div key={movie.id} className="lg:w-[13rem] lg:h-[23rem] h-[20rem] w-[9rem]  md:w-[13rem] bg-white rounded-xl  border border-gray-200 overflow-hidden">
                                      <img src={movie.bannerImage} alt={movie.title} className="w-full h-3/4 object-cover" />
                                      <div className=" p-2">
                                          <span className="text-[12px] lg:text-[16px] font-bold">{movie.title}</span>
                                          <div>
                                              <span className="text-gray-600 font-semibold text-[12px]">{movie.certificate}</span>
                                              <span className="text-gray-600 ml-2">|</span>
                                              
                                              
                                                {movie.languages.map((lang: string, index: number) => (
                                                  <span key={index} className="text-gray-600 ml-2 font-semibold text-[12px]">
                                                    {lang}
                                                  </span>
                                                ))}
                                              
      
                                          </div>
                                      </div>
                                  </div>
                                  </NavLink>
                              ))}
                              </div>
                          
      
                      </div>
          
       
      

    </div>
    </>
  )
}

export default Movies













