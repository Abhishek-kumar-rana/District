import { useRef, useState } from "react";
import { parks } from "../../utils/data";

export default function AmusementParks() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [parkIndex, setParkIndex] = useState(0);

  const moveNext = () => {
    carouselRef.current?.scrollBy({
      left: 336,
      behavior: "smooth",
    });

    setParkIndex((prev) => Math.min(prev + 1, parks.length - 3));
  };

  const movePrev = () => {
    carouselRef.current?.scrollBy({
      left: -336,
      behavior: "smooth",
    });

    setParkIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <section className="relative md:w-[90%] md:mx-auto py-10">
      <h2 className="text-2xl font-bold mb-5">
        Amusement Parks
      </h2>

      <button
        onClick={movePrev}
        className={`absolute -left-12 top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg px-4 py-2 ${
          parkIndex === 0 ? "hidden" : ""
        }`}
      >
        {"<"}
      </button>

      <div
        ref={carouselRef}
        className="flex gap-5 overflow-x-auto scroll-smooth whitespace-nowrap [&::-webkit-scrollbar]:hidden"
      >
        {parks.map((park) => (
          <div
            key={park.id}
            className="min-w-[20rem] rounded-2xl border border-gray-200 bg-white"
          >
            <img
              src={park.image}
              alt={park.title}
              className="h-96 w-full rounded-t-2xl object-cover"
            />

            {park.offer && (
              <p className="bg-gradient-to-r from-violet-500 to-violet-400 px-4 py-1 text-sm font-medium text-white">
                {park.offer}
              </p>
            )}

            <div className="space-y-1 p-4">
              <p className="text-xs font-semibold text-[#8f862c]">
                {park.date}
              </p>

              <h3 className="text-lg font-bold">
                {park.title}
              </h3>

              <p className="text-sm text-gray-700">
                {park.subtitle}
              </p>

              <p className="text-sm font-semibold text-gray-500">
                {park.price}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={moveNext}
        className={`absolute -right-10 top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg px-4 py-2 lg:block hidden ${
          parkIndex >= parks.length - 3 ? "hidden" : ""
        }`}
      >
        {">"}
      </button>
    </section>
  );
}