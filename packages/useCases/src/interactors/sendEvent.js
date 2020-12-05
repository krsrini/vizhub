import { increment } from 'multiscale-timeseries';

const maxEntries = 1000;

// Sends a new event for recording in the multiscale timeseries analytics store.
// Naming is inspired by Google Analytics 'send' method for event tracking.
export class SendEvent {
  constructor({ eventRecordsGateway }) {
    this.eventRecordsGateway = eventRecordsGateway;
  }

  async execute(requestModel) {
    const { eventIDs, date } = requestModel;

    const records = await this.eventRecordsGateway.getEventRecords(eventIDs);

    const newRecords = records.map((record, i) =>
      increment(record || { id: eventIDs[i] }, date, maxEntries)
    );

    return await this.eventRecordsGateway.setEventRecords(newRecords);
  }
}
