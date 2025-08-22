import { PartialType } from '@nestjs/swagger';
import { CreateFunctionDescriptionDto } from './create-function-description.dto';


export class UpdateFunctionDescriptionDto extends PartialType(
  CreateFunctionDescriptionDto,
) {}
