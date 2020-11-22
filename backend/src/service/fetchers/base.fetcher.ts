import fetch from 'node-fetch';
import { Logger, Injectable } from '@nestjs/common';

import { GitHubBase } from '../../model';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export abstract class GitHubBaseFetcher<T extends GitHubBase> {

  private readonly logger = new Logger(GitHubBaseFetcher.name);

  constructor(private readonly configService: ConfigService) {}

  abstract getUrl(): string;

  protected getHeaders() {
    return {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `token ${this.configService.get('GIT_HUB_TOKEN')}`
    }
  }

  public async fetchPages(): Promise<Array<T[]>> {
    const totalPages = await this.getTotalPages();
    this.logger.debug(`Total pages: ${totalPages}`);
    return Promise.all([...Array(totalPages)].map((_, page) => this.fetchPage(page)));
  }

  private async fetchPage(page): Promise<Array<T>> {
    const fetchUrl = `${this.getUrl()}?page=${page}&per_page=100&sort=created`
    this.logger.debug(`GET URL: ${fetchUrl}`)
    const response = await fetch(fetchUrl, {
      method: 'GET',
      headers: this.getHeaders()
    });
    if (!response.ok) throw Error(`Got an unexpected response: ${response.statusText}`);
    return response.json();
  }

  private async getTotalPages() {
    const fetchUrl = `${this.getUrl()}?page=1&per_page=100&sort=created`
    this.logger.debug(`HEAD URL: ${fetchUrl}`)
    const response = await fetch(fetchUrl, {
      method: 'HEAD',
      headers: this.getHeaders()
    });
    if (!response.ok) throw Error(`Got an unexpected response ${response.statusText}`);
    const linkHeader = response.headers.get('Link')
    return parseInt(linkHeader.split('rel')[1].match(/page=(\d+)?/)[1])
  }
}