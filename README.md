# gatsby-transformer-cucumber-report

## Description

Gatsby plugin for transforming sourced cucumber reports

## How to install

`npm install --save gatsby-transformer-cucumber-report`

\- or -

`yarn add gatsby-transformer-cucumber-report`

## When do I use this plugin?

If you want to create living documentation using Gatsby. This plugin will transform any sources `.json` cucucumber report you have in your project and then query the contents.

## Examples of usage

```js
// In your gatsby-config.js
module.exports = {
  plugins: [
    `gatsby-transformer-cucumber-report`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `../my-e2e/.reports/cucumber`
      }
    }
  ]
};
```

To query the data your can for example look up a specific feature using it's name:

```js
export const pageQuery = graphql`
  query($feature: String!) {
    cucumberReport(features: { elemMatch: { name: { eq: $feature } } }) {
      features {
        keyword
        name
        elements {
          name
          steps {
            name
            keyword
            embeddings {
              data
              mime_type
            }
          }
        }
      }
    }
  }
`;
```
