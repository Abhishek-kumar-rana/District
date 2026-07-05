import { MapPin } from 'lucide-react';
import { Search } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserRound } from 'lucide-react';
import {  useEffect, useState } from 'react';

export default function Header() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate=useNavigate();
    const toggleMenu = () => {

        handleStorageChange;
        setIsMenuOpen(!isMenuOpen);
    }
    const handleSignOut = () => {
        setIsSignedIn(()=>{
            const user = localStorage.getItem("currentUser");

        
            if(user) localStorage.removeItem("currentUser");
            

            return false;
        });
        setIsMenuOpen(false);
        navigate("/");
    }

    const handleStorageChange = () => {
        const user = localStorage.getItem("currentUser");
        setIsSignedIn(!!user);
    };

    const handleLoginClick = ()=>{
        setIsMenuOpen(false);
        navigate("/loginSignUp")


    }

    const handleAddMovieClick = () => {
        setIsMenuOpen(false);
        navigate("/movies/new");
    }


    useEffect(() => {

       const checkadmin=()=>{
    
      const currentUser=JSON.parse(localStorage.getItem("currentUser")!);
      if(currentUser?.role=="admin"){
        setIsAdmin(true);
      }
      
  }
 
        // Check once on mount
        checkadmin();
         
        const storedUser = localStorage.getItem("currentUser");
        setIsSignedIn(!!storedUser);
 
         
         
 
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);
    return (
        <header className=" bg-[#fff] text-black py-4  fixed top-0 left-0 right-0 z-50 shadow-md  transition-all duration-300 ease-in-out">
            <div className=" mx-auto text-center">
                <div className="flex flex-row justify-between items-center px-4">
                    <div className="flex flex-row items-center gap-6 ">
                        <div className="flex flex-row items-center gap-3">
                            <div className=" md:flex lg:flex hidden flex-col ">
                                <h1 className="text-3xl font-bold">District</h1>
                                <span className=" font-bold text-[10px] ">BY ZOMATO</span>
                            </div>

                            <div >
                                <span className=' hidden md:block lg:block w-[1px] h-[30px] border-l border-gray-300'></span>
                            </div>

                            <div>
                                <div className="flex flex-row items-center gap-2 min-w-[200px]">
                                    <div>
                                        <MapPin className="w-6 h-6 text-[#6444E4]" />

                                    </div>
                                    <div className="flex flex-col items-start">
                                        <span className="font-bold">Gurugram</span>
                                        <span className="text-sm text-gray-500">Haryana</span>
                                    </div>
                                </div>

                            </div>
                        </div>


                        <div className='lg:flex flex-row gap-1 items-center whitespace-nowrap   hidden '>


                            <NavLink to="/" className={({ isActive }) =>
                                `font-semibold px-4 py-1.5 ${isActive
                                    ? "px-4 py-1.5 rounded-2xl bg-[#eae5ff] text-blue-900"
                                    : "text-gray-500 "
                                }`
                            }>
                                For You
                            </NavLink>

                            <NavLink to="/dining" className={({ isActive }) =>
                                ` font-semibold px-4 py-1.5 ${isActive
                                    ? "px-4 py-1.5 rounded-2xl bg-red-600 text-white"
                                    : "text-gray-500 "
                                }`
                            }>
                                Dining
                            </NavLink>

                            <NavLink to="/movies" className={({ isActive }) =>
                                `font-semibold px-4 py-1.5 ${isActive
                                    ? "px-4 py-1.5 rounded-2xl bg-yellow-200 text-black"
                                    : "text-gray-500 "
                                }`
                            }>
                                Movies
                            </NavLink>
                            <NavLink to="/events" className={({ isActive }) =>
                                `font-semibold px-4 py-1.5 ${isActive
                                    ? "px-4 py-1.5 rounded-2xl bg-green-200 text-black"
                                    : "text-gray-500 "
                                }`
                            }>
                                Events
                            </NavLink>
                            <NavLink to="/stores" className={({ isActive }) =>
                                `font-semibold px-4 py-1.5 ${isActive
                                    ? " rounded-2xl bg-blue-200 text-black"
                                    : "text-gray-500 "
                                }`
                            }>
                                Stores
                            </NavLink>

                            <NavLink to="/activity" className={({ isActive }) =>
                                `font-semibold px-4 py-1.5 ${isActive
                                    ? "px-4 py-1.5 rounded-2xl bg-purple-200 text-black"
                                    : "text-gray-500 "
                                }`
                            }>
                                Activity
                            </NavLink>
                            <NavLink to="/play" className={({ isActive }) =>
                                `font-semibold px-4 py-1.5 ${isActive
                                    ? "px-4 py-1.5 rounded-2xl bg-pink-200 text-black"
                                    : "text-gray-500 "
                                }`
                            }>
                                Play
                            </NavLink>





                        </div>



                    </div>


                    <div>
                        <div  className="relative flex flex-row items-center gap-6   ">
                            <Search className="w-5  hidden   lg:block h-5 text-[#6444E4] font-bold" />
                            <div onClick={toggleMenu} className=" w-[40px] h-[40px] bg-gray-300 rounded-full flex items-center justify-center">
                                <UserRound className="p-1 text-white" />
                            </div>
                            {isMenuOpen && !isSignedIn && (
                                <div onClick={handleLoginClick} className=" absolute mt-12 px-4 py-2 border rounded-lg bg-white shadow-md right-0 top-0  z-20 whitespace-nowrap ">
                                    <button className="bg-[#6444E4] text-white px-4 py-1.5 rounded-lg font-semibold  lg:block">Sign In</button>
                                </div>
                            )}
                            {isMenuOpen && isSignedIn && (
                                <div  className="z-20 absolute mt-12 flex flex-col gap-2 px-4 py-2 border rounded-lg bg-white shadow-md right-0 top-0  whitespace-nowrap ">
                                    <button onClick={handleSignOut} className="bg-red-600 text-white px-4 py-1.5 rounded-lg font-semibold  lg:block">Sign Out</button>
                                     {isAdmin && (
                                        <button
                                            onClick={handleAddMovieClick}
                                            className="bg-[#6444E4] text-white px-4 py-1.5 rounded-lg font-semibold  lg:block"
                                        >
                                            Add Movie
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
                <div className="relative flex flex-row justify-start items-center w-full mt-4 px-4  lg:hidden">
                    <Search className="w-5 left-7 absolute  h-5 text-[#6444E4] font-bold" />
                    <input type="text" placeholder="Search for events, movies and restaurants" className="bg-gray-200 w-full text-gray-500 placeholder:text-gray-500 focus:outline-none bg-transparent border px-10 rounded-lg py-1" />
                </div>

                <div className='flex flex-row md:gap-4 gap-3 justify-evenly w-full lg:text-sm   text-[1rem] overflow-x-auto  items-center pt-4 pr-0 lg:hidden [&::-webkit-scrollbar]:hidden whitespace-nowrap '>

                    <NavLink to="/" className={({ isActive }) =>
                        `font-semibold px-4 py-1.5 ${isActive
                            ? "px-4 py-1.5 rounded-2xl bg-[#eae5ff] text-blue-900"
                            : "text-gray-500 "
                        }`
                    }>
                        For You
                    </NavLink>

                    <NavLink to="/dining" className={({ isActive }) =>
                        ` font-semibold px-4 py-1.5 ${isActive
                            ? "px-4 py-1.5 rounded-2xl bg-red-600 text-white"
                            : "text-gray-500 "
                        }`
                    }>
                        Dining
                    </NavLink>

                    <NavLink to="/movies" className={({ isActive }) =>
                        `font-semibold px-4 py-1.5 ${isActive
                            ? "px-4 py-1.5 rounded-2xl bg-yellow-200 text-black"
                            : "text-gray-500 "
                        }`
                    }>
                        Movies
                    </NavLink>
                    <NavLink to="/events" className={({ isActive }) =>
                        `font-semibold px-4 py-1.5 ${isActive
                            ? "px-4 py-1.5 rounded-2xl bg-green-200 text-black"
                            : "text-gray-500 "
                        }`
                    }>
                        Events
                    </NavLink>
                    <NavLink to="/stores" className={({ isActive }) =>
                        `font-semibold px-4 py-1.5 ${isActive
                            ? " rounded-2xl bg-blue-200 text-black"
                            : "text-gray-500 "
                        }`
                    }>
                        Stores
                    </NavLink>

                    <NavLink to="/activity" className={({ isActive }) =>
                        `font-semibold px-4 py-1.5 ${isActive
                            ? "px-4 py-1.5 rounded-2xl bg-purple-200 text-black"
                            : "text-gray-500 "
                        }`
                    }>
                        Activity
                    </NavLink>
                    <NavLink to="/play" className={({ isActive }) =>
                        `font-semibold px-4 py-1.5 ${isActive
                            ? "px-4 py-1.5 rounded-2xl bg-pink-200 text-black"
                            : "text-gray-500 "
                        }`
                    }>
                        Play
                    </NavLink>






                </div>

            </div>
        </header>
    );
}
