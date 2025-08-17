/**
 * Main chain module - orchestrates GitHub repository analysis
 * This file now serves as a coordinator between GitHub API operations and LangChain services
 */

import { getRepositoryMetadata, getReadmeContentFromGithub } from './githubApi.js';
import { summarizeGithubReadme } from './langchainService.js';

/**
 * Main function to analyze a GitHub repository
 * Fetches README content and metadata in parallel, then generates AI summary
 * @param {string} githubUrl - The URL of the GitHub repository
 * @returns {Promise<{summary: string, cool_facts: string[], stars: number, latest_version: string, website: string|null, license: string}>} - Complete analysis
 */
export async function analyzeGithubRepository(githubUrl) {
  try {
    // Fetch README content and repository metadata in parallel for better performance
    const [readmeContent, metadata] = await Promise.all([
      getReadmeContentFromGithub(githubUrl),
      getRepositoryMetadata(githubUrl)
    ]);

    if (!readmeContent) {
      throw new Error('Could not fetch README.md from the provided GitHub repository');
    }

    // Generate AI summary using the fetched content and metadata
    return await summarizeGithubReadme(readmeContent, metadata);
  } catch (error) {
    console.error('Error analyzing GitHub repository:', error);
    throw error;
  }
}

// Re-export the functions for backward compatibility
export { getRepositoryMetadata, getReadmeContentFromGithub, summarizeGithubReadme };