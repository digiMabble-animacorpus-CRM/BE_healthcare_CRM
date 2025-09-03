import { IsOptional, IsString, IsEmail, IsArray, IsObject, IsEnum, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TeamMemberRole , TeamMemberStatus } from '../entities/team-member.entity';

export class CreateTeamMemberDto {
  @ApiPropertyOptional({ example: 'Doe', description: 'Last name of the team member' })
  @IsOptional()
  @IsString()
  last_name?: string;
    
  @ApiPropertyOptional({ example: 'John', description: 'First name of the team member' })
  @IsOptional()
  @IsString()
  first_name?: string;

  @ApiPropertyOptional({ example: 'John Doe', description: 'Full name of the team member' })
  @IsOptional()
  @IsString()
  full_name?: string;

  @ApiPropertyOptional({ example: 'Psychologist', description: 'Primary job title' })
  @IsOptional()
  @IsString()
  job_1?: string;

  @ApiPropertyOptional({ example: 'Teenagers and adults', description: 'Target audience' })
  @IsOptional()
  @IsString()
  specific_audience?: string;

  @ApiPropertyOptional({ example: 'Cognitive Behavioral Therapy', description: 'First specialization' })
  @IsOptional()
  @IsString()
  specialization_1?: string;

  @ApiPropertyOptional({ example: 'Therapist', description: 'Secondary job title' })
  @IsOptional()
  @IsString()
  job_2?: string;

  @ApiPropertyOptional({ example: 'Researcher', description: 'Tertiary job title' })
  @IsOptional()
  @IsString()
  job_3?: string;

  @ApiPropertyOptional({ example: 'Lecturer', description: 'Quaternary job title' })
  @IsOptional()
  @IsString()
  job_4?: string;

  @ApiPropertyOptional({ example: 'Passionate about mental health awareness.', description: 'Personal statement' })
  @IsOptional()
  @IsString()
  who_am_i?: string;

  @ApiPropertyOptional({ example: 'Individual, couples, and group therapy', description: 'Types of consultations' })
  @IsOptional()
  @IsString()
  consultations?: string;

  @ApiPropertyOptional({ example: '123 Main Street, London', description: 'Office address' })
  @IsOptional()
  @IsString()
  office_address?: string;

  @ApiPropertyOptional({ example: 'john.doe@example.com', description: 'Contact email' })
  @IsOptional()
  @IsEmail()
  contact_email?: string;

  @ApiPropertyOptional({ example: '+44 1234 567890', description: 'Contact phone number' })
  @IsOptional()
  @IsString()
  contact_phone?: string;

  @ApiPropertyOptional({
    example: { monday: '9am-5pm', tuesday: '10am-4pm' },
    description: 'Weekly availability schedule',
    type: Object,
  })
  @IsOptional()
  @IsObject()
  schedule?: Record<string, any>;

  @ApiPropertyOptional({ example: 'Experienced therapist with 10+ years in practice.', description: 'About section' })
  @IsOptional()
  @IsString()
  about?: string;

  @ApiPropertyOptional({
    example: ['English', 'French'],
    description: 'Languages spoken by the team member',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages_spoken?: string[];

  @ApiPropertyOptional({
    example: ['Cash', 'Credit Card', 'Bank Transfer'],
    description: 'Accepted payment methods',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  payment_methods?: string[];

  @ApiPropertyOptional({
    example: ['PhD in Psychology', 'Certified CBT Therapist'],
    description: 'Diplomas and training',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  diplomas_and_training?: string[];

  @ApiPropertyOptional({
    example: ['Anxiety', 'Depression', 'Stress Management'],
    description: 'Specializations',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specializations?: string[];

  @ApiPropertyOptional({ example: 'https://www.johndoeclinic.com', description: 'Website link' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({
    example: { 'What is your approach?': 'I focus on CBT methods' },
    description: 'Frequently asked questions',
    type: Object,
  })
  @IsOptional()
  @IsObject()
  frequently_asked_questions?: Record<string, any>;

  @ApiPropertyOptional({
    example: ['https://calendly.com/johndoe'],
    description: 'Calendar booking links',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  calendar_links?: string[];

  @ApiPropertyOptional({
    example: 'https://example.com/profile-photo.jpg',
    description: 'Profile photo URL',
  })
  @IsOptional()
  @IsString()
  photo?: string;



  @ApiPropertyOptional({ example: 'staff', description: 'Role of the team member' })
@IsOptional()
@IsEnum(TeamMemberRole)
role?: TeamMemberRole;


@ApiPropertyOptional({ example: 'active', description: 'Status of the team member' })
@IsOptional()
@IsEnum(TeamMemberStatus)
status?: TeamMemberStatus;


@ApiPropertyOptional({ example: [1, 2], description: 'Assigned branch IDs' })
@IsOptional()
@IsArray()
@IsNumber({}, { each: true })
branches?: number[];


@ApiPropertyOptional({ example: 1, description: 'Primary branch ID' })
@IsOptional()
@IsNumber()
primary_branch_id?: number;



@ApiPropertyOptional({ example: { appointments: { view: true } }, description: 'Permissions JSON' })
@IsOptional()
@IsObject()
permissions?: object;



@ApiPropertyOptional({ example: 'admin', description: 'Role of the user who created this team member' })
@IsOptional()
@IsEnum(TeamMemberRole)
created_by_role?: TeamMemberRole;


}
