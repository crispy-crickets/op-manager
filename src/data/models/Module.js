/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import DataType from 'sequelize';
import Model from '../sequelize';
import Reco from './Reco';

const Module = Model.define(
  'Module',
  {
    id: {
      type: DataType.UUID,
      defaultValue: DataType.UUIDV1,
      primaryKey: true,
    },
    name: {
      type: DataType.STRING(255),
    },
    size: {
      type: DataType.INTEGER,
    },
    rowsRight: {
      type: DataType.INTEGER,
      defaultValue: 0,
    },
    rowsLeft: {
      type: DataType.INTEGER,
      defaultValue: 0,
    },
  },
  {
    indexes: [{ fields: ['name'] }],
  },
);

export default Module;
