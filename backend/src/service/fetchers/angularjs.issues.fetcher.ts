import { Injectable } from '@nestjs/common';

import { GitHubBaseFetcher } from './base.fetcher';
import { Issue } from '../../model';

@Injectable()
export class AngularGitHubIssuesFetcher extends GitHubBaseFetcher<Issue> {

  getUrl(): string {
    return 'https://api.github.com/repos/angular/angular/issues';
  } 
}