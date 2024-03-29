import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/auth.entity';
import { TasksModule } from './tasks/tasks.module';
import { Task } from './tasks/entities/task.entity';
import env from './config/app.config';

@Module({
  imports: [
    TasksModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: env.DB_PORT,
      username: 'postgres',
      password: 'postgres',
      database: "UserDB",
      entities: [Task, User],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
