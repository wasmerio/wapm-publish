/**
 * @fileoverview WAPM helper tests
 */

//Imports
import test from 'ava';
import {existsSync} from 'fs';
import {getLocation, login, publish} from './wapm';
import {loadEnv, loggedIn, logout, resolveFixture} from './test-utilities';

//Environment variables
const username = loadEnv('WAPM_USERNAME');
const password = loadEnv('WAPM_PASSWORD');

test('will get Wasmer config location', async ctx =>
{
  //Get Wasmer config location
  const location = await getLocation();

  //Asset that location exists
  ctx.true(existsSync(location));
});

test('will login', async ctx =>
{
  //Logout
  logout();

  //Assert that it will not throw an error
  await ctx.notThrowsAsync(async () =>
  {
    //Login
    await login(username, password);
  });

  //Assert that we're logged in
  ctx.true(await loggedIn());

  //Logout
  logout();
});

test('will publish', async ctx =>
{
  //Login
  await login(username, password);

  //Get the fixture
  const fixture = resolveFixture();

  //Assert that it will not throw an error
  await ctx.notThrowsAsync(async () =>
  {
    //Publish (Dry run)
    await publish(fixture, true);
  });

  //Logout
  logout();
});