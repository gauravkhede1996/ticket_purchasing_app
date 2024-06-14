import { Publisher, Subjects, TicketCreatedEvent } from '@gktickets334/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}

