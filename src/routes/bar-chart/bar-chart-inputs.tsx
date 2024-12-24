import { Link } from "react-router-dom";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dataset, useUserSelections } from "../../customElement/CustomElementContext";

export default function BarChartInputs() {
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
      // if (dataset?.dataProps) dataset.dataProps.dataColor = value;

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
    navigate('/type/bar/preview');
  }

  useEffect(() => {
    console.log('selections at top of inputs useEffect(): ', selections);

    const submitBtn = document.getElementById('submit-btn');

    // dataLabels, dataColor, dataLabel
    if (selections?.dataLabels && selections?.datasets) {
      if (selections?.dataLabels?.filter((value) => value === '').length > 0 
      || selections?.datasets?.filter((value) => value.dataProps?.dataColor?.length === 0).length > 0
      || selections?.datasets?.filter((value) => value.dataProps?.dataLabel === '').length > 0
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
          {[...Array(Number(selections?.dataLabelsNum))].map((_, index)=>(
            <div className='basis-full items-center pt-3 mb-3' key={`category-${index + 1}-container`}>
              <p className='basis-2/12 mb-4 font-bold'>Category {index + 1}</p>
              <div className='basis-full flex flex-wrap mb-3'>
                <label htmlFor={`category-${index + 1}-name`} className='pr-2 basis-full mb-1.5'>Label</label>
                <input type='text' id={`category-${index + 1}-name`} name={`category-${index + 1}-name`} value={selections?.dataLabels ? selections.dataLabels[index] : '' } onChange={(e) =>handleChange('dataLabels', e.target.value, index)} className='basis-full rounded-full border-black border-solid border-2 px-2 py-[0.25rem]' required/>
              </div>
              {[...Array(Number(selections?.datasetsNum))].map((_, index2) => (
                <div className='basis-full flex flex-wrap mb-6' key={`dataset-${index2 + 1}-category-${index + 1}-container`}>
                  <label htmlFor={`dataset-${index2 + 1}-category-${index + 1}-value`} className='pr-2 basis-full mb-1.5'>Dataset {index2 + 1} Value</label>
                  <input type='number' min={0} id={`dataset-${index2 + 1}-category-${index + 1}-value`} name={`dataset-${index2 + 1}-category-${index + 1}-value`} value={ selections?.datasets?.[index2]?.data?.[index] ? selections.datasets[index2].data[index] : '' } onChange={(e) => handleChange('data', e.target.value, index2, index)} className='basis-full rounded-full border-black border-solid border-2 px-2 py-[0.25rem] mb-3'/>
                </div>
              ))}
            </div>
          ))}
          {[...Array(Number(selections?.datasetsNum))].map((_, index, arr) => (
            <div className={`basis-full flex flex-wrap pt-3 ${index === arr.length - 1 ? 'mb-6' : 'mb-3'}`}>
              <label htmlFor={`dataset-${index + 1}-label`} className='pr-2 basis-full mb-1.5'>Dataset {index + 1} key label</label>
              <input type='text' id={`dataset-${index + 1}-label`} name={`dataset-${index + 1}-label`}  value={selections?.datasets ? selections.datasets[index]?.dataProps?.dataLabel : '' } onChange={(e) => handleChange('dataLabel', e.target.value, index)} className='basis-full rounded-full border-black border-solid border-2 px-2 py-[0.25rem] mb-3' required/>
              <label htmlFor={`dataset-${index + 1}-color`} className='pr-2 basis-full mb-1.5'>Dataset {index + 1} color</label>
              <input type='color' id={`dataset-${index + 1}-color`} name={`dataset-${index + 1}-color`} value={selections?.datasets ? selections.datasets[index]?.dataProps?.dataColor?.[0] : '' } onChange={(e) => handleChange('dataColor', e.target.value, index)} className='w-12 h-12 border-black border-solid border-2 p-0.5' required/>
            </div>
          ))}
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

// import { Link } from "react-router-dom";
// import { FormEvent, useEffect, useRef, useState } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";

// export default function BarChartInputs() {
//   type DataRef = {
//     [key: string]: string
//   }

//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const [navLinkParams, setNavLinkParams] = useState(Object.fromEntries(searchParams.entries()));
//   const [submitBtnDisabled, setSubmitBtnDisabled] = useState(Object.values(navLinkParams).filter((value) => value === '').length === 0 ? false : true);
//   const expectedParams = ['title', 'data-label', 'data-labels-num', 'data', 'data-labels', 'data-colors'];
  
//   const data = useRef<DataRef>(searchParams.get('data') !== null ? Object.fromEntries(decodeURIComponent(navLinkParams['data'] as string).split(',').map((value, index) => [`category-${index + 1}-value`, value])) : {});
//   const dataLabels = useRef<DataRef>(searchParams.get('data-labels') !== null ? Object.fromEntries(decodeURIComponent(navLinkParams['data-labels'] as string).split(',').map((value, index) => [`category-${index + 1}-name`, value])) : {});
//   const dataColors = useRef<DataRef>(searchParams.get('data-colors') !== null ? Object.fromEntries(decodeURIComponent(navLinkParams['data-colors'] as string).split(',').map((value, index) => [`category-${index + 1}-color`, value])) : {});

//   function handleChange(value: string, type: string, id: string) {
//     if (type === 'data') {
//       data.current[id] = String(value);
//       setNavLinkParams({...navLinkParams, 'data': Object.values(data.current).join(',') })
//     }
//     else if (type === 'dataLabels') {
//       dataLabels.current[id] = value;
//       setNavLinkParams({...navLinkParams, 'data-labels': Object.values(dataLabels.current).join(',') })
//     }
//     else {
//       dataColors.current[id] = value;
//       setNavLinkParams({...navLinkParams, 'data-colors': Object.values(dataColors.current).join(',') })
//     }
//   }

//   function handleSubmit(e: FormEvent) {
//     e.preventDefault();
//     navigate(`/type/bar/preview?${Object.keys(navLinkParams).map((key) => [key, navLinkParams[key]]).map((param) => `${param[0]}=${encodeURIComponent(param[1] as string)}`).join('&')}`);
//   }

//   useEffect(() => {
//     console.log("Object.values(navLinkParams).filter((value) => value === '').length:", Object.values(navLinkParams).filter((value) => value === '').length);

//     const submitBtn = document.getElementById('submit-btn');

//     if (Object.values(navLinkParams).filter((value) => value === '').length > 0 
//     || Object.values(data.current).filter((value) => value === '').length > 0 
//     || Object.values(data.current).length < Number(navLinkParams['data-labels-num'])
//     || Object.values(dataLabels.current).filter((value) => value === '').length > 0
//     || Object.values(dataLabels.current).length < Number(navLinkParams['data-labels-num'])
//     || Object.values(dataColors.current).filter((value) => value === '').length > 0
//     || Object.values(dataColors.current).length < Number(navLinkParams['data-labels-num'])
//     || expectedParams.filter((param) => !(Object.keys(navLinkParams).includes(param))).length > 0) 
//     {
//       if (submitBtn !== null) {
//         console.log('disabled');
//         setSubmitBtnDisabled(true);
//       } 
//     } 
//     else {
//       if (submitBtn !== null) {
//         setSubmitBtnDisabled(false);
//       } 
//     }
//   }, [navLinkParams]);

//   return (
//     <div className='flex flex-wrap h-[600px]'>
//       <div className='basis-full flex'>
//         <form id='inputs-container' className='basis-full flex flex-wrap gap-y-4' onSubmit={handleSubmit}>
//           {[...Array(Number(searchParams.get('data-labels-num')))].map((_, index)=>(
//             <div className='basis-full items-center mb-6' key={`category-${index + 1}-container`}>
//               <p className='basis-2/12 mb-4 font-bold'>Category {index + 1}</p>
//               <div className='basis-full flex flex-wrap mb-3'>
//                 <label htmlFor={`category-${index + 1}-name`} className='pr-2 basis-full mb-1.5'>Label</label>
//                 <input type='text' id={`category-${index + 1}-name`} name={`category-${index + 1}-name`} value={dataLabels.current[`category-${index + 1}-name`]} onChange={(e) => handleChange(e.target.value, 'dataLabels', e.target.id)} className='basis-full rounded-full border-black border-solid border-2 px-2 py-[0.25rem]' required/>
//               </div>
//               <div className='basis-full flex flex-wrap mb-3'>
//                 <label htmlFor={`category-${index + 1}-value`} className='pr-2 basis-full mb-1.5'>Value</label>
//                 <input type='number' min={0} id={`category-${index + 1}-value`} name={`category-${index + 1}-value`} value={data.current[`category-${index + 1}-value`]} onChange={(e) => handleChange(e.target.value, 'data', e.target.id)} className='basis-full rounded-full border-black border-solid border-2 px-2 py-[0.25rem]' required/>
//               </div>
//               <div className='basis-full flex flex-wrap'>
//                 <label htmlFor={`category-${index + 1}-color`} className='pr-2 basis-full mb-1.5'>Bar color</label>
//                 <input type='color' id={`category-${index + 1}-color`} name={`category-${index + 1}-color`} value={dataColors.current[`category-${index + 1}-color`]} onChange={(e) => handleChange(e.target.value, 'dataColors', e.target.id)} className='w-12 h-12 border-black border-solid border-2 p-0.5' required/>
//               </div>
//             </div>
//           ))}
//           <div className='justify-self-end basis-full flex place-items-end justify-between'>
//             <Link to={`../configure?${Object.keys(navLinkParams).map((key) => [key, navLinkParams[key]]).map((param) => `${param[0]}=${encodeURIComponent(param[1] as string)}`).join('&')}`} relative='path' className='btn back-btn'>
//               Go back to chart configuration
//             </Link>
//             <button id='submit-btn' type='submit' disabled={submitBtnDisabled} className='btn continue-btn'>
//               Continue to preview
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }