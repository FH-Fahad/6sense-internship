import { Injectable } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { User } from 'src/auth/auth.entity';
import { Logger } from '@nestjs/common';

@Injectable()
export class TasksService {
  private logger = new Logger('TasksService');
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  create(createTaskDto: CreateTaskDto, user: User) {
    const { title, description, status } = createTaskDto;

    try {
      const task = this.taskRepository.create({
        title,
        description,
        status,
        user,
      });
      this.logger.log(`User ${user.username} creating a task`);
      return this.taskRepository.save(task);
    } catch (err) {
      this.logger.error(
        `User ${user.username} failed to create a task`,
        err.message,
      );
      throw new Error('Something went wrong');
    }
  }

  async getTasks(user: User) {
    const query = this.taskRepository.createQueryBuilder('task');
    query.where({ user });

    const tasks = await query.getMany();
    this.logger.log(`User ${user.username} retrieving tasks`);
    return tasks;
  }

  findOne(id: string, user: User) {
    const task = this.taskRepository.findOne({
      where: { id, user },
    });
    if (!task) {
      this.logger.error(`Task with ID ${id} not found`);
      throw new Error('Task not found');
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, user: User) {
    const task = await this.findOne(id, user);

    try {
      this.logger.log(`User ${user.username} updating task with ID ${id}`);
      return this.taskRepository.save({ ...task, ...updateTaskDto });
    } catch (err) {
      this.logger.error(
        `User ${user.username} failed to update task with ID ${id}`,
        err.message,
      );
      throw new Error('Something went wrong');
    }
  }

  async remove(id: string, user: User) {
    const task = await this.findOne(id, user);
    return this.taskRepository.remove(task);
  }
}
