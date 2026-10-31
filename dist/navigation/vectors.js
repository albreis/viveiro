export const add = (a,b) => ({x:a.x+b.x,y:a.y+b.y,z:a.z+b.z});
export const sub = (a,b) => ({x:a.x-b.x,y:a.y-b.y,z:a.z-b.z});
export const scale = (a,k) => ({x:a.x*k,y:a.y*k,z:a.z*k});
export const dot = (a,b) => a.x*b.x+a.y*b.y+a.z*b.z;
export const length = a => Math.hypot(a.x,a.y,a.z);
export const normalize = a => scale(a,1/(length(a)||1));
export const cross = (a,b) => ({
  x:a.y*b.z-a.z*b.y,
  y:a.z*b.x-a.x*b.z,
  z:a.x*b.y-a.y*b.x
});
export const position = a => ({x:a.x,y:a.y||0,z:a.z});
export function limit(vector,max){
  const size=length(vector);
  return size>max?scale(vector,max/size):vector;
}
export function rotate(vector,axis,angle){
  const c=Math.cos(angle),s=Math.sin(angle);
  return add(add(scale(vector,c),scale(cross(axis,vector),s)),
    scale(axis,dot(axis,vector)*(1-c)));
}
