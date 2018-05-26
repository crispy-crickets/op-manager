import { Module, Reco } from 'data/models';

export const schema = [
  `
  input RecoInput {
    id: String
    moduleId: String
    name: String
    moduleSide: String
    rowNumber: Int
    slotIndex: Int
  }
  
  type Reco {
    id: String
    moduleId: String
    name: String
    moduleSide: String
    rowNumber: Int
    slotIndex: Int
    state: String
  }
`,
];

export const mutation = [
  `
  createReco(
    reco: RecoInput!
  ): Reco
`,
];

export const resolvers = {

  Mutation: {

    async createReco(parent, args) {

      const reco = await Reco.create(args.reco);
      return reco;

    }

  },

};
