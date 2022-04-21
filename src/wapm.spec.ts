/**
 * @fileoverview WAPM helper tests
 */

//Imports
import test from 'ava';
import {existsSync} from 'fs';
import {getClient} from './apollo';
import {getLocation, getRegistryUrl, login, publish, setRegistryUrl, tokenLogin} from './wapm';
import {loadEnv, loggedIn, logout, resolveFixture} from './test-utilities';
//Environment variables
const username = loadEnv('WAPM_USERNAME');
const password = loadEnv('WAPM_PASSWORD');
const userToken = loadEnv('WAPM_REGISTRY_TOKEN');

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

test('will get Wasmer config location', async ctx =>
{
  //Get Wasmer config location
  const location = await getLocation();

  //Asset that location exists
  ctx.true(existsSync(location));
});

test.serial('registry url', async ctx =>
{
  //Assert that it will not throw an error
  await ctx.notThrowsAsync(async () =>
  {
    const temp_registry_url = "https://myregistry.wapm.io";
    await setRegistryUrl(temp_registry_url);

    let registryUrl = await getRegistryUrl();
    ctx.assert(registryUrl.startsWith(temp_registry_url), "The registry.url set and get don't match");
  });
});

if(userToken) {

  test('will login with token', async ctx =>
{
  // Logout
  // logout();

  //Assert that it will not throw an error
  await ctx.notThrowsAsync(async () =>
  {
    const client = getClient(registry);
    //Login
    await tokenLogin(client, userToken);
  });

  //Assert that we're logged in
  ctx.true(await loggedIn());
  
  //Logout
  // logout();
});

  test('will publish with token', async ctx =>
  {
    //Login
    const client = getClient(registry);
    await tokenLogin(client, userToken);
  
    //Get the fixture
    const fixture = resolveFixture();
  
    //Assert that it will not throw an error
    await ctx.notThrowsAsync(async () =>
    {
      //Publish (Dry run)
      await publish(fixture, true);
    });
  
    //Logout
    // logout();
  });
} else {

  test('will login with username', async ctx =>
  {
    //Logout
    logout();
  
    //Assert that it will not throw an error
    await ctx.notThrowsAsync(async () =>
    {
      const client = getClient(registry);
      //Login
      await login(client, username, password);
    });
  
    //Assert that we're logged in
    ctx.true(await loggedIn());
  
    //Logout
    logout();
  });
  
  test('will publish with username', async ctx =>
  {
    //Login
    const client = getClient(registry);
    await login(client, username, password);
  
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
  
}
