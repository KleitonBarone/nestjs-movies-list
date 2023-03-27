import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvironmentConfigModule } from './infrastructure/config/environment-config/environment-config.module';
import { setEnvironment } from './infrastructure/config/environment-config/set-environment';
import { TypeOrmConfigModule } from './infrastructure/config/typeorm/typeorm.module';

@Module({
  imports: [
	EnvironmentConfigModule,
	ConfigModule.forRoot({
		isGlobal: true,
		expandVariables: true,
		envFilePath: setEnvironment(),
	      }),
	TypeOrmConfigModule,
],
  controllers: [],
  providers: [],
})
export class AppModule {}
