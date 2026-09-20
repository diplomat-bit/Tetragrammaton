
import { GithubRepo, GithubFile } from '../types';

const BASE_URL = 'https://api.github.com';
const RAW_URL = 'https://raw.githubusercontent.com';
const USERNAME = 'jocall3';

export const githubService = {
  /**
   * RECURSIVE REPO CRAWL: Fetches every single repository on the account by 
   * iterating through all API pages until no more are found.
   */
  async getUserRepos(): Promise<GithubRepo[]> {
    try {
      let allRepos: GithubRepo[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await fetch(`${BASE_URL}/users/${USERNAME}/repos?sort=updated&per_page=100&page=${page}`);
        if (!response.ok) {
          throw new Error(`GitHub Error: ${response.status} - ${response.statusText}`);
        }
        const data: GithubRepo[] = await response.json();
        if (data.length === 0) {
          hasMore = false;
        } else {
          allRepos = [...allRepos, ...data];
          page++;
        }
        // Safety break for extremely large accounts to prevent browser hang
        if (page > 50) break; 
      }
      return allRepos;
    } catch (e: any) {
      console.error("Total repo crawl failed", e);
      throw e;
    }
  },

  async getRepoDetails(repoName: string): Promise<any> {
    const response = await fetch(`${BASE_URL}/repos/${USERNAME}/${repoName}`);
    if (!response.ok) throw new Error('Failed to fetch repo details');
    return response.json();
  },

  async getAllRepoFilesRecursively(repoName: string, path: string = ''): Promise<GithubFile[]> {
    try {
      const repoData = await this.getRepoDetails(repoName);
      const branch = repoData.default_branch || 'main';
      const response = await fetch(`${BASE_URL}/repos/${USERNAME}/${repoName}/git/trees/${branch}?recursive=1`);
      
      if (!response.ok) return this.getRepoContents(repoName, path);

      const data = await response.json();
      const allFiles: GithubFile[] = data.tree
        .filter((item: any) => item.type === 'blob')
        .filter((item: any) => {
          const skip = /\.(png|jpg|jpeg|gif|ico|pdf|zip|exe|dll|woff|woff2|ttf|mp4|mov|avi|pyc|o|a)$/i.test(item.path);
          const inPath = path === '' || item.path.startsWith(path);
          return !skip && inPath;
        })
        .map((item: any) => ({
          name: item.path.split('/').pop(),
          path: item.path,
          type: 'file',
          download_url: `${RAW_URL}/${USERNAME}/${repoName}/${branch}/${item.path}`,
          size: item.size || 0
        }));

      return allFiles;
    } catch (e) {
      return [];
    }
  },

  async getRepoContents(repoName: string, path: string = ''): Promise<GithubFile[]> {
    try {
      const response = await fetch(`${BASE_URL}/repos/${USERNAME}/${repoName}/contents/${path}`);
      if (!response.ok) throw new Error(`Failed to fetch contents: ${response.status}`);
      return response.json();
    } catch (e: any) {
      console.error(e);
      throw e;
    }
  },

  async getFileContent(url: string): Promise<string> {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch raw content');
      return response.text();
    } catch (e) {
      return "Error: Could not retrieve file content.";
    }
  }
};
