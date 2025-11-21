import Image from "next/image";
import Link from "next/link";

export default function Education() {
  const favFoods = [
    { name: "ADOBO", src: "/adobo.webp" },
    { name: "SINIGANG", src: "/sinigang.webp" },
    { name: "LECHON", src: "/lechon.webp" },
    { name: "PAKBET", src: "/pakbet.jpg" },
    { name: "SISIG", src: "/sisig.webp" },
    { name: "CHICKEN INASAL", src: "/chicken.webp" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-10
                    bg-gradient-to-br from-purple-900 via-indigo-950 to-blue-950 text-white">

      {/* Title */}
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text 
                     bg-gradient-to-r from-yellow-400 via-red-400 to-pink-500 drop-shadow-lg text-center">
        My Favorite Foods
      </h1>
      <p className="text-lg text-white/80 text-center mt-2 mb-10">
        Explore my favorite dishes!
      </p>

      {/* Favorite Foods Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {favFoods.map((food, index) => (
          <div key={index} className="flex flex-col items-center transition-transform duration-300
                                      hover:scale-105">
            <Image
              src={food.src}
              alt={food.name}
              width={160}
              height={160}
              className="rounded-full object-cover shadow-2xl border-4 border-white/20"
            />
            <p className="mt-4 text-xl font-semibold text-yellow-300 drop-shadow-md">
              {food.name}
            </p>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="mt-12 flex gap-6 flex-wrap justify-center">
        <Link href="/">
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 
                             rounded-full shadow-xl transition-all duration-300 hover:scale-105">
            Home
          </button>
        </Link>

        <Link href="/education">
          <button className="bg-gradient-to-r from-purple-800 to-indigo-900 hover:from-purple-700 hover:to-indigo-800 
                             text-white font-bold py-3 px-6 rounded-full shadow-xl transition-all duration-300 hover:scale-105">
            Back to Profile
          </button>
        </Link>
      </div>
    </div>
  );
}
