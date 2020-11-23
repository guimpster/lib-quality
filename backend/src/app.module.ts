import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { CollectorJob } from './jobs/collector.job';
import { ConsolidateJob } from './jobs/consolidate.job';
import { FacebookGitHubIssuesFetcher } from './service/fetchers/facebook.issues.fetcher';
import { VueGitHubIssuesFetcher } from './service/fetchers/vue.issues.fetcher';
import { AngularGitHubIssuesFetcher } from './service/fetchers/angularjs.issues.fetcher';
import { ElasticModule } from './repository/elastic.module';
import { ConfigModule } from './config/config.module';
import { CollectorService } from './service/collector.service';
import { ConsolidatedService } from './service/consolidated.service';
import { ConsolidatedController } from './controller/consolidated.controller';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule,
    ElasticModule
  ],
  controllers: [
    ConsolidatedController
  ],
  providers: [
    CollectorJob,
    ConsolidateJob,
    FacebookGitHubIssuesFetcher,
    VueGitHubIssuesFetcher,
    AngularGitHubIssuesFetcher,
    CollectorService,
    ConsolidatedService
  ],
})
export class AppModule {}
