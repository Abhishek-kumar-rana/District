import {  useState } from "react";
import { useRef } from "react";

import { movies, parks, artists } from "../utils/data";

export default function Home() {

const carouselRef = useRef<HTMLDivElement>(null);
const carouselRef2 = useRef<HTMLDivElement>(null);

   

    const [parkIndex, setParkIndex] = useState(0);
    const [artistIndex, setArtistIndex] = useState(0);

 

    const MoveNext = () => {
  carouselRef.current?.scrollBy({
    left: 336,
    behavior: "smooth",
    
  });
  setParkIndex((prevIndex) => Math.min(prevIndex + 1, parks.length - 3))
};

const MovePrev = () => {
  carouselRef.current?.scrollBy({
    left: -336,
    behavior: "smooth",
  });
    setParkIndex((prevIndex) => Math.max(prevIndex - 1, 0))
};

  const MoveNext2 = () => {
  carouselRef2.current?.scrollBy({
    left: 336,
    behavior: "smooth",
    
  });
  setArtistIndex((prevIndex) => Math.min(prevIndex + 1, artists.length - 1))
};

const MovePrev2 = () => {
  carouselRef2.current?.scrollBy({
    left: -336,
    behavior: "smooth",
  });
    setArtistIndex((prevIndex) => Math.max(prevIndex - 1, 0))
};

    return (
        <>

            <div className="  bg-gradient-to-b from-[#eae5ff] via-white to-white">
                

               <div className=" lg:pt-20  pt-40 ">
                 <div className="md:w-[90%]  md:mx-auto   pt-8   ">
                    <div  >
                        <p className="text-2xl pl-2 font-bold">Top Hindi movies near you</p>
                    </div>
                    
                        <div className="flex gap-3 md:gap-6 flex-wrap justify-center md:justify-center sm:justify-evenly lg:justify-start   items-center mt-6  [&::-webkit-scrollbar]:hidden">
                            {movies.map((movie) => (
                            <div key={movie.id} className="lg:w-[13rem] lg:h-[23rem] h-[20rem] w-[9rem]  md:w-[13rem] bg-white rounded-xl  border border-gray-200 overflow-hidden">
                                <img src={movie.image} alt={movie.title} className="w-full h-3/4 object-cover" />
                                <div className=" p-2">
                                    <span className="text-[12px] lg:text-[16px] font-bold">{movie.title}</span>
                                    <div>
                                        <span className="text-gray-600 font-semibold text-[12px]">{movie.grade}</span>
                                        <span className="text-gray-600 ml-2">|</span>
                                        <span className="text-gray-600 ml-2 font-semibold text-[12px]">{movie.language}</span>

                                    </div>
                                </div>
                            </div>
                        ))}
                        </div>
                    

                </div>

                <div  className="relative  md:w-[90%]  md:mx-auto    py-10">
                    <p className="text-2xl font-bold mb-5">Amusement Parks</p>

                    <button
                        onClick={ MovePrev}
                        className={`absolute -left-12 top-1/2 z-20 ${parkIndex === 0 ? 'hidden' : ''} -translate-y-1/2 py-2 px-4 rounded-full bg-white p-3 shadow-lg hover:bg-gray-100`}
                    >
                        <span className="text-xl font-bold">{`<`}</span>
                    </button>

                    <div className="   ">
                        <div ref={carouselRef} className=" flex gap-5 [&::-webkit-scrollbar]:hidden 
                            overflow-x-auto scroll-smooth scrollbar-hide whitespace-nowrap
                     
                      "

                            // style={{
                            //     transform: `translateX(-${parkIndex * 20}rem)`,
                            // }}

                        >
                            {parks.map((park) => (
                                <div
                                    key={park.id}
                                    className="min-w-[20rem]   rounded-2xl border border-gray-200 bg-white   "
                                >
                                    <img
                                        src={park.image} alt={park.title} className="h-100 w-full  rounded-t-2xl object-cover"
                                    />

                                    {park.offer && (
                                        <p className="bg-gradient-to-r from-violet-500 to-violet-400 px-4 py-1 text-sm font-medium text-white">{park.offer}
                                        </p>
                                    )}

                                    <div className="space-y-1 p-4">
                                        <p className="text-xs font-semibold text-[#8f862c]">{park.date}
                                        </p>

                                        <h2 className=" text-[1rem] font-bold ">{park.title}
                                        </h2>

                                        <p className="text-[0.8rem] font-medium text-gray-700">{park.subtitle}
                                        </p>

                                        <p className="text-[0.8rem] font-semibold text-gray-500">{park.price}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={MoveNext}
                        className={`absolute -right-10 top-1/2 z-20 ${parkIndex >= parks.length - 3 ? 'none' : ''} -translate-y-1/2  rounded-full bg-white lg:block hidden py-2 px-4 shadow-lg hover:bg-gray-100`}
                    >
                        <span className="text-xl font-bold">{`>`}</span>
                    </button>
                </div>

                

                <div className="relative    md:w-[90%]  md:mx-auto  py-10">
                    <p className="text-2xl font-bold pl-4 mb-5">Artists in your District</p>

                    <button
                        onClick={MovePrev2}
                        className={`absolute -left-12 top-1/2 z-20 ${artistIndex === 0 ? 'hidden' : ''} -translate-y-1/2 py-2 px-4 rounded-full bg-white p-3 shadow-lg hover:bg-gray-100`}
                    >
                        <span className="text-xl font-bold">{`<`}</span>
                    </button>

                    <div className="overflow-x-hidden ">
                        <div ref={carouselRef2} className=" flex lg:gap-0 gap-4 overflow-x-auto
                        scroll-smooth scrollbar-hide whitespace-nowrap sm:pl-4 
                      [&::-webkit-scrollbar]:hidden 
                      "

                            // style={{
                            //     transform: `translateX(-${artistIndex * 20}rem)`,
                            // }}

                        >
                            {artists.map((artist) => (
                                <div
                                    key={artist.id}
                                    className=" min-w-[5rem]  md:min-w-[12rem] bg-white flex flex-col items-center justify-center  "
                                >
                                    <img
                                        src={artist.image} alt={artist.title} className="md:h-40 h-20 lg:30   rounded-full object-cover"
                                    />

                                    
                                    <div className=" p-1 flex flex-col items-center justify-center">
                                       
                                        <h2 className=" text-[0.7rem] md:text-[1rem] font-bold ">{artist.title}
                                        </h2>

                                      
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={MoveNext2}
                        className={`absolute -right-10 top-1/2 z-20 ${artistIndex >= artists.length - 1 ? 'none' : ''} -translate-y-1/2  rounded-full bg-white lg:block hidden py-2 px-4 shadow-lg hover:bg-gray-100`}
                    >
                        <span className="text-xl font-bold">{`>`}</span>
                    </button>
                </div>

               </div>
            </div>


        </>
    );
}
