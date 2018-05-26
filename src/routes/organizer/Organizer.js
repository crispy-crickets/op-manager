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
import modulesQuery from '../../data/graphql/queries/getModules.graphql';
import s from './Organizer.css';
import cx from 'classnames';
import { addModule, updateModule, deleteModule, addReco, updateReco, deleteReco, createLogEntry, updateLogEntry, deleteLogEntry, getAllLogEntries, setValue } from "../../actions/organizer";
import { connect } from "react-redux";

class Organizer extends React.Component {

  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      modules: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired
        }),
      ),
    }).isRequired,
  };

  moveAddRow(change) {
    const { setValue, addRowNumber } = this.props;
    setValue('addRowNumber', addRowNumber + change);
  }

  addRow(module, moduleSide, rowNumber) {
    console.log("adding row", module.id, moduleSide, rowNumber);
    const { updateModule } = this.props;
    const values = moduleSide === 'right' ? { rowsRight: module.rowsRight + 1 } : { rowsLeft: module.rowsLeft + 1 };
    updateModule({ module: { id: module.id, values: { ...values, moduleSide, rowNumber } } });
  }

  getRecoForSlot(recos, moduleSide, rowNumber, slotIndex) {

    for (let i = 0; i < recos.length; i++) {
      if (recos[i].moduleSide === moduleSide && recos[i].slotIndex === slotIndex && recos[i].rowNumber === rowNumber) {
        return recos[i];
      }
    }

    return null;

  }

  renderRow(module, moduleSide, rowNumber, addRow, addRowModuleSide, addRowNumber, recos) {

    const { addReco, selectedReco, getAllLogEntries, setValue } = this.props;

    const slots = [];
    for (let i = 0; i < module.size; i++) {
      slots.push({ index: i });
    }

    console.log("row count?", moduleSide, module.rowsRight, module.rowsLeft);
    const rowCount = moduleSide === 'right' ? module.rowsRight : module.rowsLeft;

    console.log("render row", module, addRow, moduleSide, addRowModuleSide, rowCount, addRowNumber, rowNumber);
    if (addRow && moduleSide === addRowModuleSide && rowCount === 0) {
      return (
        <div className={cx(s.row, s.addRow)}>
          <button onClick={() => this.addRow(module, moduleSide, 1)}>Add</button>
        </div>
      );
    }

    return (
      <div>
        {
          (addRow && moduleSide === addRowModuleSide && addRowNumber === rowNumber) &&
          <div className={cx(s.row, s.addRow)}>
            {
              (addRowNumber !== 1) &&
              <span>
                <a href="#" onClick={() => this.moveAddRow(-1)}>Up</a>
                &nbsp; | &nbsp;
              </span>
            }
            <a href="#" onClick={() => this.moveAddRow(1)}>Down</a>
            &nbsp;<button onClick={() => this.addRow(module, moduleSide, moduleSide === 'right' ? rowCount + 2 - addRowNumber : addRowNumber)}>Add</button>
          </div>

        }
        <div className={s.row} key={`${moduleSide}-${rowNumber}`}>
          {
            slots.map((slot, slotIndex) => {
              const slotRowNumber = moduleSide === 'right' ? module.rowsRight + 1 - rowNumber : rowNumber;
              const reco = this.getRecoForSlot((module.recos || []), moduleSide, slotRowNumber, slotIndex);
              const recoElem = reco ?
                (
                  (!selectedReco || selectedReco.id !== reco.id) ?
                    <div className={cx(s.reco, s.recoNew)} onClick={() => {
                      setValue('newLogEntryType', 'pinheads');
                      setValue('newLogEntryTitle', 'Added pinheads');
                      setValue('selectedReco', reco);
                      getAllLogEntries(reco.id);
                    }}>
                      {reco.slotIndex}
                    </div> :
                    <div className={cx(s.reco, s.recoNew, s.recoSelected)} onClick={() => setValue('selectedReco', null)}>
                      {reco.slotIndex}
                    </div>
                ) :
                <div className={s.emptySlot}>
                  <a href="#" onClick={() => addReco({ reco: { moduleId: module.id, moduleSide, rowNumber: slotRowNumber, slotIndex } })}>X</a>
                </div>;
              return (
                <div className={s.slot}>
                  {recoElem}
                </div>
              );
            })
          }
        </div>
        {
          (addRow && moduleSide === addRowModuleSide && (addRowNumber === rowCount + 1 && rowNumber === rowCount)) &&
          <div className={cx(s.row, s.addRow)}>
            <a href="#" onClick={() => this.moveAddRow(-1)}>Up</a>
            &nbsp;<button onClick={() => this.addRow(module, moduleSide, moduleSide === 'right' ? rowCount + 2 - addRowNumber : addRowNumber)}>Add</button>
          </div>

        }
      </div>
    );
  }

  formatLogItemDate(dateStr) {
    const date = new Date(dateStr);
    const weekDays = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ];
    return weekDays[date.getDay()] + ' ' + date.getDate() + '.' + (date.getMonth() + 1) + ' ' + date.getHours() + ':' + date.getMinutes();
  }

  render() {

    const {
      addModule, deleteModule, setValue,
      createLogEntry, deleteLogEntry, getAllLogEntries,
      newModule, newModuleName, newModuleSize,
      module, modules, loadingModules, selectedModule, logEntries,
      addRow, addRowNumber, addRowModuleSide, moduleValues, updatedModule,
      newLogEntryType, newLogEntryValue, newLogEntryTitle, newLogEntryText,
      selectedReco,
      data: { loading, getAllModules }
    } = this.props;

    console.log("render org", this.props);

    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>Grow modules</h1>
          <input type="text" value={newModuleSize || ''} onChange={(e) => { setValue('newModuleSize', e.target.value); }}></input>
          <input type="text" value={newModuleName || ''} onChange={(e) => { setValue('newModuleName', e.target.value); }}></input>
          <button onClick={() => {
            addModule({ module: { name: newModuleName, size: parseInt(newModuleSize) }});
          }}>
            Add module
          </button>
          {(false)
            ? 'Loading...'
            : <div className={s.modules}>
              {(modules || getAllModules).map(module => {

                const rightRows = [];
                for (let i = 0; i < module.rowsRight; i++) {
                  rightRows.push(this.renderRow(module, 'right', i + 1, addRow, addRowModuleSide, addRowNumber, module.recos));
                }

                const leftRows = [];
                for (let i = 0; i < module.rowsLeft; i++) {
                  leftRows.push(this.renderRow(module, 'left', i + 1, addRow, addRowModuleSide, addRowNumber, module.recos));
                }

                console.log("addd row?", addRow, addRowModuleSide, module.rowsRight, module.rowsLeft);
                if (addRow && addRowModuleSide === 'right' && module.rowsRight === 0) {
                  console.log("push to right");
                  rightRows.push(this.renderRow(module, addRowModuleSide, 1, addRow, addRowModuleSide, 1, module.recos));
                }

                if (addRow && addRowModuleSide === 'left' && module.rowsLeft === 0) {
                  console.log("push to left");
                  leftRows.push(this.renderRow(module, addRowModuleSide, 1, addRow, addRowModuleSide, 1, module.recos));
                }

                return (
                  <div key={module.id}>
                    <div className={cx(s.moduleSummary, (module.id === selectedModule) ? s.expanded : {})}>
                      <div className={s.header}>
                        <div>
                          <div className={s.name}>
                            <a href="#" onClick={() => setValue('selectedModule', module.id)}>{module.name}</a>
                          </div>
                          <div className={s.stats}>
                            <div className={s.stat}>524 Recos</div>
                            <div className={s.stat}>Temp 34'C</div>
                            <div className={s.stat}>Hum 19'</div>
                          </div>
                        </div>
                        <div>
                          <div className={s.controls}>
                            <a href="#" onClick={() => deleteModule(module.id)}>Remove</a>
                          </div>
                        </div>
                      </div>
                      {
                        (module.id === selectedModule) &&
                        <div className={s.moduleOverview}>
                          <div className={s.controls}>
                            {
                              addRow ?
                                <div>
                                  <a href="#" onClick={() => setValue('addRow', false)}>Cancel</a>
                                  &nbsp; | &nbsp;
                                  {
                                    addRowModuleSide === 'right' ?
                                      <a href="#" onClick={() => setValue('addRowModuleSide', 'left')}>Left</a> :
                                      <a href="#" onClick={() => setValue('addRowModuleSide', 'right')}>Right</a>
                                  }
                                </div> :
                                <a href="#" onClick={() => {
                                  setValue('addRowModuleSide', 'right');
                                  setValue('addRowNumber', 1);
                                  setValue('addRow', true);
                                }}>Add row</a>
                            }
                          </div>
                          <div className={s.layout}>
                            <div className={s.content}>
                              <div className={s.wall}>
                                { rightRows }
                              </div>
                              <div className={s.corridor}>CORRIDOR</div>
                              <div className={s.wall}>
                                { leftRows }
                              </div>
                            </div>
                            <div className={s.guide}>
                              <div className={cx(s.block, s.right)}>
                                R
                              </div>
                              <div className={cx(s.block, s.door)}>
                                DOOR
                              </div>
                              <div className={cx(s.block, s.left)}>
                                L
                              </div>
                            </div>
                          </div>
                        </div>
                      }
                    </div>
                    {
                      selectedReco &&
                      <div className={s.recoInfo}>
                        <div>State: {selectedReco.state}</div>
                        <div className={s.logEntry}>
                          <div className={s.logEntryRow1}>
                            <div>
                              <select value={newLogEntryType} onChange={(e) => {
                              const defaultTitles = {
                                'pinheads': 'Added pinheads',
                                'feed': 'Added feed',
                                'water': 'Added water',
                                'egg-tray-in': 'Placed egg trays',
                                'egg-tray-out': 'Removed egg trays'
                              }
                              setValue('newLogEntryType', e.target.value);
                              setValue('newLogEntryTitle', defaultTitles[e.target.value]);
                            }}>
                                <option value="pinheads">Pinheads</option>
                                <option value="feed">Feed</option>
                                <option value="water">Water</option>
                                <option value="egg-tray-in">Egg tray in</option>
                                <option value="egg-tray-out">Egg tray out</option>
                              </select>&nbsp;
                              <input type="text" value={newLogEntryTitle} onChange={(e) => setValue('newLogEntryTitle', e.target.value)}></input>
                            </div>
                            <div className={s.logEntryValue}>
                              Value: <input className={s.logEntryValueInput} type="text" value={newLogEntryValue} onChange={(e) => setValue('newLogEntryValue', e.target.value)}></input>
                            </div>
                          </div>
                          <div className={s.logEntryText}>

                            <input type="text" className={s.logEntryTextInput} value={newLogEntryText} onChange={(e) => setValue('newLogEntryText', e.target.value)}></input>
                            <button className={s.logEntrySubmit} onClick={() => {

                              const logEntry = {
                                recoId: selectedReco.id,
                                type: newLogEntryType,
                                title: newLogEntryTitle,
                                text: newLogEntryText
                              };

                              console.log("saving log entry", logEntry);
                              try {
                                const numValue = parseInt(newLogEntryValue);
                                logEntry.numValue = numValue;
                              } catch (err) {
                                logEntry.textValue = newLogEntryValue;
                              }
                              createLogEntry({ logEntry });

                            }}>Add</button>
                          </div>
                        </div>
                        <div>
                          {(logEntries || this.props.data.getAllLogEntries || []).map(logEntry => {
                            return (
                              <div className={s.logItem}>
                                <div className={s.logItemDate}>
                                  {this.formatLogItemDate(logEntry.createdAt)}
                                </div>
                                <div className={s.logItemTitle}>
                                  {logEntry.title || logEntry.type}
                                </div>
                                <div className={s.logItemValue}>
                                  {logEntry.numValue || logEntry.textValue}
                                </div>
                                <div className={s.logItemText}>
                                  {logEntry.text}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    }
                  </div>
                )
              })}
            </div>
          }
        </div>
      </div>
    );
  }
}

const mapState = state => {
  console.log(state.organizer.newModuleName);
  return { ...state.organizer };
};

const mapDispatch = {
  addModule,
  updateModule,
  deleteModule,
  addReco,
  updateReco,
  deleteReco,
  createLogEntry,
  updateLogEntry,
  deleteLogEntry,
  getAllLogEntries,
  setValue
};

export default connect(mapState, mapDispatch)(compose(withStyles(s), graphql(modulesQuery))(Organizer));
