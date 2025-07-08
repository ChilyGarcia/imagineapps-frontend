import type React from "react";
import Link from "next/link";
import {
  Calendar,
  Home,
  LogOut,
  Menu,
  Settings,
  User,
  Bell,
  Search,
  Globe,
} from "lucide-react";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex min-h-screen flex-col bg-gray-50/50">
        <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-white/80 backdrop-blur-md px-4 md:px-6 shadow-sm">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-white">
              <nav className="grid gap-2 text-lg font-medium pt-6">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
                >
                  <Home className="h-5 w-5" />
                  Panel Personal
                </Link>
                <Link
                  href="/dashboard/events"
                  className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-2 text-indigo-700 font-medium"
                >
                  <Calendar className="h-5 w-5" />
                  Mis Eventos
                  <Badge className="ml-auto bg-indigo-100 text-indigo-700">
                    4
                  </Badge>
                </Link>
                <Link
                  href="/"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
                >
                  <Globe className="h-5 w-5" />
                  Eventos Públicos
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
                >
                  <User className="h-5 w-5" />
                  Perfil
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
                >
                  <Settings className="h-5 w-5" />
                  Configuración
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-semibold"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Eventos
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" asChild className="hidden md:flex">
              <Link href="/">
                <Globe className="mr-2 h-4 w-4" />
                Ver Eventos Públicos
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                >
                  <img
                    src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                    width="36"
                    height="36"
                    className="rounded-full ring-2 ring-gray-200"
                    alt="Avatar"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Juan Pérez
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      juan@ejemplo.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Configuración
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/" className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="flex flex-1">
          <aside className="hidden w-64 border-r bg-white md:block">
            <nav className="grid gap-1 p-4 text-sm font-medium">
              <Link
                href="/dashboard/events"
                className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-2 text-indigo-700 font-medium"
              >
                <Calendar className="h-5 w-5" />
                Mis Eventos
              </Link>
            </nav>
          </aside>
          <main className="flex-1 p-6 bg-gray-50/50">{children}</main>
        </div>
      </div>
    </Suspense>
  );
}
