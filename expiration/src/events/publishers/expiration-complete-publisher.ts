import { Subjects, Publisher, ExpirationCompleteEvent } from "@gktickets334/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}