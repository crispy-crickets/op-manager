import { merge } from 'lodash';

/** * Queries ** */
import {
  schema as GetAllModules,
  queries as GetAllModulesQueries,
  resolvers as GetAllModulesResolver,
} from './modules/GetAllModules';
import {
  schema as GetAllLogEntries,
  queries as GetAllLogEntriesQueries,
  resolvers as GetAllLogEntriesResolver,
} from './modules/GetAllLogEntries';

/** * Mutations ** */
import {
  schema as CreateModuleInput,
  mutation as CreateModule,
  resolvers as CreateModuleResolver,
} from './modules/CreateModule';
import {
  schema as UpdateModuleInput,
  mutation as UpdateModule,
  resolvers as UpdateModuleResolver,
} from './modules/UpdateModule';
import {
  mutation as DeleteModule,
  resolvers as DeleteModuleResolver,
} from './modules/DeleteModule';
import {
  schema as CreateRecoInput,
  mutation as CreateReco,
  resolvers as CreateRecoResolver,
} from './modules/CreateReco';
import {
  schema as UpdateRecoInput,
  mutation as UpdateReco,
  resolvers as UpdateRecoResolver,
} from './modules/UpdateReco';
import {
  mutation as DeleteReco,
  resolvers as DeleteRecoResolver,
} from './modules/DeleteReco';
import {
  schema as CreateLogEntryInput,
  mutation as CreateLogEntry,
  resolvers as CreateLogEntryResolver,
} from './modules/CreateLogEntry';
import {
  schema as UpdateLogEntryInput,
  mutation as UpdateLogEntry,
  resolvers as UpdateLogEntryResolver,
} from './modules/UpdateLogEntry';
import {
  mutation as DeleteLogEntry,
  resolvers as DeleteLogEntryResolver,
} from './modules/DeleteLogEntry';

export const schema = [...GetAllModules, ...GetAllLogEntries, ...CreateModuleInput, ...UpdateModuleInput, ...CreateRecoInput, ...UpdateRecoInput, ...CreateLogEntryInput, ...UpdateLogEntryInput];

export const queries = [...GetAllModulesQueries, GetAllLogEntriesQueries];

export const mutations = [...CreateModule, ...UpdateModule, ...DeleteModule, ...CreateReco, ...UpdateReco, ...DeleteReco, ...CreateLogEntry, ...UpdateLogEntry, ...DeleteLogEntry];

export const resolvers = merge(
  GetAllModulesResolver,
  GetAllLogEntriesResolver,
  CreateModuleResolver,
  UpdateModuleResolver,
  DeleteModuleResolver,
  CreateRecoResolver,
  UpdateRecoResolver,
  DeleteRecoResolver,
  CreateLogEntryResolver,
  UpdateLogEntryResolver,
  DeleteLogEntryResolver
);
