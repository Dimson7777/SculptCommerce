import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Mail, Lock, LogIn } from "lucide-react";
import PageTransition from "@/components/PageTransition";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Please fill in all fields"); return; }
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    if (isSignup) {
      const { error } = await signUp(email, password);
      setLoading(false);
      if (error) { toast.error(error); } else {
        toast.success("Account created — welcome!");
        navigate("/shop");
      }
    } else {
      const { error } = await signIn(email, password);
      setLoading(false);
      if (error) { toast.error(error); } else {
        toast.success("Welcome back!");
        navigate("/shop");
      }
    }
  };

  return (
    <PageTransition>
    <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in rounded-lg border border-border bg-card p-8">
        <div className="flex items-center justify-center gap-2">
          <LogIn className="h-7 w-7 text-primary" />
          <h1 className="font-heading text-2xl font-bold uppercase text-foreground">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h1>
        </div>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {isSignup ? "Sign up to start shopping." : "Sign in to your account."}
        </p>
        <div className="mt-6 flex rounded-md border border-border">
          <button onClick={() => setIsSignup(false)} className={`flex-1 py-2 font-heading text-sm uppercase transition-colors ${!isSignup ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>Sign In</button>
          <button onClick={() => setIsSignup(true)} className={`flex-1 py-2 font-heading text-sm uppercase transition-colors ${isSignup ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>Sign Up</button>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email" className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@email.com" />
          </div>
          <div>
            <Label htmlFor="password" className="flex items-center gap-1"><Lock className="h-3.5 w-3.5" /> Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
          </div>
          <Button type="submit" className="w-full font-heading uppercase tracking-wider active:scale-95 transition-transform" disabled={loading}>
            {loading ? "Processing..." : isSignup ? "Create Account" : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
    </PageTransition>
  );
};

export default Login;
