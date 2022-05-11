/**
 * @fileoverview Publish to WAPM
 */

//Imports
import {getInput, info, setSecret} from '@actions/core';
import getClient from './apollo';
import {login, publish, setRegistryUrl, tokenLogin} from './wapm';

const main = async () =>
{
  //Get input
  const username = getInput('username');
  const password = getInput('password');
  const userToken = getInput('token');
  if(userToken) {
      await loginWithToken(userToken)
  } else {
      await loginWithUsername(username, password)
  }
  // loginWithUsername()

  const directory = getInput('directory') || process.cwd();
  //Publish to WAPM
  await publish(directory);
  info(`Published the package located in ${directory}.`);
 
  //Exit
  process.exit(1);
};


// login with username and password 
const loginWithUsername = async (username: string, password: string) => {
  
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

  
}

const loginWithToken = async (userToken: string) => {
  
    const registry = getInput('registry');
  
    //Hide credentials from the logs
    setSecret(userToken);
  
    //Get the Apollo client
    if (registry) {
      await setRegistryUrl(registry);
    }
    const client = getClient(registry);
  
    //Login to WAPM
    await tokenLogin(client, userToken);
    info('Logged in to WAPM.');
  
}
main().catch(error =>
{
  throw error;
});