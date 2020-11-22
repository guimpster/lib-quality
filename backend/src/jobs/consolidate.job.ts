import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';

import { ConsolidatedService } from '../service/consolidated.service';


@Injectable()
export class ConsolidateJob {

  private readonly logger = new Logger(ConsolidateJob.name);

  constructor(private readonly consolidatedService: ConsolidatedService) {}

  @Interval('issues-consolidator-job', 60*60*1000)
  async consolidateIssues() {
    this.logger.debug('Consolidating data from GitHub');
    await this.consolidatedService.consolidateData();
    this.logger.debug('Consolidating data from Github has ended!');
  }
}