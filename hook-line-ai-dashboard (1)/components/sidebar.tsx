"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  BarChart3,
  Settings,
  Sparkles,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react"

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Analytics", icon: BarChart3, active: false },
  { label: "Settings", icon: Settings, active: false },
]

export function Sidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-sidebar-border bg-sidebar px-4 py-3 md:hidden">
        <Brand />
        <button
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
          className="rounded-md p-2 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <Menu className="size-5" />
        </button>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar p-4 transition-transform duration-200 md:static md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between md:block">
          <Brand />
          <button
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
            className="rounded-md p-2 text-sidebar-foreground/70 hover:bg-sidebar-accent md:hidden"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-1" aria-label="Main">
          {navItems.map((item) => (
            <a
              key={item.label}
              href="#"
              aria-current={item.active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                item.active
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
            >
              <item.icon className="size-[18px]" />
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-1 border-t border-sidebar-border pt-4">
          <ThemeToggle />

          <a
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
          >
            <HelpCircle className="size-[18px]" />
            Help &amp; Support
          </a>

          <div className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
              JD
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-sidebar-foreground">Jordan Diaz</p>
              <p className="truncate text-xs text-sidebar-foreground/50">Pro Plan</p>
            </div>
            <button
              aria-label="Sign out"
              className="rounded-md p-1.5 text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              <LogOut className="size-[18px]" />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Sparkles className="size-5" />
      </div>
      <div className="leading-tight">
        <p className="text-sm font-semibold tracking-tight text-sidebar-foreground">HookLine AI</p>
        <p className="text-xs text-sidebar-foreground/50">Pitch Engine</p>
      </div>
    </div>
  )
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = theme !== "light"

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle dark mode"
      aria-pressed={mounted ? isDark : undefined}
      className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
    >
      <span className="flex items-center gap-3">
        {mounted && !isDark ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
        {mounted ? (isDark ? "Dark Mode" : "Light Mode") : "Theme"}
      </span>
      <span
        className={cn(
          "relative h-5 w-9 shrink-0 rounded-full transition-colors",
          isDark ? "bg-primary" : "bg-sidebar-border",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-4 rounded-full bg-background shadow-sm transition-transform",
            isDark ? "translate-x-[18px]" : "translate-x-0.5",
          )}
        />
      </span>
    </button>
  )
}
