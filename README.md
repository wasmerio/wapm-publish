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
```

## Input

| Name        | Required | Description                                                        |
| ----------- | -------- | ------------------------------------------------------------------ |
| `token`     | 〰️       | WAPM account token                                                 |
| `username`  | 〰️       | WAPM account username (will be used only if token is not provided) |
| `password`  | 〰️       | WAPM access password (will be used only if token is not provided)  |
| `directory` | no       | Package directory (defaults to the current working directory)      |
| `registry`  | no       | The registry url (defaults to https://registry.wapm.io/)           |

## Output

There is no output from this action


## Development

You can develop this action with npm and node:

```bash
npm i
WAPM_USERNAME=x WAPM_PASSWORD=y WAPM_TOKEN=z npm test
```
