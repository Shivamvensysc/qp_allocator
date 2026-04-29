import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isGlowing, setIsGlowing] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Glow animation interval
    const interval = setInterval(() => {
      setIsGlowing((prev) => !prev);
    }, 2000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  // const suggestedPaths = [
  //   { path: "/admin", label: "Admin Dashboard", icon: Home, role: "admin" },
  //   { path: "/selectorControl", label: "Selector Dashboard", icon: Compass, role: "selector" },
  //   { path: "/auth/loginAdmin", label: "Admin Login", icon: ArrowLeft, role: "admin" },
  //   { path: "/auth/loginSelector", label: "Selector Login", icon: ArrowLeft, role: "selector" },
  // ];

  return (
    <div className="relative h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30"></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 ">
        <div className="relative mb-3">
          <div
            className="text-center"
            style={{
              transform: `perspective(1000px) rotateX(${mousePosition.y * 0.02}deg) rotateY(${mousePosition.x * 0.02}deg)`,
            }}
          >
            <div className="relative inline-block">
              <h1 className="text-[200px] md:text-[300px] font-black leading-none tracking-tighter">
                <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent animate-gradient">
                  4
                </span>
                <span className="relative inline-block mx-4">
                  <span
                    className={`absolute inset-0 blur-2xl ${isGlowing ? "opacity-100" : "opacity-50"} transition-opacity duration-1000`}
                  >
                    <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                      0
                    </span>
                  </span>
                  <span className="relative bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                    0
                  </span>
                </span>
                <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                  4
                </span>
              </h1>
            </div>
          </div>
        </div>

        <div className="text-center max-w-3xl mx-auto mb-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-white/90">
              Page Not Found
            </span>
          </div>

          <h2 className="text-4xl  font-bold text-white mb-2">
            Oops! Lost in Space?
          </h2>

          <p className="text-lg text-white/70 ">
            The page you're looking for doesn't exist or has been moved. Let's
            get you back on track!
          </p>
        </div>

        {/* action buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="group relative px-6 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium hover:bg-white/20 transition-all duration-300 hover:scale-105"
          >
            <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-purple-500 to-pink-500 -z-10"></span>
            <ArrowLeft className="inline-block w-5 h-5 mr-2" />
            Go Back
          </button>

          <button
            onClick={() => navigate("/")}
            className="group relative px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
          >
            <Home className="inline-block w-5 h-5 mr-2" />
            Back to Home
          </button>
        </div>

        {/* suggested paths */}
        {/* <div className="text-center">
          <p className="text-white/60 text-sm mb-3">Quick Navigation</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {suggestedPaths.map((item, index) => (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className="group px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 text-white/80 text-sm hover:bg-white/10 hover:text-white transition-all duration-300 hover:scale-105"
              >
                <item.icon className="inline-block w-4 h-4 mr-2" />
                {item.label}
              </button>
            ))}
          </div>
        </div> */}

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse"></div>
      </div>
    </div>
  );
};

export default NotFound;
