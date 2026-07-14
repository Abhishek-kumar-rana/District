import { CalendarDays, Clock3, Ticket, MapPin, IndianRupee, Armchair } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { UseBookings } from "../api/userApi";
import { useUserBookings } from "../api/seat";

const Bookings = () => {
  const { getCurrentUser } = useAuth();

  const user = getCurrentUser();

  const { data, isLoading, error } = useUserBookings(user?.id!);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl font-semibold">Loading bookings...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-2xl font-semibold">
          Failed to load bookings.
        </p>
      </div>
    );

  return (
   

<div className="min-h-screen bg-gradient-to-b from-violet-200 via-white to-white pt-36 pb-16">
  <div className="mx-auto max-w-6xl px-4">

    <div className="mb-8 mt-10 lg:mt-0 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <p className="text-gray-500">
          {data?.count} Booking{data?.count !== 1 ? "s" : ""}
        </p>
      </div>
    </div>

    {data?.data.length === 0 ? (
      <div className="rounded-2xl border bg-white p-10 text-center shadow">
        <Ticket className="mx-auto h-14 w-14 text-violet-500" />
        <h2 className="mt-4 text-2xl font-bold">
          No Bookings Yet
        </h2>
        <p className="mt-2 text-gray-500">
          Book your first movie to see it here.
        </p>
      </div>
    ) : (
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

        {data?.data.map((booking: any) => {

          const bookedDate = new Date(booking.bookedAt);

          return (
            <div
              key={booking.id}
              className="overflow-hidden rounded-2xl border  bg-white shadow-md transition   "
            >

              {/* Header */}

              <div className="  p-5 text-black bg-gray-200">

                <h2 className="line-clamp-1 text-xl font-bold">
                  {booking.movieTitle}
                </h2>

                <p className="mt-1 text-sm text-violet-900">
                  Booking #{booking.id}
                </p>

              </div>

              {/* Body */}

              <div className="space-y-5 p-5">

                <div className="flex items-center justify-between">

                  <span className="flex items-center gap-2 text-gray-500">
                    <IndianRupee size={18} />
                    Total Amount
                  </span>

                  <span className="font-bold text-green-600">
                    ₹ {booking.totalAmount}
                  </span>

                </div>

                <div>

                  <div className="mb-2 flex items-center gap-2 text-gray-500">

                    <Armchair size={18} />

                    Seats

                  </div>

                  <div className="flex flex-wrap gap-2">

                    {booking.seatIds.map((seat: string) => (

                      <span
                        key={seat}
                        className="rounded-3xl border px-3 py-1 text-sm font-semibold text-violet-900"
                      >
                        {seat}
                      </span>

                    ))}

                  </div>

                </div>

                <div className="flex items-start gap-2 text-gray-500">

                  <CalendarDays size={18} className="mt-0.5" />

                  <div>

                    <p className="font-medium">
                      {bookedDate.toLocaleDateString()}
                    </p>

                    <p className="text-sm">
                      {bookedDate.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>

                  </div>

                </div>

              </div>

              {/* Footer */}

              <div className="border-t bg-gray-50 px-5 py-3">

                <span className="text-xs text-gray-500">
                  Name: {user?.name}
                </span>
                <br />
                <span className="text-xs text-gray-500">
                  Email {user?.email}
                </span>

              </div>

            </div>
          );
        })}
      </div>
    )}
  </div>
</div>
  );
};

export default Bookings;