import { Listener, OrderCancelledEvent, Subjects } from "@gktickets334/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id);

        if(!ticket) {
            throw new Error('Ticket not found');
        }

        ticket.set({orderId: undefined});

        await ticket.save();

        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            version: ticket.version,
            orderId: ticket.orderId,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId
        })

        msg.ack();
    }
}