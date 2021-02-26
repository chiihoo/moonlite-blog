import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import customConfig from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 作用于全局
      load: [customConfig], // 加载自定义配置项
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('DATABASE_CONFIG'),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    CategoriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
