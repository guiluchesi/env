'use strict';


/* dependencies */
const path = require('path');
const _ = require('lodash');
const semver = require('semver');
const dotenv = require('dotenv');


// ensure process NODE_ENV
process.env.NODE_ENV = (process.env.NODE_ENV || 'development');


// ensure process BASE_PATH
process.env.BASE_PATH =
  path.resolve(process.env.BASE_PATH || process.cwd());


// load configuration from .env file from BASE_PATH
dotenv.load({ path: path.resolve(process.env.BASE_PATH, '.env') });


/**
 * @function get
 * @name get
 * @description get environment variable
 * @param {String} key value key
 * @param {Mixed} [defaultValue] value to return if key not exists
 * @return {Mixed} environment value
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 * const { get } = require('@lykmapipo/env');
 * const BASE_PATH = get('BASE_PATH', process.cwd());
 */
const get = (key, defaultValue) => _.get(process.env, key, defaultValue);


/**
 * @function set
 * @name set
 * @description set environment variable
 * @param {String} key value key
 * @param {Mixed} [value] value to set on key
 * @return {Mixed} environment value
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 * const { set } = require('@lykmapipo/env');
 * const BASE_PATH = set('BASE_PATH', process.cwd());
 */
const set = (key, value) => {
  _.set(process.env, key, value);
  return value;
};


/**
 * @function getArray
 * @name getArray
 * @description get array value from environment variable
 * @param {String} key value key
 * @param {Array} [defaultValue] value to return if key not exists
 * @return {Array} environment value
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 * const { getArray } = require('@lykmapipo/env');
 * const categories = getArray('CATEGORIES'); //=> ['Fashion', 'Technology']
 */
const getArray = (key, defaultValue) => {
  let value = [].concat(defaultValue);
  if (!_.isEmpty(key)) {
    value = [...value, ...get(key, '').split(',')];
  }
  value = _.map(value, _.trim);
  value = _.uniq(_.compact(value));
  return value;
};


/**
 * @function getNumbers
 * @name getNumbers
 * @description get array of numbers from environment variable
 * @param {String} key value key
 * @param {Array} [defaultValue] value to return if key not exists
 * @return {Array} environment value
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 * const { getNumbers } = require('@lykmapipo/env');
 * const categories = getNumbers('AGES'); //=> [11, 18]
 */
const getNumbers = (key, defaultValue) => {
  let numbers = getArray(key, defaultValue);
  numbers = _.map(numbers, number => Number(number));
  return numbers;
};

const getNumber = function getNumber(key, defaultValue) {
  let value = get(key, defaultValue);
  value = value ? Number(value) : value;
  return value;
};

const getString = function getString(key, defaultValue) {
  let value = get(key, defaultValue);
  value = value ? String(value) : value;
  return value;
};

const getStrings = function getStrings(key, defaultValue) {
  let strings = getArray(key, defaultValue);
  strings = _.map(strings, function (number) { return String(number); });
  return strings;
};

const getBoolean = function getBoolean(key, defaultValue) {
  let value = get(key, defaultValue);
  if (value === 'false') { value = false; }
  if (value === 'true') { value = true; }
  value = value ? Boolean(value) : value;
  return value;
};


/* execution environment shortcuts */
const is = function (_env) {
  return get('NODE_ENV') === _env;
};
const isTest = () => is('test');
const isDevelopment = () => is('development');
const isProduction = () => is('production');
const isLocal = () => (isTest() || isDevelopment());


/**
 * @function apiVersion
 * @name apiVersion
 * @description parse api version from environment variable
 * @param {Object} [optns]
 * @param {String} [optns.version=1.0.0] value to use to parse api version
 * @param {String} [optns.prefix=v] prefix to set on parsed api version
 * @param {Boolean} [optns.major=true] whether to allow major part
 * @param {Boolean} [optns.minor=false] whether to allow minor part
 * @param {Boolean} [optns.patch=false] whether to allow patch part
 * @return {String} parsed environment api version
 * @author lally elias <lallyelias87@mail.com>
 * @license MIT
 * @since 0.1.0
 * @version 0.1.0
 * @static
 * @public
 * @example
 * const { apiVersion } = require('@lykmapipo/env');
 * const version = apiVersion(); //=> v1
 * const version = apiVersion({ version: '2.0.0' }); //=> v2
 */
const apiVersion = optns => {
  // ensure options
  const options = _.merge({}, {
    version: '1.0.0',
    prefix: 'v',
    major: true,
    minor: false,
    patch: false
  }, optns);
  const { version, prefix, minor, patch } = options;

  // parse api version
  const parsedVersion = semver.coerce(getString('API_VERSION', version));

  // prepare exposed api version
  let apiVersion = parsedVersion.major;

  // allow minor
  if (minor) {
    apiVersion =
      ([parsedVersion.major, parsedVersion.minor].join('.'));
  }

  // allow patch
  if (patch) {
    apiVersion = ([
      parsedVersion.major, parsedVersion.minor, parsedVersion.patch
    ].join('.'));
  }

  // return prefixed api version
  apiVersion = `${prefix}${apiVersion}`;
  return apiVersion;
};


/* exports env */
module.exports = exports = {
  get,
  set,
  getArray,
  getNumbers,
  getNumber,
  getString,
  getStrings,
  getBoolean,
  is,
  isTest,
  isDevelopment,
  isProduction,
  isLocal,
  apiVersion
};
