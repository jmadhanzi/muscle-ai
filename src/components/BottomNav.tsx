import { useLocation, useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { path: "/dashboard", icon: "dashboard", label: "Home" },
  { path: "/coach", icon: "psychology", label: "Coach" },
  { path: "/workouts", icon: "fitness_center", label: "Train" },
  { path: "/nutrition", icon: "restaurant", label: "Eat" },
  { path: "/progress", icon: "monitoring", label: "Progress" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  return (
    <footer className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-surface/90 backdrop-blur-2xl rounded-t-xl shadow-[0_-8px_40px_rgba(0,0,0,0.5)]">
      {NAV_ITEMS.map((item) => {
        const active = currentPath === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center w-14 h-12 transition-colors duration-300 active:scale-90 ${
              active ? "text-primary" : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <span className={`material-symbols-outlined ${active ? "material-filled" : ""} text-xl`}>{item.icon}</span>
            <span className={`text-[9px] mt-0.5 font-mono uppercase tracking-wider ${active ? "text-primary font-bold" : ""}`}>{item.label}</span>
          </button>
        );
      })}
    </footer>
  );
};

export default BottomNav;
