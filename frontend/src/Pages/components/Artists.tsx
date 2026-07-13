import { useRef, useState } from "react";
import { artists } from "../../utils/data";

export default function Artists() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [artistIndex, setArtistIndex] = useState(0);

  const moveNext = () => {
    carouselRef.current?.scrollBy({
      left: 336,
      behavior: "smooth",
    });

    setArtistIndex((prev) => Math.min(prev + 1, artists.length - 1));
  };

  const movePrev = () => {
    carouselRef.current?.scrollBy({
      left: -336,
      behavior: "smooth",
    });

    setArtistIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <section className="relative md:w-[90%] md:mx-auto py-10">
      <h2 className="text-2xl font-bold mb-5">
        Artists in your District
      </h2>

      <button
        onClick={movePrev}
        className={`absolute -left-12 top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg px-4 py-2 ${
          artistIndex === 0 ? "hidden" : ""
        }`}
      >
        {"<"}
      </button>

      <div
        ref={carouselRef}
        className="flex gap-4 overflow-x-auto scroll-smooth whitespace-nowrap [&::-webkit-scrollbar]:hidden"
      >
        {artists.map((artist) => (
          <div
            key={artist.id}
            className="min-w-[5rem] md:min-w-[12rem] flex flex-col items-center bg-transparent"
          >
            <img
              src={artist.image}
              alt={artist.title}
              className="h-20 md:h-40 rounded-full object-cover"
            />

            <h3 className="mt-2 text-center text-sm md:text-lg font-bold">
              {artist.title}
            </h3>
          </div>
        ))}
      </div>

      <button
        onClick={moveNext}
        className={`absolute -right-10 top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg px-4 py-2 lg:block hidden ${
          artistIndex >= artists.length - 1 ? "hidden" : ""
        }`}
      >
        {">"}
      </button>
    </section>
  );
}