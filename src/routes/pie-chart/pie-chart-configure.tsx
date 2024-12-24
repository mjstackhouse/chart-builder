import { useNavigate } from "react-router-dom";
import { FormEvent, useEffect, useState } from "react";
import { Dataset, useUserSelections } from '../../customElement/CustomElementContext';
import BackToTypeSelectionWarning from "../../warnings/back-to-type-selection-warning";

export default function PieChartConfigure() {
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
            updatedDatasets[index].data = dataset.data?.slice(0, dataset.data.length - numDifference);
            if (updatedDatasets[index].dataProps && dataset.data) {
              updatedDatasets[index].dataProps.dataColor = dataset.dataProps?.dataColor?.slice(0, dataset.data.length - numDifference);
            }
          }
        });

        if (selections.dataLabels) updatedDataLabels = selections.dataLabels.slice(0, selections.dataLabels.length - numDifference);
      }
      else if (Number(newDataLabelsNum) > Number(selections?.dataLabelsNum)) {
        const numDifference = Number(newDataLabelsNum) - Number(selections.dataLabelsNum);

        selections!.datasets!.map((_, index) => {
          if (updatedDatasets[index]) {
            [...Array(Number(numDifference))].forEach(() => {
              if (updatedDatasets[index]?.data) {
                updatedDatasets[index].data.push('');
              }
            });
          }
        });
    
        [...Array(Number(numDifference))].forEach((_, index) => {
          updatedDataLabels[index] = '';
        });
      }

      // datasetsNum
      if (updatedDatasets.length === 0) updatedDatasets = [...selections!.datasets!];

      if (selections?.datasetsNum) {
        if (Number(newDatasetsNum) < Number(selections.datasetsNum)) {
          const numDifference = Number(selections.datasetsNum) - Number(newDatasetsNum);
          updatedDatasets = updatedDatasets.slice(0, selections.datasets.length - numDifference);
        }
        else if (Number(newDatasetsNum) > Number(selections.datasetsNum)) {
          const numDifference = Number(newDatasetsNum) - Number(selections.datasetsNum);

          for (let i = 0; i < numDifference; i++) {
            updatedDatasets.push({ data: [...Array(Number(newDataLabelsNum))].map(() => ''), dataProps: { dataLabel: '', dataColor: [...Array(Number(newDataLabelsNum))].map(() => '')}});
          }
        }
      }
      else {
        for (let i = 0; i < Number(newDataLabelsNum); i++) {
          updatedDatasets.push({ data: [...Array(Number(newDataLabelsNum))].map(() => ''), dataProps: { dataLabel: '', dataColor: [...Array(Number(newDataLabelsNum))].map(() => '')}});
        }
      }
    }
    else {
      [...Array(Number(newDatasetsNum))].forEach((_, index) => {
        updatedDatasets[index] = { data: [...Array(Number(newDataLabelsNum))].map(() => ''), dataProps: { dataLabel: '', dataColor: [...Array(Number(newDataLabelsNum))].map(() => '')}};
      });

      [...Array(Number(newDataLabelsNum))].forEach((_, index) => {
        updatedDataLabels[index] = '';
      });
    }

    if (updatedDatasets.length > 0 && updatedDataLabels.length > 0) setSelections({...selections, dataLabelsNum: newDataLabelsNum, datasetsNum: newDatasetsNum, datasets: updatedDatasets, dataLabels: updatedDataLabels});
    else if (updatedDatasets.length > 0) setSelections({...selections, dataLabelsNum: newDataLabelsNum, datasetsNum: newDatasetsNum, datasets: updatedDatasets});
    else if (updatedDataLabels.length > 0) setSelections({...selections, dataLabelsNum: newDataLabelsNum, datasetsNum: newDatasetsNum, dataLabels: updatedDataLabels});
    else setSelections({...selections, dataLabelsNum: newDataLabelsNum, datasetsNum: newDatasetsNum});

    navigate('/type/pie/inputs');
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

    // if (selections?.dataLabels) {
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
            <div className='basis-full flex flex-wrap items-center mb-6'>
              <label htmlFor='data-labels-num' className='pr-2 basis-full mb-1.5'>Number of Data Values</label>
              <input type='number' min={1} id='data-labels-num' name='data-labels-num' value={dataLabelsNum} onChange={(e) => setDataLabelsNum(e.target.value) } className='basis-full rounded-full border-black border-solid border-2 px-2 py-[0.25rem]' required/>
            </div>
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
              Continue to data inputs
            </button>
          </div>
        </form>
        <BackToTypeSelectionWarning />
      </div>
    </div>
  );
}


// import { useNavigate, useSearchParams } from "react-router-dom";
// import { FormEvent, useEffect, useRef, useState } from "react";
// import BackToTypeSelectionWarning from "../../back-to-type-selection-warning";

// export default function PieChartConfigure() {
//   type DataRef = {
//     [key: string]: string | undefined
//   }

//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const [navLinkParams, setNavLinkParams] = useState(Object.fromEntries(searchParams.entries()));
//   const [submitBtnDisabled, setSubmitBtnDisabled] = useState(false);
//   const expectedParams = ['title', 'data-label', 'data-labels-num'];
  
//   const finalNavParams = useRef<DataRef>({});

//   function handleDataLabelsNum(newNum: string) {
//     if (Object.keys(navLinkParams).includes('data')) {
//       if (Number(newNum) < (navLinkParams['data'] as string)?.split(',').length) {
//         const numDifference = (navLinkParams['data'] as string)?.split(',').length - Number(newNum);
//         const currentDataValues = navLinkParams['data']?.split(',');
//         const updatedDataValues = currentDataValues?.slice(0, currentDataValues.length - numDifference);

//         const currentDataLabels = navLinkParams['data-labels']?.split(',');
//         const updatedDataLabels = currentDataLabels?.slice(0, currentDataLabels.length - numDifference);

//         finalNavParams.current = {...navLinkParams, 'data': updatedDataValues?.join(','), 'data-labels': updatedDataLabels?.join(',')};
//         navigate(`/type/pie/inputs?${Object.keys(finalNavParams.current).map((key) => [key, finalNavParams.current[key]]).map((param) => `${param[0]}=${encodeURIComponent(param[1] as string)}`).join('&')}`);
//       }
//       else {
//         finalNavParams.current = navLinkParams;
//         navigate(`/type/pie/inputs?${Object.keys(finalNavParams.current).map((key) => [key, finalNavParams.current[key]]).map((param) => `${param[0]}=${encodeURIComponent(param[1] as string)}`).join('&')}`);
//       }
//     }
//     else {
//       finalNavParams.current = navLinkParams;
//       navigate(`/type/pie/inputs?${Object.keys(finalNavParams.current).map((key) => [key, finalNavParams.current[key]]).map((param) => `${param[0]}=${encodeURIComponent(param[1] as string)}`).join('&')}`);
//     }
//   }

//   function handleSubmit(e: FormEvent) {
//     e.preventDefault();
//     handleDataLabelsNum(navLinkParams['data-labels-num'] as string);
//   }

//   function handleClick(event: string) {
//     if (event === 'useEffect') {
//       const newChartWarningContainer = document.getElementById('back-to-type-selection-warning-container');
//       if (newChartWarningContainer !== null) newChartWarningContainer.style.display = 'none';
//     }
//     else {
//       const newChartWarningContainer = document.getElementById('back-to-type-selection-warning-container');
//       if (newChartWarningContainer !== null) newChartWarningContainer.style.display = 'block';
//     }
//   }
//   useEffect(() => {
//     const submitBtn = document.getElementById('submit-btn');

//     if (Object.values(navLinkParams).filter((value) => value === '').length > 0 || expectedParams.filter((param, index, arr) => !(Object.keys(navLinkParams).includes(param))).length > 0) {
//       if (submitBtn !== null) {
//         setSubmitBtnDisabled(true);
//       } 
//     } 
//     else {
//       if (submitBtn !== null) {
//         setSubmitBtnDisabled(false);
//       } 
//     }

//     handleClick('useEffect');
//   }, [navLinkParams]);

//   return (
//     <div className='flex flex-wrap h-[600px]'>
//       <div className='basis-full flex'>
//         <form className='basis-full flex flex-wrap' onSubmit={handleSubmit}>
//           <div className='basis-full items-center'>
//             <div className='basis-full flex flex-wrap items-center mb-6'>
//               <label htmlFor='title' className='pr-2 basis-full mb-1.5'>Chart Title</label>
//               <input type='text' id='title' name='title' value={navLinkParams['title']} onChange={(e) => setNavLinkParams({...navLinkParams, 'title': e.target.value})} className='basis-full rounded-full border-black border-solid border-2 px-2 py-[0.25rem]' required/>
//             </div>
//             <div className='basis-full flex flex-wrap items-center mb-6'>
//               <label htmlFor='data-label' className='pr-2 basis-full mb-1.5'>Key Label</label>
//               <input type='text' id='data-label' name='data-label' value={navLinkParams['data-label']} onChange={(e) => setNavLinkParams({...navLinkParams, 'data-label': e.target.value})} className='basis-full rounded-full border-black border-solid border-2 px-2 py-[0.25rem]' required/>
//             </div>
//             <div className='basis-full flex flex-wrap items-center mb-8'>
//               <label htmlFor='data-labels-num' className='pr-2 basis-full mb-1.5'>Number of Data Categories</label>
//               <input type='number' min={1} id='data-labels-num' name='data-labels-num' value={navLinkParams['data-labels-num']} onChange={(e) => setNavLinkParams({...navLinkParams, 'data-labels-num': e.target.value})} className='basis-full rounded-full border-black border-solid border-2 px-2 py-[0.25rem]' required/>
//             </div>
//           </div>
//           <div className='justify-self-end basis-full flex place-items-end justify-between'>
//             <button className='btn back-btn' type='button' onClick={() => {handleClick('click')}}>
//               Go back to type selection
//             </button>
//             <button id='submit-btn' type='submit' className='btn continue-btn' disabled={submitBtnDisabled}>
//               Continue to data inputs
//             </button>
//           </div>
//         </form>
//         <BackToTypeSelectionWarning />
//       </div>
//     </div>
//   );
// }
