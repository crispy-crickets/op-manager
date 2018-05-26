import { Module, Reco } from 'data/models';

export const mutation = [
  `
  deleteReco(
    id: String!
  ): String
`,
];

export const resolvers = {

  Mutation: {

    async deleteReco(parent, args) {

      const deleted = await Reco.destroy({ where: { id: args.id }, force: true });

      return args.id;

    },

  },

};
