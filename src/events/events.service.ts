import { Injectable } from '@nestjs/common';

@Injectable()
export class EventsService {
  constructor(private eventsRepository) {}

  createMessage(message) {
    return 'ss';
  }
}
