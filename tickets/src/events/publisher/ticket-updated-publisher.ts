import { Publisher, Subjects, TicketUpdatedEvent } from '@gktickets334/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}

