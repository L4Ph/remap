import ky from 'ky';

export interface IGitHubAccountInfo {
  login: string;
  id: number;
  html_url: string;
}

export interface IFetchAccountInfoResult {
  success: boolean;
  error?: string;
  cause?: any;
  info?: IGitHubAccountInfo;
}

export interface IGitHub {
  fetchAccountInfo: (uid: string) => Promise<IFetchAccountInfoResult>;
}

const GITHUB_USER_URL = 'https://api.github.com/user';

export class GitHub implements IGitHub {
  async fetchAccountInfo(uid: string): Promise<IFetchAccountInfoResult> {
    try {
      const url = `${GITHUB_USER_URL}/${uid}`;
      const data: IGitHubAccountInfo = await ky.get(url).json();
      return {
        success: true,
        info: data,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Fetching GitHub account info failed.',
        cause: error,
      };
    }
  }
}
