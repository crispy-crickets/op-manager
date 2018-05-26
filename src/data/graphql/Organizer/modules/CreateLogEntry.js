import { Module, Reco, LogEntry } from 'data/models';

export const schema = [
  `
  input LogEntryInput {
    id: String
    recoId: String
    type: String
    numValue: Int
    textValue: String
    title: String
    text: String
  }
`,
];

export const mutation = [
  `
  createLogEntry(
    logEntry: LogEntryInput!
  ): LogEntry
`,
];

export const resolvers = {

  Mutation: {

    async createLogEntry(parent, args) {

      const logEntry = await LogEntry.create(args.logEntry);
      return logEntry;

    }

  },

};
