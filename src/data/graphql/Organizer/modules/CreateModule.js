import { Module, Reco } from 'data/models';

export const schema = [
  `
  # Module input data
  input ModuleInput {
    # Optional module id
    id: String

    # Module name
    name: String
    size: Int
  }
`,
];

export const mutation = [
  `
  # Creates a new module
  createModule(
    module: ModuleInput!
  ): Module
`,
];

export const resolvers = {

  Mutation: {

    async createModule(parent, args) {

      const module = await Module.create(args.module);
      return module;

    }

  },

};
