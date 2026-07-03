"use client"

import Link from "next/link"
import { useAuth } from "@/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import {

  GraduationCap,
  BookOpen,
  Users,
  Shield,
  ArrowRight,
  Sun,
  Moon,
  LogOut,
  LayoutDashboard,
  Sparkles,
  Store,
} from "lucide-react"

export default function LandingPage() {
  const { user, logout, loading } = useAuth()
  const { theme, setTheme } = useTheme()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Premium Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-tr from-primary to-violet-500 text-primary-foreground shadow-md shadow-primary/20">
              <Store className="h-6 w-6" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-linear-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text">
            
              Inventory Hub
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <span className="h-4 w-px bg-border" />
          </nav>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
              aria-label="Toggle theme"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {/* Authentication Action Buttons */}
            {loading || !user ? (
              <div className="flex items-center gap-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="font-semibold text-sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm" className="font-semibold text-sm shadow-sm bg-primary hover:bg-primary/90 text-primary-foreground">
                    Sign Up
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-block text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full border border-border/50">
                  Logged in as <strong className="text-foreground font-semibold">{user.email}</strong> ({user.role})
                </span>
                <Link href={user.role === "admin" || user.role === "lecturer" ? "/admin/dashboard" : "/students/dashboard"}>
                  <Button size="sm" className="gap-1.5 font-semibold text-sm">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={logout} className="gap-1.5 font-semibold text-sm border-destructive/20 text-destructive hover:bg-destructive/10 hover:border-destructive/30">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden py-24 sm:py-32">
          {/* Background Decorative Gradients */}
          <div className="absolute inset-0 -z-10 bg-radial-[at_top_right] from-primary/10 via-background to-background" />
          <div className="absolute top-1/2 left-1/4 -z-10 h-72 w-72 -translate-y-1/2 rounded-full bg-violet-400/10 blur-3xl" />

          <div className="container mx-auto px-4 sm:px-6 text-center max-w-4xl space-y-8">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground">
               Small-Business Inventory & Orders<br />
              <span className="bg-linear-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                The Right Way
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
              A shop tracks stock, records sales, flags low inventory, and views a simple sales
dashboard. lists in real-time.
            </p>

          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 bg-card">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-xs text-muted-foreground">
            &copy; 2026 InventoryHub Inc. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <span className="font-mono"><kbd className="px-1 py-0.5 rounded-sm border bg-muted"></kbd></span>
          </div>
        </div>
      </footer>
    </div>
  )
}
