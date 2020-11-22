import { Injectable, Logger } from '@nestjs/common';
import { Timeout } from '@nestjs/schedule';

import { CollectorService } from '../service/collector.service';


@Injectable()
export class CollectorJob {

  private readonly logger = new Logger(CollectorJob.name);

  constructor(
    private readonly collectorService: CollectorService
  ) {}

  @Timeout('issues-collector-job', 10*1000)
  async collectIssues() {
    this.logger.debug('Collecting issues from Github has started');
    await this.collectorService.collectIssues();
    this.logger.debug('Collecting issues from Github has ended!')
  }
}