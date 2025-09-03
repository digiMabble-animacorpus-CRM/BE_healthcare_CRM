// src/common/guards/permission.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { TeamMember } from 'src/modules/team-member/entities/team-member.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import { Permission } from 'src/modules/permissions/entities/permission.entity';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<{ module: string, action: string }[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user: TeamMember = request.user;

    console.log('PermissionGuard -> Required Permissions:', requiredPermissions);
  console.log('PermissionGuard -> User Permissions:', user?.permissions);

  if (!requiredPermissions || requiredPermissions.length === 0) return true;
  if (!user.permissions) {
    console.log('PermissionGuard -> No permissions found on user');
    return false;
  }


    for (const perm of requiredPermissions) {
      const modulePerms = user.permissions[perm.module];
      if (!modulePerms || !modulePerms[perm.action]) {
        console.log('PermissionGuard -> Access denied for permission:', perm);
        throw new ForbiddenException(`No permission for ${perm.module}.${perm.action}`);
      }
    }

    return true;
  }
}
