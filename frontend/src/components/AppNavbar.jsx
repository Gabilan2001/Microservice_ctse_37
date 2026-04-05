import React from "react";

function NavBrand({ title, subtitle, onClick, clickable }) {
  const inner = (
    <>
      <span className="nav-logo-mark" aria-hidden>
        P
      </span>
      <div className="nav-title-wrap">
        <h1 className="nav-title">{title}</h1>
        {subtitle ? <p className="nav-subtitle">{subtitle}</p> : null}
      </div>
    </>
  );

  if (clickable && onClick) {
    return (
      <button type="button" className="nav-brand-btn" onClick={onClick}>
        {inner}
      </button>
    );
  }

  return <div className="nav-brand-static">{inner}</div>;
}

function UserMenuBlock({
  currentUser,
  userMenuRef,
  isUserMenuOpen,
  setIsUserMenuOpen,
  onLogout,
}) {
  return (
    <div className="user-menu" ref={userMenuRef}>
      <button
        type="button"
        className="user-icon-btn"
        onClick={() => setIsUserMenuOpen((prev) => !prev)}
        aria-expanded={isUserMenuOpen}
        aria-haspopup="true"
      >
        {currentUser?.name?.charAt(0).toUpperCase() || "U"}
      </button>

      {isUserMenuOpen ? (
        <div className="user-dropdown">
          <p className="user-dropdown-name">{currentUser?.name || "—"}</p>
          <p className="user-dropdown-email">{currentUser?.email || "—"}</p>
          <p className="user-dropdown-role">Role: {currentUser?.role || "—"}</p>
          <button type="button" className="logout-btn" onClick={onLogout}>
            Log out
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function AppNavbar({
  variant = "main",
  title = "Pulse Events",
  subtitle = "Creator gatherings, concerts, workshops, and festivals",
  currentUser,
  canAccessAdminPanel,
  activePage = "home",
  onNavigate,
  userMenuRef,
  isUserMenuOpen,
  setIsUserMenuOpen,
  onLogout,
  searchTerm,
  onSearchChange,
  searchPlaceholder,
  adminTitle = "Admin Studio",
  adminSubtitle = "Operations dashboard",
}) {
  if (variant === "public") {
    return (
      <header className="navbar navbar--public">
        <div className="navbar-inner">
          <NavBrand title={title} subtitle={subtitle || "Secure event booking"} />
        </div>
      </header>
    );
  }

  if (variant === "admin") {
    return (
      <header className="navbar navbar--admin">
        <div className="navbar-inner navbar-inner--spread">
          <NavBrand
            title={adminTitle}
            subtitle={adminSubtitle}
            onClick={() => onNavigate?.("home")}
            clickable
          />
          <div className="navbar-center">
            {searchPlaceholder != null ? (
              <div className="admin-search-wrap">
                <input
                  type="search"
                  className="admin-search-input"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  aria-label="Search in current section"
                />
              </div>
            ) : null}
          </div>
          <div className="nav-actions nav-actions--admin">
            <nav className="nav-pills" aria-label="Main">
              <button
                type="button"
                className={`nav-pill ${activePage === "home" ? "active" : ""}`}
                onClick={() => onNavigate?.("home")}
              >
                Home
              </button>
              <button
                type="button"
                className={`nav-pill ${activePage === "profile" ? "active" : ""}`}
                onClick={() => onNavigate?.("profile")}
              >
                Profile
              </button>
              {canAccessAdminPanel ? (
                <span className="nav-pill active" aria-current="page">
                  Admin
                </span>
              ) : null}
            </nav>
            <UserMenuBlock
              currentUser={currentUser}
              userMenuRef={userMenuRef}
              isUserMenuOpen={isUserMenuOpen}
              setIsUserMenuOpen={setIsUserMenuOpen}
              onLogout={onLogout}
            />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="navbar">
      <div className="navbar-inner navbar-inner--spread">
        <NavBrand
          title={title}
          subtitle={subtitle}
          onClick={() => onNavigate?.("home")}
          clickable
        />
        <div className="nav-actions">
          <nav className="nav-pills" aria-label="Main">
            <button
              type="button"
              className={`nav-pill ${activePage === "home" ? "active" : ""}`}
              onClick={() => onNavigate?.("home")}
            >
              Home
            </button>
            <button
              type="button"
              className={`nav-pill ${activePage === "profile" ? "active" : ""}`}
              onClick={() => onNavigate?.("profile")}
            >
              Profile
            </button>
            {canAccessAdminPanel ? (
              <button
                type="button"
                className={`nav-pill ${activePage === "admin" ? "active" : ""}`}
                onClick={() => onNavigate?.("admin")}
              >
                Admin
              </button>
            ) : null}
          </nav>
          <UserMenuBlock
            currentUser={currentUser}
            userMenuRef={userMenuRef}
            isUserMenuOpen={isUserMenuOpen}
            setIsUserMenuOpen={setIsUserMenuOpen}
            onLogout={onLogout}
          />
        </div>
      </div>
    </header>
  );
}
