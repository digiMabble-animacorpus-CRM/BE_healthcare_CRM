import { PartialType } from '@nestjs/swagger';
import { CreatePatientDto } from './create-Patient.dto';


export class UpdatePatientDto extends PartialType(CreatePatientDto) { }