import AmusementParks from "./components/AmusementParks";
import Artists from "./components/Artists";

const Events = () => {
  return (
    <div
      className='min-h-screen w-full bg-[url("https://wallpaperaccess.com/full/1092795.jpg")] bg-cover bg-center bg-fixed'
    >
      {/* Dark overlay */}
      <div className="min-h-screen bg-black/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 pt-32 pb-16 md:px-8">
          
          <h1
            className="text-centerfont-extraboldtext-whitetext-xl mt-20 md:text-2xl lg:text-3xl leading-tight
            "
          >
            Events will be visible soon...<br />Stay Tuned!
          </h1>

          <div className="mt-16 w-full">
            <AmusementParks />
          </div>

          <div className="mt-16 w-full">
            <Artists />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;