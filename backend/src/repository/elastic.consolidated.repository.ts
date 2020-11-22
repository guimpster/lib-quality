import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

import { ConfigService } from '../config/config.service';
import { ConsolidatedData } from '../model';
import { ElasticBaseRepository } from './elastic.base.repository';


@Injectable()
export class ElasticConsolidatedRepository extends ElasticBaseRepository {

    private readonly logger = new Logger(ElasticConsolidatedRepository.name);

    constructor(
        private readonly esRepository: ElasticsearchService,
        private readonly configService: ConfigService
    ) {
        super()
    }

    public async createIndex() {
        this.logger.debug(`Creating index ${this.configService.get('GITHUB_CONSOLIDATED_INDEX')}`);
        await this.esRepository.indices.create({
            index: this.configService.get('GITHUB_CONSOLIDATED_INDEX'),
            body: {
                mappings: {
                    properties: {
                        id: { type: 'text' },
                        org: { type: 'keyword' },
                        repo: { type: 'keyword' },
                        qty_issues: { type: 'long' },
                        avg_age: { type: 'double' },
                        std_age: { type: 'double' },
                        qty_stars: { type: 'long' },
                        qty_forks: { type: 'long' },
                        qty_contributors: { type: 'long' },
                        issues_by_labels: { type: 'nested' }
                    },
                },
            },
        }, { ignore: [400] });
        this.logger.debug(`Index ${this.configService.get('GITHUB_CONSOLIDATED_INDEX')} created/updated`);
    }

    public async consolidateIssues(): Promise<ConsolidatedData[]> {
        const { body } = await this.esRepository.sql.query({
            body: {
                query: `SELECT repo, COUNT(*) as qty_issues, AVG(DATE_DIFF('days', CAST(created_at AS DATETIME), CURRENT_TIMESTAMP())) as avg_age, STDDEV_SAMP(DATE_DIFF('days', CAST(created_at AS DATETIME), CURRENT_TIMESTAMP())) as std_age FROM \'${this.configService.get('GITHUB_ISSUES_INDEX')}\' GROUP BY repo`
            }
        });
        const data: ConsolidatedData[] = body.rows.map(([repo, qty_issues, avg_age, std_age]) => ({
            id: `facebook/${repo}`,
            org: 'facebook',
            repo,
            qty_issues,
            avg_age,
            std_age
        }));
        return data;
    }

    public async bulkConsolidatedData(collects: Array<ConsolidatedData>) {
        this.logger.debug(`Consolidated data: ${JSON.stringify(collects, null, 4)}`);
        const body = collects.flatMap(collectItem => [{
            index: {
                _index: this.configService.get('GITHUB_CONSOLIDATED_INDEX'),
                _id: collectItem.id
            }
        },
            collectItem
        ]);
        const { body: bulkResponse } = await this.esRepository.bulk({ refresh: true, body });
        this.checkError(bulkResponse, body);
    }

    public async insertConsolidatedData(collect: ConsolidatedData) {
        return this.esRepository.index({
            index: this.configService.get('GITHUB_CONSOLIDATED_INDEX'),
            body: collect
        });
    }
}