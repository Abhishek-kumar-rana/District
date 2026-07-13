// NoNetwork.tsx
import { WifiOff } from "lucide-react";

export default function NoNetwork() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 px-4">
      <div className="text-center">
        <WifiOff className="mx-auto h-20 w-20 text-red-500" />

        <h1 className="mt-4 text-3xl font-bold">
          No Internet Connection
        </h1>

        <p className="mt-3 text-gray-500">
          Booking requires an active internet connection.
        </p>
      </div>
    </div>
  );
}