/**
 * Summarizes GitHub repository README content using OpenAI via LangChain.
 * Uses the @langchain/openai ChatOpenAI model (default: gpt-3.5-turbo).
 * @param {string} readmeContent - The content of the README.md file
 * @returns {Promise<{summary: string, cool_facts: string[]}>} - Structured summary with facts
 */
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatOpenAI } from "@langchain/openai";

/**
 * Uses OpenAI (ChatOpenAI) to summarize the README.
 * You can change the model by setting the OPENAI_MODEL environment variable.
 * Requires OPENAI_API_KEY to be set in the environment.
 */
export async function summarizeGithubReadme(readmeContent) {
  // Use gpt-3.5-turbo as default model, or override via env
  const modelName = process.env.OPENAI_MODEL || "gpt-4.1-mini";
  const llm = new ChatOpenAI({
    model: modelName,
    temperature: 0.2
  });

  // Limit README content to avoid exceeding token quota (approx 3000 chars ~ 1000 tokens)
  const MAX_CHARS = 3000;
  const truncatedReadme = readmeContent.length > MAX_CHARS
    ? readmeContent.slice(0, MAX_CHARS)
    : readmeContent;

  const systemPrompt = `
You are an expert technical writer. Summarize this GitHub repository from this readme file content. 
Return a JSON object with two fields: 'summary' (a concise summary string) and 'cool_facts' (an array of 3-5 interesting facts about the repository). 
Only output valid JSON. Here is the README content:
${truncatedReadme}
`;

  // Call ChatOpenAI directly with the prompt/messages
  const messages = [
    { role: "system", content: systemPrompt }
  ];

  let rawOutput;
  try {
    const response = await llm.invoke(messages);
    // The response from ChatOpenAI is an object with a .content property
    rawOutput = response.content;
  } catch (e) {
    console.error("Error occurred during LLM analysis", e);
    return {
      summary: "Unable to analyze the README content at this time.",
      cool_facts: ["Error occurred during LLM analysis"]
    };
  }

  // Parse the output as JSON (the LLM is instructed to return JSON)
  let result;
  try {
    result = JSON.parse(rawOutput);
    // Ensure structure
    if (
      typeof result.summary !== "string" ||
      !Array.isArray(result.cool_facts)
    ) {
      throw new Error("Malformed LLM output");
    }
  } catch (e) {
    // Fallback in case of LLM output error
    return {
      summary: "Unable to analyze the README content at this time.",
      cool_facts: ["Error occurred during LLM analysis"]
    };
  }

  return result;
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