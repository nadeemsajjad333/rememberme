import React, {createRef} from 'react';
const navigationRef = createRef();
const navigate = name => {
  navigationRef.current?.navigate(name);
};
const push = name => {
  navigationRef.current?.push(name);
};
const navigateto = (name,params) => {
  navigationRef.current?.navigate(name,params);
};
export {push, navigate,navigateto, navigationRef};
