import { Injectable, Logger } from '@nestjs/common';

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
}