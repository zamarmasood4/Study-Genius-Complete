import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  BookOpen, 
  User, 
  LayoutDashboard, 
  Film, 
  HelpCircle,
  Home,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { ThemeToggle } from "@/components/ThemeToggle";
import { apiService } from '@/services/api'; // Adjust path as needed

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen && !event.target.closest('.profile-dropdown-trigger')) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen]);

  // Check if user is logged in and fetch profile
  useEffect(() => {
    const checkAuth = async () => {
      if (apiService.isAuthenticated()) {
        try {
          setLoading(true);
          const response = await apiService.getProfile();
          
          if (response.success) {
            const userData = response.user;
            setUser({
              full_name: userData.full_name || userData.user_metadata?.full_name || userData.email?.split('@')[0],
              email: userData.email,
              profile_picture: userData.profile_picture || userData.user_metadata?.profile_picture
            });
          }
        } catch (error) {
          console.error('Failed to fetch profile:', error);
          // Clear token if invalid
          apiService.clearToken();
        } finally {
          setLoading(false);
        }
      }
    };
    
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsProfileOpen(false);
      navigate('/');
    }
  };

  const ProfileDropdown = () => (
    <div className="absolute top-full right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-1 z-50">
      <div className="px-4 py-2 border-b border-border">
        <p className="text-sm font-medium text-foreground truncate">
          {user?.full_name || 'User'}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {user?.email}
        </p>
      </div>
      
      <Link 
        to="/profile" 
        className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
        onClick={() => setIsProfileOpen(false)}
      >
        <UserIcon className="h-4 w-4" />
        <span>Profile</span>
      </Link>
      
    
      
      <div className="border-t border-border my-1"></div>
      
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors"
      >
        <LogOut className="h-4 w-4" />
        <span>Logout</span>
      </button>
    </div>
  );

  const UserAvatar = () => (
    <div className="relative profile-dropdown-trigger">
      <button
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="User menu"
        disabled={loading}
      >
        {loading ? (
          <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
        ) : user?.profile_picture ? (
          <img 
            src={user.profile_picture} 
            alt={user.full_name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="text-xs font-medium">
            {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
          </span>
        )}
      </button>
      
      {isProfileOpen && <ProfileDropdown />}
    </div>
  );

  return (
    <nav className="bg-card/95 backdrop-blur-sm shadow-sm py-4 sticky top-0 z-50 border-b border-border transition-colors duration-300">
      <div className="app-container">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary/20 transition-colors">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-bold gradient-text">StudyGenius</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`font-medium transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-md ${isActive('/') ? 'text-primary bg-primary/10' : 'text-foreground/80 hover:text-primary hover:bg-muted'}`}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link 
              to="/dashboard" 
              className={`font-medium transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-md ${isActive('/dashboard') ? 'text-primary bg-primary/10' : 'text-foreground/80 hover:text-primary hover:bg-muted'}`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            {/* <Link 
              to="/videos" 
              className={`font-medium transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-md ${isActive('/videos') ? 'text-primary bg-primary/10' : 'text-foreground/80 hover:text-primary hover:bg-muted'}`}
            >
              <Film className="h-4 w-4" />
              <span>Videos</span>
            </Link> */}
            <Link 
              to="/questions" 
              className={`font-medium transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-md ${isActive('/questions') ? 'text-primary bg-primary/10' : 'text-foreground/80 hover:text-primary hover:bg-muted'}`}
            >
              <HelpCircle className="h-4 w-4" />
              <span>Exam Preparation</span>
            </Link>
            
            <div className="flex items-center gap-3 ml-4">
              <ThemeToggle />
              
              {user ? (
                <UserAvatar />
              ) : (
                <Link to="/login">
                  <Button variant="default" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Sign In</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            
            {user ? (
              <UserAvatar />
            ) : (
              <Link to="/login" className="mr-2">
                <Button variant="outline" size="icon" className="rounded-full h-9 w-9">
                  <User className="h-4 w-4" />
                </Button>
              </Link>
            )}
            
            <button 
              className="text-foreground p-2 rounded-md hover:bg-muted"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2 flex flex-col">
            <Link 
              to="/" 
              className={`font-medium px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${isActive('/') ? 'bg-primary/10 text-primary' : 'text-foreground/80 hover:text-primary hover:bg-muted'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link 
              to="/dashboard" 
              className={`font-medium px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${isActive('/dashboard') ? 'bg-primary/10 text-primary' : 'text-foreground/80 hover:text-primary hover:bg-muted'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/videos" 
              className={`font-medium px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${isActive('/videos') ? 'bg-primary/10 text-primary' : 'text-foreground/80 hover:text-primary hover:bg-muted'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Film className="h-4 w-4" />
              <span>Videos</span>
            </Link>
            <Link 
              to="/questions" 
              className={`font-medium px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${isActive('/questions') ? 'bg-primary/10 text-primary' : 'text-foreground/80 hover:text-primary hover:bg-muted'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <HelpCircle className="h-4 w-4" />
              <span>Exam Preparation</span>
            </Link>
            
            {!user && (
              <Link 
                to="/login"
                onClick={() => setIsMenuOpen(false)}
              >
                <Button variant="default" className="flex items-center gap-2 w-full justify-center mt-2">
                  <User className="h-4 w-4" />
                  <span>Sign In</span>
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;