function ProgressBar({ progress }) {
  return <div className="page-progress" aria-hidden="true"><span style={{ transform: `scaleX(${progress})` }} /></div>
}

export default ProgressBar