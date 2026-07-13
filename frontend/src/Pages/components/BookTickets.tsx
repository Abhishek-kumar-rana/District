import { useParams } from "react-router-dom";
import { useBookSeats, useHoldSeats, useReleaseSeats, useSeats } from "../../api/seat";
import { useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { twMerge } from "tailwind-merge";
import NoNetwork from "./NoNetwork";
 
export const BookTickets = () => {
    const { id } = useParams<{ id: string }>();

    const { getCurrentUser } = useAuth();

    const seatTotal = useSeats(id!);
    const holdMutation = useHoldSeats(id!);
    const bookseats=useBookSeats(id!);
    const releaseSeats=useReleaseSeats(id!);
    const [isopen,setIsOpen]= useState(false);
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const scrollRef=useRef<HTMLDivElement|null>(null);
    if (seatTotal.isLoading) return <div>Loading seats...</div>;
    if (seatTotal.isError) return <div>Failed to load seats.</div>;

    const seats = seatTotal.data?.data.seats ?? [];

    const statusColor: Record<string, string> = {
        available: "bg-sky-100 ",
        held: "bg-yellow-400",
        booked: "bg-gray-200  cursor-none border-none   text-white",
    };

    const handleSeatSelect = (seatId: string, status: string) => {
        if (status !== "available") return;

        setSelectedSeats((prev) => {
            if (prev.includes(seatId)) {
                return prev.filter((id) => id !== seatId);
            }

            return [...prev, seatId];
        });
    };

    const handleHold = () => {
        const user = getCurrentUser();

        if (!user) {
            alert("Please login first.");
            return;
        }

        if (selectedSeats.length === 0) {
            alert("Please select at least one seat.");
            return;
        }
        const unavailableSeats = seats.filter((seat) =>(seat.status === "held" && selectedSeats.includes(seat.seatId) 
        ));

                    //B3 B7       
        console.log(selectedSeats,seats,unavailableSeats)

        if (unavailableSeats.length > 0) {
        alert(
            `These seats are hold by other for payment: ${unavailableSeats.map((s) => s.seatId).join(", ")}`
        );
        window.location.reload();
        return;
    }

    scrollRef?.current?.scrollTo({
      behavior: "smooth"
    });
        holdMutation.mutate(
            {
                seatIds: selectedSeats,
                userId: user.id,
            },
            {
                onSuccess: (data) => {
                    console.log("Seats held successfully", data);
                    // setSelectedSeats([]);
                    setIsOpen(true);
                    
                },
                onError: (error) => {
                    console.error(error);
                    alert("Failed to hold seats.");
                },
            }
        );
    };

    const handlebooking=()=>{
            const user=getCurrentUser();
             if (!user) {
            alert("Please login first.");
            return;
        }

        if (selectedSeats.length === 0) {
            alert("Please select at least one seat.");
            return;
        }
            bookseats.mutate(
            {
                seatIds: selectedSeats,
                userId: user.id,
            },
            {
                onSuccess: (data) => {
                    console.log("Seats held successfully", data);
                    setSelectedSeats([]);
                    setIsOpen(false);
                    
                },
                onError: (error) => {
                    console.error(error);
                    alert("Failed to hold seats.");
                },
            })
    }

    const handleReleaseSeat=()=>{
         const user=getCurrentUser();
             if (!user) {
            alert("Please login first.");
            return;
        }

        if (selectedSeats.length === 0) {
            alert("Please select at least one seat.");
            return;
        }
            releaseSeats.mutate(
            {
                seatIds: selectedSeats,
                userId: user.id,
            },
            {
                onSuccess: (data) => {
                    console.log("Seats released successfully", data);
                    setSelectedSeats([]);
                    setIsOpen(false);
                    
                },
                onError: (error) => {
                    console.error(error);
                    alert("Failed to hold seats.");
                },
            })
    }

     if (!navigator.onLine) {
    return <NoNetwork />;
  }

    return (
        <div className=" mt-45 lg:mt-20  ">
            
            <div>
                {/* //----------payment-------- */}
                {isopen ? (
                    <div ref={scrollRef} className="flex justify-center items-center ">
                        <div className="bg-[url('https://b.zmtcdn.com/data/o2_assets/cff25f32c0fd4d4dadae03014b9c1bed1736642601.png')] bg-cover bg-center mb-40 bg-gray-400 rounded border shadow-lg flex flex-col max-w-xl md:w-4xl lg:w-4xl mt-10 p-2 md:p-6 lg:p-3 rounded-xl">
                        <div >
                            <div  className="text-white border-b mb-4 flex justify-center items-center ">
                                <div className=" flex  flex-col justify-center items-center ">
                                <span className="text-3xl font-bold">District</span>
                                <span className=" font-bold text-[0.6rem] pb-2 ">BY ZOMATO</span>
                            </div> </div>
                            <div className="flex flex-wrap items-center">
                                <span className="text-white">Selected seats: </span>
                            {selectedSeats.map((seat,index)=><span key={index} className="text-white p-1">{seat}</span>)}
                            </div>
                        </div>
                         <p className=" p-3 text-gray-100 ">Total fare: ₹{selectedSeats.length*200}</p>
                         <p  className="text-gray-300 text-sm ">Select payment options</p>
                        <div className=" flex flex-col lg:flex-row gap-1 cursor-pointer">
                           
                            <p className=" p-3 bg-yellow-300">Pay using UPI</p>
                            <p className="p-3 bg-sky-400">Pay using bank</p>
                            <p className="p-3 bg-orange-500">Credit card & Debit card</p>
                        </div>
                        <div className=" mt-10 mb-10 flex gap-1">
                            <span onClick={handlebooking} className="p-3 rounded-xl text-white whitespace-nowrap border cursor-pointer">Confirm Booking</span>
                            <span onClick={handleReleaseSeat} className="p-3 rounded-xl text-white whitespace-nowrap border cursor-pointer">Cancel Booking</span>
                        </div>
                    </div>
                    </div>
                ):
                
                <>
                {/* // choose  seats */}
                <div className="    p-4 flex flex-col justify-center ">
                <div>
                    <h2 className="text-2xl font-bold">Select seats</h2>
                </div>

                {/* <p>You are booking movie {id}</p> */}
                 
                        

                        <div className=" w-full flex flex-row gap-4 mb-2 mt-2">
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-[0.25rem] bg-sky-100 border border-sky-400"></div>
                                <span className="text-sm">Available</span>
                            </div>

                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-[0.25rem] bg-yellow-400"></div>
                                <span className="text-sm">Hold</span>
                            </div>

                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-[0.25rem] bg-gray-200"></div>
                                <span className="text-sm">Booked</span>
                            </div>
                        </div>
                   


                <div className="overflow-x-scroll lg:[&::-webkit-scrollbar]:hidden bg-gray-100 p-4">
                
                <div className="min-w-[640px] w-fit mx-auto grid grid-cols-10 gap-2">
                        {seats.map((seat) => {
                            const isSelected = selectedSeats.includes(seat.seatId);

                            return (
                                <div
                                    key={seat.seatId}
                                    onClick={() =>
                                        handleSeatSelect(seat.seatId, seat.status)
                                    }
                                    className={twMerge(`
                                            
                                                h-12 w-12
                                                flex justify-center items-center
                                            rounded-xl
                                            text-center
                                            border
                                            border-sky-400
                                            transition-all
                                            cursor-pointer
                                            hover:border-sky-500
                                          
                  
                                         `,` ${isSelected
                                            ? "border-3 border border-sky-600 bg-sky-400"
                                            : statusColor[seat.status] 
                                        }
                                             ${seat.status === "available"
                                            ? "hover:border-sky-500  hover:border-3 "
                                            : "cursor-not-allowed"
                                        }`)}
                                >
                                    <p >
                                        {seat.seatId}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    <div className="w-full flex flex-row justify-center mt-10">

                        <div className="" />

                        <img src={"https://cdn.district.in/movies-web/_next/static/media/screen-img-light.b7b18ffd.png"} alt="Screen" className=" w-[12rem] lg:w-[25rem] md:w-[20rem]" />

                    </div>
                </div>

                <div className="mt-2  flex flex-row justify-between">
                    <div>
                        
                        <div className="flex gap-2 flex-wrap ">
                        <h3 className="font-semibold">Selected Seats</h3>
                        

                        {selectedSeats.length === 0 ? (
                            <p>No seats selected</p>
                        ) : (
                               <> {selectedSeats.map((seat) => (
                                    <span
                                        key={seat}
                                        className="bg-green-500 text-white px-3 py-1 rounded-full"
                                    >
                                        {seat}
                                    </span>
                                ))}
                                </>
                        )}
                            </div>

                        <div></div>

                        {selectedSeats.length ? <button
                            onClick={handleHold}
                            disabled={
                                selectedSeats.length === 0 || holdMutation.isPending
                            }
                            className="mt-1 px-6 py-3 rounded-xl bg-green-500 text-white disabled:bg-gray-400"
                        >
                            {holdMutation.isPending
                                ? "Holding Seats..."
                                : selectedSeats.length? "Proceed":"Select seat"}
                        </button>:<div className="mt-1 px-6 py-7 "></div>}
                    </div>

                    


                    


                </div >
            </div >
                </>
            }
            </div>
        </div >
    );
};