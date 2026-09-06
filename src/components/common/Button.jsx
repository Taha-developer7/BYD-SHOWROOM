function Button({ children, variant = 'primary', href, onClick, className = '', ...props }) {
  const classes = `show-button show-button--${variant} ${className}`
  if (href) return <a className={classes} href={href} onClick={onClick} {...props}>{children}<span aria-hidden="true">↗</span></a>
  return <button className={classes} onClick={onClick} {...props}>{children}<span aria-hidden="true">↗</span></button>
}

export default Button