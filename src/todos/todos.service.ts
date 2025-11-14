import { Injectable } from '@nestjs/common';

interface Todo {
  id: number;
  title: string;
  text: string;
  completed: boolean;
}

@Injectable()
export class TodosService {}
