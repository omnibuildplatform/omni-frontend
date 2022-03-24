export interface AnyObj {
  [index: string]: any;
}

export interface BoolObj {
  [index: string]: boolean;
}

export interface StringObj {
  [index: string]: string;
}

export interface CommonOptionsItem {
  key: string;
  label?: string;
  selected?: boolean;
}
