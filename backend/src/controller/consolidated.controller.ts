import { Controller, Get, Logger, Query } from '@nestjs/common';
import { ConsolidatedData } from 'src/model';
import { ConsolidatedService } from 'src/service/consolidated.service';


@Controller('consolidated')
export class ConsolidatedController {

    private readonly logger = new Logger(ConsolidatedController.name);

    constructor(
        private readonly consolidatedService: ConsolidatedService
    ) { }

    @Get()
    async findConsolidatedByRepo(@Query('repo') repo: string): Promise<ConsolidatedData> {
        this.logger.debug(`Searching data by repo ${repo}`);
        return this.consolidatedService.searchByRepo(repo); 
    }
}