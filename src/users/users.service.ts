import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export interface User {
  id: number;
  name: string;
  age: number;
  role: 'TEACHER' | 'STUDENT' | 'ADMIN';
}

@Injectable()
export class UsersService {
  private users: User[] = [
    { id: 1, name: 'Tyler', age: 26, role: 'TEACHER' },
    { id: 2, name: 'John', age: 33, role: 'STUDENT' },
    { id: 3, name: 'Stan', age: 50, role: 'ADMIN' },
  ];

  getUsers() {
    return this.users;
  }

  getUser(id: number) {
    const user = this.users.find((user) => user.id === id);
    return user;
  }

  createUser(createUserDto: CreateUserDto) {
    const maxId = Math.max(...this.users.map((user) => user.id));
    const newUser: User = { id: maxId + 1, ...createUserDto };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(id: number, updateUserDto: UpdateUserDto) {
    // update user in here
    const user = this.getUser(id);
    if (!user) {
      throw new NotFoundException('user with that id not found');
    }

    if (updateUserDto.name) user.name = updateUserDto.name;
    if (updateUserDto.age) user.age = updateUserDto.age;
    if (updateUserDto.role) user.role = updateUserDto.role;

    return user;
  }

  deleteUser(id: number) {
    // delete the user here
    this.users = this.users.filter((user) => user.id !== id);
  }
}
