export function Logo() {
  return (
    <div className="topbar-logo">
      <div className="logo-box">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3,3 9,8 3,13" />
          <polyline points="8,3 14,8 8,13" />
        </svg>
      </div>
      <span className="logo-wordmark">LexNews</span>
    </div>
  );
}
