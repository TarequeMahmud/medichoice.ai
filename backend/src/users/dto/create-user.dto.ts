import { UserRole } from '../entities/user.entity';
import { BaseAuthDto } from 'src/users/dto/base-auth.dto';
import { FullNameField, RoleField } from 'src/common/decorators/auth.decorator';

export class CreateUserDto extends BaseAuthDto {
  @FullNameField()
  full_name: string;

  @RoleField()
  role: UserRole;
}
