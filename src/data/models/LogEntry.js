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

const LogEntry = Model.define(
  'LogEntry',
  {
    id: {
      type: DataType.UUID,
      defaultValue: DataType.UUIDV1,
      primaryKey: true,
    },
    type: {
      type: DataType.STRING(255),
    },
    numValue: {
      type: DataType.INTEGER,
    },
    textValue: {
      type: DataType.STRING(255),
    },
    title: {
      type: DataType.STRING(255),
    },
    text: {
      type: DataType.STRING(255),
    },
  },
  {
    indexes: [{ fields: ['title'] }],
  },
);

export default LogEntry;
