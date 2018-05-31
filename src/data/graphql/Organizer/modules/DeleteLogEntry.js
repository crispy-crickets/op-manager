import { Module, Reco, LogEntry } from 'data/models';

export const mutation = [
  `
  deleteLogEntry(
    id: String!
  ): LogEntry
`,
];

export const resolvers = {

  Mutation: {

    async deleteLogEntry(parent, args) {

      const logEntry = await LogEntry.findById(args.id);
      const deleted = await LogEntry.destroy({ where: { id: args.id }, force: true });

      return logEntry;

    },

  },

};
