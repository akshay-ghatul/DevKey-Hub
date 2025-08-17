/**
 * LangChain service module
 * Handles AI-powered repository summarization using OpenAI and LangChain
 */

import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

// Define the structured output schema using Zod
const summarySchema = z.object({
  summary: z.string().describe("A concise summary of the GitHub repository"),
  cool_facts: z.array(z.string()).describe("3-5 interesting facts about the repository"),
  stars: z.number().describe("Number of stars the repository has"),
  latest_version: z.string().describe("Latest version/tag of the repository"),
  website: z.string().nullable().describe("Website URL of the repository (if available)"),
  license: z.string().describe("License type of the repository")
});

/**
 * Uses OpenAI (ChatOpenAI) to summarize the README with structured output.
 * @param {string} readmeContent - The content of the README.md file
 * @param {Object} metadata - Repository metadata (stars, latest_version, website, license)
 * @returns {Promise<{summary: string, cool_facts: string[], stars: number, latest_version: string, website: string|null, license: string}>} - Structured summary
 */
export async function summarizeGithubReadme(readmeContent, metadata) {
  // Use gpt-4o-mini as default model, or override via env
  const modelName = process.env.OPENAI_MODEL || "gpt-4o-mini";
  
  // Create the base LLM
  const llm = new ChatOpenAI({
    model: modelName,
    temperature: 0.2,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  // Bind the structured output to the model
  const structuredLlm = llm.withStructuredOutput(summarySchema);

  // Limit README content to avoid exceeding token quota
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
    
    // Merge the LLM result with repository metadata
    return {
      ...result,
      stars: metadata.stars,
      latest_version: metadata.latest_version,
      website: metadata.website,
      license: metadata.license
    };
  } catch (e) {
    console.error("Error occurred during LLM analysis:", e);
    // Return fallback structure that matches the schema
    return {
      summary: "Unable to analyze the README content at this time.",
      cool_facts: ["Error occurred during LLM analysis"],
      stars: metadata.stars,
      latest_version: metadata.latest_version,
      website: metadata.website,
      license: metadata.license
    };
  }
} 