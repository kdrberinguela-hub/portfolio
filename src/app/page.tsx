import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-8 min-h-screen items-center justify-center font-sans
                    bg-gradient-to-br from-purple-800 to-blue-900 dark:from-black dark:to-purple-950
                    transition-all duration-700">

      {/* Logo */}
      <div className="mb-2 animate-spin-slow hover:scale-110 transition-transform duration-300">
        <Image
          src="/logo.png"
          alt="Logo"
          width={160}
          height={160}
          className="rounded-full shadow-2xl border-4 border-white dark:border-gray-700"
        />
      </div>

      {/* Title */}
      <h1 className="text-5xl font-extrabold tracking-wide text-transparent bg-clip-text
                     bg-gradient-to-r from-red-400 via-purple-400 to-blue-400 drop-shadow-lg
                     animate-pulse">
        STUDENT PROFILE
      </h1>

      {/* Button Group */}
      <div className="flex flex-col gap-4 mt-4 w-72">

        {/* 1 - Profile */}
        <Link
          href="/education"
          className="px-6 py-3 bg-gradient-to-r from-red-400 to-blue-400 text-white rounded-full
                     hover:from-red-500 hover:to-blue-500 hover:scale-110 hover:shadow-2xl
                     transition-all duration-300 ease-in-out text-center font-semibold shadow-md
                     backdrop-blur-md bg-opacity-90 hover:bg-opacity-100"
        >
          PROFILE
        </Link>

        {/* 2 - Hobbies */}
        <Link
          href="/hobbies"
          className="px-6 py-3 bg-gradient-to-r from-red-400 to-blue-400 text-white rounded-full
                     hover:from-red-500 hover:to-blue-500 hover:scale-110 hover:shadow-2xl
                     transition-all duration-300 ease-in-out text-center font-semibold shadow-md
                     backdrop-blur-md bg-opacity-90 hover:bg-opacity-100"
        >
          HOBBIES
        </Link>

        {/* 3 - About */}
        <Link
          href="/contact"
          className="px-6 py-3 bg-gradient-to-r from-red-400 to-blue-400 text-white rounded-full
                     hover:from-red-500 hover:to-blue-500 hover:scale-110 hover:shadow-2xl
                     transition-all duration-300 ease-in-out text-center font-semibold shadow-md
                     backdrop-blur-md bg-opacity-90 hover:bg-opacity-100"
        >
          ABOUT
        </Link>

        {/* 4 - Favorite Food */}
        <Link
          href="/favFood"
          className="px-6 py-3 bg-gradient-to-r from-red-400 to-blue-400 text-white rounded-full
                     hover:from-red-500 hover:to-blue-500 hover:scale-110 hover:shadow-2xl
                     transition-all duration-300 ease-in-out text-center font-semibold shadow-md
                     backdrop-blur-md bg-opacity-90 hover:bg-opacity-100"
        >
          FAVORITE FOOD
        </Link>

        {/* 5 - Favorite Music */}
        <Link
          href="/favMusic"
          className="px-6 py-3 bg-gradient-to-r from-red-400 to-blue-400 text-white rounded-full
                     hover:from-red-500 hover:to-blue-500 hover:scale-110 hover:shadow-2xl
                     transition-all duration-300 ease-in-out text-center font-semibold shadow-md
                     backdrop-blur-md bg-opacity-90 hover:bg-opacity-100"
        >
          FAVORITE MUSIC ARTIST
        </Link>

      </div>
    </div>
  );
}
