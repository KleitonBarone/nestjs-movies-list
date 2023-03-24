import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentConfigService } from './environment-config.service';

@Module({
  providers: [EnvironmentConfigService]
})
export class EnvironmentConfigModule {}
