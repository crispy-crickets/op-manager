import { Module, Reco } from 'data/models';

export const schema = [
  `
  input ModuleValues {
    name: String
    size: Int
    rowsRight: Int
    rowsLeft: Int
    moduleSide: String
    rowNumber: Int
  }
  
  input UpdateModuleInput {
    id: String!
    values: ModuleValues
  }
`,
];

export const mutation = [
  `
  updateModule(
    module: UpdateModuleInput!
  ): Module
`,
];

export const resolvers = {

  Mutation: {

    async updateModule(parent, args) {

      const { values } = args.module;

      let module = await Module.findById(args.module.id);

      if (values.moduleSide || values.rowNumber) {
        // TODO: Update reco row numbers
        delete values.moduleSide;
        delete values.rowNumber;
      }

      const result = await module.update(values);
      console.log("update result", result);

      module = await Module.findById(args.module.id);

      return module;

    },

  },

};
