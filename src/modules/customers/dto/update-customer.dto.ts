import { PartialType } from '@nestjs/swagger';
import { CreatePatientDto } from './create-customer.dto';

export class UpdatePatientDto extends PartialType(CreatePatientDto) {}
