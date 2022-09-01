/**
 * @fileoverview Test utilities
 */

//Imports
import {execSync} from 'child_process';
import {join} from 'path';
import {debug, setSecret} from '@actions/core';

/**
 * Load an environment variable
 * @param name The environment variable name
 */
export const loadEnv = (name: string) =>
{
  //Get the variable
  const value = process.env[name];

  //If null, crash
  if (value == null || value.length == 0)
  {
    throw new Error(`Environment variable ${name} not provided!`);
  }
  else
  {
    //Hide from the logs
    setSecret(value);

    return value;
  }
};

/**
 * Check if signed in to WAPM
 */
export const loggedIn = () =>
{
  //Get auth state
  const state = execSync('wapm whoami', {
    encoding: 'utf-8'
  }).trim();
  debug(`User logged in: ${state}`);

  return !state.startsWith('(not logged in)');
};

/**
 * Log out of WAPM
 */
export const logout = () =>
{
  //Log out
  execSync('wapm logout');

  //If still logged in, crash
  if (loggedIn())
  {
    throw new Error('Failed to log out of WAPM!');
  }
};

/**
 * Resolve the absolute path of a fixture
 * @param path The relative path of the fixture
 * @returns The absolute path of the fixture
 */
export const resolveFixture = (path?: string) =>
{
  //Add the paths
  const paths = [
    __dirname,
    '../fixtures'
  ];

  if (path != null)
  {
    paths.push(path);
  }

  //Join the paths
  const fixture = join(...paths);

  return fixture;
};