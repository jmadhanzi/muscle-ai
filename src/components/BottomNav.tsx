const BottomNav = () => (
  <footer className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-surface/90 backdrop-blur-2xl rounded-t-xl shadow-[0_-8px_40px_rgba(0,0,0,0.5)]">
    <div className="flex flex-col items-center justify-center text-surface-variant w-12 h-12 hover:text-primary transition-colors active:scale-90 duration-300 cursor-pointer">
      <span className="material-symbols-outlined">dashboard</span>
    </div>
    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-full w-14 h-14 shadow-[0_0_20px_hsla(155,100%,71%,0.3)] active:scale-90 duration-300 cursor-pointer">
      <span className="material-symbols-outlined">psychology</span>
    </div>
    <div className="flex flex-col items-center justify-center text-surface-variant w-12 h-12 hover:text-primary transition-colors active:scale-90 duration-300 cursor-pointer">
      <span className="material-symbols-outlined">fitness_center</span>
    </div>
    <div className="flex flex-col items-center justify-center text-surface-variant w-12 h-12 hover:text-primary transition-colors active:scale-90 duration-300 cursor-pointer">
      <span className="material-symbols-outlined">restaurant</span>
    </div>
    <div className="flex flex-col items-center justify-center text-surface-variant w-12 h-12 hover:text-primary transition-colors active:scale-90 duration-300 cursor-pointer">
      <span className="material-symbols-outlined">monitoring</span>
    </div>
  </footer>
);

export default BottomNav;
