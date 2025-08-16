'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GitBranch, Star, TrendingUp, Zap, Shield, BarChart3, GitPullRequest } from "lucide-react"
import { useSession, signIn, signOut } from "next-auth/react"

export default function HomePage() {
  const { data: session, status } = useSession()

  const handleLogin = () => {
    if (session) {
      signOut()
    } else {
      signIn('google')
    }
  }

  const handleSignUp = () => {
    signIn('google')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">DevKey Hub</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              className="border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 bg-white text-gray-700 font-medium px-6 py-2 rounded-lg transition-all duration-200"
              onClick={() => window.location.href = '/dashboards'}
            >
              Dashboard
            </Button>
            <Button 
              variant="ghost" 
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium px-6 py-2 rounded-lg transition-all duration-200"
              onClick={handleLogin}
            >
              {session ? 'Sign Out' : 'Login'}
            </Button>
            {!session && (
              <Button 
                className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                onClick={handleSignUp}
              >
                Sign Up
              </Button>
            )}
            {session && (
              <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-blue-50 px-4 py-2 rounded-lg border border-green-200">
                {session.user.image && (
                  <img 
                    src={session.user.image} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full ring-2 ring-green-300"
                  />
                )}
                <span className="text-sm font-medium text-gray-700">
                  {session.user.name || session.user.email}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-6 bg-accent/10 text-accent border-accent/20">GitHub Analytics Made Simple</Badge>
          <h1 className="text-5xl font-bold text-foreground mb-6 leading-tight">
            Unlock Deep Insights from Your
            <span className="text-primary"> GitHub Repositories</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Get comprehensive analytics, track important updates, and discover cool facts about any open source
            repository. Make data-driven decisions with our powerful GitHub analyzer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
              Start Analyzing Free
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 bg-white text-gray-700 font-semibold px-8 py-4 rounded-lg transition-all duration-200">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Everything You Need to Analyze GitHub Repositories
            </h2>
            <p className="text-lg text-muted-foreground">Comprehensive insights and analytics at your fingertips</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-foreground">Repository Summary</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Get instant overviews of any repository including key metrics, activity trends, and project health.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-foreground">Star Analytics</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Track star growth patterns, identify viral moments, and understand repository popularity trends.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-foreground">Cool Facts</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Discover interesting statistics, contributor insights, and unique patterns in repository data.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <GitPullRequest className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-foreground">Pull Request Tracking</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Monitor important PRs, track merge patterns, and identify key contributors and changes.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-foreground">Version Updates</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Stay informed about releases, version patterns, and update frequencies across projects.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-foreground">Security Insights</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Analyze security practices, vulnerability patterns, and maintenance quality indicators.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-muted-foreground">Start free and scale as you grow</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Tier */}
            <Card className="border-border relative">
              <CardHeader className="text-center">
                <CardTitle className="text-foreground">Free</CardTitle>
                <div className="text-3xl font-bold text-foreground mt-4">$0</div>
                <CardDescription className="text-muted-foreground">Perfect for getting started</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center text-muted-foreground">
                    <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>5 repository analyses per month
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                    Basic insights and summaries
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                    Star tracking
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                    Community support
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Pro Tier */}
            <Card className="border-primary relative shadow-lg">
              <div className="absolute -top-2 -right-2">
                <Badge className="bg-orange-500 text-white text-xs px-2 py-1">Coming Soon</Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-foreground">Pro</CardTitle>
                <div className="text-3xl font-bold text-foreground mt-4">$29</div>
                <CardDescription className="text-muted-foreground">For serious developers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    100 repository analyses per month
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Advanced analytics & insights
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    PR tracking & version monitoring
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Export reports (PDF, CSV)
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Priority support
                  </li>
                </ul>
                <Button disabled className="w-full mt-6 bg-muted text-muted-foreground cursor-not-allowed">
                  Coming Soon
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Tier */}
            <Card className="border-border relative">
              <div className="absolute -top-2 -right-2">
                <Badge className="bg-orange-500 text-white text-xs px-2 py-1">Coming Soon</Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-foreground">Enterprise</CardTitle>
                <div className="text-3xl font-bold text-foreground mt-4">Custom</div>
                <CardDescription className="text-muted-foreground">For teams and organizations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center text-muted-foreground">
                    <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                    Unlimited analyses
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                    Custom integrations
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                    Team collaboration tools
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                    Dedicated support
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                    SLA guarantees
                  </li>
                </ul>
                <Button disabled className="w-full mt-6 bg-muted text-muted-foreground cursor-not-allowed">
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl font-bold text-foreground mb-6">Ready to Unlock Your Repository Insights?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of developers who trust DevKey Hub for their GitHub analytics needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
              Start Free Analysis
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 bg-white text-gray-700 font-semibold px-8 py-4 rounded-lg transition-all duration-200">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <GitBranch className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold text-foreground">DevKey Hub</span>
              </div>
              <p className="text-muted-foreground text-sm">Powerful GitHub analytics for developers and teams.</p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Status
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 DevKey Hub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
