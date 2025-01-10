import 'chart.js/auto';
import { Link } from "react-router-dom";
import { Chart } from "chart.js";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Dataset, useUserSelections, useValue } from '../customElement/CustomElementContext';
import { Value } from "../customElement/value";
import { useNavigate } from "react-router-dom";

export default function ChartPreview() {
  const navigate = useNavigate();
  const [selections] = useUserSelections();
  const [_, setElementValue] = useValue();
  const [imageWidth, setImageWidth] = useState<string | number>(500);
  const [loadingText, setLoadingText] = useState<string>('Loading your chart preview...');

  let chart: Chart<"bar" | "line" | "pie", string[] | undefined, string> | Chart<'pie', string[] | undefined, string> | undefined | Chart<'line', string[] | undefined, string> | undefined;
  let chartData: Value = { valueKey: '', userSelections: '' };
  const datasets = useRef<Dataset[] | undefined>(selections!.datasets);
  const config = useRef<any>();
  
  useEffect(() => {
    chooseFontSize(Number(imageWidth));
 
    const imageWidthWarning = document.getElementById('image-width-warning');
    if (imageWidthWarning) imageWidthWarning.style.display = 'none';
    
    const ctx = document.getElementById('chart') as HTMLCanvasElement;

    // Proccessing data to properly 'skip' empty data values in the chart
    if (datasets.current) {
      datasets.current.forEach((dataset) => {
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

    config.current = {
      type: selections?.type,
      data: {
        labels: selections!.dataLabels,
        datasets: datasets ? datasets.current!.map((dataset, index) => ({
          label: selections?.type === 'bar' || selections?.type === 'line' ? dataset.dataProps!.dataLabel : selections!.dataLabels![index],
          data: dataset.data,
          borderWidth: 1,
          borderColor: selections?.type === 'bar' || selections?.type === 'pie' ? dataset.dataProps!.dataColor : dataset.dataProps!.dataColor![0],
          backgroundColor: selections?.type === 'bar' || selections?.type === 'pie' ? dataset.dataProps!.dataColor : dataset.dataProps!.dataColor![0],
          spanGaps: true
        })) : []
      },
      options: {
        responsive: true,
        animation: {
          onComplete: () => handleInitialChartRender(),
        },
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: selections!.chartTitle
          }
        }
      }
    };

    if (selections?.type === 'bar' || selections?.type === 'line') {
      config.current.options.indexAxis = 'x';
      config.current.options.scales = {
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
                      }
      }

    chart = new Chart(ctx, config.current);

    return () => chart?.destroy();
  }, [chart]);

  function chooseFontSize(width: number) {
    if (width < 1000) Chart.defaults.font.size = 12;
    else if (width >= 1000 && width < 1500) Chart.defaults.font.size = 20;
    else if (width >= 1500 && width < 2000) Chart.defaults.font.size = 28;
    else return Chart.defaults.font.size = 36;
  }

  function handleInitialChartRender() {
    const canvas = document.getElementById('chart');
    const defaultImageWidth = canvas?.style.width.slice(0, -2);
    const loadingContainer = document.getElementById('loading-container');

    if (loadingContainer) loadingContainer.style.display = 'none';
    if (defaultImageWidth) setImageWidth(defaultImageWidth);
  }

  function setCustomElementValue(e: FormEvent, currentConfig: any) {
    e.preventDefault();
    
    if (document !== null) {
      const userWidthCanvas = createOffscreenCanvas(Number(imageWidth));
      setLoadingText('Saving your chart...');

      const loadingContainer = document.getElementById('loading-container');
      if (loadingContainer) loadingContainer.style.display = 'flex';
      
      if (userWidthCanvas) {
        currentConfig.options.responsive = false;
        currentConfig.options.maintainAspectRatio = true;
        currentConfig.options.animation = {
          onComplete: () => handleSave(userWidthCanvas)
        }
        
        new Chart(userWidthCanvas, currentConfig);
      }
    }
  }

  function createOffscreenCanvas(width: number) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.id = 'offscreen-canvas';
    return canvas;
  }

  function handleSave(canvas: HTMLCanvasElement) {
    const loadingContainer = document.getElementById('loading-container');
    if (loadingContainer) loadingContainer.style.display = 'none';

    // Checking if the data URL is small enough to save in the element's value
    if (canvas.toDataURL('image/webp', 1).length <= 100000) {
      chooseFontSize(Number(imageWidth));
      chartData = { valueKey: canvas.toDataURL('image/webp', 1), userSelections: JSON.stringify(selections) };
      setElementValue(chartData);
      navigate('/home');
    }
    else {
      const imageWidthWarning = document.getElementById('image-width-warning');
      if (imageWidthWarning) imageWidthWarning.style.display = 'block';

      const imageWidthInput = document.getElementById('image-width');
      if (imageWidthInput && imageWidthWarning) {
        imageWidthInput.addEventListener('click', function handleClick () {
          imageWidthWarning.style.display = 'none';
          imageWidthInput.removeEventListener('click', handleClick);
        }, { once: true });
      }
    }
  }

  return (
    <div className='flex flex-wrap justify-around h-[600px]'>
      <div id='loading-container' className='basis-full fixed bg-white z-10 h-[560px] w-full flex place-items-center'>
        <div className='basis-full flex flex-wrap'>
          <p className='basis-full text-center mb-3'>{loadingText}</p>
          <div className='basis-full flex place-content-center'>
            <span id='loading-span' className='text-6xl'></span>
          </div>
        </div>
      </div>
      <div id='chart-container' className='relative basis-full flex justify-around max-h-[450px] max-w-full'>
        <canvas id='chart'></canvas>
      </div>
      <div className='justify-self-end basis-full flex place-items-end justify-between'>
        <Link to={`../inputs`} draggable={false} relative='path' className='btn back-btn'>
          Go back to inputs
        </Link>
        <form className='flex flex-wrap justify-end' onSubmit={(e) => setCustomElementValue(e, config.current)}>
          <div id='image-width-container' className='relative flex flex-wrap justify-end mb-6' title='The default value is the width you are currently viewing'>
            <label htmlFor='image-width' className='pr-2 basis-full mb-1.5'>Output width (px)</label>
            <input id='image-width' name='image-width' type='number' min={250} max={2000} value={imageWidth} onChange={(e) => setImageWidth(e.target.value)} className='relative basis-full rounded-full border-black border-solid border-2 px-2 py-[0.25rem] mb-1.5' required />
            <p id='image-width-warning' className='absolute bg-red text-white px-2 py-[0.25rem] rounded-lg left-[-265px] bottom-[0.5rem]'>Please choose a smaller output width</p>
          </div>
          <div className='basis-full'>
            <button type='submit' className='btn continue-btn justify-self-end'>
              Save and complete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}