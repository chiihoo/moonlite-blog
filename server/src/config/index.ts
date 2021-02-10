// import { resolve, join } from 'path'

// @nestjs/config库的配置

export default () => ({
  // 数据库配置
  DATABASE_CONFIG: {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'moonlite_blog_db',
    // 这路径不能写错了，这里是按照当前路径config文件夹的上一级，也就是src文件夹下的，所有以.entity.{ts,js}为后缀名的文件
    // entities: [join(__dirname, '../', '**/*.entity.{ts,js}')],
    // entities: [join(__dirname, '..', '**/*.entity.{ts,js}')],

    autoLoadEntities: true, //将自动加载实体，不需要写 entities: []
    synchronize: true, // 自动会根据模型生成表
  },
});
