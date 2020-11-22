import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';

import { CollectorService } from '../service/collector.service';


@Injectable()
export class CollectorJob {

  private readonly logger = new Logger(CollectorJob.name);

  constructor(
    private readonly collectorService: CollectorService
  ) {}

  @Interval('issues-collector-job', 60*60*1000)
  async collectIssues() {
    this.logger.debug('Collecting issues from Github has started');
    await this.collectorService.collectIssues();
    this.logger.debug('Collecting issues from Github has ended!')
  }
}