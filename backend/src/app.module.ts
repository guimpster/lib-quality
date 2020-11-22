import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { CollectorJob } from './jobs/collector.job';
import { ConsolidateJob } from './jobs/consolidate.job';
import { GitHubIssuesFetcher } from './service/fetchers/issues.fetcher';
import { ElasticModule } from './repository/elastic.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule,
    ElasticModule
  ],
  controllers: [],
  providers: [
    CollectorJob,
    ConsolidateJob,
    GitHubIssuesFetcher,
  ],
})
export class AppModule {}
