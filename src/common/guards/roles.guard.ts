import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { TeamMemberRole } from 'src/modules/team-member/entities/team-member.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<TeamMemberRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      this.logger.debug('No roles required → Access granted by default.');
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    this.logger.debug(`Checking access for user: ${JSON.stringify(user)}`);
    this.logger.debug(`Required Roles: ${requiredRoles.join(', ')}`);
    this.logger.debug(`User Role: ${user?.role ?? 'NONE'}`);

    if (!user) {
      this.logger.warn('No user found in request → Access denied.');
      return false;
    }

    // ✅ Super Admin bypass
    if (user.role === TeamMemberRole.SUPER_ADMIN) {
      this.logger.log('Super Admin bypass → Access granted.');
      return true;
    }

    // ✅ Normal role check
    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) {
      this.logger.warn(`Access denied → User role "${user.role}" not in required roles.`);
    } else {
      this.logger.log(`Access granted → User role "${user.role}" matches required roles.`);
    }

    return hasRole;
  }
}
