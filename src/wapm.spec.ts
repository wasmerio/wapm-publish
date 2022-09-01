/**
 * @fileoverview WAPM helper tests
 */

//Imports
import test from 'ava';
import {existsSync} from 'fs';
import {getClient} from './apollo';
import {getLocation, getRegistryUrl, login, loginWithToken, publish, setRegistryUrl} from './wapm';
import {loadEnv, loggedIn, logout, resolveFixture} from './test-utilities';

//Environment variables
const username = loadEnv('WAPM_USERNAME');
const password = loadEnv('WAPM_PASSWORD');
const token = loadEnv('WAPM_TOKEN');

// We test on the dev registry by default
const registry = process.env['WAPM_REGISTRY'] || "https://registry.wapm.dev";

let defaultRegistry: string;
test.before(async t => {
  // Get the default global registry url
  defaultRegistry = await getRegistryUrl();
});
test.beforeEach(async t => {
  // Overwrite the global registry url before each test
  await setRegistryUrl(registry);
});
test.afterEach(async t => {
  // Overwrite the global registry url in case the test changed the default
  await setRegistryUrl(registry);
});
test.after(async t => {
  // Reset the global registry url
  await setRegistryUrl(defaultRegistry);
});

test.serial('will get Wasmer config location', async ctx =>
{
  //Get Wasmer config location
  const location = await getLocation();

  //Asset that location exists
  ctx.true(existsSync(location));
});

test.serial('registry url', async ctx =>
{
  const temp_registry_url = "https://registry.wapm.dev";
  await setRegistryUrl(temp_registry_url);

  let registryUrl = await getRegistryUrl();
  ctx.assert(registryUrl.startsWith(temp_registry_url), "The registry.url set and get don't match");
});

test('will login', async ctx =>
{

  const client = getClient(registry);
  //Login
  await login(client, username, password);

  //Assert that we're logged in
  ctx.true(await loggedIn());
  //Logout
  logout();
});


test.serial('will login with token', async ctx =>
{
  //Logout
  logout();

  const client = getClient(registry);
  //Login
  await loginWithToken(token);

  //Assert that we're logged in
  ctx.true(await loggedIn());

  //Logout
  logout();
});

test.serial('will publish', async ctx =>
{
  //Login
  const client = getClient(registry);
  await login(client, username, password);

  //Assert that we're logged in
  ctx.true(await loggedIn());

  //Get the fixture
  const fixture = resolveFixture();

  //Publish (Dry run)
  await publish(fixture, true);

  //Logout
  logout();
});


test.serial('will publish with token', async ctx =>
{
  //Login
  const client = getClient(registry);
  await loginWithToken(token);

  //Assert that we're logged in
  ctx.true(await loggedIn());

  //Get the fixture
  const fixture = resolveFixture();

  //Publish (Dry run)
  await publish(fixture, true);

  //Logout
  logout();
});
