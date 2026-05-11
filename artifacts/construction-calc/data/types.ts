export type InputType = "number" | "select";

export type SelectOption = {
  label: string;
  value: string;
};

export type CalculatorInput = {
  id: string;
  label: string;
  unit: string;
  type: InputType;
  options?: SelectOption[];
  defaultValue?: string;
  hint?: string;
  min?: number;
  step?: number;
};

export type CalculatorResult = {
  label: string;
  value: number;
  unit: string;
  highlight?: boolean;
};

export type Calculator = {
  id: string;
  name: string;
  description: string;
  inputs: CalculatorInput[];
  calculate: (inputs: Record<string, string>) => CalculatorResult[];
};

export type Trade = {
  id: string;
  name: string;
  color: string;
  icon: string;
  calculators: Calculator[];
};
