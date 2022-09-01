/**
 * @fileoverview Publish to WAPM
 */

//Imports
import {getInput, info, setSecret, setFailed} from '@actions/core';
import getClient from './apollo';
import {login, loginWithToken, publish, setRegistryUrl} from './wapm';

const main = async () =>
{
  const directory = getInput('directory') != '' ? getInput('directory') : process.cwd();

  const registry = getInput('registry');


  //Get the Apollo client
  if (registry) {
    await setRegistryUrl(registry);
  }
  const client = getClient(registry);


  //Get input
  const token = getInput('token');
  setSecret(token);

  if (token) {
    await loginWithToken(token);
  }
  else {
    const username = getInput('username', {
      required: true
    });

    const password = getInput('password', {
      required: true
    });
    //Hide credentials from the logs
    setSecret(username);
    setSecret(password);
    await login(client, username, password);
  }

  //Login to WAPM
  info('Logged in to WAPM.');

  //Publish to WAPM
  await publish(directory);
  info(`Published the package located in ${directory}.`);

  //Exit
  process.exit();
};

main().catch((error: Error) =>
{
  setFailed(error);
  process.exit(1);

});
