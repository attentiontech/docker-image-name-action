# docker-image-name-action

[![GitHub Super-Linter](https://github.com/actions/javascript-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/actions/javascript-action/actions/workflows/ci.yml/badge.svg)

Generates Unique Docker Images per Pull Request

## Usage

```yaml
name: Build Docker Image

on:
  pull_request:
    branches:
      - main
  push:
    branches:
      - main

jobs:
  unique-image-name:
    runs-on: ubuntu-latest

    steps:
      - name: Generate Docker Image Name
        id: unique-image-name
        uses: attentiontech/docker-image-name-action@v1
        with:
          baseName: myregistry/myimage

      - name: 'Print Output: imageName'
        run: echo "${{ steps.unique-image-name.outputs.imageName }}"
      - name: 'Print Output: tag'
        run: echo "${{ steps.unique-image-name.outputs.tag }}"
```

## License

MIT
