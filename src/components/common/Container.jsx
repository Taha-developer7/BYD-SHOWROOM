function Container({ children, className = '' }) {
  return <div className={`show-container ${className}`}>{children}</div>
}

export default Container