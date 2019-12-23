import { Subject } from "rxjs";
import { EventList } from "./interfaces";

export class Events {

  public static eventList: EventList = {};

  public static listen(eventKey: string): Subject<any> {
    if (!(eventKey in Events.eventList)) {
      const event = new Subject();
      Events.eventList[eventKey] = event;
    }
    return Events.eventList[eventKey];
  }

  public static send(eventKey: string, data: any = null): void {
    if (!(eventKey in Events.eventList)) {
      const event = new Subject();
      Events.eventList[eventKey] = event;
    }
    Events.eventList[eventKey].next(data);
  }
}
