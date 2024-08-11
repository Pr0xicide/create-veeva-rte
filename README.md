# Create Veeva Rep-triggered Email (RTE)

[![NPM Version](https://img.shields.io/npm/v/create-veeva-rte.svg?style=flat)](https://github.com/Pr0xicide/create-veeva-rte) [![NPM Downloads](https://img.shields.io/npm/dt/create-veeva-rte.svg?style=flat)](https://www.npmjs.com/package/create-veeva-rte) [![Issues](https://img.shields.io/github/issues-raw/Pr0xicide/create-veeva-rte.svg?maxAge=25000)](https://github.com/Pr0xicide/create-veeva-rte/issues)

CLI tool to quickly setup Veeva RTEs boilerplate files (email template and fragments) in your current directory.

## Quick Start

### NPX

Using npx, run the following command below to create an RTE project in current directory:

```bash
npx create-veeva-rte
```

### Global

Or install this package globally using:

```bash
npm install create-veeva-rte -g
```

Then run the following command in your terminal to verify:

```bash
create-veeva-rte
```

## Commands

### Project

Creates a new directory containing multiple email templates and fragments.

Example for creating 1 new email template containing 2 email fragments.

```bash
npx create-veeva-rte project
RTE project directory name: example-rte-directory-name

Number of email templates: 1
Email template 1 name: template 1

Number of email fragments: 2
Email fragment 1 name: fragment 1
Email fragment 2 name: fragment 2
```

The example above would create the following directory structure in your current working directory.

```text
.
`-- example-rte-directory-name/
    |-- email fragments/
    |   |-- fragment 1/
    |   |   `-- index.html
    |   `-- fragment 2/
    |       `-- index.html
    `-- email templates/
        `-- template 1/
            `-- index.html
```

## Email Template

TODO - WIP

## Email Fragment

TODO - WIP

## Additional Resources

- [Creating Approved Email Templates](https://crmhelp.veeva.com/doc/Content/CRM_topics/Multichannel/ApprovedEmail/ManageCreateContent/CreatingContent/CreatingAETemplates.htm)
- [Creating Approved Email Fragments](https://crmhelp.veeva.com/doc/Content/CRM_topics/Multichannel/ApprovedEmail/ManageCreateContent/CreatingContent/CreatingAEFragments.htm)
- [Approved Email Configuration Tokens](https://crmhelp.veeva.com/doc/Content/CRM_topics/Multichannel/ApprovedEmail/ManageCreateContent/CreatingContent/ConfigTokens.htm)

## Author

Jayvin Duong
