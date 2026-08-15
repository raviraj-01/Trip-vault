function AuthCard({ title, subtitle, error, footer, children }) {
  return (
    <div className="page">
      <div className="card">
        <h1>{title}</h1>
        {subtitle && <p className="subtitle">{subtitle}</p>}
        {error && <div className="alert alert-error">{error}</div>}
        {children}
        {footer && <p className="footer-text">{footer}</p>}
      </div>
    </div>
  );
}

export default AuthCard;
