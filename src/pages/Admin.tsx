import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import AirQualitySidebar from "@/components/AirQualitySidebar";
import AdminPanel from "@/components/AdminPanel";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, User } from "lucide-react";

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem("aqi-admin-auth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simple authentication check
    if (username === "air-quality" && password === "index") {
      localStorage.setItem("aqi-admin-auth", "true");
      setIsAuthenticated(true);
      toast.success("Login successful!");
    } else {
      toast.error("Invalid credentials");
    }
    
    setIsLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("aqi-admin-auth");
    setIsAuthenticated(false);
    toast.info("Logged out successfully");
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen animate-gradient-shift p-4">
        <div className="glass-card w-full max-w-md p-8 rounded-xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              AQI Analysis Admin
            </h1>
            <p className="text-blue-300 mt-2">
              Enter your credentials to access the admin panel
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="pl-9 bg-white/5 border-white/10 text-white"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="pl-9 bg-white/5 border-white/10 text-white"
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-500 hover:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? "Authenticating..." : "Login"}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-blue-300">
            <Button 
              variant="link" 
              className="text-blue-300 hover:text-blue-400"
              onClick={() => navigate("/")}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full relative">
        <div className="fixed top-0 h-screen overflow-y-auto">
          <AirQualitySidebar onLogout={handleLogout} isAdmin={true} />
        </div>
        
        <main className="flex-1 overflow-x-hidden ml-0 md:ml-64">
          <AdminPanel onLogout={handleLogout} />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
