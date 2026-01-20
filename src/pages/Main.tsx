export default function Main() {
  const navigate = useNavigate();
  const [role, setRole] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.token) {
          setIsLoggedIn(true);
          setRole(user.role);
        }
      } catch (e) {
        console.error("Failed to parse user data");
      }
    }
    // We removed navigate("/login") so they stay on the page as guests
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setRole(null);
    navigate("/"); // Stay home
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dynamic Navbar */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-black text-2xl text-blue-600 tracking-tighter cursor-pointer" onClick={() => navigate("/")}>
            ONEFIX
          </div>
          
          <div className="hidden md:flex space-x-8 text-gray-600 font-medium">
            {/* Show these only if logged in */}
            {isLoggedIn && (
              <>
                <button onClick={() => navigate("/books")} className="flex items-center gap-1 hover:text-blue-600 transition">
                  <span>📖</span> {role === "technician" ? "My Jobs" : "My Books"}
                </button>
                <button onClick={() => navigate("/profile")} className="flex items-center gap-1 hover:text-blue-600 transition">
                  <span>👤</span> Profile
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-1 text-red-500 font-semibold text-sm hover:bg-red-50 px-3 py-2 rounded-lg transition"
              >
                <span>🚪</span> Logout
              </button>
            ) : (
              <div className="space-x-2">
                <button 
                  onClick={() => navigate("/login")}
                  className="text-blue-600 font-semibold text-sm px-4 py-2 hover:bg-blue-50 rounded-lg"
                >
                  Login
                </button>
                <button 
                  onClick={() => navigate("/signup")}
                  className="bg-blue-600 text-white font-semibold text-sm px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* If user is tech, show TechHome. Otherwise (Client or Guest), show ClientHome */}
        {role === "technician" ? <TechHome /> : <ClientHome />}
      </div>
    </div>
  );
}
