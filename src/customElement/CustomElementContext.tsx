import React, { useContext, useEffect, useLayoutEffect, useMemo } from "react";
import { ReactNode, useState } from "react";
import { Config, isConfig } from "./config";
import { Value, parseValue } from "./value";

// hooks are only ever used in the react tree so this is fine
/* eslint-disable react-refresh/only-export-components */
export const useConfig = () => useContext(Context).config;

export const useValue = () => [useContext(Context).value, useContext(Context).setValue] as const;

export const useIsDisabled = () => useContext(Context).isDisabled;

export const useEnvironmentId = () => useContext(Context).environmentId;

export const useItemInfo = () => useContext(Context).item;

export const useVariantInfo = () => useContext(Context).variant;

export const useUserSelections = () => [useContext(Context).userSelections, useContext(Context).setUserSelections] as const;
/* eslint-enable react-refresh/only-export-components */

export type Dataset = {
  data?: Array<string>,
  dataProps?: {
    dataLabel?: string,
    dataColor?: Array<string>
  }
}

export type UserSelections = {
  type?: string,
  dataLabelsNum?: number | string,
  datasetsNum?: number | string,
  dataLabels?: Array<string>,
  datasets?: Array<Dataset>,
  chartTitle?: string,
  xAxisTitle?: string,
  yAxisTitle?: string,
  yAxisIncrement?: number | string
} | null;

// export type ChartSelections = {
//   bar?: UserSelections,
//   line?: UserSelections,
//   pie?: UserSelections
// }

type CustomElementContext = Readonly<{
  config: Config;
  value: Value | null;
  setValue: (newValue: Value) => void;
  isDisabled: boolean;
  environmentId: string;
  item: ItemInfo;
  variant: Readonly<{
    id: string;
    codename: string;
  }>;
  userSelections: UserSelections | null;
  setUserSelections: (newSelections: UserSelections) => void;
}>;

type ItemInfo = Readonly<{
  id: string;
}> & ItemChangedDetails;

type CustomElementContextProps = Readonly<{
  height?: number | "default" | "dynamic";
  children: ReactNode;
}>;

export const CustomElementContext = (props: CustomElementContextProps) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [value, setValue] = useState<Value | null | typeof specialMissingValue>(specialMissingValue);
  const [config, setConfig] = useState<Config | typeof specialMissingValue>(specialMissingValue);
  const [error, setError] = useState<string | null>(null);
  const [environmentId, setEnvironmentId] = useState<string | null>(null);
  const [item, setItem] = useState<ItemInfo | null>(null);
  const [variant, setVariant] = useState<Readonly<{ id: string; codename: string }> | null>(null);
  const [userSelections, setUserSelections] = useState<UserSelections | null>(null);

  const context = useMemo(() => {
    if (config === specialMissingValue || value === specialMissingValue || !environmentId || !item || !variant) {
      return null;
    }
    return {
      config,
      value,
      setValue: (newValue: Value | null) => {
        const serializedValue = newValue === null ? null : JSON.stringify(newValue);
        CustomElement.setValue(serializedValue);
        setValue(newValue);
      },
      isDisabled,
      environmentId,
      item,
      variant,
      userSelections,
      setUserSelections: (newSelections: UserSelections | null) => {
        // CustomElement.setUserSelections(newSelections);
        setUserSelections(newSelections);
      }
    };
  }, [config, value, isDisabled, environmentId, item, variant, userSelections]);

  useEffect(() => {
    CustomElement.init((element, context) => {
      if (!isConfig(element.config)) {
        setError("The element's config is not valid!");
        return;
      }
      const parsedValue = parseValue(element.value);
      if (parsedValue === "invalidValue") {
        console.warn(`Custom element received invalid value "${element.value}". Treating it as a missing value.`);
      }

      setValue(parsedValue === "invalidValue" ? null : parsedValue);
      if (parsedValue !== 'invalidValue') setUserSelections(parsedValue?.userSelections !== undefined ? JSON.parse(parsedValue.userSelections) : null);
      setConfig(element.config as Config);
      setIsDisabled(element.disabled);
      setEnvironmentId(context.projectId);
      setItem(context.item);
      setVariant(context.variant);
    });
  }, []);

  useEffect(() => {
    CustomElement.observeItemChanges(i => setItem(prev => prev && ({ ...prev, ...i })));
  }, []);

  useEffect(() => {
    CustomElement.onDisabledChanged(setIsDisabled);
  }, []);

  useDynamicHeight(props.height === "dynamic", value);

  useEffect(() => {
    if (typeof props.height === "number") {
      CustomElement.setHeight(props.height);
    }
  }, [props.height]);

  if (error) {
    return <h1 style={{ color: "red" }}>{error}</h1>;
  }

  if (!context) {
    return <h1>Loading...</h1>;
  }

  return (
    <Context.Provider value={context}>
      {props.children}
    </Context.Provider>
  )
};

const Context = React.createContext<CustomElementContext>({
  value: null,
  variant: { id: "", codename: "" },
  item: {
    id: "",
    codename: "",
    name: "",
    collection: { id: "" },
  },
  environmentId: "",
  config: {} as Config,
  isDisabled: true,
  setValue: () => { },
  userSelections: {
    type: '',
    dataLabelsNum: '',
    datasetsNum: '',
    dataLabels: [],
    datasets: [{
      data: [],
      dataProps: {
        dataLabel: '',
        dataColor: []
      }
    }],
    chartTitle: '',
    xAxisTitle: '',
    yAxisTitle: '',
    yAxisIncrement: '',
  },
  setUserSelections: () => {}
});

const useDynamicHeight = (isEnabled: boolean, value: Value | null | typeof specialMissingValue) => {
  useLayoutEffect(() => {
    if (!isEnabled) {
      return;
    }
    const newSize = Math.max(document.documentElement.offsetHeight, 100);

    CustomElement.setHeight(Math.ceil(newSize));
  }, [value, isEnabled]); // recalculate the size when value changes
};

const specialMissingValue = "This value is special and indicates that a value is missing. This allows having undefined and null as valid values." as const;
