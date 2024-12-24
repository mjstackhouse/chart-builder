# Chart Builder Custom Element for Kontent.ai

This custom element allows for users to build charts/graphs within Kontent.ai, and save those charts to be displayed on their app's front-end.

It was built using the [Kontent.ai's Custom Element Starter code](https://github.com/kontent-ai/custom-element-starter-react) and [Chart.js](https://www.chartjs.org/docs/latest/).

## Deploying

Netlify has made this easy. If you click the deploy button below, it will guide you through the process of deploying it to Netlify and leave you with a copy of the repository in your GitHub account as well.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/mjstackhouse/chart-builder)

## Configuring the Custom Element

This custom element requires no parameters, so only the following is necessary:

`{}`

## What is Saved

This custom element saves the user's chart as a data URI in the 'valueKey' property, as well as their selections in the 'userSelections' property. Example output (the data URI has been shortened for sake of the example):

```
{
    "valueKey": "data:image/webp;base64,UklGRhQjAABXRUJQVlA4WAoAAAAwAAAA8wEA8wEA",
    "userSelections": 
      {
        "type": "pie",
        "chartTitle": "People's Favorite RGB Color",
        "dataLabels":["Number of Votes for Red","Number of Votes for Green","Number of Votes for Blue"]",
        "dataLabelsNum":"3",
        "datasetsNum":"1",
        "datasets":
          [
            {
              "data": ["50","31","66"],
              "dataProps": {
                             "dataLabel":"",
                             "dataColor": ["#fa0000","#00db1a","#00a4eb"]
                           }
            }
          ]
      }
  }
  ```

The 'valueKey' value will need to be parsed, and then it can be used to set the 'src' attribute of an `<img>` tag. If you're interested in the interactivity that Chart.js provides as opposed to the static image of the chart, then the 'userSelections' values can be used in your front-end with Chart.js to create the chart.