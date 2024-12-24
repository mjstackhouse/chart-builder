import { useNavigate, useRouteError } from 'react-router-dom';

export default function ErrorBoundary() {
  const error = useRouteError() as Error;
  const navigate = useNavigate();

  function handleClick() {
    navigate(-1);
  }

  return (
    <div className='flex flex-wrap h-[500px] w-full'>
      <div className='basis-full flex flex-wrap justify-around mb-8'>
        <h1>Oops! Something went wrong.</h1>
        <p>{error.message}</p>
      </div>
      <div className='justify-self-end basis-full flex justify-between'>
        <button onClick={handleClick} className='btn back-btn'>
          Go back
        </button>
      </div>
    </div>
  );
}