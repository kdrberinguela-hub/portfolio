import Image from "next/image";
import Link from "next/link";

export default function Education() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-10
                    bg-gradient-to-br from-blue-700 via-purple-800 to-indigo-900
                    dark:from-zinc-900 dark:to-black transition-all duration-700">

      {/* Title with Logo */}
      <div className="flex items-center justify-center mb-8">
        <div className="animate-spin-slow mr-4 hover:scale-110 transition duration-300">
          <Image
            src="/logo.png"
            alt="Logo"
            width={85}
            height={85}
            className="rounded-full shadow-lg ring-4 ring-white dark:ring-zinc-700"
          />
        </div>

        <h1 className="text-4xl font-extrabold tracking-wide text-transparent bg-clip-text
                       bg-gradient-to-r from-red-400 via-purple-400 to-blue-400 drop-shadow-xl">
          STUDENT PROFILE
        </h1>
      </div>

      {/* Profile Card */}
      <div className="bg-white/90 dark:bg-zinc-900/90 shadow-2xl p-10 rounded-3xl w-full max-w-xl
                      text-center border border-zinc-200 dark:border-zinc-800 backdrop-blur-md
                      hover:scale-[1.02] hover:shadow-3xl transition-all duration-500">

        {/* Photo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/beringuela.jpg.jpg"
            width={210}
            height={210}
            alt="Profile Photo"
            className="rounded-full shadow-xl object-cover ring-4 ring-blue-500
                       hover:ring-blue-400 transition-all duration-300"
          />
        </div>

        {/* Name */}
        <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white drop-shadow-lg">
          Kenneth Driethyn R. Beringuela
        </h2>

        {/* Info */}
        <div className="text-lg space-y-3 mt-4">
          <InfoItem label="Course & Year" value="BSIT – Computer Studies, 2nd Year" />
          <InfoItem label="Contact Number" value="0992-228-7182" />
          <InfoItem label="Emergency Contact" value="0906-190-5667" />
          <InfoItem label="Date of Birth" value="March 06, 2006" />
        </div>

        {/* Navigation Buttons inside profile card */}
        <div className="mt-6 flex flex-col gap-3 w-full">
          <Link
            href="/favFood"
            className="px-4 py-2 bg-gradient-to-r from-red-400 to-blue-400 text-white rounded-full
                       hover:from-red-500 hover:to-blue-500 hover:scale-105 hover:shadow-lg
                       transition-all duration-300 text-center font-semibold text-sm"
          >
            FAVORITE FOOD
          </Link>

          <Link
            href="/favMusic"
            className="px-4 py-2 bg-gradient-to-r from-red-400 to-blue-400 text-white rounded-full
                       hover:from-red-500 hover:to-blue-500 hover:scale-105 hover:shadow-lg
                       transition-all duration-300 text-center font-semibold text-sm"
          >
            FAVORITE MUSIC ARTIST
          </Link>

          <Link
            href="/hobbies"
            className="px-4 py-2 bg-gradient-to-r from-red-400 to-blue-400 text-white rounded-full
                       hover:from-red-500 hover:to-blue-500 hover:scale-105 hover:shadow-lg
                       transition-all duration-300 text-center font-semibold text-sm"
          >
            HOBBIES
          </Link>

          <Link
            href="/"
            className="px-4 py-2 bg-gradient-to-r from-red-400 to-blue-400 text-white rounded-full
                       hover:from-red-500 hover:to-blue-500 hover:scale-105 hover:shadow-lg
                       transition-all duration-300 text-center font-semibold text-sm"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

// Info item component
function InfoItem({ label, value }) {
  return (
    <p className="flex justify-between items-center bg-zinc-100/80 dark:bg-zinc-800/80 px-4 py-2 rounded-xl shadow-inner">
      <strong className="text-blue-600 dark:text-blue-400">{label}:</strong>
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-purple-400 to-blue-400 font-semibold">
        {value}
      </span>
    </p>
  );
}
