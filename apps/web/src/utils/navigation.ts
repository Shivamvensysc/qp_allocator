import type  { NavigateFunction } from "react-router-dom";

let navigateFunction: NavigateFunction | null = null;
//  Register navigate function globally
export const setNavigator = (
  navigate: NavigateFunction
) => {
  navigateFunction = navigate;
};


//  Navigate without page refresh
export const navigateTo = (path: string) => {
  if (navigateFunction) {
    navigateFunction(path);
  }
};