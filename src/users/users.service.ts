import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: 0,
      name: 'Bob',
      email: 'bob@gmail.com',
      password: 'bobPass',
    },

    {
      id: 1,
      name: 'John',
      email: 'john@gmail.com',
      password: 'johnPass',
    },

    {
      id: 2,
      name: 'Gary',
      email: 'gary@gmail.com',
      password: 'garyPass',
    },
  ];
  
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number): Promise<User | undefined> {
    const user = this.users.find((user) => user.id === id);
    if (user) {
      return Promise.resolve(user);
    }
    return undefined;
  }

  findByEmail(email: string): Promise<User | undefined> {
    const user = this.users.find((user) => user.email === email);
    if (user) {
      return Promise.resolve(user);
    }
    return undefined;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
