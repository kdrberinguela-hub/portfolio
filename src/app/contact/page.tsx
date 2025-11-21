import Image from "next/image";
import Link from "next/link";

export default function AboutMe() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-10 
                    bg-gradient-to-br from-purple-800 to-blue-900 
                    dark:from-black dark:to-purple-950 font-sans">

      {/* Title */}
      <h1
        className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text  
                   bg-gradient-to-r from-purple-400 via-pink-400 to-blue-300 
                   drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]
                   animate-pulse text-center mb-4"
      >
        About Me
      </h1>

      {/* Subtitle */}
      <p className="text-lg md:text-xl text-white/90 text-center mb-12 tracking-wide drop-shadow-md">
        Get to know me better!
      </p>

      {/* Content Section */}
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl gap-12">

        {/* Text */}
        <div className="md:w-1/2 text-zinc-200 dark:text-zinc-300 leading-relaxed text-lg md:text-xl">
          <p className="mb-4">
            Hi, I'm <span className="font-semibold text-purple-400 dark:text-purple-300">Kenneth Driethyn R. Beringuela</span>, a 2nd-year BSIT student passionate about technology and learning.
          </p>
          <p className="mb-4">
            I study at <span className="font-semibold text-blue-400">Naga College Foundation</span> and enjoy exploring new fields in Information Technology to grow my skills and knowledge.
          </p>
          <p className="mb-4">
            Outside of academics, I enjoy playing basketball, watching movies, and discovering new places.  
          </p>
          <p>
            I’m excited to connect with like-minded individuals and explore opportunities that challenge me and help me grow.
          </p>
        </div>

        {/* Image */}
        <div className="md:w-1/2 flex justify-center">
          <Image
            src="/Dinosaur Hello Sticker.gif"
            alt="Profile GIF"
            width={256}
            height={256}
            className="rounded-xl hover:scale-110 transition-transform duration-300 drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-12 flex gap-4 flex-wrap justify-center">
        <Link href="/" passHref>
          <button className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-6 rounded-full 
                             shadow-lg hover:shadow-xl transition-all duration-300 text-lg">
            Home
          </button>
        </Link>
        <Link href="/education" passHref>
          <button className="bg-purple-600 hover:bg-purple-800 text-white font-semibold py-2 px-6 rounded-full 
                             shadow-lg hover:shadow-xl transition-all duration-300 text-lg">
            Back to Profile
          </button>
        </Link>
      </div>
    </div>
  );
}
