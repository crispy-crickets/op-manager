import { Module, Reco, LogEntry } from 'data/models';

export const schema = [
  `
  # A grow module object
  type LogEntry {
    id: String
    recoId: String
    type: String
    numValue: Int
    textValue: String
    title: String
    text: String,
    createdAt: String
  }
`,
];

export const queries = [
  `
  getAllLogEntries(
    recoId: String!
  ): [LogEntry]
`,

];

export const resolvers = {

  RootQuery: {

    async getAllLogEntries(parent, args) {

      console.log("query log entries", args);
      const logEntries = await LogEntry.findAll({ where: { recoId: args.recoId }, order: [ [ 'createdAt', 'DESC' ] ] });

      return logEntries;

    }

  },
};
