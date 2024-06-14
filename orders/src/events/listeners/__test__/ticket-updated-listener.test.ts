import { TicketUpdatedListener } from "../ticket-updated-listener";
import { TicketUpdatedEvent } from "@gktickets334/common";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () => {
    // create a listener
    const listener = new TicketUpdatedListener(natsWrapper.client);

    // create and save a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    });
    await ticket.save();

    // create a fake data object
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: 'concert',
        price: 999,
        userId: 'iahfhaga'
    }

    // create a fake msg object
    //  @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    // return all this stuff
    return { listener, ticket, data, msg};

}

it('finds, updates and save a ticket', async () => {
    const { listener, ticket, data, msg} = await setup();
    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.version).toEqual(data.version);

});

it('acks a message', async () => {
    const { listener, data, msg} = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has skipped version number', async () => {
    const { msg, data, listener, ticket} = await setup();

    data.version = 10;

    try {
        await listener.onMessage(data, msg);
    } catch( err ) {

    }
    expect(msg.ack).not.toHaveBeenCalled();
})