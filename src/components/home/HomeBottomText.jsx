// import { Link } from "react-router-dom";

// const HomeBottomText = () => {
//   return (
//     <div className="font-[font2] flex items-center justify-center gap-20 py-10">
//       {/* PROJECTS Button */}
//       <div className="group relative h-28 flex items-center justify-center px-12 border-5 border-white rounded-full uppercase transition-all duration-200 ease-in-out hover:scale-110 hover:border-[#00E0FF] hover:bg-[#00E0FF]/20 hover:text-[#00E0FF]">
//         <Link
//           to="/projects"
//           className="text-[6vw] lg:text-[3vw] font-bold transition-colors duration-300"
//         >
//           Projects
//         </Link>
//       </div>

//       {/* ABOUT ME Button */}
//       <div className="group relative h-28 flex items-center justify-center px-12 border-5 border-white rounded-full uppercase transition-all duration-200 ease-in-out hover:scale-110 hover:border-[#00E0FF] hover:bg-[#00E0FF]/20 hover:text-[#00E0FF]">
//         <Link
//           to="/aboutMe"
//           className="text-[6vw] lg:text-[3vw] font-bold transition-colors duration-300"
//         >
//           About Me
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default HomeBottomText;

import { Link } from "react-router-dom";

const HomeBottomText = () => {
  return (
    <div
      className="font-[font2] flex flex-col sm:flex-row items-center justify-center 
                 gap-10 sm:gap-16 md:gap-20 py-10 px-4 text-center"
    >
      {/* PROJECTS Button */}
      <div
        className="group relative flex items-center justify-center 
                   px-8 sm:px-10 md:px-12 py-4 sm:py-6 md:h-24 h-20 
                   border-4 border-white rounded-full uppercase 
                   transition-all duration-200 ease-in-out 
                   hover:scale-110 hover:border-[#00E0FF] hover:bg-[#00E0FF]/20 hover:text-[#00E0FF]"
      >
        <Link
          to="/projects"
          className="text-[8vw] sm:text-[5vw] md:text-[3vw] font-bold transition-colors duration-300"
        >
          Projects
        </Link>
      </div>

      {/* ABOUT ME Button */}
      <div
        className="group relative flex items-center justify-center 
                   px-8 sm:px-10 md:px-12 py-4 sm:py-6 md:h-24 h-20 
                   border-4 border-white rounded-full uppercase 
                   transition-all duration-200 ease-in-out 
                   hover:scale-110 hover:border-[#00E0FF] hover:bg-[#00E0FF]/20 hover:text-[#00E0FF]"
      >
        <Link
          to="/aboutMe"
          className="text-[8vw] sm:text-[5vw] md:text-[3vw] font-bold transition-colors duration-300"
        >
          About Me
        </Link>
      </div>
    </div>
  );
};

export default HomeBottomText;