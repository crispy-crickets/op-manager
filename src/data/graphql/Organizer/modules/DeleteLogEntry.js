import { Module, Reco, LogEntry } from 'data/models';

export const mutation = [
  `
  deleteLogEntry(
    id: String!
  ): String
`,
];

export const resolvers = {

  Mutation: {

    async deleteLogEntry(parent, args) {

      const deleted = await LogEntry.destroy({ where: { id: args.id }, force: true });

      return args.id;

    },

  },

};
