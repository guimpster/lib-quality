import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

import { ConfigService } from '../config/config.service';
import { ElasticBaseRepository } from './elastic.base.repository';
import { Issue } from '../model';


@Injectable()
export class ElasticIssueRepository extends ElasticBaseRepository {

    private readonly logger = new Logger(ElasticIssueRepository.name);

    constructor(
        private readonly esService: ElasticsearchService,
        private readonly configService: ConfigService
    ) { 
        super();
    }

    public async createIndex() {
        this.logger.debug(`Creating index ${this.configService.get('GITHUB_ISSUES_INDEX')}`);
        await this.esService.indices.create({
            index: this.configService.get('GITHUB_ISSUES_INDEX'),
            body: {
                mappings: {
                    properties: {
                        id: { type: 'long' },
                        count: { type: 'long' },
                        pageNumber: { type: 'long' },
                        org: { type: 'keyword' },
                        repo: { type: 'keyword' },
                        issue_number: { type: 'long' },
                        state: { type: 'text' },
                        created_at: { type: 'date' },
                        closed_at: { type: 'date' },
                        labels: { type: 'nested' }
                    },
                },
            },
        }, { ignore: [400] });
        this.logger.debug(`Index ${this.configService.get('GITHUB_ISSUES_INDEX')} created/updated`);
    }

    public async insertIssue(issue: Issue) {
        return this.esService.index({
            index: this.configService.get('GITHUB_ISSUES_INDEX'),
            body: {
                id: issue.id,
                org: 'facebook',
                repo: 'react',
                issue_number: issue.number,
                state: issue.state,
                created_at: issue.created_at,
                closed_at: issue.closed_at,
                labels: issue.labels
            }
        });
    }

    public async countIssues() {
        const { body: count } = await this.esService.count({ index: this.configService.get('GITHUB_ISSUES_INDEX') })
        this.logger.debug(`Now index ${this.configService.get('GITHUB_ISSUES_INDEX')} has ${count.count} issues!`)
    }

    public async bulkIssues(issuePage: Array<Issue>, pageNumber: number) {
        this.logger.debug(`Inserting page ${pageNumber} with ${issuePage.length} data`);
        const body = issuePage
            .map((issue, index) => ({
                id: issue.id,
                count: index,
                pageNumber,
                org: 'facebook',
                repo: 'react',
                issue_number: issue.number,
                state: issue.state,
                created_at: issue.created_at,
                closed_at: issue.closed_at,
                labels: issue.labels
            }))
            .flatMap(issueItem => [{
                index: {
                    _index: this.configService.get('GITHUB_ISSUES_INDEX'),
                    _id: issueItem.id
                }
            },
                issueItem
            ]);
        const { body: bulkResponse } = await this.esService.bulk({ refresh: true, body });
        this.checkError(bulkResponse, body);
    }

    public async issuesByInterval(/*search: Object*/) {
        const { body } = await this.esService.search({
            index: this.configService.get('GITHUB_ISSUES_INDEX'),
            body: {
                size: 0,
                query: {
                    query: {
                        range: {
                            created_at: {
                                gte: "now-1M"
                            }
                        }
                    },
                    aggs: {
                        byday: {
                            date_histogram: {
                                field: "created_at",
                                interval: "day"
                            }
                        }
                    }
                }
            },
        });
        const { buckets: results } = body.aggregations.byday;
        return { results, total: body.hits.total.value };
    }
}