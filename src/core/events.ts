import { Subject } from "rxjs";
import { EventList } from "./interfaces";

const events: EventList = {};

export const listen = (eventKey: string): Subject<any> => {

    if (!(eventKey in events)) {
        const event = new Subject();
        events[eventKey] = event;
    }

    return events[eventKey];
};

export const send = (eventKey: string, data: any = null): any => {

    if (!(eventKey in events)) {
        const event = new Subject();
        events[eventKey] = event;
    }
    return events[eventKey].next(data);
};
