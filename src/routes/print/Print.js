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
import { FormattedRelative } from 'react-intl';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import QRCode from 'qrcode';
import recoQuery from '../../data/graphql/queries/getReco.graphql';
import s from './Print.css';
import cx from 'classnames';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
import {
  getAllModules,
  setValue
} from '../../actions/organizer';
import { connect } from 'react-redux';

class Print extends React.Component {

  async generateQR(text, size) {
    try {
      const dataUrl = await QRCode.toDataURL(text, { width: size });
      console.log(dataUrl);
      return dataUrl;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  formatLogItemDate(dateStr) {
    const date = new Date(dateStr);
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return `${date.getDate()}.${date.getMonth()}`;
  }

  async createElem(reco) {

    let firstPinheads = null;
    if (reco.firstPinheads) {
      firstPinheads = new Date(reco.firstPinheads);
      firstPinheads = firstPinheads.getDate() + '.' + (firstPinheads.getMonth() + 1) + '.' + firstPinheads.getFullYear();
    }

    const qrData = await this.generateQR(`http://ops.crispycrickets.fi:3000/reco/${reco.id}`);

    const elem = (
      <div className={s.reco}>
        <div className={s.header}>
          <div className={s.qr}>
            <img src={qrData} />
          </div>
          <div className={s.info}>
            <div className={s.text}>
              <div className={s.place}>
                <div className={s.row}>
                  Row {reco.rowNumber}
                </div>
                <div className={s.slot}>
                  Slot {reco.slotIndex}
                </div>
              </div>
              {
                (firstPinheads !== null) &&
                <div className={s.date}>
                  {firstPinheads}
                </div>
              }
              {
                (reco.pinheads > 0) &&
                <div className={s.amount}>
                  {reco.pinheads} ml
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    );

    return elem;

  }


  render() {

    const {
      setValue,
      showPrints,
      prints,
      modules,
    } = this.props;

    console.log('render print', this.props);

    if (modules) {

      setTimeout(async () => {

        const printElems = [];
        let counter = 0;

        for (let i = 0; i < modules.length; i++) {
          for (let j = 0; j < modules[i].recos.length; j += 2) {

            const elemPair = [];

            elemPair.push(await this.createElem(modules[i].recos[j]));
            if (j + 1 < modules[i].recos.length) {
              elemPair.push(await this.createElem(modules[i].recos[j + 1]));
            }

            printElems.push(
              <div className={cx(s.row, counter % 2 ? s.rowMargin6 : s.rowMargin7)}>
                {elemPair}
              </div>
            );

            counter++;

          }
        }

        setValue('prints', printElems);

      }, 1000);
    }

    return (
      <div className={s.root}>
        <div className={s.container}>
          {
            prints ?
              <div>
                {
                  prints.map(print => {
                    return (
                      <div>
                        {print}
                      </div>
                    );
                  })
                }
              </div> :
              <div>
                Loading...
              </div>
          }
        </div>
      </div>
    );

  }

}

const mapState = (state, ownProps) => {
  return { ...state.organizer };
};

const mapDispatch = {
  getAllModules,
  setValue
};

export default connect(mapState, mapDispatch)(
  compose(withStyles(s))(Print),
);
