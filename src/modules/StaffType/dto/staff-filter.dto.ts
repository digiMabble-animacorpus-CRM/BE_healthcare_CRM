// import { 
//   IsOptional, 
//   IsString, 
//   IsNumberString, 
//   IsDateString, 
//   IsEnum 
// } from 'class-validator';
// import { ApiPropertyOptional } from '@nestjs/swagger';
// import { Gender, Status } from '../entities/staff.entity';

// export class StaffFilterDto {
//   @ApiPropertyOptional({ description: 'Page number', example: '1' })
//   @IsOptional()
//   @IsNumberString({}, { message: 'Page must be a numeric string' })
//   page?: string;

//   @ApiPropertyOptional({ description: 'Limit per page', example: '10' })
//   @IsOptional()
//   @IsNumberString({}, { message: 'Limit must be a numeric string' })
//   limit?: string;

//   @ApiPropertyOptional({ description: 'Search text for name, phone, email', example: 'john' })
//   @IsOptional()
//   @IsString()
//   searchText?: string;

//   @ApiPropertyOptional({ description: 'Branch name for filtering', example: 'Chennai' })
//   @IsOptional()
//   @IsString()
//   branch?: string;

//   @ApiPropertyOptional({ description: 'From date (YYYY-MM-DD)', example: '2024-01-01' })
//   @IsOptional()
//   @IsDateString({}, { message: 'fromDate must be a valid ISO date string' })
//   fromDate?: string;

//   @ApiPropertyOptional({ description: 'To date (YYYY-MM-DD)', example: '2024-12-31' })
//   @IsOptional()
//   @IsDateString({}, { message: 'toDate must be a valid ISO date string' })
//   toDate?: string;

//   // ---------------- Staff fields from CreateStaffDto ----------------
//   @ApiPropertyOptional({ description: 'Full Name', example: 'John Doe' })
//   @IsOptional()
//   @IsString()
//   fullName?: string;

//   @ApiPropertyOptional({ description: 'First Name', example: 'John' })
//   @IsOptional()
//   @IsString()
//   firstName?: string;

//   @ApiPropertyOptional({ description: 'Last Name', example: 'Doe' })
//   @IsOptional()
//   @IsString()
//   lastName?: string;

//   @ApiPropertyOptional({ enum: Gender, description: 'Gender' })
//   @IsOptional()
//   @IsEnum(Gender)
//   gender?: Gender;

//   @ApiPropertyOptional({ enum: Status, description: 'Status' })
//   @IsOptional()
//   @IsEnum(Status)
//   status?: Status;

//   @ApiPropertyOptional({ description: 'Job title', example: 'Therapist' })
//   @IsOptional()
//   @IsString()
//   jobTitle?: string;

//   @ApiPropertyOptional({ description: 'Target audience', example: 'Children, Adults' })
//   @IsOptional()
//   @IsString()
//   targetAudience?: string;

//   @ApiPropertyOptional({ description: 'Specialization 1', example: 'Psychology' })
//   @IsOptional()
//   @IsString()
//   specialization1?: string;

//   @ApiPropertyOptional({ description: 'Specialization 2', example: 'Child Therapy' })
//   @IsOptional()
//   @IsString()
//   specialization2?: string;

//   @ApiPropertyOptional({ description: 'Spoken languages', example: 'English,French' })
//   @IsOptional()
//   @IsString()
//   spokenLanguages?: string;

//   @ApiPropertyOptional({ description: 'Payment methods', example: 'Cash, Credit Card' })
//   @IsOptional()
//   @IsString()
//   paymentMethods?: string;

//   @ApiPropertyOptional({ description: 'Website', example: 'https://example.com' })
//   @IsOptional()
//   @IsString()
//   website?: string;

//   @ApiPropertyOptional({ description: 'About', example: 'Short bio' })
//   @IsOptional()
//   @IsString()
//   about?: string;

//   @ApiPropertyOptional({ description: 'About Me', example: 'Detailed bio' })
//   @IsOptional()
//   @IsString()
//   aboutMe?: string;

//   @ApiPropertyOptional({ description: 'Center Email', example: 'center@example.com' })
//   @IsOptional()
//   @IsString()
//   centerEmail?: string;

//   @ApiPropertyOptional({ description: 'Center Phone Number', example: '+911234567890' })
//   @IsOptional()
//   @IsString()
//   centerPhoneNumber?: string;

//   @ApiPropertyOptional({ description: 'Center Address', example: '123 Main Street' })
//   @IsOptional()
//   @IsString()
//   centerAddress?: string;

//   @ApiPropertyOptional({ description: 'Contact Email', example: 'john@example.com' })
//   @IsOptional()
//   @IsString()
//   contactEmail?: string;

//   @ApiPropertyOptional({ description: 'Contact Phone', example: '+911234567890' })
//   @IsOptional()
//   @IsString()
//   contactPhone?: string;

//   @ApiPropertyOptional({ description: 'Appointment Start', example: '2024-01-01T09:00:00Z' })
//   @IsOptional()
//   @IsDateString()
//   appointmentStart?: string;

//   @ApiPropertyOptional({ description: 'Appointment End', example: '2024-01-01T18:00:00Z' })
//   @IsOptional()
//   @IsDateString()
//   appointmentEnd?: string;

//   @ApiPropertyOptional({ description: 'Appointment Alert', example: '15 min before' })
//   @IsOptional()
//   @IsString()
//   appointmentAlert?: string;

//   @ApiPropertyOptional({ description: 'Schedule JSON', example: '{}' })
//   @IsOptional()
//   @IsString()
//   schedule?: string;

//   @ApiPropertyOptional({ description: 'Availability JSON', example: '{}' })
//   @IsOptional()
//   @IsString()
//   availability?: string;

//   @ApiPropertyOptional({ description: 'FAQ', example: 'Frequently asked questions' })
//   @IsOptional()
//   @IsString()
//   faq?: string;

//   @ApiPropertyOptional({ description: 'Rosa Link', example: 'https://rosa.example.com' })
//   @IsOptional()
//   @IsString()
//   rosaLink?: string;

//   @ApiPropertyOptional({ description: 'Google Agenda Link', example: 'https://calendar.google.com' })
//   @IsOptional()
//   @IsString()
//   googleAgendaLink?: string;

//   @ApiPropertyOptional({ description: 'Team Namur 1', example: 'Team A' })
//   @IsOptional()
//   @IsString()
//   teamNamur1?: string;

//   @ApiPropertyOptional({ description: 'Team Namur 2', example: 'Team B' })
//   @IsOptional()
//   @IsString()
//   teamNamur2?: string;

//   @ApiPropertyOptional({ description: 'Imported Table 2', example: 'Some value' })
//   @IsOptional()
//   @IsString()
//   importedTable2?: string;

//   @ApiPropertyOptional({ description: 'Imported Table 2-2', example: 'Some value' })
//   @IsOptional()
//   @IsString()
//   importedTable22?: string;

//   @ApiPropertyOptional({ description: 'Imported Table 2-3', example: 'Some value' })
//   @IsOptional()
//   @IsString()
//   importedTable23?: string;

//   @ApiPropertyOptional({ description: 'Sites', example: 'Chennai' })
//   @IsOptional()
//   @IsString()
//   sites?: string;

//   @ApiPropertyOptional({ description: 'Photo URL', example: 'https://example.com/photo.jpg' })
//   @IsOptional()
//   @IsString()
//   photo?: string;
// }
