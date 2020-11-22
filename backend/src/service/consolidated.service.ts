import { Injectable, Logger } from '@nestjs/common';
import { ConsolidatedData } from 'src/model';

import { ElasticConsolidatedRepository } from '../repository/elastic.consolidated.repository';


@Injectable()
export class ConsolidatedService {

    private readonly logger = new Logger(ConsolidatedService.name);
  
    constructor(private readonly consolidatedRepository: ElasticConsolidatedRepository) {}

    public async consolidateData() {
        const data = await this.consolidatedRepository.consolidateIssues();
        // consolidate other info //
        await this.consolidatedRepository.bulkConsolidatedData(data);
    }

    public async searchByRepo(repo: String): Promise<ConsolidatedData> {
        return this.consolidatedRepository.searchByRepo(repo);
    }
}