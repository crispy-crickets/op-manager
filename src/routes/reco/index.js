/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Organizer from './Organizer';
import recoQuery from '../../data/graphql/queries/getReco.graphql';

async function action({ client }, { id }) {
  const data = await client.query({
    query: recoQuery,
    variables: { id },
  });

  console.log('DDATA', data);
  return {
    title: 'Crispy Operations Manager - Reco',
    chunks: ['reco'],
    component: <Organizer reco={data.data.getReco} />,
  };
}

export default action;
