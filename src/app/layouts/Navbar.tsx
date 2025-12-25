import { Menu, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { UserProfile } from "@/types/User";

type NavBarProps = {
  onBurgerClick?: () => void; // mobile sidebar toggle
  onCreateUser?: () => void; // create user callback
  userData: UserProfile | null;
};

export function NavBar({ onBurgerClick, onCreateUser, userData }: NavBarProps) {
  return (
    <header className="h-16 border-b border-border bg-background flex items-center px-4 md:px-6">
      {/* Mobile Burger */}
      {onBurgerClick && (
        <button className="md:hidden p-2 mr-2" onClick={onBurgerClick} aria-label="Open sidebar">
          <Menu className="w-6 h-6 text-foreground" />
        </button>
      )}

      {/* Brand / Optional Logo */}
      <div className="hidden md:flex items-center gap-2">
        <span className="text-xl font-bold text-slate-800">INHS Portal</span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right side: Create Account + Avatar */}
      <div className="flex items-center gap-2">
        {/* Create Account Button */}
        {userData?.role === "admin" ? (
          <Button variant="outline" onClick={() => console.log(userData)} className="flex items-center gap-1">
            <Plus className="w-4 h-4" />
            <span>Create Account</span>
          </Button>
        ) : null}

        {/* Avatar */}
        <Avatar className="w-9 h-9 cursor-pointer border-2 border-border">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <User className="w-5 h-5" />
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
