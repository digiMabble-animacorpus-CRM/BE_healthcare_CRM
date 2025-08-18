import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMenuDto {
  @ApiProperty({
    example: 'User Management',
    description: 'The name of the menu item',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Manage user accounts and permissions',
    description: 'A description of the menu item',
    required: false
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    example: '/admin/users',
    description: 'The URL path for this menu item',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  path: string;

  @ApiProperty({
    example: 'user',
    description: 'The icon name or class for this menu item',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  icon: string;

  @ApiProperty({
    example: 1,
    description: 'The ID of the parent menu item (if this is a submenu)',
    required: false
  })
  @IsNumber()
  @IsOptional()
  parent_id: number;

  @ApiProperty({
    example: 1,
    description: 'The display order of this menu item',
    required: false,
    default: 0
  })
  @IsNumber()
  @IsOptional()
  order: number;

  @ApiProperty({
    example: true,
    description: 'Whether this menu item is active',
    required: false,
    default: true
  })
  @IsBoolean()
  @IsOptional()
  is_active: boolean;

  @ApiProperty({
    example: true,
    description: 'Whether this menu item should be visible in the navigation',
    required: false,
    default: false
  })
  @IsBoolean()
  @IsOptional()
  is_visible: boolean;

  @ApiProperty({
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    description: 'Array of permission IDs required to access this menu item',
    required: false,
    type: [String]
  })
  @IsArray()
  @IsOptional()
  permission_ids: number[];
}
