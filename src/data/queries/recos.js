/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { GraphQLList as List } from 'graphql';
import RecoType from '../types/RecoType';
import RecoInputType from "../types/RecoInputType";

let items = [
  { id: '1', name: 'Reco 1' },
  { id: '2', name: 'Reco 2' },
  { id: '3', name: 'Reco 3' },
  { id: '4', name: 'Reco 4' },
  { id: '5', name: 'Reco 5' }
];

const query = {
  type: new List(RecoType),
  resolve() {
    return items;
  },
};

const mutation = {
  type: RecoType,
  description: 'Update or create a reco',
  args: {
    reco: { type: RecoInputType }
  },
  resolve: async ({ request }, { reco }) => {
    if (!module.id) {
      console.log("create reco", reco);
      return reco;
    } else {
      console.log("update reco", reco);
      return reco;
    }
  }
};

const recos = {
  query,
  mutation
};

export default recos;
