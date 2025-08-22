import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
  //   const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
  //     context.getHandler(),
  //     context.getClass(),
  //   ]);

  //   console.log(' RolesGuard checking roles...');
  //   console.log(' Required Roles:', requiredRoles);

  //   if (!requiredRoles || requiredRoles.length === 0) {
  //     return true;
  //   }

  //   const { user } = context.switchToHttp().getRequest();
  //   console.log(' request.user:', user);

  //   if (!user) {
  //     console.log(' No user found in request');
  //     return false;
  //   }

  //   //  Check roles array
  //   if (Array.isArray(user.roles)) {
  //     const matched = user.roles.some(
  //       (role) =>
  //         requiredRoles.includes(role.role_type) ||
  //         requiredRoles.includes(role.name),
  //     );
  //     console.log(' Matched from roles array:', matched);
  //     if (matched) return true;
  //   } else {
  //     console.log(' user.roles is missing or not an array:', user.roles);
  //   }

  //   //  Check user_type
  //   if (user.user_type) {
  //     const matched = requiredRoles.includes(user.user_type);
  //     console.log(' Matched from user_type:', matched);
  //     if (matched) return true;
  //   }

  //   //  Check single flat role_type (optional support)
  //   if (user.role_type) {
  //     const matched = requiredRoles.includes(user.role_type);
  //     console.log(' Matched from role_type:', matched);
  //     if (matched) return true;
  //   }

  //   console.log('Access denied. No role matched.');
  //   return false;
  return true; 
   }
}
