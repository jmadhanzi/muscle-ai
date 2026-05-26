import { Link, useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  // Silently track 404s without console noise in production
  // If you need analytics, send to your error tracking service here

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-on-surface-variant text-4xl">search_off</span>
        </div>
        <h1 className="font-headline font-bold text-5xl text-on-surface mb-3">404</h1>
        <p className="text-on-surface-variant text-lg mb-2">Page not found</p>
        <p className="text-on-surface-variant/60 text-sm mb-8 font-mono">{location.pathname}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-headline font-bold text-sm hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined text-base">home</span>
          Back to home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
