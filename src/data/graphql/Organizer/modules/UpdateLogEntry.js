import { Module, Reco, LogEntry } from 'data/models';

export const schema = [
  `
  input LogEntryValues {
    recoId: String
    type: String
    numValue: Int
    textValue: String
    title: String
    text: String
  }
  
  input UpdateLogEntryInput {
    id: String!
    values: LogEntryValues
  }
`,
];

export const mutation = [
  `
  updateLogEntry(
    logEntry: UpdateLogEntryInput!
  ): LogEntry
`,
];

export const resolvers = {

  Mutation: {

    async updateLogEntry(parent, args) {

      const { values } = args.logEntry;

      let logEntry = await LogEntry.findById(args.logEntry.id);
      const result = await logEntry.update(values);
      console.log("update logEntry result", result);

      logEntry = await LogEntry.findById(args.logEntry.id);

      return logEntry;

    },

  },

};
