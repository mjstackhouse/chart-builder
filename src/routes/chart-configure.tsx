import { useNavigate } from "react-router-dom";
import { FormEvent, useEffect, useState } from "react";
import { Dataset, useUserSelections } from '../customElement/CustomElementContext';
import BackToTypeSelectionWarning from "../warnings/back-to-type-selection-warning";

export default function ChartConfigure() {
  const navigate = useNavigate();
  const [selections, setSelections] = useUserSelections();
  const [submitBtnDisabled, setSubmitBtnDisabled] = useState(false);
  const [dataLabelsNum, setDataLabelsNum] = useState<string | number>(selections?.dataLabelsNum ? selections.dataLabelsNum : '');
  const [datasetsNum, setDatasetsNum] = useState<string | number>(selections?.datasetsNum ? selections.datasetsNum : '');

  function handleDataNums(newDataLabelsNum: number | string, newDatasetsNum: number | string) {
    let updatedDatasets: Dataset[] = [];
    let updatedDataLabels: string[] = [];

    if (selections?.datasets) {
      // dataLabelsNum
      updatedDatasets = [...selections!.datasets!];

      if (Number(newDataLabelsNum) < Number(selections?.dataLabelsNum)) {
        const numDifference = Number(selections?.dataLabelsNum) - Number(newDataLabelsNum);
        
        selections!.datasets!.map((dataset, index) => {
          if (updatedDatasets[index]) {
            // Remove the extra data values
            updatedDatasets[index].data = dataset.data?.slice(0, dataset.data.length - numDifference);
            if (updatedDatasets[index].dataProps && dataset.data) {
              // Remove the extra data colors
              updatedDatasets[index].dataProps.dataColor = dataset.dataProps?.dataColor?.slice(0, dataset.data.length - numDifference);
            }
          }
        });

        // Remove the extra data labels
        if (selections.dataLabels) updatedDataLabels = selections.dataLabels.slice(0, selections.dataLabels.length - numDifference);
      }
      else if (Number(newDataLabelsNum) > Number(selections?.dataLabelsNum)) {
        const numDifference = Number(newDataLabelsNum) - Number(selections.dataLabelsNum);

        // Add placeholder values for the new data values
        selections!.datasets!.map((_, index) => {
          if (updatedDatasets[index]) {
            [...Array(Number(numDifference))].forEach(() => {
              if (updatedDatasets[index]?.data) {
                updatedDatasets[index].data.push('');
              }
            });
          }
        });

        if (selections.dataLabels) updatedDataLabels = selections.dataLabels;

        const loopLimit = numDifference + updatedDataLabels.length;

        // Add placeholder values for the new labels
        for (let i = updatedDataLabels.length; i < loopLimit; i++) {
          updatedDataLabels[i] = '';
        }
      }

      // datasetsNum
      if (updatedDatasets.length === 0) updatedDatasets = [...selections!.datasets!];

      if (selections?.datasetsNum) {
        if (Number(newDatasetsNum) < Number(selections.datasetsNum)) {
          const numDifference = Number(selections.datasetsNum) - Number(newDatasetsNum);
          // Remove extra datasets
          updatedDatasets = updatedDatasets.slice(0, selections.datasets.length - numDifference);
        }
        else if (Number(newDatasetsNum) > Number(selections.datasetsNum)) {
          const numDifference = Number(newDatasetsNum) - Number(selections.datasetsNum);

          // Add placeholder datasets for the new datasets
          for (let i = 0; i < numDifference; i++) {
            updatedDatasets.push({ data: [...Array(Number(newDataLabelsNum))].map(() => ''), dataProps: { dataLabel: '', dataColor: ['']}});
          }
        }
      }
    }
    // Add placeholder datasets and data labels if none previously existed
    else {
      [...Array(Number(newDatasetsNum))].forEach((_, index) => {
        updatedDatasets[index] = { data: [...Array(Number(newDataLabelsNum))].map(() => ''), dataProps: { dataLabel: '', dataColor: ['']}};
      });

      [...Array(Number(newDataLabelsNum))].forEach((_, index) => {
        updatedDataLabels[index] = '';
      });
    }

    // Set the user's selections depending on what changed
    if (updatedDatasets.length > 0 && updatedDataLabels.length > 0) setSelections({...selections, dataLabelsNum: newDataLabelsNum, datasetsNum: newDatasetsNum, datasets: updatedDatasets, dataLabels: updatedDataLabels});
    else if (updatedDatasets.length > 0) setSelections({...selections, dataLabelsNum: newDataLabelsNum, datasetsNum: newDatasetsNum, datasets: updatedDatasets});
    else if (updatedDataLabels.length > 0) setSelections({...selections, dataLabelsNum: newDataLabelsNum, datasetsNum: newDatasetsNum, dataLabels: updatedDataLabels});
    else setSelections({...selections, dataLabelsNum: newDataLabelsNum, datasetsNum: newDatasetsNum});

    navigate(`/type/${selections?.type}/inputs`);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    handleDataNums(dataLabelsNum, datasetsNum);
  }

  function handleClick(event: string) {
    if (event === 'useEffect') {
      const newChartWarningContainer = document.getElementById('back-to-type-selection-warning-container');
      if (newChartWarningContainer !== null) newChartWarningContainer.style.display = 'none';
    }
    else {
      const newChartWarningContainer = document.getElementById('back-to-type-selection-warning-container');
      if (newChartWarningContainer !== null) newChartWarningContainer.style.display = 'block';
    }
  }
  useEffect(() => {
    const submitBtn = document.getElementById('submit-btn');

    if (selections?.chartTitle === '' || selections?.dataLabelsNum === '' || selections?.datasetsNum === '' || selections?.xAxisTitle === '' || selections?.yAxisTitle === '' || selections?.yAxisIncrement === '') {
      if (submitBtn !== null) {
        setSubmitBtnDisabled(true);
      } 
    }
    else {
      if (submitBtn !== null) {
        setSubmitBtnDisabled(false);
      }
    }

    handleClick('useEffect');
  }, [selections]);

  return (
    <div className='flex flex-wrap h-[600px]'>
      <div className='basis-full flex'>
        <form className='basis-full flex flex-wrap' onSubmit={handleSubmit}>
          <div className='basis-full items-center'>
            <div className='basis-full flex flex-wrap items-center mb-6'>
              <label htmlFor='title' className='pr-2 basis-full mb-1.5'>Chart Title</label>
              <input type='text' id='title' name='title' value={selections?.chartTitle ? selections.chartTitle : ''} onChange={(e) => setSelections({...selections, chartTitle: e.target.value})} className='basis-full rounded-full border-black border-solid border-2 px-2 py-[0.25rem]' required/>
            </div>
            {
              selections?.type === 'bar' || selections?.type === 'line' ? 
              <div className='basis-full flex flex-wrap items-center mb-6'>
                <label htmlFor='x-axis-title' className='pr-2 basis-full mb-1.5'>X-Axis Title</label>
                <input type='text' id='x-axis-title' name='x-axis-title' value={selections?.xAxisTitle ? selections.xAxisTitle : ''} onChange={(e) => setSelections({...selections, xAxisTitle: e.target.value})} className='basis-full rounded-full border-black border-solid border-2 px-2 py-[0.25rem]' required/>
              </div>
              : <></>
            }
            <div className='basis-full flex flex-wrap items-center mb-6'>
              <label htmlFor='data-labels-num' className='pr-2 basis-full mb-1.5'>{selections?.type === 'bar' || selections?.type === 'line' ? 'Number of X-Axis Labels' : 'Number of Data Values'}</label>
              <input type='number' min={1} id='data-labels-num' name='data-labels-num' value={dataLabelsNum} onChange={(e) => setDataLabelsNum(e.target.value) } className='basis-full rounded-full border-black border-solid border-2 px-2 py-[0.25rem]' required/>
            </div>
            {
              selections?.type === 'bar' || selections?.type === 'line' ? 
              <div className='basis-full flex flex-wrap items-center mb-6'>
                <label htmlFor='y-axis-title' className='pr-2 basis-full mb-1.5'>Y-Axis Title</label>
                <input type='text' id='y-axis-title' name='y-axis-title' value={selections?.yAxisTitle ? selections.yAxisTitle : ''} onChange={(e) => setSelections({...selections, yAxisTitle: e.target.value})} className='basis-full rounded-full border-black border-solid border-2 px-2 py-[0.25rem]' required/>
              </div>
              : <></>
            }
            {
              selections?.type === 'bar' || selections?.type === 'line' ? 
              <div className='basis-full flex flex-wrap items-center mb-6'>
                <label htmlFor='y-axis-increment' className='pr-2 basis-full mb-1.5'>Y-Axis Increment</label>
                <input type='number' min={1} id='y-axis-increment' name='y-axis-increment' value={selections?.yAxisIncrement ? selections.yAxisIncrement : ''} onChange={(e) => { setSelections({...selections, yAxisIncrement: e.target.value})}} className='basis-full rounded-full border-black border-solid border-2 px-2 py-[0.25rem]' required/>
              </div>
              : <></>
            }
            <div className='basis-full flex flex-wrap items-center mb-6'>
              <label htmlFor='datasets-num' className='pr-2 basis-full mb-1.5'>Number of Datasets</label>
              <input type='number' min={1} id='datasets-num' name='datasets-num' value={datasetsNum} onChange={(e) => setDatasetsNum(e.target.value) } className='basis-full rounded-full border-black border-solid border-2 px-2 py-[0.25rem]' required/>
            </div>
          </div>
          <div className='justify-self-end basis-full flex place-items-end justify-between'>
            <button className='btn back-btn' type='button' onClick={() => {handleClick('click')}}>
              Go back to type selection
            </button>
            <button id='submit-btn' type='submit' className='btn continue-btn' disabled={submitBtnDisabled}>
              Continue to inputs
            </button>
          </div>
        </form>
        <BackToTypeSelectionWarning />
      </div>
    </div>
  );
}
