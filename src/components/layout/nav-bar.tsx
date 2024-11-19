import { MdAirplaneTicket } from "react-icons/md";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { SidebarContent } from "./sidebar";

export function Navbar() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-14 items-center justify-between">
                    <div className="flex items-center gap-2">
                        {/* Mobile Menu */}
                        <div className="md:hidden">
                            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="mr-2">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="p-0 w-64 flex flex-col">
                                    <div className="flex items-center gap-2 p-4 border-b">
                                        <MdAirplaneTicket className="h-5 w-5" />
                                        <span className="font-semibold">Planejador de Milhas</span>
                                    </div>
                                    <div className="flex-1 overflow-y-auto">
                                        <SidebarContent onSelect={() => setIsMobileOpen(false)} />
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>

                        {/* Desktop Logo */}
                        <MdAirplaneTicket className="h-6 w-6 hidden sm:inline-block" />
                        <span className="font-semibold hidden sm:inline-block">Planejador de Milhas</span>
                    </div>

                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
