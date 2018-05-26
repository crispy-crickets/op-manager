import { Module, Reco } from 'data/models';

export const schema = [
  `
  # A grow module object
  type Module {
    id: String
    name: String
    size: Int
    rowsRight: Int
    rowsLeft: Int
    recos: [Reco]
  }
`,
];

export const queries = [
  `
  # Retrieves all grow modules
  getAllModules: [Module]

  # Retrieves a single user from the local database
  getModule(
    # The user's email address
    id: String!
  ): Module
`,

];

export const resolvers = {

  RootQuery: {

    async getAllModules() {

      const modules = await Module.findAll({
        include: [
          { model: Reco, as: 'recos' }
        ]
      });

      return modules;

    },

    getModule(parent, { id }) {
      return {
        id: '1',
        name: 'Module 1'
      };
    },

  },
};
