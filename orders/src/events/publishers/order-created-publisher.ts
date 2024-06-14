import { Publisher, OrderCreatedEvent, Subjects} from '@gktickets334/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}

