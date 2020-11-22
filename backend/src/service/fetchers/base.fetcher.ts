import fetch from 'node-fetch';
import { Logger, Injectable } from '@nestjs/common';

import { GitHubBase } from '../../model';

@Injectable()
export abstract class GitHubBaseFetcher<T extends GitHubBase> {
  private readonly logger = new Logger(GitHubBaseFetcher.name);

  private readonly defaultHeaders = {
    'Accept': 'application/vnd.github.v3+json',
    'Authorization': 'token d90a25f0dbc4c1f9fbd05813dd0e4a9e9dbdccb3'
  }

  abstract getUrl(): string;

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
      headers: this.defaultHeaders
    });
    if (!response.ok) throw Error(`Got an unexpected response: ${response.statusText}`);
    return response.json();
  }

  private async getTotalPages() {
    const fetchUrl = `${this.getUrl()}?page=1&per_page=100&sort=created`
    this.logger.debug(`HEAD URL: ${fetchUrl}`)
    const response = await fetch(fetchUrl, {
      method: 'HEAD',
      headers: this.defaultHeaders
    });
    if (!response.ok) throw Error(`Got an unexpected response ${response.statusText}`);
    const linkHeader = response.headers.get('Link')
    return parseInt(linkHeader.split('rel')[1].match(/page=(\d+)?/)[1])
  }
}