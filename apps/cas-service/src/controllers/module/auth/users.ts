import * as bcrypt from 'bcrypt';
import { UserDto } from './dto';
export function getUserList(): UserDto[] {
  return [
    {
      userId: 1,
      userName: 'casuser',
      password: bcrypt.hashSync('123', 10),
      email: 'casuser@example.com',
      userType: '1',
      phone: '12345676',
      realName: '张三',
    },
  ];
}
