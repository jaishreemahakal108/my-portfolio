import Video from "./Video";

const HomeHeroText = () => {
  return (
    <div className="font-[font1] pt-5 text-center">
      {/* Top Line */}
      <div className="text-[9vw] uppercase justify-center flex items-center leading-[10vw] 
                      bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 
                      bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(255,100,0,0.6)] 
                      animate-shine">
        Code. Design.
      </div>

      {/* Bottom Line */}
      <div className="text-[8vw] uppercase justify-center flex items-center leading-[10vw] 
                      bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 
                      bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(255,80,0,0.6)] 
                      animate-shine">
        Create.
        <div
          className="relative h-[12vw] w-[20vw] rounded-[50%] overflow-hidden -mt-4 mx-3 
                     border-4 border-red-500 shadow-[0_0_40px_rgba(255,0,0,0.4)] 
                     animate-glow"
        >
          <Video />
        </div>
        Repeat
      </div>
    </div>
  );
};

export default HomeHeroText;