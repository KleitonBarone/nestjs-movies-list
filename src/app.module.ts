import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvironmentConfigModule } from './infrastructure/config/environment-config/environment-config.module';
import { setEnvironment } from './infrastructure/config/environment-config/set-environment';

@Module({
  imports: [
	EnvironmentConfigModule,
	ConfigModule.forRoot({
		isGlobal: true,
		expandVariables: true,
		envFilePath: setEnvironment(),
	      }),
],
  controllers: [],
  providers: [],
})
export class AppModule {}
