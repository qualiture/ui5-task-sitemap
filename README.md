# UI5 task for generating a sitemap for your UI5 application 

Task for [ui5-builder](https://github.com/SAP/ui5-builder), creates an XML sitemap

## Prerequisites

- Requires at least [`@ui5/cli@3.0.0`](https://sap.github.io/ui5-tooling/v3/pages/CLI/) (to support [`specVersion: "3.0"`](https://sap.github.io/ui5-tooling/pages/Configuration/#specification-version-30))

## Install

```bash
npm install ui5-task-sitemap --save-dev
```

## Usage

1. Define the dependency in `$yourapp/package.json`:

```json
"devDependencies": {
    // ...
    "ui5-task-sitemap": "*"
    // ...
}
```

2. configure it in `$yourapp/ui5.yaml`:

```yaml
builder:
  customTasks:
  - name: ui5-task-sitemap
    afterTask: replaceVersion
    configuration:
      baseUrl: "https://yourapp.example.com"
      priority: 0.8
      changefreq: "monthly"
```

**Please note, this is a work in progress!**

## Licence

Standard MIT license

If you find this extension useful, buy Qualiture (Robin van het Hof) a beer when you see him 🙂
