import Image from "next/image";
import Link from "next/link";

export default function FavMusic() {
  const favMusic = [
    { name: "HEV-ABI", src: "/gev.jpg" },
    { name: "SHANTIDOPE", src: "/shanti.webp" },
    { name: "HELLMERRY", src: "/hellm.jpg" },
    { name: "DANIEL CAESAR", src: "/daniel.webp" },
    { name: "NATE MAN", src: "/nateman.png" },
    { name: "REALEST CRAM", src: "/cram].webp" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-10
                    bg-gradient-to-br from-purple-900 via-indigo-950 to-blue-950 text-white">

      {/* Title */}
      <div className="flex items-center justify-center mb-10 gap-4">
        <Image
          src="/spotify.gif"
          alt="Spotify Logo"
          width={100}
          height={100}
          className="rounded-full shadow-xl"
        />
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text
                         bg-gradient-to-r from-pink-400 via-red-400 to-yellow-400 drop-shadow-lg text-center">
            My Favorite Music Artist
          </h1>
          <p className="text-lg text-white/80 text-center mt-2">
            Explore my favorite genres!
          </p>
        </div>
      </div>

      {/* Music Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {favMusic.map((music, index) => (
          <div key={index} className="flex flex-col items-center transition-transform duration-300 hover:scale-105">
            <Image
              src={music.src}
              alt={music.name}
              width={180}  // uniform size
              height={180} // uniform size
              className="rounded-full object-cover shadow-2xl border-4 border-white/20"
            />
            <p className="mt-4 text-xl font-semibold text-pink-400 drop-shadow-md text-center">
              {music.name}
            </p>
            <div className="flex justify-center mt-2">
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce mx-1"></div>
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce mx-1" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce mx-1" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Home Button */}
      <Link href="/">
        <button className="mt-12 bg-pink-400 hover:bg-pink-500 text-black font-bold py-3 px-6 
                           rounded-full shadow-xl transition-all duration-300 hover:scale-105">
          Home
        </button>
      </Link>
    </div>
  );
}
