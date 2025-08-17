import { GitBranch, Star, TrendingUp, Zap, Shield, BarChart3, GitPullRequest, Play, Book } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ApiDemo() {
  const [apiUrl, setApiUrl] = useState("https://github.com/assafelovic/gpt-researcher")
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState({
    summary:
      "GPT Researcher is an autonomous agent designed for comprehensive online research on various tasks. It aims to produce detailed, factual, and unbiased research reports by leveraging AI technology. The project addresses issues of misinformation, speed, determinism, and reliability in research tasks.",
    cool_facts: [
      "The project leverages both 'gpt-do-mini' and 'gpt-4o' (128K context) to complete research tasks, optimizing costs by using each only when necessary.",
      "The average research task using GPT Researcher takes around 2 minutes to complete and costs approximately $0.005.",
      "The project has gained significant traction in the AI research community with over 5,000 stars on GitHub.",
      "It supports multiple research methodologies including web search, document analysis, and cross-referencing.",
    ],
    stars: 5432,
    latest_version: "v0.3.0",
    website: "https://gpt-researcher.com",
    license: "MIT"
  })

  const router = useRouter()

  // Validate GitHub URL format
  const isValidGitHubUrl = (url) => {
    const githubUrlPattern = /^https:\/\/github\.com\/[^\/]+\/[^\/]+/
    return githubUrlPattern.test(url.trim())
  }

  // Check if button should be enabled
  const isButtonEnabled = apiUrl.trim() && isValidGitHubUrl(apiUrl)

  const handleSendRequest = () => {
    if (isButtonEnabled) {
      // Store the URL in sessionStorage for the playground
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('demoGitHubUrl', apiUrl.trim())
      }
      // Redirect to playground
      router.push('/playground')
    }
  }

  const handleApiCall = async () => {
    setIsLoading(true)
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock response based on URL
    if (apiUrl.includes("facebook/react")) {
      setResponse({
        summary:
          "React is a JavaScript library for building user interfaces, particularly web applications. It was created by Facebook and is now maintained by Meta and the community. React allows developers to create reusable UI components and manage application state efficiently.",
        cool_facts: [
          "React has over 220,000 stars on GitHub and is one of the most popular JavaScript libraries.",
          "The library was first released in 2013 and introduced the concept of a virtual DOM to improve performance.",
          "React Native allows you to build mobile apps using the same React components and logic.",
          "The project has a massive ecosystem with thousands of third-party libraries and tools.",
        ],
        stars: 220000,
        latest_version: "v18.3.1",
        website: "https://react.dev",
        license: "MIT"
      })
    } else if (apiUrl.includes("microsoft/vscode")) {
      setResponse({
        summary:
          "Visual Studio Code is a free, open-source code editor developed by Microsoft. It supports a wide range of programming languages and includes features like debugging, syntax highlighting, intelligent code completion, and Git integration.",
        cool_facts: [
          "VS Code has over 160,000 stars and is the most popular code editor among developers.",
          "The editor is built using Electron and TypeScript, making it cross-platform and highly extensible.",
          "VS Code has a rich extension marketplace with thousands of free and paid extensions.",
          "It's completely free and open-source, despite being developed by Microsoft.",
        ],
        stars: 160000,
        latest_version: "v1.89.0",
        website: "https://code.visualstudio.com",
        license: "MIT"
      })
    } else {
      // Default response for the original URL
      setResponse({
        summary:
          "GPT Researcher is an autonomous agent designed for comprehensive online research on various tasks. It aims to produce detailed, factual, and unbiased research reports by leveraging AI technology. The project addresses issues of misinformation, speed, determinism, and reliability in research tasks.",
        cool_facts: [
          "The project leverages both 'gpt-do-mini' and 'gpt-4o' (128K context) to complete research tasks, optimizing costs by using each only when necessary.",
          "The average research task using GPT Researcher takes around 2 minutes to complete and costs approximately $0.005.",
          "The project has gained significant traction in the AI research community with over 5,000 stars on GitHub.",
          "It supports multiple research methodologies including web search, document analysis, and cross-referencing.",
        ],
        stars: 5432,
        latest_version: "v0.3.0",
        website: "https://gpt-researcher.com",
        license: "MIT"
      })
    }
    setIsLoading(false)
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Request Panel */}
      <div className="border border-border rounded-lg p-6 bg-card">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Play className="w-5 h-5 text-primary" />
              API Request
            </h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm border border-border rounded bg-transparent hover:bg-accent transition-colors flex items-center gap-2">
                <Book className="w-4 h-4" />
                Documentation
              </button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">POST https://api.devkeyhub.com/github-summarizer</p>
          <p className="text-xs text-muted-foreground mt-1">Get comprehensive repository analysis including summary, facts, stars, version, license & website</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">GitHub Repository URL</label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className={`w-full p-3 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm break-all ${
                apiUrl.trim() && !isValidGitHubUrl(apiUrl) 
                  ? 'border-red-500 focus:ring-red-500/50' 
                  : 'border-border focus:ring-primary/50'
              }`}
              placeholder="https://github.com/owner/repo"
            />
            {apiUrl.trim() && !isValidGitHubUrl(apiUrl) && (
              <p className="text-sm text-red-500 mt-1">Please enter a valid GitHub repository URL</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Request Body (JSON)</label>
            <div className="bg-muted/50 p-4 rounded-lg border border-border overflow-hidden">
              <pre className="text-sm text-muted-foreground whitespace-pre-wrap break-all">
                {`{
  "githubUrl": "${apiUrl}"
}`}
              </pre>
            </div>
          </div>

          <button
            onClick={handleSendRequest}
            disabled={!isButtonEnabled || isLoading}
            className={`w-full px-4 py-2 rounded-lg transition-colors flex items-center gap-2 justify-center ${
              isButtonEnabled 
                ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            <Play className="w-4 h-4" />
            Send Request
          </button>
        </div>
      </div>

      {/* Response Panel */}
      <div className="border border-border rounded-lg p-6 bg-card">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-accent" />
            Repository Analysis Results
          </h3>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 text-xs bg-green-500/10 text-green-600 border border-green-500/20 rounded">200 OK</span>
            <span className="text-sm text-muted-foreground">Response time: ~2.5s</span>
          </div>
        </div>
        
        {/* Enhanced Response Display */}
        <div className="space-y-4">
          {/* Repository Summary */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Summary</h4>
            <div className="bg-muted/50 p-3 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {response.summary}
              </p>
            </div>
          </div>

          {/* Cool Facts */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Cool Facts</h4>
            <div className="bg-muted/50 p-3 rounded-lg border border-border">
              <ul className="space-y-2">
                {response.cool_facts.map((fact, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start">
                    <span className="text-accent mr-2">•</span>
                    {fact}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Repository Stats */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Repository Stats</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="text-xs font-medium text-blue-600">Stars</div>
                <div className="text-lg font-bold text-blue-900">{response.stars.toLocaleString()}</div>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="text-xs font-medium text-green-600">Latest Version</div>
                <div className="text-lg font-bold text-green-900">{response.latest_version}</div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Additional Information</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <div className="text-xs font-medium text-purple-600">License</div>
                <div className="text-lg font-bold text-purple-900">{response.license}</div>
              </div>
              
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                <div className="text-xs font-medium text-orange-600">Website</div>
                <div className="text-sm font-medium text-orange-900 truncate">
                  {response.website ? (
                    <a 
                      href={response.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-orange-600 hover:text-orange-500 underline"
                    >
                      {response.website}
                    </a>
                  ) : (
                    <span className="text-orange-400">Not available</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Raw JSON Response */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Raw JSON Response</h4>
            <div className="bg-muted/50 p-3 rounded-lg border border-border overflow-auto max-h-32">
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 