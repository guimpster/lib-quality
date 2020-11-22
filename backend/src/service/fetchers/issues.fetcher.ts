import { Injectable } from '@nestjs/common';

import { GitHubBaseFetcher } from './base.fetcher';
import { Issue } from '../../model';

@Injectable()
export class GitHubIssuesFetcher extends GitHubBaseFetcher<Issue> {

  getUrl(): string {
    return 'https://api.github.com/repos/facebook/react/issues';
  } 
}