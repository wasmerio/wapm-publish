/**
 * @fileoverview Publish to WAPM
 */

//Imports
import {getInput, info, setSecret} from '@actions/core';
import getClient from './apollo';
import {login, publish, setRegistryUrl} from './wapm';

const main = async () =>
{
  //Get input
  const username = getInput('username', {
    required: true
  });

  const password = getInput('password', {
    required: true
  });

  const directory = getInput('directory') != '' ? getInput('directory') : process.cwd();

  const registry = getInput('registry');

  //Hide credentials from the logs
  setSecret(username);
  setSecret(password);

  //Get the Apollo client
  if (registry) {
    await setRegistryUrl(registry);
  }
  const client = getClient(registry);

  //Login to WAPM
  await login(client, username, password);
  info('Logged in to WAPM.');

  //Publish to WAPM
  await publish(directory);
  info(`Published the package located in ${directory}.`);

  //Exit
  process.exit();
};

main().catch(error =>
{
  throw error;
});