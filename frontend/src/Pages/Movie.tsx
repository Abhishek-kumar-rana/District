import { useEffect, useState } from 'react'


import { useData } from '../api/api';
import { useParams, NavLink } from 'react-router-dom';


function Movie() {
  

  const [isadmin,setIsadmin]=useState(false);

  const { id } = useParams<{ id: string }>();


  const { data, isLoading, error } = useData(id!);


  
  const checkadmin=()=>{
    
      const currentUser=JSON.parse(localStorage.getItem("currentUser")!);
      if(currentUser?.role=="admin"){
        setIsadmin(true);
      }
      
  }
  useEffect(()=>{
    console.log("haefaef")

      checkadmin();

  },[]);

  if (isLoading) return <h2>Loading...</h2>;

  if (error) return <h2>Something went wrong</h2>;

  return (
    <>
    <div className=" mt-30 md:mt-40 lg:mt-20 mb-100  ">
      
      <div className="h-[20rem] lg:h-[30rem] md:h-[30rem]   relative  gap-4 flex justify-evenly items-center bg-cover content-fit bg-center "
  style={{
    backgroundImage: `url(${data?.data.backgroundImage})`,
  }}>
    <div className="absolute hidden md:block lg:block inset-0 bg-gradient-to-t from-black/90 z to-black/50 text-white"></div>
        <div className=" max-w-7xl flex lg:flex-row md:flex-row justify-evenly gap-3  flex-col mx-auto z-10 p-4">
            <div  className="flex mt-[45rem] md:mt-0 lg:mt-0  flex-col flex-wrap justify-center lg:justify-start gap-4 z-10">
             <div>
                <span className="text-2xl lg:text-5xl text-black md:text-white lg:text-white font-bold">{data?.data.title}</span>
             </div>
             <div className="flex flex-row items-center gap-2">
                <span className="text-black text-sm md:text-white lg:text-white">{data?.data.certificate}</span>
                <span className="mx-2 text-black md:text-white lg:text-white">|</span>
                {data?.data.languages.map((lang: string, index: number) => (
                  <span key={index} className="text-black md:text-white lg:text-white">
                    {lang}
                  </span>
                ))}
             
                <span className="mx-2 text-black md:text-white lg:text-white">|</span>
                <span className="text-black md:text-white lg:text-white">{data?.data.duration}</span>
             </div>

             <div>
                <span className="text-black md:text-white lg:text-white text-[0.85rem]">{data?.data.description}</span>
             </div>

             <div>
                {data?.data.genres.map((genre: string, index: number) => (
                  <span key={index} className="text-black md:text-white lg:text-white md:bg-gray-100/20 lg:bg-gray-100/20 bg-black/30 px-3 py-1 text-[0.875rem] rounded-xl mr-2">
                    {genre}
                  </span>
                ))}
             </div>

             <div>
                <span className=" text-black/50 md:text-white lg:text-white text-[0.8rem] ">Released {data?.data.releaseDate}</span>
             </div>
             

             <div className='flex flex-col gap-7 w-full'>
                <div>
                <span className=' cursor-pointer text-lg border w-full px-6 py-2 bg-white text-black text-center font-bold rounded-lg'>Book Tickets</span>
             </div>
             {isadmin && (
               <NavLink to={`/movies/${id}/edit`}>
                 <span className=' cursor-pointer text-lg w-full  px-9 py-2 bg-red-500 text-white text-center font-bold rounded-lg'>Edit movie</span>
               </NavLink>
             )}
             </div>
             


        </div>
        <div className="flex flex-col gap-4 z-10  hidden md:flex lg:flex">

            <div className="h-[20rem] w-[15rem]  rounded-xl overflow-hidden">
                <img src={data?.data.bannerImage} alt="" />
            </div>


        </div>
        </div>

      </div>

      <div className="relative  mt-90 md:mt-0 lg:mt-0 lg:max-w-7xl max-w-4xl mx-auto md:mx-6 py-10">
                          <p className="text-2xl font-bold pl-1 mb-5">Cast & Crew</p>
      
                          
      
                          <div className="overflow-x-hidden ">
                              <div  className=" flex lg:gap-0 gap-4 overflow-x-auto
                              scroll-smooth scrollbar-hide whitespace-nowrap pl-4 md:pl-0 lg:pl-0
                            [&::-webkit-scrollbar]:hidden 
                            "
      
                                  // style={{
                                  //     transform: `translateX(-${artistIndex * 20}rem)`,
                                  // }}
      
                              >
                                  {data?.data.cast.map((cast:any) => (
                                      <div
                                          key={cast.id}
                                          className="  lg:min-w-[12rem] min-w-[7rem] bg-white flex flex-col items-center justify-center  "
                                      >
                                          <img
                                              src={cast.image} alt={cast.title} className="h-28 lg:30   rounded-full object-cover"
                                          />
      
                                          
                                          <div className=" p-1 flex flex-col items-center justify-center">
                                             
                                              <h2 className=" text-[1rem] font-bold ">{cast.name}
                                              </h2>
                                              <h2 className=" text-[0.8rem] font-semibold ">{cast.role}
                                              </h2>
      
                                            
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          </div>
                          
                      </div>
          
       
      

    </div>
    </>
  )
}

export default Movie