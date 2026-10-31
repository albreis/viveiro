import { forecast } from './simulation.js';
self.onmessage = ({data}) => {
  try { self.postMessage({id:data.id, result:forecast(data.snapshot,data.runs,data.days)}); }
  catch(error) { self.postMessage({id:data.id,error:error.message}); }
};
