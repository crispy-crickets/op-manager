import { Module, Reco } from 'data/models';

export const mutation = [
  `
  # Deletes a module
  deleteModule(
    id: String!
  ): String
`,
];

export const resolvers = {

  Mutation: {

    async deleteModule(parent, args) {

      const deleted = await Module.destroy({ where: { id: args.id }, force: true });

      return args.id;

    },

  },

};
