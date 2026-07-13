import {  useState } from "react";
import { useRef } from "react";

import { movies, parks, artists } from "../utils/data";
import AmusementParks from "./components/AmusementParks";
import Artists from "./components/Artists";

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

                {/* // amusement Park */}

                <AmusementParks/>

                

              {/* // artist in your districts */}
              <Artists/>

               </div>
            </div>


        </>
    );
}
