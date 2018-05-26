/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import sequelize from '../sequelize';
import User from './User';
import UserLogin from './UserLogin';
import UserClaim from './UserClaim';
import UserProfile from './UserProfile';
import Reco from './Reco';
import Module from './Module';
import LogEntry from './LogEntry';

User.hasMany(UserLogin, {
  foreignKey: 'userId',
  as: 'logins',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

User.hasMany(UserClaim, {
  foreignKey: 'userId',
  as: 'claims',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

User.hasOne(UserProfile, {
  foreignKey: 'userId',
  as: 'profile',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

Module.hasMany(Reco, {
  foreignKey: 'moduleId',
  as: 'recos',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

Reco.hasMany(LogEntry, {
  foreignKey: 'recoId',
  as: 'logEntries',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

function sync(...args) {
  return sequelize.sync(...args);
}

export default { sync };
export { User, UserLogin, UserClaim, UserProfile, Reco, Module, LogEntry };
