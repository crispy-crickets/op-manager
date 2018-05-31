/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Organizer from './Print';
import modulesQuery from '../../data/graphql/queries/getModules.graphql';

async function action({ client }, { module, range }) {

  const data = await client.query({
    query: modulesQuery
  });

  console.log('PRINT DATA', data);

  return {
    title: 'Crispy Operations Manager - QR Codes',
    chunks: ['print'],
    component: <Organizer range={range} modules={data.data.getAllModules} />,
  };
}

export default action;
