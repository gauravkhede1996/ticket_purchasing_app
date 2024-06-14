import mongoose from 'mongoose';
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { Ticket } from "../../../models/ticket";
import { Order } from "../../../models/order";
import { OrderStatus, ExpirationCompleteEvent } from '@gktickets334/common';
import { Message } from 'node-nats-streaming';

const setup = async () => {
    const listener  = new ExpirationCompleteListener(natsWrapper.client);
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    });
    await ticket.save();
    const order= Order.build({
        status: OrderStatus.Created,
        userId: 'jabfiap',
        expiresAt: new Date(),
        ticket
    });
    await order.save();

    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id
    };
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, order, msg, data, ticket};
}

it('updates the order status to cancel', async () => {
    const { listener, data, msg, ticket, order } = await setup();
    await listener.onMessage(data,msg);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits an order cancel event', async () => {
    const { listener, data, msg, ticket, order } = await setup();
    await listener.onMessage(data,msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(eventData.id).toEqual(order.id);
});

it('acks the message', async () => {
    const { listener, data, msg, ticket, order } = await setup();
    await listener.onMessage(data,msg);

    expect(msg.ack).toHaveBeenCalled();
});