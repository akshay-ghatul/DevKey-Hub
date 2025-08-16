import { GitBranch, Star, TrendingUp, Zap, Shield, BarChart3, GitPullRequest, Play, Book } from "lucide-react"
import { useState } from "react"

export default function ApiDemo() {
  const [apiUrl, setApiUrl] = useState("https://github.com/assafelovic/gpt-researcher")
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState({
    summary:
      "GPT Researcher is an autonomous agent designed for comprehensive online research on various tasks. It aims to produce detailed, factual, and unbiased research reports by leveraging AI technology. The project addresses issues of misinformation, speed, determinism, and reliability in research tasks.",
    cool_facts: [
      "The project leverages both 'gpt-do-mini' and 'gpt-4o' (128K context) to complete research tasks, optimizing costs by using each only when necessary.",
      "The average research task using GPT Researcher takes around 2 minutes to complete and costs approximately $0.005.",
    ],
  })

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
        ],
      })
    } else if (apiUrl.includes("microsoft/vscode")) {
      setResponse({
        summary:
          "Visual Studio Code is a free, open-source code editor developed by Microsoft. It supports a wide range of programming languages and includes features like debugging, syntax highlighting, intelligent code completion, and Git integration.",
        cool_facts: [
          "VS Code has over 160,000 stars and is the most popular code editor among developers.",
          "The editor is built using Electron and TypeScript, making it cross-platform and highly extensible.",
        ],
      })
    } else {
      // Default response for the original URL
      setResponse({
        summary:
          "GPT Researcher is an autonomous agent designed for comprehensive online research on various tasks. It aims to produce detailed, factual, and unbiased research reports by leveraging AI technology. The project addresses issues of misinformation, speed, determinism, and reliability in research tasks.",
        cool_facts: [
          "The project leverages both 'gpt-do-mini' and 'gpt-4o' (128K context) to complete research tasks, optimizing costs by using each only when necessary.",
          "The average research task using GPT Researcher takes around 2 minutes to complete and costs approximately $0.005.",
        ],
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
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">GitHub Repository URL</label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm break-all"
              placeholder="https://github.com/owner/repo"
            />
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
            onClick={handleApiCall}
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center gap-2 justify-center">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                Analyzing...
              </div>
            ) : (
              <div className="flex items-center gap-2 justify-center">
                <Play className="w-4 h-4" />
                Send Request
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Response Panel */}
      <div className="border border-border rounded-lg p-6 bg-card">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-accent" />
            API Response
          </h3>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 text-xs bg-green-500/10 text-green-600 border border-green-500/20 rounded">200 OK</span>
            <span className="text-sm text-muted-foreground">Response time: ~2.5s</span>
          </div>
        </div>
        <div className="bg-muted/50 p-4 rounded-lg border border-border overflow-auto max-h-96">
          <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
} 