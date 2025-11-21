export default function Education() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-10 
                    bg-gradient-to-br from-purple-800 to-blue-900 
                    dark:from-black dark:to-purple-950">

      {/* Title */}
      <h1
        className="text-5xl font-extrabold text-transparent bg-clip-text 
                   bg-gradient-to-r from-purple-400 to-blue-300 
                   drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]
                   animate-pulse text-center"
      >
        About Me
      </h1>

      <p className="text-lg text-white text-center mt-3 mb-10 opacity-90 tracking-wide drop-shadow-md">
        Get to know me better!
      </p>

      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl gap-8">
        
        {/* Text Section */}
        <div className="md:w-1/2 text-zinc-200 dark:text-zinc-300 leading-relaxed text-lg">
          <p className="mb-4">
            Hi, I'm <span className="font-semibold text-purple-400 dark:text-purple-300">
              Kenneth Driethyn R. Beringuela
            </span>, a 2nd-year BSIT student with a strong passion for technology.
          </p>
          <p className="mb-4">
            I'm currently studying at Naga College Foundation, where I'm continuing 
            to explore and grow in the field of Information Technology.
          </p>
          <p className="mb-4">
            In my free time, I enjoy playing basketball, watching movies, and discovering new places.
          </p>
          <p>
            I'm excited to connect with like-minded individuals and discover new opportunities 
            along the way.
          </p>
        </div>

        {/* Image */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src="/Dinosaur Hello Sticker.gif"
            alt="Profile Photo"
            className="w-64 h-64 hover:scale-110 transition-transform duration-300 drop-shadow-xl"
          />
        </div>
      </div>

      {/* Home Button */}
      <button className="mt-10 bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition-all duration-300">
        <a href="/">Home</a>
      </button>
    </div>
  );
}
