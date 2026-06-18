"use client"

import Link from "next/link"
import React from 'react'
import { Calculator, Bot, Trophy, Leaf } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Particle Animation Styles */}
      <style>{`
        @keyframes float-up {
          0% { transform: translateY(100vh) rotate(0deg) scale(0.8); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { transform: translateY(-20vh) rotate(360deg) scale(1.2); opacity: 0; }
        }
        .leaf-particle {
          position: absolute;
          bottom: -10%;
          color: var(--color-eco-primary);
          opacity: 0;
          animation: float-up linear infinite;
          z-index: 0;
          pointer-events: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .leaf-particle { animation: none; display: none; }
        }
      `}</style>

      {/* Floating Leaves Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-eco-surface/50 to-background dark:from-green-950/20 dark:to-background z-0" />
        {[...Array(12)].map((_, i) => {
          const left = (i * 13.5) % 100;
          const duration = 15 + ((i * 7) % 15);
          const delay = (i * 3) % 5;
          const opacity = 0.1 + ((i * 11) % 20) / 100;
          return (
            <Leaf 
              key={i} 
              className="leaf-particle" 
              style={{
                left: `${left}%`,
                animationDuration: `${duration}s`,
                animationDelay: `${delay}s`,
                opacity: opacity
              }} 
            />
          );
        })}
      </div>

      <header className="absolute top-0 w-full p-6 flex justify-between items-center z-20">
        <div className="flex items-center space-x-2">
          <Leaf className="w-6 h-6 text-eco-primary" />
          <span className="text-xl font-bold text-eco-primary tracking-tight">EcoTrack AI</span>
        </div>
        <div className="space-x-4">
          <Link href="/login" className="text-sm font-medium hover:text-eco-primary transition-colors">Sign In</Link>
          <Link href="/register" className="inline-flex items-center justify-center rounded-full font-medium transition-colors bg-green-600 text-white hover:bg-green-700 shadow h-9 px-6 text-sm">
            Get Started
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 z-10 pt-20">
        
        {/* HERO SECTION */}
        <section className="max-w-4xl mx-auto space-y-8 py-20">
          <div className="inline-block px-4 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-eco-primary text-sm font-medium mb-4 border border-green-200 dark:border-green-800">
            🌱 Join the sustainability movement
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground">
            Track Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-eco-primary to-eco-accent">Carbon Footprint.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto">
            Reduce Emissions. Save The Planet. Get personalized AI recommendations to reduce your impact in minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link href="/register" className="w-full sm:w-auto inline-flex items-center justify-center font-medium transition-all bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl h-14 px-8 rounded-full text-lg">
              Start Tracking Free
            </Link>
            <Link href="/login" className="w-full sm:w-auto inline-flex items-center justify-center font-medium transition-colors border border-green-600 text-green-600 hover:bg-green-50 h-14 px-8 rounded-full text-lg">
              Already have an account?
            </Link>
          </div>
        </section>

        {/* STATS BAR */}
        <section className="w-full border-y border-border bg-card/50 backdrop-blur-sm py-10 mt-10">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
            <div className="flex flex-col items-center justify-center space-y-2">
              <span className="text-4xl font-black text-foreground">2,400+</span>
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Users Tracked</span>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <span className="text-4xl font-black text-foreground">12</span>
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Tonnes CO₂ Saved</span>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <span className="text-4xl font-black text-foreground">95%</span>
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Found It Helpful</span>
            </div>
          </div>
        </section>

        {/* WHY THIS MATTERS SECTION */}
        <section className="max-w-4xl mx-auto py-16 px-4 text-center">
          <div className="bg-green-50 dark:bg-green-950/20 rounded-3xl p-8 border border-green-200 dark:border-green-900 shadow-sm">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Why calculate your footprint?</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              You can&apos;t manage what you don&apos;t measure. By understanding your specific carbon sources, you can make targeted changes—whether switching to renewable energy, driving less, or adjusting your diet—that significantly reduce your personal contribution to climate change. Every ton of carbon saved is a step toward a sustainable future.
            </p>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="max-w-6xl mx-auto py-24 px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Everything you need to go green</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-8 bg-card rounded-3xl border border-border hover:border-eco-primary/50 transition-colors shadow-sm">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-eco-primary mb-6">
                <Calculator className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Calculate</h3>
              <p className="text-muted-foreground">Measure your footprint across transport, energy, food, and waste in under 3 minutes.</p>
            </div>
            <div className="flex flex-col items-center text-center p-8 bg-card rounded-3xl border border-border hover:border-eco-primary/50 transition-colors shadow-sm">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-eco-primary mb-6">
                <Bot className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Coach</h3>
              <p className="text-muted-foreground">Get personalized, actionable reduction plans tailored precisely to your lifestyle by EcoCoach.</p>
            </div>
            <div className="flex flex-col items-center text-center p-8 bg-card rounded-3xl border border-border hover:border-eco-primary/50 transition-colors shadow-sm">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-eco-primary mb-6">
                <Trophy className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Gamify</h3>
              <p className="text-muted-foreground">Earn badges, improve your Green Score, and compete on the global sustainability leaderboard.</p>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-border py-8 text-center z-10 bg-background">
        <p className="text-muted-foreground text-sm font-medium">
          Built for a greener future &middot; EcoTrack AI 2025
        </p>
      </footer>
    </div>
  )
}
