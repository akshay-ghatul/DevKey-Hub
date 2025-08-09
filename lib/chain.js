/**
 * Summarizes GitHub repository README content using OpenAI via LangChain.
 * Uses the @langchain/openai ChatOpenAI model with structured output.
 * @param {string} readmeContent - The content of the README.md file
 * @returns {Promise<{summary: string, cool_facts: string[]}>} - Structured summary with facts
 */
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

// Define the structured output schema using Zod
const summarySchema = z.object({
  summary: z.string().describe("A concise summary of the GitHub repository"),
  cool_facts: z.array(z.string()).describe("3-5 interesting facts about the repository")
});

/**
 * Uses OpenAI (ChatOpenAI) to summarize the README with structured output.
 * You can change the model by setting the OPENAI_MODEL environment variable.
 * Requires OPENAI_API_KEY to be set in the environment.
 */
export async function summarizeGithubReadme(readmeContent) {
  // Use gpt-4o-mini as default model (better for structured output), or override via env
  const modelName = process.env.OPENAI_MODEL || "gpt-4o-mini";
  
  // Create the base LLM
  const llm = new ChatOpenAI({
    model: modelName,
    temperature: 0.2,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  // Bind the structured output to the model
  const structuredLlm = llm.withStructuredOutput(summarySchema);

  // Limit README content to avoid exceeding token quota (approx 3000 chars ~ 1000 tokens)
  const MAX_CHARS = 3000;
  const truncatedReadme = readmeContent.length > MAX_CHARS
    ? readmeContent.slice(0, MAX_CHARS)
    : readmeContent;

  // Create the prompt template
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system", 
      "You are an expert technical writer. Analyze the GitHub repository README content and provide a structured summary."
    ],
    [
      "human",
      "Please summarize this GitHub repository based on the README content:\n\n{readmeContent}"
    ]
  ]);

  // Create the chain: prompt -> structured LLM
  const chain = prompt.pipe(structuredLlm);

  try {
    // Run the chain with structured output
    const result = await chain.invoke({ readmeContent: truncatedReadme });
    return result;
  } catch (e) {
    console.error("Error occurred during LLM analysis:", e);
    // Return fallback structure that matches the schema
    return {
      summary: "Unable to analyze the README content at this time.",
      cool_facts: ["Error occurred during LLM analysis"]
    };
  }
}

/**
 * Fetches the content of README.md from a given GitHub repository URL.
 * @param {string} githubUrl - The URL of the GitHub repository (e.g., https://github.com/user/repo)
 * @returns {Promise<string|null>} - The content of README.md as a string, or null if not found/error.
 */
export async function getReadmeContentFromGithub(githubUrl) {
  try {
    // Extract owner and repo from the URL
    const match = githubUrl.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)(\/|$)/);
    if (!match) {
      throw new Error('Invalid GitHub repository URL');
    }
    const owner = match[1];
    const repo = match[2];

    // Try to fetch README.md from the main or master branch
    const branches = ['main', 'master'];
    for (const branch of branches) {
      const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`;
      const res = await fetch(rawUrl);
      if (res.ok) {
        return await res.text();
      }
    }

    // If not found in main/master, try GitHub API to get default branch
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
    const repoRes = await fetch(apiUrl);
    if (repoRes.ok) {
      const repoData = await repoRes.json();
      if (repoData.default_branch) {
        const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${repoData.default_branch}/README.md`;
        const res = await fetch(rawUrl);
        if (res.ok) {
          return await res.text();
        }
      }
    }

    // README.md not found
    return null;
  } catch (err) {
    console.error('Error fetching README.md:', err);
    return null;
  }
}