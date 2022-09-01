/**
 * @fileoverview WAPM helper
 */

//Imports
import { Client } from './apollo';
import {LoginDocument} from './graphql';
import {debug, setSecret} from '@actions/core';
import {exec} from '@actions/exec';
import {existsSync} from 'fs';
import {join} from 'path';

/**
 * Get the Wasmer config location
 * @returns The fully-qualified path to the Wasmer location
 */
export const getLocation = async () =>
{
  //Get the Wasmer directory
  const wasmerDir = process.env.WASMER_DIR;

  if (wasmerDir == null)
  {
    //Fail the step
    throw new Error('Wasmer not detected!');
  }

  //Resolve the location
  const location = join(wasmerDir, 'wapm.toml');

  //Create the config if it doesn't exist
  if (!existsSync(location))
  {
    debug(`Creating config at ${location}.`);

    const exitCode = await exec('wapm', ['config', 'set', 'telemetry.enabled', 'false']);

    //Ensure the child was successful
    if (exitCode != 0)
    {
      //Fail the step
      throw new Error(`Failed to create WAPM config, WAPM exited with ${exitCode}!`);
    }
  }

  return location;
};

/**
 * Login to WAPM
 * @param username WAPM username
 * @param password WAPM password
 */
export const login = async (client: Client, username: string, password: string) =>
{
  debug("Set WAPM username/password");

  //Authenticate to WAPM
  const {data, errors} = await client.mutate({
    mutation: LoginDocument,
    variables: {
      username,
      password
    }
  });

  if (errors) {
    throw new Error(`GraphQL query failed with the errors: ${errors.map(e => e.message).join(", ")}`);
  }
  //Extract the data
  const token = data!.tokenAuth!.refreshToken!;

  //Hide the token from the logs
  setSecret(token);

  const exitCode = await exec('wapm', ['config', 'set', 'registry.token', token]);
  if (exitCode != 0)
  {
    //Fail the step
    throw new Error(`Failed to set WAPM user token, WAPM exited with ${exitCode}!`);
  }
  // loginWithToken(token);

};

/**
 * Set WAPM token
 * @param token WAPM login token
 */
 export const loginWithToken = async (token: string) => {
  debug("Set WAPM token");

  //Update the token
  const exitCode = await exec('wapm', ['login', token]);

  //Ensure the child was successful
  if (exitCode != 0)
  {
    //Fail the step
    throw new Error(`Failed to set WAPM token, WAPM exited with ${exitCode}!`);
  }
}

/**
 * Set WAPM Registry url
 * @param url WAPM registry url
 */
export const setRegistryUrl = async (url: string) =>
{
  debug(`Set registry url: ${url}`);

  //Update the registry url
  const exitCode = await exec('wapm', ['config', 'set', 'registry.url', url]);

  //Ensure the child was successful
  if (exitCode != 0)
  {
    //Fail the step
    throw new Error(`Failed to set WAPM the registry url, WAPM exited with ${exitCode}!`);
  }
};


/**
 * Get WAPM Registry url
 */
export const getRegistryUrl = async (): Promise<string> =>
{
  let registryUrl = '';

  const options = {
    listeners: {
      stdout: (data: Buffer) => {
        registryUrl += data.toString();
      },
    }
  };

  //Get the registry url
  const exitCode = await exec('wapm', ['config', 'get', 'registry.url'], options);

  //Ensure the child was successful
  if (exitCode != 0)
  {
    //Fail the step
    throw new Error(`Failed to set WAPM the registry url, WAPM exited with ${exitCode}!`);
  }
  
  return registryUrl.trim();
};

/**
 * Publish to WAPM
 * @param directory The package directory
 */
export const publish = async (directory: string, dryRun = false) =>
{
  debug(`Publish: ${directory}${dryRun?" (dry run)": ""}`);

  //Generate arguments
  const args = ['publish'];

  if (dryRun)
  {
    args.push('--dry-run');
  }

  //Publish
  const exitCode = await exec('wapm', args, {
    cwd: directory
  });

  //Ensure the child was successful
  if (exitCode != 0)
  {
    //Fail the step
    throw new Error(`Failed to publish to WAPM, WAPM exited with ${exitCode}!`);
  }
};