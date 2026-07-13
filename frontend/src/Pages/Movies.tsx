 

import {  useMovies } from '../api/Movies';
import { NavLink } from 'react-router-dom';


function Movies() {
 

  const { data, isLoading, error } = useMovies();

  console.log("Movies Data:", data);

  if (isLoading) return <h2 className='h-screen mt-30 text-4xl'>Loading...</h2>;

  if (error) return <h2 className='h-screen mt-30 text-4xl'>Something went wrong</h2>;

  return (
    <>
    <div className=" mt-30 md:mt-40 lg:mt-20 mb-100  ">
      
       <div className="lg:max-w-7xl mx-auto  pt-8   ">
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
