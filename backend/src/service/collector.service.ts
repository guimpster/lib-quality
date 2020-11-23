import { Injectable, Logger } from '@nestjs/common';

import { ElasticIssueRepository } from '../repository/elastic.issue.repository';
import { FacebookGitHubIssuesFetcher } from '../service/fetchers/facebook.issues.fetcher';
import { VueGitHubIssuesFetcher } from '../service/fetchers/vue.issues.fetcher';
import { AngularGitHubIssuesFetcher } from '../service/fetchers/angularjs.issues.fetcher';


@Injectable()
export class CollectorService {

    private readonly logger = new Logger(CollectorService.name);

    constructor(
        private readonly facebookFetcher: FacebookGitHubIssuesFetcher,
        private readonly vueFetcher: VueGitHubIssuesFetcher,
        private readonly angularFetcher: AngularGitHubIssuesFetcher,
        private readonly issueRepository: ElasticIssueRepository
    ) { }

    public async collectIssues() {
        this.logger.debug('Fetching issues from GitHub')
        const facePages = await this.facebookFetcher.fetchPages();
        const vuePages = await this.vueFetcher.fetchPages();
        const angularPages = await this.angularFetcher.fetchPages();
        this.logger.debug('Inserting issues on elasticsearch')
        await Promise.all(facePages.map((issuePage, page) => 
            this.issueRepository.bulkIssues(issuePage, page, 'facebook', 'react')));
        await Promise.all(vuePages.map((issuePage, page) => 
            this.issueRepository.bulkIssues(issuePage, page, 'vuejs', 'vue')));
        await Promise.all(angularPages.map((issuePage, page) => 
            this.issueRepository.bulkIssues(issuePage, page, 'angular', 'angular')));
    }
}