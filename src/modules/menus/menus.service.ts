import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from './entities/menu.entity';
import { PermissionsService } from '../permissions/permissions.service';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    private readonly permissionsService: PermissionsService,
  ) {}

  async create(createMenuDto: CreateMenuDto): Promise<Menu> {
    const { permission_ids, ...menuData } = createMenuDto;
    const menu = this.menuRepository.create(menuData);

    if (permission_ids && permission_ids.length > 0) {
      const permissions = await Promise.all(
        permission_ids.map(id => this.permissionsService.findOne(id))
      );
      menu.permissions = permissions;
    }

    return await this.menuRepository.save(menu);
  }

  async findAll(): Promise<Menu[]> {
    return await this.menuRepository.find({
      relations: ['parent', 'children', 'permissions'],
      order: {
        order: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<Menu> {
    const menu = await this.menuRepository.findOne({
      where: { id },
      relations: ['parent', 'children', 'permissions'],
    });

    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }

    return menu;
  }

  async update(id: number, updateMenuDto: UpdateMenuDto): Promise<Menu> {
    const { permission_ids, ...menuData } = updateMenuDto;
    const menu = await this.findOne(id);

    if (permission_ids) {
      const permissions = await Promise.all(
        permission_ids.map(id => this.permissionsService.findOne(id))
      );
      menu.permissions = permissions;
    }

    Object.assign(menu, menuData);
    return await this.menuRepository.save(menu);
  }

  async remove(id: number): Promise<void> {
    const menu = await this.findOne(id);
    await this.menuRepository.remove(menu);
  }
}
