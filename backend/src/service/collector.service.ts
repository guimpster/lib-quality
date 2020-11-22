import { Injectable, Logger } from '@nestjs/common';

import { ElasticIssueRepository } from '../repository/elastic.issue.repository';
import { GitHubIssuesFetcher } from './fetchers/issues.fetcher';


@Injectable()
export class CollectorService {

    private readonly logger = new Logger(CollectorService.name);

    constructor(
        private readonly githubIssuesFetcher: GitHubIssuesFetcher,
        private readonly issueRepository: ElasticIssueRepository
    ) { }

    public async collectIssues() {
        this.logger.debug('Fetching issues from GitHub')
        const pages = await this.githubIssuesFetcher.fetchPages();
        this.logger.debug('Inserting issues on elasticsearch')
        await Promise.all(pages.map((issuePage, page) => this.issueRepository.bulkIssues(issuePage, page)));
    }
}