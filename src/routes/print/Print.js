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
      <div key={Math.random()} className={s.reco}>
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
                <div className={s.side}>
                  { reco.moduleSide === 'right' ? 'R' : 'L' }
                </div>
                <div className={s.slot}>
                  Slot {reco.slotIndex + 1}
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
      range,
      setValue,
      prints,
      modules,
    } = this.props;

    console.log('render print', this.props);

    if (modules && !prints) {

      let allRecos = [];
      for (let i = 0; i < modules.length; i++) {
        for (let j = 0; j < modules[i].recos.length; j++) {
          allRecos.push({ ...modules[i].recos[j], module: i });
        }
      }

      //console.log("all recos", allRecos);

      if (range) {

        const rangeValues = [];
        const rangeElems = range.split(',');

        for (let i = 0; i < rangeElems.length; i++) {
          const recoCoords = rangeElems[i].split(':');
          rangeValues.push({
            module: parseInt(recoCoords[0]),
            side: recoCoords[1] === 'r' ? 'right' : 'left',
            row: parseInt(recoCoords[2]),
            slot: parseInt(recoCoords[3]) - 1
          });
        }

        //console.log("range vals", rangeValues);
        allRecos = allRecos.filter(reco => {

          for (let i = 0; i < rangeValues.length; i++) {

            //console.log(reco.module, rangeValues[i].module, reco.moduleSide, rangeValues[i].side, reco.rowNumber, rangeValues[i].row, reco.slotIndex, rangeValues[i].slot);
            if (
              reco.module === rangeValues[i].module &&
              reco.moduleSide === rangeValues[i].side &&
              reco.rowNumber === rangeValues[i].row &&
              reco.slotIndex === rangeValues[i].slot
            ) {
              return true;
            }

          }

          return false;

        });

      }

      //console.log("filtered recos", allRecos);

      setTimeout(async () => {

        const printElems = [];
        let counter = 0;

        for (let i = 0; i < allRecos.length; i += 2) {

          const elemPair = [];

          elemPair.push(await this.createElem(allRecos[i]));
          if (i + 1 < allRecos.length) {
            elemPair.push(await this.createElem(allRecos[i + 1]));
          }

          printElems.push(
            <div key={Math.random()} className={cx(s.row, counter % 2 ? s.rowMargin6 : s.rowMargin7)}>
              {elemPair}
            </div>
          );

          counter++;

        }

        if (!prints) {
          setValue('prints', printElems);
        }

      }, 1000);
    }

    return (
      <div className={s.root}>
        <div className={s.container}>
          {
            prints ?
              <div>
                {prints}
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
