import Image from "next/image";
import Link from "next/link";

export default function Education() {
  const hobbies = [
    { name: "DRAWING", src: "/Happy Fun Sticker by Kennysgifs.gif" },
    { name: "PLAYING VOLLEYBALL", src: "/penguins.gif" },
    { name: "GYM", src: "/GYM.gif" },
    { name: "TRAVELING", src: "/ROADTRIP.gif" },
    { name: "WATCHING MOVIES", src: "/MOVIES.gif" },
    { name: "PLAYING BASKETBALL", src: "/BASKETBALL.gif" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-10 
                    bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 
                    dark:from-zinc-900 dark:to-black transition-all duration-700">

      {/* Title Box */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-8 rounded-2xl shadow-2xl mb-12 
                      w-full max-w-2xl backdrop-blur-md border border-white/20 
                      hover:scale-[1.02] transition-all duration-300">
        <h1 className="text-5xl font-extrabold text-white text-center drop-shadow-lg">
          My Hobbies
        </h1>
        <p className="text-lg text-white text-center mt-3 opacity-90">
          Explore my favorite activities!
        </p>
      </div>

      {/* Hobbies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {hobbies.map((hobby, index) => (
          <div key={index} className="flex flex-col items-center select-none">
            <div className="relative bg-white/20 dark:bg-white/10 p-4 rounded-xl 
                            shadow-2xl backdrop-blur-md border border-white/30
                            hover:scale-110 hover:shadow-3xl hover:rotate-1
                            transition-all duration-300">
              <Image
                src={hobby.src}
                alt={hobby.name}
                width={160}
                height={160}
                className="rounded-xl shadow-xl object-cover"
              />
            </div>

            <p className="mt-4 text-lg font-semibold text-white drop-shadow-md">
              {hobby.name}
            </p>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="mt-12 flex gap-6 flex-wrap justify-center">
        <Link href="/">
          <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white 
                             font-bold rounded-full shadow-xl hover:shadow-2xl 
                             hover:scale-110 transition-all duration-300">
            Home
          </button>
        </Link>

        <Link href="/education">
          <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white 
                             font-bold rounded-full shadow-xl hover:shadow-2xl 
                             hover:scale-110 transition-all duration-300">
            Back to Profile
          </button>
        </Link>
      </div>
    </div>
  );
}
