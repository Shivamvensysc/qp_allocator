import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Home, 
  ArrowLeft, 
  Search, 
  AlertTriangle,
  Compass,
  Zap,
  Sparkles
} from "lucide-react";

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
      setIsGlowing(prev => !prev);
    }, 2000);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  const suggestedPaths = [
    { path: "/admin", label: "Admin Dashboard", icon: Home, role: "admin" },
    { path: "/selectorControl", label: "Selector Dashboard", icon: Compass, role: "selector" },
    { path: "/auth/loginAdmin", label: "Admin Login", icon: ArrowLeft, role: "admin" },
    { path: "/auth/loginSelector", label: "Selector Login", icon: ArrowLeft, role: "selector" },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16">
        {/* 404 Number with Animation */}
        <div className="relative mb-8">
          <div 
            className="text-center"
            style={{
              transform: `perspective(1000px) rotateX(${mousePosition.y * 0.02}deg) rotateY(${mousePosition.x * 0.02}deg)`
            }}
          >
            <div className="relative inline-block">
              <h1 className="text-[200px] md:text-[300px] font-black leading-none tracking-tighter">
                <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent animate-gradient">
                  4
                </span>
                <span className="relative inline-block mx-4">
                  <span className={`absolute inset-0 blur-2xl ${isGlowing ? 'opacity-100' : 'opacity-50'} transition-opacity duration-1000`}>
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
              
              {/* Floating Elements */}
              <div className="absolute -top-10 -right-20 animate-float">
                <Zap className="w-12 h-12 text-yellow-400" />
              </div>
              <div className="absolute -bottom-10 -left-20 animate-float-delayed">
                <Sparkles className="w-10 h-10 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-white/90">Page Not Found</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Oops! Lost in Space?
          </h2>
          
          <p className="text-lg text-white/70 mb-8">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track!
          </p>

          {/* Search Box */}
          <div className="relative max-w-md mx-auto mb-8">
            <input
              type="text"
              placeholder="Search for a page..."
              className="w-full px-6 py-3 pl-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const value = (e.target as HTMLInputElement).value;
                  if (value) {
                    window.location.href = `/${value.toLowerCase().replace(/\s/g, '')}`;
                  }
                }
              }}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <button
            onClick={() => navigate(-1)}
            className="group relative px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium hover:bg-white/20 transition-all duration-300 hover:scale-105"
          >
            <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-purple-500 to-pink-500 -z-10"></span>
            <ArrowLeft className="inline-block w-5 h-5 mr-2" />
            Go Back
          </button>
          
          <button
            onClick={() => navigate("/")}
            className="group relative px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
          >
            <Home className="inline-block w-5 h-5 mr-2" />
            Back to Home
          </button>
        </div>

        {/* Suggested Paths */}
        <div className="text-center">
          <p className="text-white/60 text-sm mb-4">Quick Navigation</p>
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
        </div>

        {/* Animated Border Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse"></div>
      </div>
    </div>
  );
};

export default NotFound;