import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { ElasticIssueRepository } from './elastic.issue.repository';
import { ElasticConsolidatedRepository } from './elastic.consolidated.repository';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get('ELASTICSEARCH_NODE'),
        //maxRetries: 10,
        //requestTimeout: 10000,
        //pingTimeout: 10000,
        //sniffOnStart: true,
        auth: {
          username: configService.get('ELASTICSEARCH_USERNAME'),
          password: configService.get('ELASTICSEARCH_PASSWORD'),
        }
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  providers:  [
    ElasticIssueRepository,
    ElasticConsolidatedRepository,
  ],
  exports:  [
    ElasticIssueRepository,
    ElasticConsolidatedRepository,
  ],
})
export class ElasticModule implements OnModuleInit {

  private readonly logger = new Logger(ElasticModule.name);

  constructor(
    private elasticIssueRepository: ElasticIssueRepository,
    private elasticConsolidatedRepository: ElasticConsolidatedRepository,
  ) {}

  onModuleInit() {
    this.logger.debug('Creating elasticsearch indices...');
    this.elasticIssueRepository.createIndex().then();
    this.elasticConsolidatedRepository.createIndex().then();
  }
}