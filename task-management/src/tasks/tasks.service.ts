import { Injectable } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { User } from 'src/auth/auth.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  create(createTaskDto: CreateTaskDto, user: User) {
    const { title, description, status } = createTaskDto;
    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = status;
    task.user = user;
    return this.taskRepository.save(task);
  }

  async getTasks(user: User) {
    const query = this.taskRepository.createQueryBuilder('task');
    query.where({ user });

    const tasks = await query.getMany();
    return tasks;
  }

  findOne(id: string, user: User) {
    const task = this.taskRepository.findOne({
      where: { id, user },
    });
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, user: User) {
    const task = await this.findOne(id, user);
    return this.taskRepository.save({ ...task, ...updateTaskDto });
  }

  async remove(id: string, user: User) {
    const task = await this.findOne(id, user);
    return this.taskRepository.remove(task);
  }
}
