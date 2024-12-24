import 'chart.js/auto';
import { Link } from "react-router-dom";
import { Chart } from "chart.js";
import { useEffect } from "react";
import { useUserSelections, useValue } from '../customElement/CustomElementContext';
import { Value } from "../customElement/value";
import { useNavigate } from "react-router-dom";

export default function ChartPreview() {
  const navigate = useNavigate();
  const [selections] = useUserSelections();
  const [_, setElementValue] = useValue();

  let chart: Chart<'bar', string[] | undefined, string> | Chart<'pie', string[] | undefined, string> | undefined | Chart<'line', string[] | undefined, string> | undefined;
  let chartData: Value = { valueKey: '', userSelections: '' };
  
  useEffect(() => {
    const ctx = document.getElementById('chart') as HTMLCanvasElement;

    if (selections?.type === 'pie') {
      let datasets = selections!.datasets;

      if (datasets) {
        datasets.forEach((dataset) => {
          if (dataset.data) {
            dataset.data.forEach((value, index2) => {
              if (value === '' || value === null || value === undefined) {
                if (dataset.data) {
                  dataset.data[index2] = 'NaN';
                }
              }
            })
          }
        })
      }

      chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: selections!.dataLabels,
          datasets: datasets ? datasets!.map((dataset, index) => ({
            label: selections!.dataLabels![index],
            data: dataset.data,
            borderWidth: 1,
            borderColor: dataset.dataProps!.dataColor,
            backgroundColor: dataset.dataProps!.dataColor,
            spanGaps: true
          })) : []
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: selections!.chartTitle,
            }
          }
        }
      });
    }
    else if (selections?.type === 'bar') {
      let datasets = selections!.datasets;

      if (datasets) {
        datasets.forEach((dataset) => {
          if (dataset.data) {
            dataset.data.forEach((value, index2) => {
              if (value === '' || value === null || value === undefined) {
                if (dataset.data) {
                  dataset.data[index2] = 'NaN';
                }
              }
            })
          }
        })
      }

      chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: selections!.dataLabels,
          datasets: datasets ? datasets!.map((dataset) => ({
            label: dataset.dataProps!.dataLabel,
            data: dataset.data,
            borderWidth: 1,
            borderColor: dataset.dataProps!.dataColor,
            backgroundColor: dataset.dataProps!.dataColor,
            spanGaps: true
          })) : []
        },
        options: {
          responsive: true,
          indexAxis: 'x',
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: selections!.yAxisIncrement as number
              },
              title: {
                display: true,
                text: selections!.yAxisTitle,
                align: 'center',
              }
            },
            x: {
              title: {
                display: true,
                text: selections!.xAxisTitle,
                align: 'center'
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: selections!.chartTitle,
            }
          }
        }
      });
    }
    else if (selections?.type === 'line') {
      let datasets = selections!.datasets;

      if (datasets) {
        datasets.forEach((dataset) => {
          if (dataset.data) {
            dataset.data.forEach((value, index2) => {
              if (value === '' || value === null || value === undefined) {
                if (dataset.data) {
                  dataset.data[index2] = 'NaN';
                }
              }
            })
          }
        })
      }
      
      chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: selections!.dataLabels,
          datasets: datasets ? datasets!.map((dataset) => ({
            label: dataset.dataProps!.dataLabel,
            data: dataset.data,
            borderWidth: 1,
            borderColor: dataset.dataProps!.dataColor![0],
            backgroundColor: dataset.dataProps!.dataColor![0],
            spanGaps: true
          })) : []
        },
        options: {
          responsive: true,
          indexAxis: 'x',
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: selections!.yAxisIncrement as number
              },
              title: {
                display: true,
                text: selections!.yAxisTitle,
                align: 'center',
              }
            },
          },
          plugins: {
            title: {
              display: true,
              text: selections!.chartTitle,
            }
          }
        }
      });
    }

    return () => chart?.destroy();
  }, []);

  function setCustomElementValue() {
    if (document !== null) {
      const chart = document.getElementById('chart') as HTMLCanvasElement;
      chartData = { valueKey: chart.toDataURL('image/webp', 1), userSelections: JSON.stringify(selections) };

      if (chart !== null) {
        setElementValue(chartData);
        navigate('/home');
      }
    }
  }

  return (
    <div className='flex flex-wrap justify-around h-[600px]'>
      <div id='chart-container' className='relative basis-full max-h-[500px] max-w-full flex justify-around'>
        <canvas id='chart'></canvas>
      </div>
      <div className='justify-self-end basis-full flex place-items-end justify-between'>
        <Link to={`../inputs`} draggable={false} relative='path' className='btn back-btn'>
          Go back to inputs
        </Link>
        <button onClick={setCustomElementValue} className='btn continue-btn'>
          Save and complete
        </button>
      </div>
    </div>
  );
}