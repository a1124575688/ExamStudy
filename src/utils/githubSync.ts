import type { AppData } from '@/types';
import GITHUB_CONFIG from '@/config/github';

interface GitHubFileResponse {
  content: string;
  sha: string;
}

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (GITHUB_CONFIG.token) {
    headers.Authorization = `Bearer ${GITHUB_CONFIG.token}`;
  }
  return headers;
}

function buildApiUrl(): string {
  return `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}`;
}

export async function loadFromGitHub(): Promise<AppData | null> {
  if (!GITHUB_CONFIG.token) {
    console.warn('GitHub token is not configured, skip loading from remote.');
    return null;
  }

  const url = `${buildApiUrl()}?ref=${GITHUB_CONFIG.branch}`;
  const response = await fetch(url, { method: 'GET', headers: getHeaders() });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to load data from GitHub: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as GitHubFileResponse;
  const json = atob(data.content.replace(/\n/g, ''));
  const parsed = JSON.parse(json) as AppData;

  return {
    studyItems: parsed.studyItems || [],
    reviewTasks: parsed.reviewTasks || [],
  };
}

export async function saveToGitHub(data: AppData, sha?: string): Promise<void> {
  if (!GITHUB_CONFIG.token) {
    console.warn('GitHub token is not configured, skip saving to remote.');
    return;
  }

  const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));

  const body: Record<string, string> = {
    message: 'Update study data via Ebbinghaus app',
    content,
    branch: GITHUB_CONFIG.branch,
  };

  if (sha) {
    body.sha = sha;
  }

  const response = await fetch(buildApiUrl(), {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Failed to save data to GitHub: ${response.status} ${response.statusText}`);
  }
}

export async function getFileSha(): Promise<string | null> {
  if (!GITHUB_CONFIG.token) {
    return null;
  }

  const url = `${buildApiUrl()}?ref=${GITHUB_CONFIG.branch}`;
  const response = await fetch(url, { method: 'GET', headers: getHeaders() });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to get file sha from GitHub: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as { sha: string };
  return data.sha;
}
