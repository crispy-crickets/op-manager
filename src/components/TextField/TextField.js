/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './TextField.css';
import cx from "classnames";

class TextField extends React.Component {
  render() {
    const { label, value, onChange, className } = this.props;
    return (
      <div className={cx(s.textField, className)}>
        <div className={s.fieldLabel}>{label}</div>
        <div className={s.inputContainer}>
          <input type="text" value={value} onChange={onChange} />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(TextField);
