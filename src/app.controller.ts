import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/chatting')
  @Render('index')
  root() {
    return {
      data: {
        title: '채팅',
        copyright: 'HTL Arrayagg lee',
      },
    };
  }
}
