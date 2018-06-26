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
import modulesQuery from '../../data/graphql/queries/getModules.graphql';
import s from './Organizer.css';
import cx from 'classnames';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
import {
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

  moveAddRow(change) {
    const { setValue, addRowNumber } = this.props;
    setValue('addRowNumber', addRowNumber + change);
  }

  addRow(module, moduleSide, rowNumber) {
    console.log('adding row', module.id, moduleSide, rowNumber);
    const { updateModule } = this.props;
    const values =
      moduleSide === 'right'
        ? { rowsRight: module.rowsRight + 1 }
        : { rowsLeft: module.rowsLeft + 1 };
    updateModule({
      module: { id: module.id, values: { ...values, moduleSide, rowNumber } },
    });
  }

  getRecoForSlot(recos, moduleSide, rowNumber, slotIndex) {
    for (let i = 0; i < recos.length; i++) {
      if (
        recos[i].moduleSide === moduleSide &&
        recos[i].slotIndex === slotIndex &&
        recos[i].rowNumber === rowNumber
      ) {
        return recos[i];
      }
    }

    return null;
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

  updateSelections(reco) {
    const { selections, setValue } = this.props;

    if (selections[reco.id]) {
      delete selections[reco.id];
    } else {
      selections[reco.id] = reco;
    }

    setValue('selections', null);
    setValue('selections', selections);
  }

  renderRow(
    module,
    moduleSide,
    rowNumber,
    addRow,
    addRowModuleSide,
    addRowNumber,
    recos,
  ) {
    const {
      addReco,
      deleteReco,
      selectedReco,
      getAllLogEntries,
      createLogEntry,
      setValue,
      showWorkPlan,
      selectedRecoQr,
      showLargeQr,
      workPlanFeed,
      workPlanWater,
      workPlanTraysIn,
      workPlanTraysOut,
      workPlanHarvest,
      selections,
      multiSelect,
    } = this.props;

    const slots = [];
    for (let i = 0; i < module.size; i++) {
      slots.push({ index: i });
    }

    const rowCount =
      moduleSide === 'right' ? module.rowsRight : module.rowsLeft;

    if (addRow && moduleSide === addRowModuleSide && rowCount === 0) {
      return (
        <div className={cx(s.row, s.addRow)}>
          <button onClick={() => this.addRow(module, moduleSide, 1)}>
            Add
          </button>
        </div>
      );
    }

    return (
      <div>
        {addRow &&
          moduleSide === addRowModuleSide &&
          addRowNumber === rowNumber && (
            <div className={cx(s.row, s.addRow)}>
              {addRowNumber !== 1 && (
                <span>
                  <a href="#" onClick={() => this.moveAddRow(-1)}>
                    Up
                  </a>
                  &nbsp; | &nbsp;
                </span>
              )}
              <a href="#" onClick={() => this.moveAddRow(1)}>
                Down
              </a>
              &nbsp;<button
                onClick={() =>
                  this.addRow(
                    module,
                    moduleSide,
                    moduleSide === 'right'
                      ? rowCount + 2 - addRowNumber
                      : addRowNumber,
                  )
                }
              >
                Add
              </button>
            </div>
          )}
        <div className={s.row} key={`${moduleSide}-${rowNumber}`}>
          {slots.map((slot, slotIndex) => {
            const slotRowNumber =
              moduleSide === 'right'
                ? module.rowsRight + 1 - rowNumber
                : rowNumber;
            const reco = this.getRecoForSlot(
              module.recos || [],
              moduleSide,
              slotRowNumber,
              slotIndex,
            );

            const recoSelected =
              reco && selectedReco && selectedReco.id === reco.id;
            const stateStyles = {
              empty: s.empty,
              growing: s.growing,
              laying: s.laying,
            };

            const workPlanStyles = this.getWorkPlanStyles(reco);

            let requiredActions = [];
            if (reco && reco.requiredActions) {
              requiredActions = reco.requiredActions.split(',');
            }

            const actionLabels = {
              pinheads: {
                type: 'pinheads',
                value: 10,
                label: 'Add pinheads',
                color: '#FFF',
              },
              feed: {
                type: 'feed',
                value: 10,
                label: 'Add feed',
                color: '#DEB887',
              },
              water: {
                type: 'water',
                value: 10,
                label: 'Add water',
                color: '#00BFFF',
              },
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
              harvest: {
                type: 'harvest',
                value: 1900,
                label: 'Harvest',
                color: '',
              },
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

            const recoElem = reco ? (
              <div
                className={cx(
                  s.reco,
                  recoSelected ? s.recoSelected : {},
                  selections[reco.id] ? s.multiSelected : {},
                )}
                style={workPlanStyles || {}}
                onClick={
                  multiSelect
                    ? () => this.updateSelections(reco)
                    : recoSelected
                      ? () => {
                          setValue('showLargeQr', null);
                          setValue('selectedReco', null);
                        }
                      : async e => {
                          e.preventDefault();
                          e.stopPropagation();

                          const qrData = await this.generateQR(
                            `http://ops.crispycrickets.fi:3000/reco/${reco.id}`,
                            40,
                          );

                          setValue('selectedRecoQr', qrData);

                          setValue('selectedReco', reco);
                          setValue('newLogEntryType', 'pinheads');
                          setValue('newLogEntryTitle', 'Added pinheads');
                          setValue('newLogEntryDate', '');
                          setValue('newLogEntryValue', '10');
                          getAllLogEntries(reco.id);
                        }
                }
              >
                <div
                  className={cx(
                    s.recoContent,
                    reco.actionAlert ? s.actionAlert : {},
                    reco.infoAlert ? s.infoAlert : {},
                    stateStyles[reco.state],
                  )}
                  style={
                    showWorkPlan && !recoSelected
                      ? {
                          height: '100%',
                          border: 'none',
                          backgroundColor: workPlanStyles
                            ? 'transparent'
                            : '#CCC',
                        }
                      : {}
                  }
                >
                  {recoSelected ? (
                    <div className={s.contentWrapper}>
                      {reco.state !== 'empty' && (
                        <div className={s.recoContentHeader}>
                          {reco.state === 'growing' && (
                            <div className={s.growHeader}>
                              GROW DAY {reco.lifeDays}
                            </div>
                          )}
                          {reco.state === 'laying' && (
                            <div className={s.layingHeader}>
                              <div className={s.eggDays}>
                                EGG DAY {reco.layingDays}
                              </div>
                              <div className={s.lifeDays}>{reco.lifeDays}</div>
                            </div>
                          )}
                        </div>
                      )}
                      <div className={s.requiredActions}>
                        {requiredActions.map(action => (
                          <div
                            className={s.requiredAction}
                            style={{
                              backgroundColor: actionLabels[action].color,
                            }}
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
                                  });
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className={s.contentBottom}>
                        <div className={s.pinheads}>{pinheadsText}</div>
                      </div>
                      {showLargeQr && (
                        <div className={s.largeQr}>
                          <img src={showLargeQr} />
                          <div
                            className={s.closeLargeQr}
                            onClick={e => {
                              e.preventDefault();
                              e.stopPropagation();
                              setValue('showLargeQr', null);
                            }}
                          >
                            x
                          </div>
                        </div>
                      )}
                      <div
                        className={s.qrCode}
                        onClick={async e => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('generate qr for', reco.id);
                          setValue('showLargeQr', Math.random());
                          const qrData = await this.generateQR(
                            `http://ops.crispycrickets.fi:3000/reco/${reco.id}`,
                            200,
                          );
                          setValue('showLargeQr', qrData);
                        }}
                      >
                        <img src={selectedRecoQr} />
                      </div>
                      <div
                        className={s.deleteReco}
                        onClick={() => deleteReco(reco.id)}
                      >
                        D
                      </div>
                    </div>
                  ) : (
                    <div className={s.notSelected}>{reco.slotIndex + 1}</div>
                  )}
                </div>
              </div>
            ) : (
              <div
                className={cx(s.emptySlot)}
                onClick={
                  multiSelect
                    ? () => this.updateSelections(reco)
                    : () =>
                        addReco({
                          reco: {
                            moduleId: module.id,
                            moduleSide,
                            rowNumber: slotRowNumber,
                            slotIndex,
                          },
                        })
                }
              >
                {slotIndex + 1}
              </div>
            );
            return <div className={s.slot}>{recoElem}</div>;
          })}
        </div>
        {addRow &&
          moduleSide === addRowModuleSide &&
          (addRowNumber === rowCount + 1 && rowNumber === rowCount) && (
            <div className={cx(s.row, s.addRow)}>
              <a href="#" onClick={() => this.moveAddRow(-1)}>
                Up
              </a>
              &nbsp;<button
                onClick={() =>
                  this.addRow(
                    module,
                    moduleSide,
                    moduleSide === 'right'
                      ? rowCount + 2 - addRowNumber
                      : addRowNumber,
                  )
                }
              >
                Add
              </button>
            </div>
          )}
      </div>
    );
  }

  formatLogItemDate(dateStr) {
    const date = new Date(dateStr);
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return `${weekDays[date.getDay()]} ${date.getDate()}.${date.getMonth() +
      1} ${date.getHours()}:${date.getMinutes()}`;
  }

  moduleSelected(id) {
    const { selectedModules } = this.props;
    return (selectedModules || []).includes(id);
  }

  render() {
    const {
      addModule,
      updateModule,
      updateReco,
      deleteModule,
      showAddModule,
      showWorkPlan,
      setValue,
      createLogEntry,
      deleteLogEntry,
      getAllLogEntries,
      newModule,
      newModuleName,
      newModuleSize,
      module,
      modules,
      loadingModules,
      selectedModules,
      logEntries,
      addRow,
      addRowNumber,
      addRowModuleSide,
      moduleValues,
      updatedModule,
      newLogEntryDate,
      newLogEntryType,
      newLogEntryValue,
      newLogEntryTitle,
      newLogEntryText,
      newRecoState,
      selectedReco,
      workPlanFeed,
      workPlanWater,
      workPlanTraysIn,
      workPlanTraysOut,
      workPlanHarvest,
      multiSelect,
      selections,
      data: { loading, getAllModules },
    } = this.props;

    console.log('render org', this.props);

    return (
      <div className={s.root}>
        <div className={s.container}>
          <div className={s.mainMenu}>
            <div className={cx(s.mainMenuItem, s.selected)}>GROW MODULES</div>
            <div className={s.mainMenuItem}>INCUBATION UNITS</div>
          </div>
          <div className={s.modulesHeader}>
            <div className={s.modulesStats}>
              <div className={s.statItem}>
                <b>2</b> modules
              </div>
              <div className={s.statItem}>
                <b>966</b> recos
              </div>
              <div className={s.statItem}>
                Power consumption: <b>16</b> kW
              </div>
            </div>
            <div className={s.modulesControls}>
              <div className={s.controlSwitches}>
                {!showWorkPlan && (
                  <div className={cx(s.workPlanControl)}>
                    <a href="#" onClick={() => setValue('showWorkPlan', true)}>
                      Work plan
                    </a>
                  </div>
                )}
                <div className={cx(s.addModule, showAddModule ? s.hidden : {})}>
                  <a href="#" onClick={() => setValue('showAddModule', true)}>
                    New module
                  </a>
                </div>
                <div
                  className={cx(s.addModule, !showAddModule ? s.hidden : {})}
                >
                  <div className={s.textField}>
                    <TextField
                      label="Size"
                      value={newModuleSize || ''}
                      onChange={e => {
                        setValue('newModuleSize', e.target.value);
                      }}
                    />
                  </div>
                  <div className={s.textField}>
                    <TextField
                      label="Name"
                      value={newModuleName || ''}
                      onChange={e => {
                        setValue('newModuleName', e.target.value);
                      }}
                    />
                  </div>
                  <Button
                    label="Add"
                    onClick={() => {
                      addModule({
                        module: {
                          name: newModuleName,
                          size: parseInt(newModuleSize),
                        },
                      });
                    }}
                  />
                  &nbsp;
                  <Button
                    label="Cancel"
                    onClick={() => setValue('showAddModule', false)}
                  />
                </div>
              </div>
            </div>
          </div>

          {showWorkPlan && (
            <div className={s.workPlan}>
              <div className={s.checkBoxes}>
                <div
                  className={s.checkBoxItem}
                  style={{ backgroundColor: '#DEB887' }}
                >
                  <input
                    type="checkbox"
                    checked={workPlanFeed || false}
                    onChange={e => {
                      setValue('workPlanFeed', !workPlanFeed);
                    }}
                  />
                  <div className={s.label}>Feed</div>
                </div>
                <div
                  className={s.checkBoxItem}
                  style={{ backgroundColor: '#00BFFF' }}
                >
                  <input
                    type="checkbox"
                    checked={workPlanWater || false}
                    onChange={e => {
                      setValue('workPlanWater', !workPlanWater);
                    }}
                  />
                  <div className={s.label}>Water</div>
                </div>
                <div
                  className={s.checkBoxItem}
                  style={{ backgroundColor: '#90EE90' }}
                >
                  <input
                    type="checkbox"
                    checked={workPlanTraysIn || false}
                    onChange={e => {
                      setValue('workPlanTraysIn', !workPlanTraysIn);
                    }}
                  />
                  <div className={s.label}>Egg tray in</div>
                </div>
                <div
                  className={s.checkBoxItem}
                  style={{ backgroundColor: '#FFB6C1' }}
                >
                  <input
                    type="checkbox"
                    checked={workPlanTraysOut || false}
                    onChange={e => {
                      setValue('workPlanTraysOut', !workPlanTraysOut);
                    }}
                  />
                  <div className={s.label}>Egg tray out</div>
                </div>
                <div
                  className={s.checkBoxItem}
                  style={{ backgroundColor: '#FFD700' }}
                >
                  <input
                    type="checkbox"
                    checked={workPlanHarvest || false}
                    onChange={e => {
                      setValue('workPlanHarvest', !workPlanHarvest);
                    }}
                  />
                  <div className={s.label}>Harvest</div>
                </div>
              </div>
              <div className={s.closeWorkPlan}>
                <a href="#" onClick={() => setValue('showWorkPlan', false)}>
                  Close
                </a>
              </div>
            </div>
          )}

          {false ? (
            'Loading...'
          ) : (
            <div className={s.modules}>
              {(modules || getAllModules).map((module, moduleIndex) => {
                const rightRows = [];
                for (let i = 0; i < module.rowsRight; i++) {
                  rightRows.push(
                    this.renderRow(
                      module,
                      'right',
                      i + 1,
                      addRow,
                      addRowModuleSide,
                      addRowNumber,
                      module.recos,
                    ),
                  );
                }

                const leftRows = [];
                for (let i = 0; i < module.rowsLeft; i++) {
                  leftRows.push(
                    this.renderRow(
                      module,
                      'left',
                      i + 1,
                      addRow,
                      addRowModuleSide,
                      addRowNumber,
                      module.recos,
                    ),
                  );
                }

                if (
                  addRow &&
                  addRowModuleSide === 'right' &&
                  module.rowsRight === 0
                ) {
                  rightRows.push(
                    this.renderRow(
                      module,
                      addRowModuleSide,
                      1,
                      addRow,
                      addRowModuleSide,
                      1,
                      module.recos,
                    ),
                  );
                }

                if (
                  addRow &&
                  addRowModuleSide === 'left' &&
                  module.rowsLeft === 0
                ) {
                  leftRows.push(
                    this.renderRow(
                      module,
                      addRowModuleSide,
                      1,
                      addRow,
                      addRowModuleSide,
                      1,
                      module.recos,
                    ),
                  );
                }

                const typeUnits = {
                  pinheads: 'ml',
                  feed: 'kg',
                  water: 'l',
                  'egg-tray-in': 'tray(s)',
                  'egg-tray-out': 'tray(s)',
                  harvest: 'g',
                  'state-change': '',
                };

                const defaultTitles = {
                  pinheads: 'Added pinheads',
                  feed: 'Added feed',
                  water: 'Added water',
                  'egg-tray-in': 'Placed egg trays',
                  'egg-tray-out': 'Removed egg trays',
                  'state-change': 'Changed state',
                  harvest: 'Harvest collected',
                };

                return (
                  <div key={module.id}>
                    <div className={cx(s.moduleSummary)}>
                      <div className={s.header}>
                        <div className={s.name}>
                          <a
                            href="#"
                            onClick={
                              !this.moduleSelected(module.id)
                                ? () => {
                                    const newSelectedModules =
                                      selectedModules || [];
                                    newSelectedModules.push(module.id);
                                    setValue(
                                      'selectedModules',
                                      newSelectedModules,
                                    );
                                    setValue('selectedModule', module.id);
                                  }
                                : () => {
                                    const newSelectedModules = selectedModules.filter(
                                      id => id !== module.id,
                                    );
                                    setValue(
                                      'selectedModules',
                                      newSelectedModules,
                                    );
                                    setValue('selectedModule', Math.random());
                                  }
                            }
                          >
                            {module.name}
                          </a>
                        </div>
                        <div className={s.stats}>
                          <div className={s.stat}>524 Recos</div>
                          <div className={s.stat}>Temp 34'C</div>
                          <div className={s.stat}>Hum 19'</div>
                        </div>
                        <div className={s.controls}>
                          <a href="#" onClick={() => deleteModule(module.id)}>
                            Remove
                          </a>
                        </div>
                      </div>
                      {
                        <div
                          className={cx(
                            s.moduleOverview,
                            this.moduleSelected(module.id)
                              ? cx(
                                  s.expanded,
                                  selectedReco ? s.allowOverflow : {},
                                )
                              : {},
                          )}
                        >
                          <div className={s.controls}>
                            {multiSelect ? (
                              <div>
                                <a
                                  href="#"
                                  onClick={() => {
                                    let printUrl =
                                      'http://crispycrickets.fi:3000/print/';
                                    const printIds = Object.keys(selections);
                                    for (let i = 0; i < printIds.length; i++) {
                                      const r = selections[printIds[i]];
                                      printUrl += `${moduleIndex}:${
                                        r.moduleSide === 'right' ? 'r' : 'l'
                                      }:${r.rowNumber}:${r.slotIndex + 1},`;
                                    }
                                    console.log(printUrl);
                                  }}
                                >
                                  Print All
                                </a>
                                &nbsp;&nbsp;
                                <a
                                  href="#"
                                  onClick={() => {
                                    setValue('multiSelect', false);
                                    setValue('selections', {});
                                  }}
                                >
                                  Cancel
                                </a>
                                &nbsp;&nbsp;
                              </div>
                            ) : (
                              <div>
                                <a
                                  href="#"
                                  onClick={() => {
                                    setValue('selections', []);
                                    setValue('multiSelect', true);
                                  }}
                                >
                                  Select
                                </a>
                                &nbsp;&nbsp;
                              </div>
                            )}
                            {addRow ? (
                              <div>
                                <a
                                  href="#"
                                  onClick={() => setValue('addRow', false)}
                                >
                                  Cancel
                                </a>
                                &nbsp; | &nbsp;
                                {addRowModuleSide === 'right' ? (
                                  <a
                                    href="#"
                                    onClick={() =>
                                      setValue('addRowModuleSide', 'left')
                                    }
                                  >
                                    Left
                                  </a>
                                ) : (
                                  <a
                                    href="#"
                                    onClick={() =>
                                      setValue('addRowModuleSide', 'right')
                                    }
                                  >
                                    Right
                                  </a>
                                )}
                              </div>
                            ) : (
                              <a
                                href="#"
                                onClick={() => {
                                  setValue('addRowModuleSide', 'right');
                                  setValue('addRowNumber', 1);
                                  setValue('addRow', true);
                                }}
                              >
                                Add row
                              </a>
                            )}
                          </div>
                          <div className={s.layout}>
                            <div className={s.content}>
                              <div className={s.wall}>{rightRows}</div>
                              <div className={s.corridor}>CORRIDOR</div>
                              <div className={s.wall}>{leftRows}</div>
                            </div>
                            <div className={s.guide}>
                              <div className={cx(s.block, s.right)}>R</div>
                              <div className={cx(s.block, s.door)}>DOOR</div>
                              <div className={cx(s.block, s.left)}>L</div>
                            </div>
                          </div>
                        </div>
                      }
                    </div>
                    {selectedReco &&
                      this.moduleSelected(module.id) && (
                        <div className={s.recoInfo}>
                          <div className={s.logEntry}>
                            <div className={s.logEntryRow1}>
                              <div className={s.logEntryRight}>
                                <select
                                  value={newLogEntryType}
                                  onChange={e => {
                                    setValue('newLogEntryType', e.target.value);
                                    setValue(
                                      'newLogEntryTitle',
                                      defaultTitles[e.target.value],
                                    );
                                  }}
                                >
                                  <option value="pinheads">Pinheads</option>
                                  <option value="feed">Feed</option>
                                  <option value="water">Water</option>
                                  <option value="egg-tray-in">
                                    Egg tray in
                                  </option>
                                  <option value="egg-tray-out">
                                    Egg tray out
                                  </option>

                                  <option value="harvest">Harvest</option>
                                  <option value="state-change">State</option>
                                </select>&nbsp;
                                <TextField
                                  label="Title"
                                  value={newLogEntryTitle}
                                  onChange={e =>
                                    setValue('newLogEntryTitle', e.target.value)
                                  }
                                />&nbsp;
                                <TextField
                                  label="Date"
                                  value={newLogEntryDate}
                                  onChange={e =>
                                    setValue('newLogEntryDate', e.target.value)
                                  }
                                />
                              </div>
                              <div className={s.logEntryValue}>
                                {newLogEntryType === 'state-change' ? (
                                  <select
                                    value={newRecoState || selectedReco.state}
                                    onChange={e => {
                                      setValue('newRecoState', e.target.value);
                                    }}
                                  >
                                    <option value="growing">Growing</option>
                                    <option value="laying">Laying</option>
                                  </select>
                                ) : (
                                  <div>
                                    <TextField
                                      className={s.logEntryValueInput}
                                      label="Value"
                                      value={newLogEntryValue}
                                      onChange={e =>
                                        setValue(
                                          'newLogEntryValue',
                                          e.target.value,
                                        )
                                      }
                                    />&nbsp;
                                    {typeUnits[newLogEntryType]}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className={s.logEntryText}>
                              <TextField
                                className={s.logEntryTextInput}
                                label="Notes"
                                value={newLogEntryText}
                                onChange={e =>
                                  setValue('newLogEntryText', e.target.value)
                                }
                              />
                              <Button
                                className={s.logEntrySubmit}
                                label="Add"
                                onClick={() => {
                                  const logEntry = {
                                    recoId: selectedReco.id,
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
                                  createLogEntry({ logEntry });
                                  console.log('new log entry', newLogEntryType);
                                  if (newLogEntryType === 'state-change') {
                                    updateReco({
                                      reco: {
                                        id: selectedReco.id,
                                        values: { state: newRecoState },
                                      },
                                    });
                                  } else if (newLogEntryType === 'harvest') {
                                    updateReco({
                                      reco: {
                                        id: selectedReco.id,
                                        values: { state: 'harvested' },
                                      },
                                    });
                                  }
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            {(
                              logEntries ||
                              this.props.data.getAllLogEntries ||
                              []
                            ).map((logEntry, index) => (
                              <div
                                className={cx(
                                  s.logItem,
                                  index % 2 !== 0 ? s.stripeBg : {},
                                )}
                              >
                                <div className={s.left}>
                                  <div className={s.logItemDate}>
                                    {this.formatLogItemDate(logEntry.createdAt)}
                                  </div>
                                  <div className={s.logItemTitle}>
                                    {logEntry.title || logEntry.type}
                                  </div>
                                  <div className={s.logItemValue}>
                                    {logEntry.numValue || logEntry.textValue}
                                  </div>
                                </div>
                                <div className={s.right}>
                                  <div className={s.logItemText}>
                                    {logEntry.text}
                                  </div>
                                </div>
                                <div
                                  className={s.deleteLogEntry}
                                  onClick={() => {
                                    deleteLogEntry(logEntry.id);
                                  }}
                                >
                                  D
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                );
              })}
            </div>
          )}
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
  setValue,
};

export default connect(mapState, mapDispatch)(
  compose(withStyles(s), graphql(modulesQuery))(Organizer),
);
