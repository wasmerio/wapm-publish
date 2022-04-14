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
        loginWithToken(userToken)
      } else {
        loginWithUsername(username, password)
      }
  // loginWithUsername()

 
  //Exit
  process.exit();
};


// login with username and password 
const loginWithUsername = async (username: string, password: string) => {

  
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
  
}

const loginWithToken = async (userToken: string) => {

  
    const directory = getInput('directory') != '' ? getInput('directory') : process.cwd();
  
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
  
    //Publish to WAPM
    await publish(directory);
    info(`Published the package located in ${directory}.`);
  
}
main().catch(error =>
{
  throw error;
});