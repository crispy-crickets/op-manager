/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { GraphQLList as List } from 'graphql';
import ModuleType from '../types/ModuleType';
import ModuleInputType from '../types/ModuleInputType';

let items = [
  { id: '1', name: 'Module 1', recos: [{ id: '1', name: 'Reco 1' }, { id: '2', name: 'Reco 2' }, { id: '3', name: 'Reco 3' }]},
  { id: '2', name: 'Module 2', recos: [{ id: '4', name: 'Reco 4' }, { id: '5', name: 'Reco 5' }, { id: '6', name: 'Reco 6' }]}
];

const query = {
  type: new List(ModuleType),
  resolve() {
    return items;
  },
};

const mutation = {
  type: ModuleType,
  description: 'Update or create a module',
  args: {
    module: { type: ModuleInputType }
  },
  resolve: async ({ request }, { module }) => {
    if (!module.id) {
      console.log("create module", module);
      return module;
    } else {
      console.log("update module", module);
      return module;
    }
  }
};

const modules = {
  query,
  mutation
};

export default modules;
