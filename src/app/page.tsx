import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function Home() {

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2 py-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-20 h-20 bg-primary rounded-lg flex items-center justify-center">
                <Image
                  src="/logo.PNG"
                  alt="Alpha Logo"
                  width={192}
                  height={192}
                  className="object-contain"
                />
              </div>
              {/* <h1 className="text-2xl font-bold text-foreground">AlphaCode</h1> */}
            </div>
            <Button variant="outline">Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-foreground mb-6">
            Meet <span className="text-primary">Alpha Mini</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            A smart, compact and powerful AI assistant designed to support you in all your daily tasks.
            With advanced natural language processing capabilities and deep contextual understanding.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Try it now
            </Button>
            <Button variant="outline" size="lg">
              Learn more
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-foreground mb-16">Key Features</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border border-border shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-secondary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-foreground mb-4">High Speed</h4>
                <p className="text-muted-foreground">Extremely fast processing and response, helping you save time and increase work efficiency.</p>
              </CardContent>
            </Card>

            <Card className="border border-border shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-secondary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-foreground mb-4">Smart</h4>
                <p className="text-muted-foreground">Understands context and your intentions, providing accurate and helpful answers.</p>
              </CardContent>
            </Card>

            <Card className="border border-border shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-secondary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-foreground mb-4">User-friendly</h4>
                <p className="text-muted-foreground">Simple interface, easy to use and suitable for all types of users.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-foreground mb-6">About Alpha Mini</h3>
              <p className="text-lg text-muted-foreground mb-6">
                Alpha Mini is the compact version of the Alpha AI product line, optimized to deliver high performance
                in a compact package. Developed by a team of talented engineers, Alpha Mini combines advanced
                AI technology with user-friendly design.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                From answering questions, writing assistance, data analysis to solving complex problems,
                Alpha Mini is a reliable companion in work and life.
              </p>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Explore now
              </Button>
            </div>
            <div className="relative">
              <div className="w-full h-96 bg-primary rounded-2xl shadow-2xl flex items-center justify-center">
                <div className="text-primary-foreground text-6xl font-bold">α</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">α</span>
            </div>
            <span className="text-xl font-bold text-foreground">Alpha Mini</span>
          </div>
          <p className="text-muted-foreground mb-4">
            © 2025 Alpha Mini. Developed with ❤️ by SEP-AlphaCode.
          </p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
