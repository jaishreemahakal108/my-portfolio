const Video = () => {
  return (
    <video
      src="/Intro-videp.mp4"
      autoPlay
      loop
      muted
      playsInline
      className="w-full h-full object-cover animate-zoom"
    ></video>
  );
};

export default Video;