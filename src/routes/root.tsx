import { Outlet } from "react-router-dom";
import { useIsDisabled, useValue } from '../customElement/CustomElementContext';

export default function Root() {
  const isDisabled = useIsDisabled();
  const [elementValue] = useValue();

  return (
    <div>
      { isDisabled === false ?
        <div id='detail'>
          <Outlet />
        </div>
        : <div>
            <div>
              <h1>Existing Chart Preview</h1>
              <img src={elementValue?.valueKey} />
            </div>
          </div>
      }
    </div>
  );
}