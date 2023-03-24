import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvironmentConfigModule } from './infrastructure/config/environment-config/environment-config.module';

@Module({
  imports: [
	EnvironmentConfigModule,
	ConfigModule.forRoot({
		isGlobal: true,
		expandVariables: true,
		envFilePath: '.env',
	      }),
],
  controllers: [],
  providers: [],
})
export class AppModule {}
