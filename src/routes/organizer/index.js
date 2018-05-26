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
import modulesQuery from '../../data/graphql/queries/getModules.graphql';
import Layout from '../../components/Layout';

async function action({ client }) {

  const data = await client.query({
    query: modulesQuery,
  });

  return {
    title: 'Crispy Organizer',
    chunks: ['organizer'],
    component: (
      <Layout>
        <Organizer modules={data.reactjsGetAllModules} />
      </Layout>
    ),
  };
}

export default action;
