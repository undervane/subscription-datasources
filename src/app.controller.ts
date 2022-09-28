import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly service: AppService) {}

  @Get()
  triggerPublish(): Promise<string> {
    return this.service.publish('example', 'Hello world!');
  }
}
