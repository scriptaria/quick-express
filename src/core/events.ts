import { Subject } from "rxjs";
import { EventList } from "./interfaces";

export class Events {
    private events: EventList = {};

    public listen(eventKey: string): Subject<any> {

        if (!(eventKey in this.events)) {
            const event = new Subject();
            this.events[eventKey] = event;
        }

        return this.events[eventKey];
    }

    public send(eventKey: string, data: any = null): any {

        if (!(eventKey in this.events)) {
            const event = new Subject();
            this.events[eventKey] = event;
        }

        return this.events[eventKey].next(data);
    }

}
