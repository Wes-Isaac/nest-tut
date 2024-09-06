export class CreateUserDto {
  name: string;
  email: string;
  role: 'ADMIN' | 'INTERN' | 'ENGINEER';
}
