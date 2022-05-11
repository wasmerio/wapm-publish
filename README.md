# WAPM Publish Action

[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/wasmerio/wapm-publish/Tests?label=Tests&style=flat-square)](https://github.com/wasmerio/wapm-publish/actions/workflows/tests.yml)

[GitHub action](https://github.com/features/actions) for publishing to
[WAPM](https://wapm.io). Works well with
[wasmerio/setup-wasmer](https://github.com/wasmerio/setup-wasmer).

## Features

- Suppresses output (Prevent leaking credentials)
- Cross platform (Linux, Mac, and Windows)
- Fully tested

## Caveats

- Requires WAPM to already be installed (Use
  [wasmerio/setup-wasmer](https://github.com/wasmerio/setup-wasmer))

## Usage

```yaml
- name: Setup Wasmer
  uses: wasmerio/setup-wasmer@v1

- name: Publish to WAPM
  uses: wasmerio/wapm-publish@v1
  with:
    username: ${{ secrets.WAPM_USERNAME }}
    password: ${{ secrets.WAPM_PASSWORD }}
    token: ${{ secrets.WAPM_REGISTRY_TOKEN }}
```

## Input

| Name        | Required | Description                                                   |
| ----------- | -------- | ------------------------------------------------------------  |
| `username`  | 〰️        | WAPM account username(Instead of the `token`)                                       |
| `password`  | 〰️        | WAPM account password(Instead of the `token`)                                              |          
| `token`     | 〰️        | WAPM access token(Instead of the `username`/`password`)                                         |
| `directory` | no       | Package directory (defaults to the current working directory) |
| `registry`  | no       | The registry url (defaults to https://registry.wapm.io/)      |

## Output


There is no output from this action
## Development 
- WAPM_USERNAME=a WAPM_PASSWORD=b npm run test `In case of username & password`
- token=token_value `In case of token`
