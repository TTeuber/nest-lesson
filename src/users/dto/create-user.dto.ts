import { IsEnum, IsNumber, IsString, Min, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsNumber()
  @Min(13)
  age: number;

  @IsEnum(['TEACHER', 'STUDENT', 'ADMIN'])
  role: 'TEACHER' | 'STUDENT' | 'ADMIN';
}
