import { Injectable, Logger } from '@nestjs/common';
import { Timeout } from '@nestjs/schedule';

import { ConsolidatedService } from '../service/consolidated.service';


@Injectable()
export class ConsolidateJob {

  private readonly logger = new Logger(ConsolidateJob.name);

  constructor(private readonly consolidatedService: ConsolidatedService) {}

  @Timeout('issues-consolidator-job', 40*1000)
  async consolidateIssues() {
    this.logger.debug('Consolidating issues from GitHub');
    await this.consolidatedService.consolidateIssues();
    this.logger.debug('Consolidating issues from Github has ended!');
  }
}