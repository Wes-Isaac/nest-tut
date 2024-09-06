import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsEmail()
  email: string;
  @IsEnum(['ADMIN', 'INTERN', 'ENGINEER'], {
    message: 'Invalid role',
  })
  role: 'ADMIN' | 'INTERN' | 'ENGINEER';
}
