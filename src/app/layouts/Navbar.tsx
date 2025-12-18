import { Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function NavBar() {
  return (
    <header className="h-16 border-b border-border bg-background flex items-center px-6 gap-4">
      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search in Drive"
            className="pl-10 pr-4 w-full bg-muted/50 border-0 focus-visible:ring-1"
          />
        </div>
      </div>

      <Avatar className="w-9 h-9 cursor-pointer border-2 border-border">
        <AvatarFallback className="bg-primary text-primary-foreground">
          <User className="w-5 h-5" />
        </AvatarFallback>
      </Avatar>
    </header>
  );
}
