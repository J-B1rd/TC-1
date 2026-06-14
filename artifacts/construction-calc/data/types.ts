export type InputType = "number" | "select";
export type Difficulty = "basic" | "intermediate" | "advanced";

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
  max?: number;
  step?: number;
  integer?: boolean;
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
  category?: string;
  difficulty?: Difficulty;
  formula?: string;
  calculationSteps?: string[];
  warnings?: string[];
  references?: string[];
  tips?: string[];
  inputs: CalculatorInput[];
  calculate: (inputs: Record<string, string>) => CalculatorResult[];
  computeSteps?: (inputs: Record<string, string>) => string[];
};

export type Trade = {
  id: string;
  name: string;
  color: string;
  icon: string;
  calculators: Calculator[];
};
