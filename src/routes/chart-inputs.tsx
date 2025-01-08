import { Link } from "react-router-dom";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserSelections } from "../customElement/CustomElementContext";

export default function ChartInputs() {
  const navigate = useNavigate();
  const [selections, setSelections] = useUserSelections();
  const [submitBtnDisabled, setSubmitBtnDisabled] = useState(true);

  function handleChange(type: string, value: string, datasetIndex: number, dataValueIndex?: number) {
    if (type === 'data') {
      const currentDatasets = [...selections?.datasets!];
      let dataset;

      dataset = currentDatasets?.[datasetIndex];
      
      if (dataset?.data) dataset.data[dataValueIndex!] = value;

      if (currentDatasets[datasetIndex]) {
        currentDatasets[datasetIndex] = {...dataset};
        setSelections({...selections, datasets: currentDatasets});
      }
    }
    else if (type === 'dataLabels') {
      const currentDataLabels = [...selections?.dataLabels!];
      currentDataLabels[datasetIndex] = value;
      setSelections({...selections, dataLabels: currentDataLabels});
    }
    else if (type === 'dataColor') {
      const currentDatasets = [...selections?.datasets!];
      const dataset = currentDatasets?.[datasetIndex];

      if (dataset?.dataProps?.dataColor) {
        dataset.dataProps.dataColor[0] = value;
      }

      if (currentDatasets[datasetIndex]) {
        currentDatasets[datasetIndex] = {...dataset};
        setSelections({...selections, datasets: currentDatasets});
      }
    }
    else if (type === 'dataLabel') {
      const currentDatasets = [...selections?.datasets!];
      const dataset = currentDatasets?.[datasetIndex];

      if (dataset?.dataProps) dataset.dataProps.dataLabel = value;

      if (currentDatasets[datasetIndex]) {
        currentDatasets[datasetIndex] = {...dataset};
        setSelections({...selections, datasets: currentDatasets});
      }
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    navigate(`/type/${selections?.type}/preview`);
  }

  useEffect(() => {
    const submitBtn = document.getElementById('submit-btn');

    if (selections?.dataLabels && selections?.datasets) {
      if (selections?.dataLabels?.filter((label) => label === '').length > 0 
      || selections?.datasets?.filter((dataset) => dataset.dataProps?.dataColor?.length === 0).length > 0
      || (selections.type === 'pie' && selections?.datasets?.filter((dataset) => dataset.data!.filter((value) => value === '').length > 0).length > 0)
      )
      {
        if (submitBtn !== null) {
          setSubmitBtnDisabled(true);
        } 
      } 
      else {
        if (submitBtn !== null) {
          setSubmitBtnDisabled(false);
        }
      }
    }
  }, [selections]);

  return (
    <div className='flex flex-wrap h-[600px]'>
      <div className='basis-full flex'>
        <form id='inputs-container' className='basis-full flex flex-wrap' onSubmit={handleSubmit}>
          <div className='basis-full h-[525px] overflow-y-scroll divide-solid divide-y'>
            { 
              selections?.type === 'bar' || selections?.type === 'line' ?
              <div className='basis-full h-[525px] overflow-y-scroll divide-solid divide-y'>
                {[...Array(Number(selections?.dataLabelsNum))].map((_, index)=>(
                <div className='basis-full items-center pt-3 mb-6' key={`category-${index + 1}-container`}>
                  <p className='basis-2/12 mb-4 font-bold'>Category {index + 1}</p>
                  <div className='basis-full flex flex-wrap mb-3'>
                    <label htmlFor={`category-${index + 1}-name`} className='pr-2 basis-full mb-1.5'>Label</label>
                    <input type='text' id={`category-${index + 1}-name`} name={`category-${index + 1}-name`} value={selections?.dataLabels ? selections.dataLabels[index] : '' } onChange={(e) =>handleChange('dataLabels', e.target.value, index)} className='basis-full rounded-full border-black border-solid border-2 px-2 py-[0.25rem]' required/>
                  </div>
                  {[...Array(Number(selections?.datasetsNum))].map((_, index2) => (
                    <div className='basis-full flex flex-wrap mb-3' key={`dataset-${index2 + 1}-category-${index + 1}-container`}>
                      <label htmlFor={`dataset-${index2 + 1}-category-${index + 1}-value`} className='pr-2 basis-full mb-1.5'>Dataset {index2 + 1} Value</label>
                      <input type='number' min={0} id={`dataset-${index2 + 1}-category-${index + 1}-value`} name={`dataset-${index2 + 1}-category-${index + 1}-value`} value={ selections?.datasets?.[index2]?.data?.[index] ? selections.datasets[index2].data[index] : '' } onChange={(e) => handleChange('data', e.target.value, index2, index)} className='basis-full rounded-full border-black border-solid border-2 px-2 py-[0.25rem] mb-1.5'/>
                    </div>
                  ))}
                </div>
                ))}
                {[...Array(Number(selections?.datasetsNum))].map((_, index, arr) => (
                  <div className={`basis-full flex flex-wrap pt-3 ${index === arr.length - 1 ? 'mb-6' : 'mb-3'}`} key={`dataset-${index + 1}-container`}>
                    <label htmlFor={`dataset-${index + 1}-label`} className='pr-2 basis-full mb-1.5'>Dataset {index + 1} key label</label>
                    <input type='text' id={`dataset-${index + 1}-label`} name={`dataset-${index + 1}-label`}  value={selections?.datasets ? selections.datasets[index]?.dataProps?.dataLabel : '' } onChange={(e) => handleChange('dataLabel', e.target.value, index)} className='basis-full rounded-full border-black border-solid border-2 px-2 py-[0.25rem] mb-3' required/>
                    <label htmlFor={`dataset-${index + 1}-color`} className='pr-2 basis-full mb-1.5'>Dataset {index + 1} color</label>
                    <input type='color' id={`dataset-${index + 1}-color`} name={`dataset-${index + 1}-color`} value={selections?.datasets ? selections.datasets[index]?.dataProps?.dataColor?.[0] : '' } onChange={(e) => handleChange('dataColor', e.target.value, index)} className='w-12 h-12 border-black border-solid border-2 p-0.5 mb-3' required/>
                  </div>
                ))}
              </div>
              :
              <div className='basis-full h-[525px] overflow-y-scroll divide-solid divide-y'>
                {[...Array(Number(selections?.dataLabelsNum))].map((_, index)=>(
                  <div className='basis-full items-center pt-3 mb-6' key={`category-${index + 1}-container`}>
                    <p className='basis-2/12 mb-4 font-bold'>Category {index + 1}</p>
                    <div className='basis-full flex flex-wrap mb-3'>
                      <label htmlFor={`category-${index + 1}-name`} className='pr-2 basis-full mb-1.5'>Label</label>
                      <input type='text' id={`category-${index + 1}-name`} name={`category-${index + 1}-name`} value={selections?.dataLabels ? selections.dataLabels[index] : '' } onChange={(e) =>handleChange('dataLabels', e.target.value, index)} className='basis-full rounded-full border-black border-solid border-2 px-2 py-[0.25rem]' required/>
                    </div>
                    {[...Array(Number(selections?.datasetsNum))].map((_, index2, arr) => (
                      <div className={`basis-full flex flex-wrap ${index2 === arr.length - 1 ? 'mb-6' : 'mb-3'}`} key={`dataset-${index2 + 1}-category-${index + 1}-container`}>
                        <label htmlFor={`dataset-${index2 + 1}-category-${index + 1}-value`} className='pr-2 basis-full mb-1.5'>Dataset {index2 + 1} value</label>
                        <input type='number' min={0} id={`dataset-${index2 + 1}-category-${index + 1}-value`} name={`dataset-${index2 + 1}-category-${index + 1}-value`} value={ selections?.datasets?.[index2]?.data?.[index] ? selections.datasets[index2].data[index] : '' } onChange={(e) => handleChange('data', e.target.value, index2, index)} className='basis-full rounded-full border-black border-solid border-2 px-2 py-[0.25rem] mb-1.5' required/>
                        <label htmlFor={`dataset-${index2 + 1}-category-${index + 1}-color`} className='pr-2 basis-full mb-1.5'>Dataset {index2 + 1} color</label>
                        <input type='color' id={`dataset-${index2 + 1}-category-${index + 1}-color`} name={`dataset-${index2 + 1}-category-${index + 1}-color`} value={selections?.datasets ? selections.datasets[index2]?.dataProps?.dataColor?.[index] : '' } onChange={(e) => handleChange('dataColor', e.target.value, index2, index)} className='w-12 h-12 border-black border-solid border-2 p-0.5' required/>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            }
          </div>
          <div className='justify-self-end basis-full flex place-items-end justify-between'>
            <Link to={'../configure'} draggable={false} relative='path' className='btn back-btn'>
              Go back to chart configuration
            </Link>
            <button id='submit-btn' type='submit' disabled={submitBtnDisabled} className='btn continue-btn'>
              Continue to preview
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}