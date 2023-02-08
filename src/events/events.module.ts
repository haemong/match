import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  providers: [EventsGateway, EventsService],
  controllers: [EventsController],
})
export class EventsModule {}
