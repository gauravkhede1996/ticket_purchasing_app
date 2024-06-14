import { Subjects, Publisher, OrderCancelledEvent } from "@gktickets334/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}

