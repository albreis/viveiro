import * as THREE from 'three';
export function createSoilGeometry(nest){
  const nx=96,ny=28,nz=64,sx=20/nx,sy=4.2/ny,sz=13/nz;
  const index=(x,y,z)=>(y*nz+z)*nx+x;
  const solid=new Uint8Array(nx*ny*nz);
  const segmentDistance=(x,y,z,a,b)=>{
    const dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z;
    const t=Math.max(0,Math.min(1,((x-a.x)*dx+(y-a.y)*dy+(z-a.z)*dz)/(dx*dx+dy*dy+dz*dz||1)));
    return Math.hypot(x-a.x-t*dx,y-a.y-t*dy,z-a.z-t*dz);
  };
  const isVoid=(x,y,z)=>{
    for(const p of nest.nodes)if(Math.hypot(x-p.x,y-p.y,z-p.z)<p.r)return true;
    for(const [a,b] of nest.links)if(segmentDistance(x,y,z,nest.nodes[a],nest.nodes[b])<.27)return true;
    return false;
  };
  for(let y=0;y<ny;y++)for(let z=0;z<nz;z++)for(let x=0;x<nx;x++)
    solid[index(x,y,z)]=isVoid(-10+(x+.5)*sx,-4.2+(y+.5)*sy,-6.5+(z+.5)*sz)?0:1;
  const positions=[],normals=[],uvs=[],colors=[],groups=[];
  const faces=[
    {d:[1,0,0],v:[[1,0,0],[1,1,0],[1,1,1],[1,0,1]]},
    {d:[-1,0,0],v:[[0,0,1],[0,1,1],[0,1,0],[0,0,0]]},
    {d:[0,1,0],v:[[0,1,1],[1,1,1],[1,1,0],[0,1,0]]},
    {d:[0,-1,0],v:[[0,0,0],[1,0,0],[1,0,1],[0,0,1]]},
    {d:[0,0,1],v:[[1,0,1],[1,1,1],[0,1,1],[0,0,1]]},
    {d:[0,0,-1],v:[[0,0,0],[0,1,0],[1,1,0],[1,0,0]]}
  ];
  const soil=new THREE.Color(),top=new THREE.Color('#a4ad77');
  for(let y=0;y<ny;y++)for(let z=0;z<nz;z++)for(let x=0;x<nx;x++){
    if(!solid[index(x,y,z)])continue;
    for(const face of faces){
      const [dx,dy,dz]=face.d,ax=x+dx,ay=y+dy,az=z+dz;
      if(ax>=0&&ax<nx&&ay>=0&&ay<ny&&az>=0&&az<nz&&solid[index(ax,ay,az)])continue;
      const start=positions.length/3,isTop=dy===1&&y===ny-1;
      for(const k of [0,1,2,0,2,3]){
        const v=face.v[k],px=-10+(x+v[0])*sx,py=-4.2+(y+v[1])*sy,pz=-6.5+(z+v[2])*sz;
        positions.push(px,py,pz);normals.push(dx,dy,dz);uvs.push(px/10,dy?pz/6.5:py/4.2);
        const shade=.87+Math.sin(y*1.65+x*.035)*.1+Math.sin(x*13+z*7)*.025;
        soil.set(isTop?top:'#987554').multiplyScalar(isTop?1:shade);
        colors.push(soil.r,soil.g,soil.b);
      }
      groups.push([start,6,isTop?1:0]);
    }
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geo.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));
  geo.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
  // Two contiguous material groups avoid thousands of draw calls.
  const order=[0,1].flatMap(mat=>groups.filter(g=>g[2]===mat).flatMap(g=>Array.from({length:6},(_,i)=>g[0]+i)));
  geo.setIndex(order);
  const sideCount=groups.filter(g=>!g[2]).length*6;geo.addGroup(0,sideCount,0);geo.addGroup(sideCount,order.length-sideCount,1);
  geo.computeBoundingSphere();return geo;
}
