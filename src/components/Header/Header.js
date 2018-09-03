/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.css';
import Link from '../Link';
import Navigation from '../Navigation';
import LanguageSwitcher from '../LanguageSwitcher';
import logoUrl from './logo.png';
import logoUrl2x from './logo-small@2x.png';

const messages = defineMessages({
  brand: {
    id: 'header.brand',
    defaultMessage: 'Your Company Brand',
    description: 'Brand name displayed in header',
  },
  bannerTitle: {
    id: 'header.banner.title',
    defaultMessage: 'React',
    description: 'Title in page header',
  },
  bannerDesc: {
    id: 'header.banner.desc',
    defaultMessage: 'Complex web apps made easy',
    description: 'Description in header',
  },
});

class Header extends React.Component {
  render() {
    const { title } = this.props;
    return (
      <div className={s.root}>
        <div className={s.container}>
          <div className={s.logoCorner}>
            <div className={s.logoImage}>
              <Link className={s.brand} to="/">
                <img
                  src={logoUrl}
                  srcSet={`${logoUrl2x} 2x`}
                  height="60"
                  alt="Crispy Crickets"
                />
              </Link>
            </div>
            <div className={s.logoTitle}>
              <span className={s.brandTxt}>{title || 'OPERATION'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Header);
