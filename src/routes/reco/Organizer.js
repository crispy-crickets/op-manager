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
import s from './Organizer.css';
import cx from 'classnames';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
import {
  addReco,
  getReco,
  updateReco,
  deleteReco,
  createLogEntry,
  updateLogEntry,
  deleteLogEntry,
  getAllLogEntries,
  setValue,
} from '../../actions/organizer';
import { connect } from 'react-redux';

class Organizer extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      modules: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
        }),
      ),
    }).isRequired,
  };

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

  getWorkPlanStyles(reco) {
    const {
      showWorkPlan,
      workPlanFeed,
      workPlanWater,
      workPlanTraysIn,
      workPlanTraysOut,
      workPlanHarvest,
    } = this.props;

    const displayActions = {
      feed: workPlanFeed,
      water: workPlanWater,
      traysIn: workPlanTraysIn,
      traysOut: workPlanTraysOut,
      harvest: workPlanHarvest,
    };

    if (!reco) {
      return null;
    }

    const requiredActions = (reco.requiredActions || '').split(',');
    const matchingActions = requiredActions.filter(
      action => displayActions[action],
    );

    if (!showWorkPlan || matchingActions.length === 0) {
      return null;
    }

    const workPlanColors = {
      feed: '#DEB887',
      water: '#00BFFF',
      traysIn: '#90EE90',
      traysOut: '#FFB6C1',
      harvest: '',
    };

    let backgroundStyle = {};
    if (matchingActions.length === 1) {
      backgroundStyle = {
        backgroundColor: workPlanColors[matchingActions[0]],
      };
    } else if (matchingActions.length === 2) {
      backgroundStyle = {
        background: `linear-gradient(180deg, ${
          workPlanColors[matchingActions[0]]
        } 0, ${workPlanColors[matchingActions[0]]} 50%, ${
          workPlanColors[matchingActions[1]]
        } 50%, ${workPlanColors[matchingActions[1]]} 100%)`,
      };
    } else {
      backgroundStyle = {
        background: `linear-gradient(180deg, ${
          workPlanColors[matchingActions[0]]
        } 0, ${workPlanColors[matchingActions[0]]} 33%, ${
          workPlanColors[matchingActions[1]]
        } 33%, ${workPlanColors[matchingActions[1]]} 66%, ${
          workPlanColors[matchingActions[2]]
        } 66%, ${workPlanColors[matchingActions[2]]} 100%)`,
      };
    }

    const workPlanStyles = {
      ...backgroundStyle,
    };

    console.log('req actions', matchingActions, workPlanStyles);

    return workPlanStyles;
  }

  formatLogItemDate(dateStr) {
    const date = new Date(dateStr);
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return `${date.getDate()}.${date.getMonth() + 1}`;
  }

  render() {
    const {
      reco,
      getReco,
      updateReco,
      setValue,
      createLogEntry,
      deleteLogEntry,
      getAllLogEntries,
      newLogEntryDate,
      newLogEntryType,
      newLogEntryValue,
      newLogEntryTitle,
      newLogEntryText,
      newRecoState,
      logEntries,
      workPlanFeed,
      workPlanWater,
      workPlanTraysIn,
      workPlanTraysOut,
      workPlanHarvest,
      // data: { getReco },
    } = this.props;

    console.log('render org', this.props);
    const loading = false;

    const typeUnits = {
      pinheads: 'ml',
      feed: 'kg',
      water: 'l',
      'egg-tray-in': 'tray(s)',
      'egg-tray-out': 'tray(s)',
      'state-change': '',
    };

    const defaultTitles = {
      pinheads: 'Added pinheads',
      feed: 'Added feed',
      water: 'Added water',
      'egg-tray-in': 'Placed egg trays',
      'egg-tray-out': 'Removed egg trays',
      'state-change': 'Changed state',
    };

    const defaultValues = {
      pinheads: '10',
      feed: '10',
      water: '10',
      'egg-tray-in': '2',
      'egg-tray-out': '2',
      'state-change': 'laying',
    };

    const actionLabels = {
      pinheads: {
        type: 'pinheads',
        value: 10,
        label: 'Add pinheads',
        color: '#FFF',
      },
      feed: { type: 'feed', value: 10, label: 'Add feed', color: '#DEB887' },
      water: { type: 'water', value: 10, label: 'Add water', color: '#00BFFF' },
      traysIn: {
        type: 'egg-tray-in',
        value: 2,
        label: 'Place egg trays',
        color: '#90EE90',
      },
      traysOut: {
        type: 'egg-tray-out',
        value: 2,
        label: 'Remove egg trays',
        color: '#FFB6C1',
      },
      harvest: { type: 'harvest', value: 1900, label: 'Harvest', color: '' },
    };

    let pinheadsText = '';

    if (reco) {
      if (reco.firstPinheads) {
        const firstPinheads = new Date(reco.firstPinheads);
        pinheadsText = `${firstPinheads.getDate()}.${firstPinheads.getMonth() +
          1} - `;
      }

      pinheadsText += `${reco.pinheads} ml`;
    }

    let requiredActions = [];
    if (reco && reco.requiredActions) {
      requiredActions = reco.requiredActions.split(',');
    }

    return (
      <div className={s.root}>
        <div className={s.container}>
          {loading ? (
            'Loading...'
          ) : (
            <div className={s.recoInfo}>
              <div className={s.recoStats}>
                <div className={s.pinheads}>{pinheadsText}</div>
                <div className={s.days}>
                  {reco.state === 'growing' && (
                    <div className={s.grow}>GROW DAY {reco.lifeDays}</div>
                  )}
                  {reco.state === 'laying' && (
                    <div className={s.laying}>
                      <div>EGG DAY {reco.lifeDays}</div>
                      <div>GROW DAY {reco.lifeDays}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className={s.requiredActions}>
                {requiredActions.map(action => (
                  <div
                    className={s.requiredAction}
                    style={{ backgroundColor: actionLabels[action].color }}
                  >
                    <div className={s.actionLabel}>
                      {actionLabels[action].label}
                    </div>
                    <div className={s.actionCheckbox}>
                      <input
                        type="checkbox"
                        onClick={e => {
                          e.stopPropagation();
                          createLogEntry({
                            logEntry: {
                              recoId: reco.id,
                              type: actionLabels[action].type,
                              title: actionLabels[action].label,
                              numValue: actionLabels[action].value,
                            },
                          }, true);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className={s.logEntry}>
                <div className={s.logEntryRow}>
                  <div className={s.logEntryType}>
                    <select
                      value={newLogEntryType}
                      onChange={e => {
                        setValue('newLogEntryType', e.target.value);
                        setValue(
                          'newLogEntryTitle',
                          defaultTitles[e.target.value],
                        );
                        setValue(
                          'newLogEntryValue',
                          defaultValues[e.target.value],
                        );
                      }}
                    >
                      <option value="pinheads">Pinheads</option>
                      <option value="feed">Feed</option>
                      <option value="water">Water</option>
                      <option value="egg-tray-in">Egg tray in</option>
                      <option value="egg-tray-out">Egg tray out</option>
                      <option value="state-change">State</option>
                    </select>&nbsp;
                  </div>
                  <div className={s.logEntryValue}>
                    {newLogEntryType === 'state-change' ? (
                      <select
                        value={newRecoState || reco.state}
                        onChange={e => {
                          setValue('newRecoState', e.target.value);
                        }}
                      >
                        <option value="growing">Growing</option>
                        <option value="laying">Laying</option>
                      </select>
                    ) : (
                      <input
                        placeholder="Value"
                        type="text"
                        value={newLogEntryValue}
                        onChange={e =>
                          setValue('newLogEntryValue', e.target.value)
                        }
                      />
                    )}
                  </div>
                </div>
                <div className={s.logEntryRow}>
                  <div className={s.logEntryTitle}>
                    <input
                      type="text"
                      placeholder="Title"
                      value={newLogEntryTitle}
                      onChange={e =>
                        setValue('newLogEntryTitle', e.target.value)
                      }
                    />
                  </div>
                  <div className={s.logEntryDate}>
                    <input
                      placeholder="Date"
                      type="text"
                      value={newLogEntryDate}
                      onChange={e =>
                        setValue('newLogEntryDate', e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className={s.logEntryRow}>
                  <div className={s.logEntryText}>
                    <input
                      type="text"
                      value={newLogEntryText}
                      onChange={e =>
                        setValue('newLogEntryText', e.target.value)
                      }
                    />
                  </div>
                  <div className={s.logEntrySubmit}>
                    <button
                      onClick={() => {
                        const logEntry = {
                          recoId: reco.id,
                          type: newLogEntryType,
                          title: newLogEntryTitle,
                          text: newLogEntryText,
                        };

                        if (newLogEntryDate) {
                          logEntry.createdAt = newLogEntryDate;
                        }

                        console.log('saving log entry', logEntry);
                        try {
                          const numValue = parseInt(newLogEntryValue);
                          logEntry.numValue = numValue;
                        } catch (err) {
                          logEntry.textValue = newLogEntryValue;
                        }
                        createLogEntry({ logEntry }, true);
                        console.log('new log entry', newLogEntryType);
                        if (newLogEntryType === 'state-change') {
                          updateReco({
                            reco: {
                              id: reco.id,
                              values: { state: newRecoState },
                            },
                          });
                        }
                      }}
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
              <div>
                {(logEntries || (reco || {}).logEntries || []).map(
                  (logEntry, index) => (
                    <div
                      className={cx(
                        s.logItem,
                        index % 2 !== 0 ? s.stripeBg : {},
                      )}
                    >
                      <div className={s.row}>
                        <div className={s.left}>
                          <div className={s.logItemDate}>
                            {this.formatLogItemDate(logEntry.createdAt)}
                          </div>
                        </div>
                        <div className={s.right}>
                          <div className={s.logItemTitle}>
                            {logEntry.title || logEntry.type}
                          </div>
                          <div className={s.logItemValue}>
                            {logEntry.numValue || logEntry.textValue}
                          </div>
                        </div>
                      </div>
                      {logEntry.text &&
                        logEntry.text !== '' && (
                          <div className={s.row}>
                            <div className={s.logItemText}>{logEntry.text}</div>
                          </div>
                        )}
                    </div>
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapState = (state, ownProps) => {
  console.log('map state', state, ownProps);
  return { ...state.organizer };
};

const mapDispatch = {
  addReco,
  getReco,
  updateReco,
  deleteReco,
  createLogEntry,
  updateLogEntry,
  deleteLogEntry,
  getAllLogEntries,
  setValue,
};

export default connect(mapState, mapDispatch)(
  compose(withStyles(s))(Organizer),
);
