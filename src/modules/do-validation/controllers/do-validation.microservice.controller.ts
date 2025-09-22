import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DoValidationService } from '../services/do-validation.service';
import { DoValidationQueryDto, DoValidationResponseDto } from '../dtos/do-validation.dtos';
import { Internal } from 'src/common/decorators/internal.decorator';

@Controller('week-sales')
@Internal()
export class DoValidationMicroserviceController {
    private readonly logger = new Logger(DoValidationMicroserviceController.name);

    constructor(private readonly doValidationService: DoValidationService) {
        this.logger.log('DoValidationMicroserviceController initialized');
    }

    @MessagePattern('do_validation_find_all')
    async findAllDoValidation(@Payload() data: DoValidationQueryDto): Promise<DoValidationResponseDto> {
        this.logger.log('==== MICROSERVICE: Find all DO validation ====');
        this.logger.log(`Query parameters: ${JSON.stringify(data)}`);

        try {
            return await this.doValidationService.findAllDoValidation(data);
        } catch (error) {
            this.logger.error(`Error in microservice findAllDoValidation: ${error.message}`, error.stack);
            return {
                data: [],
                count: 0,
                status: false,
                message: `Error retrieving DO validation data: ${error.message}`,
            };
        }
    }

    @MessagePattern('do_validation_find_by_no_surat_jalan')
    async findByNoSuratJalan(@Payload() data: { noSuratJalan: string }): Promise<DoValidationResponseDto> {
        this.logger.log('==== MICROSERVICE: Find DO validation by delivery order number ====');
        this.logger.log(`Delivery order number: ${data.noSuratJalan}`);

        try {
            return await this.doValidationService.findByNoSuratJalan(data.noSuratJalan);
        } catch (error) {
            this.logger.error(`Error in microservice findByNoSuratJalan: ${error.message}`, error.stack);
            return {
                data: [],
                count: 0,
                status: false,
                message: `Error retrieving DO validation data for delivery order ${data.noSuratJalan}: ${error.message}`,
            };
        }
    }
}
