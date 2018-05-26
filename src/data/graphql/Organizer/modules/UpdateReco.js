import { Module, Reco } from 'data/models';

export const schema = [
  `
  input RecoValues {
    moduleId: String
    name: String
    moduleSide: String
    rowNumber: Int
    slotIndex: Int
  }
  
  input UpdateRecoInput {
    id: String!
    values: RecoValues
  }
`,
];

export const mutation = [
  `
  updateReco(
    reco: UpdateRecoInput!
  ): Reco
`,
];

export const resolvers = {

  Mutation: {

    async updateReco(parent, args) {

      const { values } = args.reco;

      let reco = await Reco.findById(args.reco.id);
      const result = await reco.update(values);
      console.log("update reco result", result);

      reco = await Reco.findById(args.reco.id);

      return reco;

    },

  },

};
