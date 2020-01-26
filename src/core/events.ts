import { Subject } from "rxjs";
import { EventList } from "./interfaces";

const events: EventList = {};

export const listenEvent = (key: string): Subject<any> => {
  if (!(key in events)) {
    const event = new Subject();
    events[key] = event;
  }

  return events[key];
};

export const sendEvent = (key: string, data: any = null): void => {
  if (!(key in events)) {
    const event = new Subject();
    events[key] = event;
  }
  events[key].next(data);
};
