// ProjectCard.jsx
const ProjectCard = ({ video, title, link }) => {
  const hasLink = Boolean(link && title)

  const CardContent = (
    <div
      className='group relative w-full h-[400px] lg:h-[650px] overflow-hidden 
      rounded-[25px] transition-all duration-700 
      hover:shadow-[0_0_50px_rgba(255,215,80,0.4)] hover:scale-[1.02]'
    >
      {/* 🎥 Video - fully fits card */}
      <video
        src={video}
        autoPlay
        loop
        muted
        playsInline
        className='absolute inset-0 w-full h-full object-fill transition-transform duration-700 ease-in-out group-hover:scale-105'
      ></video>

      {/* 🪶 Overlay for hover text */}
      {title && (
        <div
          className='absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 
          group-hover:opacity-100 transition-opacity duration-700'
        >
          <span
            className='text-3xl lg:text-5xl font-[font1] text-yellow-300 tracking-wider 
            opacity-0 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 
            transition-all duration-700 ease-out'
          >
            {title}
          </span>
        </div>
      )}

      {/* ✨ Soft glow overlay */}
      <div className='absolute inset-0 opacity-0 group-hover:opacity-30 transition-all duration-700 bg-gradient-to-r from-yellow-200/10 via-amber-400/30 to-yellow-200/10 blur-[30px]'></div>
    </div>
  )

  return hasLink ? (
    <a href={link} target='_blank' rel='noopener noreferrer' className='block'>
      {CardContent}
    </a>
  ) : (
    CardContent
  )
}

export default ProjectCard
