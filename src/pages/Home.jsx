// import React from 'react'
// import Video from '../components/home/Video'
// import HomeHeroText from '../components/home/HomeHeroText'
// import HomeBottomText from '../components/home/HomeBottomText'

// const Home = () => {
//   return (
//     <div className='text-white'>
//         <div className='h-screen w-screen fixed overflow-hidden'>
//             <Video />
//         </div>
//         <div className='h-screen w-screen relative flex flex-col justify-between'>
//             <HomeHeroText />
//             <HomeBottomText />
//         </div>
//     </div>
//   )
// }

// export default Home

import React from "react";
import Video from "../components/home/Video";
import HomeHeroText from "../components/home/HomeHeroText";
import HomeBottomText from "../components/home/HomeBottomText";

const Home = () => {
  return (
    <div className="text-white">
      {/* Background Video */}
      <div className="h-screen w-screen fixed overflow-hidden">
        <Video />
      </div>

      {/* Foreground Content */}
      <div className="h-screen w-screen relative flex flex-col justify-between">
        <HomeHeroText />
        <HomeBottomText />
      </div>
    </div>
  );
};

export default Home;
