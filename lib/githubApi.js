/**
 * GitHub API operations module
 * Handles fetching repository metadata, README content, and other GitHub-related operations
 */

/**
 * Fetches repository metadata including stars, latest version, website, and license from GitHub API.
 * @param {string} githubUrl - The URL of the GitHub repository
 * @returns {Promise<{stars: number, latest_version: string, website: string, license: string}>} - Repository metadata
 */
export async function getRepositoryMetadata(githubUrl) {
  try {
    const { owner, repo } = extractOwnerAndRepo(githubUrl);
    
    // Fetch repository info and latest release/tag in parallel
    const [repoData, releasesData, tagsData] = await Promise.allSettled([
      fetchRepositoryInfo(owner, repo),
      fetchLatestRelease(owner, repo),
      fetchLatestTag(owner, repo)
    ]);

    // Extract stars from repository data
    const stars = repoData.status === 'fulfilled' ? (repoData.value.stargazers_count || 0) : 0;
    
    // Extract website URL and license from repository data
    const website = repoData.status === 'fulfilled' ? (repoData.value.homepage || null) : null;
    const license = repoData.status === 'fulfilled' ? (repoData.value.license?.name || 'No license') : 'Unable to fetch';
    
    // Determine latest version (prefer releases over tags)
    let latestVersion = "No releases found";
    if (releasesData.status === 'fulfilled' && releasesData.value) {
      latestVersion = releasesData.value.tag_name || releasesData.value.name || "Latest release";
    } else if (tagsData.status === 'fulfilled' && tagsData.value && tagsData.value.length > 0) {
      latestVersion = tagsData.value[0].name;
    }

    return { 
      stars, 
      latest_version: latestVersion,
      website,
      license
    };
  } catch (err) {
    console.error('Error fetching repository metadata:', err);
    return { 
      stars: 0, 
      latest_version: "Unable to fetch",
      website: null,
      license: "Unable to fetch"
    };
  }
}

/**
 * Fetches the content of README.md from a given GitHub repository URL.
 * @param {string} githubUrl - The URL of the GitHub repository
 * @returns {Promise<string|null>} - The content of README.md as a string, or null if not found/error.
 */
export async function getReadmeContentFromGithub(githubUrl) {
  try {
    const { owner, repo } = extractOwnerAndRepo(githubUrl);
    
    // Try to fetch README from main branches and get default branch info in parallel
    const [mainBranchReadme, masterBranchReadme, defaultBranchInfo] = await Promise.allSettled([
      fetchReadmeFromBranch(owner, repo, 'main'),
      fetchReadmeFromBranch(owner, repo, 'master'),
      fetchDefaultBranchInfo(owner, repo)
    ]);

    // Return the first successful README fetch
    if (mainBranchReadme.status === 'fulfilled' && mainBranchReadme.value) {
      return mainBranchReadme.value;
    }
    
    if (masterBranchReadme.status === 'fulfilled' && masterBranchReadme.value) {
      return masterBranchReadme.value;
    }

    // Try default branch if main/master didn't work
    if (defaultBranchInfo.status === 'fulfilled' && defaultBranchInfo.value) {
      const defaultBranchReadme = await fetchReadmeFromBranch(owner, repo, defaultBranchInfo.value);
      if (defaultBranchReadme) {
        return defaultBranchReadme;
      }
    }

    return null;
  } catch (err) {
    console.error('Error fetching README.md:', err);
    return null;
  }
}

/**
 * Extracts owner and repository name from a GitHub URL.
 * @param {string} githubUrl - The GitHub repository URL
 * @returns {{owner: string, repo: string}} - Object containing owner and repo
 * @throws {Error} - If the URL is invalid
 */
function extractOwnerAndRepo(githubUrl) {
  const match = githubUrl.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)(\/|$)/);
  if (!match) {
    throw new Error('Invalid GitHub repository URL');
  }
  return { owner: match[1], repo: match[2] };
}

/**
 * Fetches basic repository information from GitHub API.
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @returns {Promise<Object>} - Repository data
 */
async function fetchRepositoryInfo(owner, repo) {
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
  const response = await fetch(apiUrl);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch repository data: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Fetches the latest release from GitHub API.
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @returns {Promise<Object|null>} - Latest release data or null
 */
async function fetchLatestRelease(owner, repo) {
  const releasesUrl = `https://api.github.com/repos/${owner}/${repo}/releases/latest`;
  const response = await fetch(releasesUrl);
  
  if (!response.ok) {
    return null; // No releases found
  }
  
  return response.json();
}

/**
 * Fetches the latest tag from GitHub API.
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @returns {Promise<Array|null>} - Array of tags or null
 */
async function fetchLatestTag(owner, repo) {
  const tagsUrl = `https://api.github.com/repos/${owner}/${repo}/tags`;
  const response = await fetch(tagsUrl);
  
  if (!response.ok) {
    return null;
  }
  
  return response.json();
}

/**
 * Fetches README content from a specific branch.
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} branch - Branch name
 * @returns {Promise<string|null>} - README content or null
 */
async function fetchReadmeFromBranch(owner, repo, branch) {
  const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`;
  const response = await fetch(rawUrl);
  
  if (!response.ok) {
    return null;
  }
  
  return response.text();
}

/**
 * Fetches the default branch information for a repository.
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @returns {Promise<string|null>} - Default branch name or null
 */
async function fetchDefaultBranchInfo(owner, repo) {
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
  const response = await fetch(apiUrl);
  
  if (!response.ok) {
    return null;
  }
  
  const repoData = await response.json();
  return repoData.default_branch || null;
} 