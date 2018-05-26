/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
  GraphQLList as List,
} from 'graphql';

import RecoType from './RecoType';

const ModuleType = new ObjectType({
  name: 'Module',
  fields: {
    id: { type: new NonNull(StringType) },
    name: { type: new NonNull(StringType) },
    recos: { type: new List(RecoType) },
  },
});

export default ModuleType;
