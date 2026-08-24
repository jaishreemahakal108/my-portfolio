import { PROFILE } from '../data'

export default function ResumeApp() {
  return (
    <div className="rzw-app-content" style={{ maxWidth: 'none' }}>
      <span className="rzw-eyebrow">Resume</span>
      <div className="rzw-resume-actions">
        <a className="rzw-btn primary" href={PROFILE.resumeUrl} download="Rajaswa_Anand.pdf">⬇ Download PDF</a>
        <a className="rzw-btn" href={PROFILE.resumeUrl} target="_blank" rel="noreferrer">⤢ Open Full Screen</a>
      </div>
      {/* <object>, unlike <iframe>, renders its children as a fallback when the
          browser has no inline PDF viewer wired up — an iframe just shows a
          blank box in that case, with no way to recover. */}
      <object className="rzw-resume-frame" data={PROFILE.resumeUrl} type="application/pdf" aria-label="Rajaswa Anand — Resume preview">
        <div className="rzw-resume-fallback">
          <p>Your browser can't preview the PDF inline here.</p>
          <a className="rzw-btn primary" href={PROFILE.resumeUrl} download="Rajaswa_Anand.pdf">⬇ Download the PDF instead</a>
        </div>
      </object>
    </div>
  )
}
