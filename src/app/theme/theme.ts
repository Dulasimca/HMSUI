export interface Theme {
  name: string;
  properties: any;
}

export const light_y: Theme = {
  name: "yellow",
  properties: {
    "--foreground-default": "#08090A",
    "--foreground-secondary": "#41474D",
    "--foreground-tertiary": "#797C80",
    "--foreground-quaternary": "#F4FAFF",
    "--foreground-light": "#41474D",

    "--background-default": "#FFC90E",

    "--comment-text-color": "#ffb102",

    "--border-default": "1px solid #f7e81b",

    "--panel-background": "#f5d049",

    "--button-background": "#fcd23d",
    "--button-border": "1px solid #f1c629",

    "--border-color-default": "#f8d248",

    "--primary-default": "#5DFDCB",
    "--primary-dark": "#24B286",
    "--primary-light": "#B2FFE7",

    "--error-default": "#EF3E36",
    "--error-dark": "#800600",
    "--error-light": "#FFCECC",

    "--background-tertiary-shadow": "0 1px 3px 0 rgba(92, 125, 153, 0.5)"
  }
};

export const dark_g: Theme = {
  name: "green",
  properties: {
    "--foreground-default": "#5C7D99",
    "--foreground-secondary": "#A3B9CC",
    "--foreground-tertiary": "#F4FAFF",
    "--foreground-quaternary": "#E5E5E5",
    "--foreground-light": "#FFFFFF",

    "--background-default": "#157110",

    "--comment-text-color": "#157110",

    "--border-default": "1px solid #7ED626;",

    "--panel-background": "#9dca71",

    "--border-color-default": "#a4d27d",

    "--button-background": "#4CAF50",
    "--button-border": "1px solid #4CAF50",

    "--primary-default": "#5DFDCB",
    "--primary-dark": "#24B286",
    "--primary-light": "#B2FFE7",

    "--error-default": "#EF3E36",
    "--error-dark": "#800600",
    "--error-light": "#FFCECC",

    "--background-tertiary-shadow": "0 1px 3px 0 rgba(8, 9, 10, 0.5)"
  }
};

export const dark_b: Theme = {
  name: "blue",
  properties: {
    "--foreground-default": "#5C7D99",
    "--foreground-secondary": "#A3B9CC",
    "--foreground-tertiary": "#F4FAFF",
    "--foreground-quaternary": "#E5E5E5",
    "--foreground-light": "#FFFFFF",

    "--background-default": "#1271cb",

    "--comment-text-color": "#1271cb",

    "--button-background": "#2b8fec",
    "--button-border": "1px solid #1f78ca",

    "--border-color-default": "#60affa",


    "--border-default": "1px solid #2d91ee;",

    "--panel-background": "#49a5fc",

    "--primary-default": "#5DFDCB",
    "--primary-dark": "#24B286",
    "--primary-light": "#B2FFE7",

    "--error-default": "#EF3E36",
    "--error-dark": "#800600",
    "--error-light": "#FFCECC",

    "--background-tertiary-shadow": "0 1px 3px 0 rgba(8, 9, 10, 0.5)"
  }
};

export const light_r: Theme = {
  name: "red",
  properties: {
    "--foreground-default": "#5C7D99",
    "--foreground-secondary": "#A3B9CC",
    "--foreground-tertiary": "#F4FAFF",
    "--foreground-quaternary": "#E5E5E5",
    "--foreground-light": "#FFFFFF",

    "--background-default": "#E05C0A",

    "--comment-text-color": "#f77403",

    "--border-color-default": "#fa9455",

    "--border-default": "1px solid #ec7830",

    "--panel-background": "#f88e4c",

    "--button-background": "#ee772d",
    "--button-border": "1px solid #f17528",

    "--primary-default": "#5DFDCB",
    "--primary-dark": "#24B286",
    "--primary-light": "#B2FFE7",

    "--error-default": "#EF3E36",
    "--error-dark": "#800600",
    "--error-light": "#FFCECC",

    "--background-tertiary-shadow": "0 1px 3px 0 rgba(8, 9, 10, 0.5)"
  }
};