(function(){var e=Object.create,t=Object.defineProperty,n=Object.getOwnPropertyDescriptor,r=Object.getOwnPropertyNames,i=Object.getPrototypeOf,a=Object.prototype.hasOwnProperty,o=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t,t.exports),e=null),t.exports),s=(e,i,o,s)=>{if(i&&typeof i==`object`||typeof i==`function`)for(var c=r(i),l=0,u=c.length,d;l<u;l++)d=c[l],!a.call(e,d)&&d!==o&&t(e,d,{get:(e=>i[e]).bind(null,d),enumerable:!(s=n(i,d))||s.enumerable});return e},c=(n,r,o)=>(o=n==null?{}:e(i(n)),s(r||!n||!n.__esModule||!a.call(n,`default`)?t(o,`default`,{value:n,enumerable:!0}):o,n));let l={exp:Math.exp,expm1:Math.expm1,sin:Math.sin,cos:Math.cos,tan:Math.tan,tanh:Math.tanh,atan:Math.atan,atan2:Math.atan2,log:Math.log,log1p:Math.log1p,cbrt:Math.cbrt,pow:Math.pow,hypot:Math.hypot},u=l,d=`ecmascript-native-f64-v1`,f=()=>d,p=Object.freeze({exp:e=>u.exp(e),expm1:e=>u.expm1(e),sin:e=>u.sin(e),cos:e=>u.cos(e),tan:e=>u.tan(e),tanh:e=>u.tanh(e),atan:e=>u.atan(e),log:e=>u.log(e),log1p:e=>u.log1p(e),cbrt:e=>u.cbrt(e),atan2:(e,t)=>u.atan2(e,t),pow:(e,t)=>u.pow(e,t),hypot:(...e)=>u.hypot(...e)});function m(e){if(d!==`stdlib-f64-v1`){if(Object.keys(l).some(t=>typeof e[t]!=`function`))throw Error(`Backend numérico incompleto.`);u=Object.freeze({...e}),d=`stdlib-f64-v1`}}
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var h=/* @__PURE__ */ o(((e,t)=>{function n(e){return e!==e}t.exports=n})),g=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=h()})),_=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=Math.floor})),v=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=_()})),y=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=Math.ceil})),b=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=y()})),x=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=v(),r=b();function i(e){return e<0?r(e):n(e)}t.exports=i})),S=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=x()})),C=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=Number})),w=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=C()})),T=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=w().NEGATIVE_INFINITY})),E=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=1/0})),D=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=1023})),O=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=1023})),ee=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=-1023})),te=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=-1074})),k=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=E(),r=T();function i(e){return e===n||e===r}t.exports=i})),A=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=k()})),j=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=2147483648})),M=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=2147483647})),N=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2021 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=typeof Object.defineProperty==`function`?Object.defineProperty:null})),ne=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2021 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=N();function r(){try{return n({},`x`,{}),!0}catch{return!1}}t.exports=r})),re=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=Object.defineProperty})),ie=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function n(e){return typeof e==`number`}t.exports=n})),ae=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function n(e){return e[0]===`-`}function r(e){for(var t=``,n=0;n<e;n++)t+=`0`;return t}function i(e,t,i){var a=!1,o=t-e.length;return o<0||(n(e)&&(a=!0,e=e.substr(1)),e=i?e+r(o):r(o)+e,a&&(e=`-`+e)),e}t.exports=i})),oe=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=ie(),r=ae(),i=String.prototype.toLowerCase,a=String.prototype.toUpperCase;function o(e){var t,o,s;switch(e.specifier){case`b`:t=2;break;case`o`:t=8;break;case`x`:case`X`:t=16;break;default:t=10}if(o=e.arg,s=parseInt(o,10),!isFinite(s)){if(!n(o))throw Error(`invalid integer. Value: `+o);s=0}return s<0&&(e.specifier===`u`||t!==10)&&(s=4294967295+s+1),s<0?(o=(-s).toString(t),e.precision&&(o=r(o,e.precision,e.padRight)),o=`-`+o):(o=s.toString(t),!s&&!e.precision?o=``:e.precision&&(o=r(o,e.precision,e.padRight)),e.sign&&(o=e.sign+o)),t===16&&(e.alternate&&(o=`0x`+o),o=e.specifier===a.call(e.specifier)?a.call(o):i.call(o)),t===8&&e.alternate&&o.charAt(0)!==`0`&&(o=`0`+o),o}t.exports=o})),se=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function n(e){return typeof e==`string`}t.exports=n})),ce=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=Math.abs,r=String.prototype.toLowerCase,i=String.prototype.toUpperCase,a=String.prototype.replace,o=/e\+(\d)$/,s=/e-(\d)$/,c=/^(\d+)$/,l=/^(\d+)e/,u=/\.0$/,d=/\.0*e/,f=/(\..*[^0])0*e/;function p(e,t){var p,m;switch(t.specifier){case`e`:case`E`:m=e.toExponential(t.precision);break;case`f`:case`F`:m=e.toFixed(t.precision);break;case`g`:case`G`:n(e)<1e-4?(p=t.precision,p>0&&--p,m=e.toExponential(p)):m=e.toPrecision(t.precision),t.alternate||(m=a.call(m,f,`$1e`),m=a.call(m,d,`e`),m=a.call(m,u,``));break;default:throw Error(`invalid double notation. Value: `+t.specifier)}return m=a.call(m,o,`e+0$1`),m=a.call(m,s,`e-0$1`),t.alternate&&(m=a.call(m,c,`$1.`),m=a.call(m,l,`$1.e`)),e>=0&&t.sign&&(m=t.sign+m),m=t.specifier===i.call(t.specifier)?i.call(m):r.call(m),m}t.exports=p})),le=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function n(e){for(var t=``,n=0;n<e;n++)t+=` `;return t}function r(e,t,r){var i=t-e.length;return i<0||(e=r?e+n(i):n(i)+e),e}t.exports=r})),ue=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=oe(),r=se(),i=ie(),a=ce(),o=le(),s=ae(),c=String.fromCharCode,l=Array.isArray;function u(e){return e!==e}function d(e){var t={};return t.specifier=e.specifier,t.precision=e.precision===void 0?1:e.precision,t.width=e.width,t.flags=e.flags||``,t.mapping=e.mapping,t}function f(e){var t,f,p,m,h,g,_,v,y,b;if(!l(e))throw TypeError("invalid argument. First argument must be an array. Value: `"+e+"`.");for(g=``,_=1,y=0;y<e.length;y++)if(p=e[y],r(p))g+=p;else{if(t=p.precision!==void 0,p=d(p),!p.specifier)throw TypeError("invalid argument. Token is missing `specifier` property. Index: `"+y+"`. Value: `"+p+"`.");for(p.mapping&&(_=p.mapping),f=p.flags,b=0;b<f.length;b++)switch(m=f.charAt(b),m){case` `:p.sign=` `;break;case`+`:p.sign=`+`;break;case`-`:p.padRight=!0,p.padZeros=!1;break;case`0`:p.padZeros=f.indexOf(`-`)<0;break;case`#`:p.alternate=!0;break;default:throw Error(`invalid flag: `+m)}if(p.width===`*`){if(p.width=parseInt(arguments[_],10),_+=1,u(p.width))throw TypeError(`the argument for * width at position `+_+" is not a number. Value: `"+p.width+"`.");p.width<0&&(p.padRight=!0,p.width=-p.width)}if(t&&p.precision===`*`){if(p.precision=parseInt(arguments[_],10),_+=1,u(p.precision))throw TypeError(`the argument for * precision at position `+_+" is not a number. Value: `"+p.precision+"`.");p.precision<0&&(p.precision=1,t=!1)}switch(p.arg=arguments[_],p.specifier){case`b`:case`o`:case`x`:case`X`:case`d`:case`i`:case`u`:t&&(p.padZeros=!1),p.arg=n(p);break;case`s`:p.maxWidth=t?p.precision:-1,p.arg=String(p.arg);break;case`c`:if(!u(p.arg)){if(h=parseInt(p.arg,10),h<0||h>127)throw Error(`invalid character code. Value: `+p.arg);p.arg=u(h)?String(p.arg):c(h)}break;case`e`:case`E`:case`f`:case`F`:case`g`:case`G`:if(t||(p.precision=6),v=parseFloat(p.arg),!isFinite(v)){if(!i(p.arg))throw Error(`invalid floating-point number. Value: `+g);v=p.arg,p.padZeros=!1}p.arg=a(v,p);break;default:throw Error(`invalid specifier: `+p.specifier)}p.maxWidth>=0&&p.arg.length>p.maxWidth&&(p.arg=p.arg.substring(0,p.maxWidth)),p.padZeros?p.arg=s(p.arg,p.width||p.precision,p.padRight):p.width&&(p.arg=o(p.arg,p.width,p.padRight)),g+=p.arg||``,_+=1}return g}t.exports=f})),de=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=ue()})),fe=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=/%(?:([1-9]\d*)\$)?([0 +\-#]*)(\*|\d+)?(?:(\.)(\*|\d+)?)?[hlL]?([%A-Za-z])/g;function r(e){var t={mapping:e[1]?parseInt(e[1],10):void 0,flags:e[2],width:e[3],precision:e[5],specifier:e[6]};return e[4]===`.`&&e[5]===void 0&&(t.precision=`1`),t}function i(e){var t,i=[],a,o=0;for(a=n.exec(e);a;)t=e.slice(o,n.lastIndex-a[0].length),t.length&&i.push(t),a[6]===`%`?i.push(`%`):i.push(r(a)),o=n.lastIndex,a=n.exec(e);return t=e.slice(o),t.length&&i.push(t),i}t.exports=i})),pe=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=fe()})),me=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function n(e){return typeof e==`string`}t.exports=n})),he=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=de(),r=pe(),i=me();function a(e){var t,o;if(!i(e))throw TypeError(a("invalid argument. First argument must be a string. Value: `%s`.",e));for(t=[r(e)],o=1;o<arguments.length;o++)t.push(arguments[o]);return n.apply(null,t)}t.exports=a})),ge=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=he()})),_e=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=ge(),r=Object.prototype,i=r.toString,a=r.__defineGetter__,o=r.__defineSetter__,s=r.__lookupGetter__,c=r.__lookupSetter__;function l(e,t,l){var u,d,f,p;if(typeof e!=`object`||!e||i.call(e)===`[object Array]`)throw TypeError(n("invalid argument. First argument must be an object. Value: `%s`.",e));if(typeof l!=`object`||!l||i.call(l)===`[object Array]`)throw TypeError(n("invalid argument. Property descriptor must be an object. Value: `%s`.",l));if(d=`value`in l,d&&(s.call(e,t)||c.call(e,t)?(u=e.__proto__,e.__proto__=r,delete e[t],e[t]=l.value,e.__proto__=u):e[t]=l.value),f=`get`in l,p=`set`in l,d&&(f||p))throw Error(`invalid argument. Cannot specify one or more accessors and a value or writable attribute in the property descriptor.`);return f&&a&&a.call(e,t,l.get),p&&o&&o.call(e,t,l.set),e}t.exports=l})),ve=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=ne(),r=re(),i=_e();t.exports=n()?r:i})),ye=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=ve();function r(e,t,r){n(e,t,{configurable:!1,enumerable:!1,writable:!1,value:r})}t.exports=r})),be=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=ye()})),xe=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function n(){return typeof Symbol==`function`&&typeof Symbol(`foo`)==`symbol`}t.exports=n})),Se=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=xe()})),Ce=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=Se()();function r(){return n&&typeof Symbol.toStringTag==`symbol`}t.exports=r})),we=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=Ce()})),Te=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=Object.prototype.toString})),Ee=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=Te();function r(e){return n.call(e)}t.exports=r})),De=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=Object.prototype.hasOwnProperty;function r(e,t){return e!=null&&n.call(e,t)}t.exports=r})),Oe=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=De()})),ke=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=typeof Symbol==`function`?Symbol:void 0})),Ae=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=ke()})),je=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=Ae();t.exports=typeof n==`function`?n.toStringTag:``})),Me=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=Oe(),r=je(),i=Te();function a(e){var t,a,o;if(e==null)return i.call(e);a=e[r],t=n(e,r);try{e[r]=void 0}catch{return i.call(e)}return o=i.call(e),t?e[r]=a:delete e[r],o}t.exports=a})),Ne=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=we(),r=Ee(),i=Me();t.exports=n()?i:r})),Pe=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=Ne(),r=typeof Uint32Array==`function`;function i(e){return r&&e instanceof Uint32Array||n(e)===`[object Uint32Array]`}t.exports=i})),Fe=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=Pe()})),Ie=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=4294967295})),Le=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=typeof Uint32Array==`function`?Uint32Array:null})),Re=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=Fe(),r=Ie(),i=Le();function a(){var e,t;if(typeof i!=`function`)return!1;try{t=[1,3.14,-3.14,r+1,r+2],t=new i(t),e=n(t)&&t[0]===1&&t[1]===3&&t[2]===r-2&&t[3]===0&&t[4]===1}catch{e=!1}return e}t.exports=a})),ze=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=Re()})),Be=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=typeof Uint32Array==`function`?Uint32Array:void 0})),Ve=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function n(){throw Error(`not implemented`)}t.exports=n})),He=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=ze(),r=Be(),i=Ve();t.exports=n()?r:i})),Ue=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=Ne(),r=typeof Float64Array==`function`;function i(e){return r&&e instanceof Float64Array||n(e)===`[object Float64Array]`}t.exports=i})),We=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=Ue()})),Ge=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=typeof Float64Array==`function`?Float64Array:null})),Ke=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=We(),r=Ge();function i(){var e,t;if(typeof r!=`function`)return!1;try{t=new r([1,3.14,-3.14,NaN]),e=n(t)&&t[0]===1&&t[1]===3.14&&t[2]===-3.14&&t[3]!==t[3]}catch{e=!1}return e}t.exports=i})),qe=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=Ke()})),Je=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=typeof Float64Array==`function`?Float64Array:void 0})),Ye=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function n(){throw Error(`not implemented`)}t.exports=n})),Xe=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=qe(),r=Je(),i=Ye();t.exports=n()?r:i})),Ze=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=Ne(),r=typeof Uint8Array==`function`;function i(e){return r&&e instanceof Uint8Array||n(e)===`[object Uint8Array]`}t.exports=i})),Qe=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=Ze()})),$e=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=255})),et=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=typeof Uint8Array==`function`?Uint8Array:null})),tt=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=Qe(),r=$e(),i=et();function a(){var e,t;if(typeof i!=`function`)return!1;try{t=[1,3.14,-3.14,r+1,r+2],t=new i(t),e=n(t)&&t[0]===1&&t[1]===3&&t[2]===r-2&&t[3]===0&&t[4]===1}catch{e=!1}return e}t.exports=a})),nt=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=tt()})),rt=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=typeof Uint8Array==`function`?Uint8Array:void 0})),it=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function n(){throw Error(`not implemented`)}t.exports=n})),at=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=nt(),r=rt(),i=it();t.exports=n()?r:i})),ot=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=Ne(),r=typeof Uint16Array==`function`;function i(e){return r&&e instanceof Uint16Array||n(e)===`[object Uint16Array]`}t.exports=i})),st=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=ot()})),ct=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=65535})),lt=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=typeof Uint16Array==`function`?Uint16Array:null})),ut=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=st(),r=ct(),i=lt();function a(){var e,t;if(typeof i!=`function`)return!1;try{t=[1,3.14,-3.14,r+1,r+2],t=new i(t),e=n(t)&&t[0]===1&&t[1]===3&&t[2]===r-2&&t[3]===0&&t[4]===1}catch{e=!1}return e}t.exports=a})),dt=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=ut()})),ft=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=typeof Uint16Array==`function`?Uint16Array:void 0})),pt=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function n(){throw Error(`not implemented`)}t.exports=n})),mt=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=dt(),r=ft(),i=pt();t.exports=n()?r:i})),ht=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=at();t.exports={uint16:mt(),uint8:n}})),gt=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=ht(),r;function i(){var e=new n.uint16(1),t;return e[0]=4660,t=new n.uint8(e.buffer),t[0]===52}r=i(),t.exports=r})),_t=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=gt()})),vt=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=_t(),r,i,a;n===!0?(i=1,a=0):(i=0,a=1),r={HIGH:i,LOW:a},t.exports=r})),yt=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=He(),r=Xe(),i=vt(),a=new r(1),o=new n(a.buffer),s=i.HIGH,c=i.LOW;function l(e,t,n,r){return a[0]=e,t[r]=o[s],t[r+n]=o[c],t}t.exports=l})),bt=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=yt();function r(e){return n(e,[0,0],1,0)}t.exports=r})),xt=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=be(),r=bt();n(r,`assign`,yt()),t.exports=r})),St=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=+(_t()===!0)})),Ct=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=He(),r=Xe(),i=St(),a=new r(1),o=new n(a.buffer);function s(e){return a[0]=e,o[i]}t.exports=s})),P=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=Ct()})),wt=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=_t(),r,i,a;n===!0?(i=1,a=0):(i=0,a=1),r={HIGH:i,LOW:a},t.exports=r})),Tt=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=He(),r=Xe(),i=wt(),a=new r(1),o=new n(a.buffer),s=i.HIGH,c=i.LOW;function l(e,t){return o[s]=e,o[c]=t,a[0]}t.exports=l})),Et=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=Tt()})),Dt=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=j(),r=M(),i=xt(),a=P(),o=Et(),s=[0,0];function c(e,t){var c,l;return i.assign(e,s,1,0),c=s[0],c&=r,l=a(t),l&=n,c|=l,o(c,s[1])}t.exports=c})),Ot=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=Dt()})),kt=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=22250738585072014e-324})),At=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2021 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function n(e){return Math.abs(e)}t.exports=n})),jt=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=At()})),Mt=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=kt(),r=A(),i=g(),a=jt(),o=4503599627370496;function s(e,t,s,c){return i(e)||r(e)?(t[c]=e,t[c+s]=0,t):e!==0&&a(e)<n?(t[c]=e*o,t[c+s]=-52,t):(t[c]=e,t[c+s]=0,t)}t.exports=s})),Nt=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=Mt();function r(e){return n(e,[0,0],1,0)}t.exports=r})),Pt=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=be(),r=Nt();n(r,`assign`,Mt()),t.exports=r})),Ft=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=2146435072})),It=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=P(),r=Ft(),i=D();function a(e){var t=n(e);return t=(t&r)>>>20,t-i|0}t.exports=a})),Lt=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=It()})),Rt=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=E(),r=T(),i=D(),a=O(),o=ee(),s=te(),c=g(),l=A(),u=Ot(),d=Pt().assign,f=Lt(),p=xt(),m=Et(),h=2220446049250313e-31,_=2148532223,v=[0,0],y=[0,0];function b(e,t){var g,b;return t===0||e===0||c(e)||l(e)?e:(d(e,v,1,0),e=v[0],t+=v[1],t+=f(e),t<s?u(0,e):t>a?e<0?r:n:(t<=o?(t+=52,b=h):b=1,p.assign(e,y,1,0),g=y[0],g&=_,g|=t+i<<20,b*m(g,y[1])))}t.exports=b})),zt=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=Rt()})),Bt=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function n(e){return e===0?.16666666666666602:.16666666666666602+e*(-.0027777777777015593+e*(6613756321437934e-20+e*(-16533902205465252e-22+e*4.1381367970572385e-8)))}t.exports=n})),Vt=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
*
* ## Notice
*
* The following copyrights, licenses, and long comment were part of the original implementation available as part of [Go]{@link https://github.com/golang/go/blob/cb07765045aed5104a3df31507564ac99e6ddce8/src/math/exp.go}, which in turn was based on an implementation available as part of [FreeBSD]{@link https://svnweb.freebsd.org/base/release/9.3.0/lib/msun/src/e_exp.c}. The implementation follows the original, but has been modified for JavaScript.
*
* ```text
* Copyright (c) 2009 The Go Authors. All rights reserved.
*
* Redistribution and use in source and binary forms, with or without
* modification, are permitted provided that the following conditions are
* met:
*
*    * Redistributions of source code must retain the above copyright
* notice, this list of conditions and the following disclaimer.
*    * Redistributions in binary form must reproduce the above
* copyright notice, this list of conditions and the following disclaimer
* in the documentation and/or other materials provided with the
* distribution.
*    * Neither the name of Google Inc. nor the names of its
* contributors may be used to endorse or promote products derived from
* this software without specific prior written permission.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
* "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
* LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
* A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
* OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
* SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
* LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
* DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
* THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
* (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
* OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
* ```
*
* ```text
* Copyright (C) 2004 by Sun Microsystems, Inc. All rights reserved.
*
* Developed at SunPro, a Sun Microsystems, Inc. business.
* Permission to use, copy, modify, and distribute this
* software is freely granted, provided that this notice
* is preserved.
* ```
*/
var n=zt(),r=Bt();function i(e,t,i){var a=e-t,o=a*a,s=a-o*r(o);return n(1-(t-a*s/(2-s)-e),i)}t.exports=i})),Ht=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
*
* ## Notice
*
* The following copyrights, licenses, and long comment were part of the original implementation available as part of [Go]{@link https://github.com/golang/go/blob/cb07765045aed5104a3df31507564ac99e6ddce8/src/math/exp.go}, which in turn was based on an implementation available as part of [FreeBSD]{@link https://svnweb.freebsd.org/base/release/9.3.0/lib/msun/src/e_exp.c}. The implementation follows the original, but has been modified for JavaScript.
*
* ```text
* Copyright (c) 2009 The Go Authors. All rights reserved.
*
* Redistribution and use in source and binary forms, with or without
* modification, are permitted provided that the following conditions are
* met:
*
*    * Redistributions of source code must retain the above copyright
* notice, this list of conditions and the following disclaimer.
*    * Redistributions in binary form must reproduce the above
* copyright notice, this list of conditions and the following disclaimer
* in the documentation and/or other materials provided with the
* distribution.
*    * Neither the name of Google Inc. nor the names of its
* contributors may be used to endorse or promote products derived from
* this software without specific prior written permission.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
* "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
* LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
* A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
* OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
* SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
* LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
* DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
* THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
* (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
* OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
* ```
*
* ```text
* Copyright (C) 2004 by Sun Microsystems, Inc. All rights reserved.
*
* Developed at SunPro, a Sun Microsystems, Inc. business.
* Permission to use, copy, modify, and distribute this
* software is freely granted, provided that this notice
* is preserved.
* ```
*/
var n=g(),r=S(),i=T(),a=E(),o=Vt(),s=.6931471803691238,c=19082149292705877e-26,l=1.4426950408889634,u=709.782712893384,d=-745.1332191019411,f=1/(1<<28),p=-f;function m(e){var t,m,h;return n(e)||e===a?e:e===i?0:e>u?a:e<d?0:e>p&&e<f?1+e:(h=r(e<0?l*e-.5:l*e+.5),t=e-h*s,m=h*c,o(t,m,h))}t.exports=m})),Ut=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=Ht()})),Wt=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=+(_t()===!0)})),Gt=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=He(),r=Xe(),i=Wt(),a=new r(1),o=new n(a.buffer);function s(e,t){return a[0]=e,o[i]=t>>>0,a[0]}t.exports=s})),Kt=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=Gt()})),qt=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=.34657359027997264})),Jt=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function n(e){return e===0?-.03333333333333313:-.03333333333333313+e*(.0015873015872548146+e*(-793650757867488e-19+e*(4008217827329362e-21+e*-2.0109921818362437e-7)))}t.exports=n})),Yt=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
*
* ## Notice
*
* The following copyright, license, and long comment were part of the original implementation available as part of [FDLIBM]{@link http://www.netlib.org/fdlibm/s_expm1.c} and [FreeBSD]{@link https://svnweb.freebsd.org/base/release/12.2.0/lib/msun/src/s_expm1.c}. The implementation follows the original, but has been modified for JavaScript.
*
* ```text
* Copyright (C) 2004 by Sun Microsystems, Inc. All rights reserved.
*
* Developed at SunPro, a Sun Microsystems, Inc. business.
* Permission to use, copy, modify, and distribute this
* software is freely granted, provided that this notice
* is preserved.
* ```
*/
var n=g(),r=P(),i=Kt(),a=Et(),o=E(),s=T(),c=D(),l=qt(),u=Jt(),d=709.782712893384,f=.6931471803691238,p=19082149292705877e-26,m=1.4426950408889634,h=38.816242111356935,_=1.0397207708399179;function v(e){var t,g,v,y,b,x,S,C,w,T,E,D,O;if(e===o||n(e))return e;if(e===s)return-1;if(e===0)return e;if(e<0?(v=!0,C=-e):(v=!1,C=e),C>=h){if(v)return-1;if(C>=d)return o}if(x=r(C)|0,C>l)C<_?v?(y=e+f,b=-p,O=-1):(y=e-f,b=p,O=1):(O=v?m*e-.5:m*e+.5,O|=0,E=O,y=e-E*f,b=E*p),e=y-b,T=y-e-b;else if(x<1016070144)return e;else O=0;return t=.5*e,w=e*t,S=1+w*u(w),E=3-S*t,D=w*((S-E)/(6-e*E)),O===0?e-(e*D-w):(g=a(c+O<<20,0),D=e*(D-T)-T,D-=w,O===-1?.5*(e-D)-.5:O===1?e<-.25?-2*(D-(e+.5)):1+2*(e-D):O<=-2||O>56?(C=1-(D-e),O===1024?(y=r(C)+(O<<20)|0,C=i(C,y)):C*=g,C-1):(E=1,O<20?(y=1072693248-(2097152>>O)|0,E=i(E,y),C=E-(D-e)):(y=c-O<<20,E=i(E,y),C=e-(D+E),C+=1),C*=g,C))}t.exports=v})),Xt=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=Yt()})),Zt=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function n(e){return e===0?.0416666666666666:.0416666666666666+e*(-.001388888888887411+e*2480158728947673e-20)}t.exports=n})),Qt=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function n(e){return e===0?-2.7557314351390663e-7:-2.7557314351390663e-7+e*(2.087572321298175e-9+e*-11359647557788195e-27)}t.exports=n})),$t=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
*
* ## Notice
*
* The following copyright, license, and long comment were part of the original implementation available as part of [FreeBSD]{@link https://svnweb.freebsd.org/base/release/12.2.0/lib/msun/src/k_cos.c}. The implementation follows the original, but has been modified for JavaScript.
*
* ```text
* Copyright (C) 1993 by Sun Microsystems, Inc. All rights reserved.
*
* Developed at SunPro, a Sun Microsystems, Inc. business.
* Permission to use, copy, modify, and distribute this
* software is freely granted, provided that this notice
* is preserved.
* ```
*/
var n=Zt(),r=Qt();function i(e,t){var i,a,o,s=e*e;return o=s*s,a=s*n(s),a+=o*o*r(s),i=.5*s,o=1-i,o+(1-o-i+(s*a-e*t))}t.exports=i})),en=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=$t()})),tn=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
*
* ## Notice
*
* The following copyright, license, and long comment were part of the original implementation available as part of [FreeBSD]{@link https://svnweb.freebsd.org/base/release/9.3.0/lib/msun/src/k_sin.c}. The implementation follows the original, but has been modified for JavaScript.
*
* ```text
* Copyright (C) 1993 by Sun Microsystems, Inc. All rights reserved.
*
* Developed at SunPro, a Sun Microsystems, Inc. business.
* Permission to use, copy, modify, and distribute this
* software is freely granted, provided that this notice
* is preserved.
* ```
*/
var n=-.16666666666666632;function r(e,t){var r,i,a,o=e*e;return a=o*o,r=.00833333333332249+o*(-.0001984126982985795+o*27557313707070068e-22)+o*a*(-2.5050760253406863e-8+o*158969099521155e-24),i=o*e,t===0?e+i*(n+o*r):e-(o*(.5*t-i*r)-t-i*n)}t.exports=r})),nn=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=tn()})),rn=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=1048575})),an=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=_t()===!0?0:1})),on=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=He(),r=Xe(),i=an(),a=new r(1),o=new n(a.buffer);function s(e){return a[0]=e,o[i]}t.exports=s})),sn=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=on()})),cn=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2021 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function n(e,t){for(var n=[],r=0;r<t;r++)n.push(e);return n}t.exports=n})),ln=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2021 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=cn()})),un=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2021 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=ln();function r(e){return n(0,e)}t.exports=r})),dn=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2021 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=un()})),fn=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
*
* ## Notice
*
* The following copyright and license were part of the original implementation available as part of [FreeBSD]{@link https://svnweb.freebsd.org/base/release/9.3.0/lib/msun/src/k_rem_pio2.c}. The implementation follows the original, but has been modified for JavaScript.
*
* ```text
* Copyright (C) 1993 by Sun Microsystems, Inc. All rights reserved.
*
* Developed at SunPro, a Sun Microsystems, Inc. business.
* Permission to use, copy, modify, and distribute this
* software is freely granted, provided that this notice
* is preserved.
* ```
*/
var n=v(),r=zt(),i=dn(),a=[10680707,7228996,1387004,2578385,16069853,12639074,9804092,4427841,16666979,11263675,12935607,2387514,4345298,14681673,3074569,13734428,16653803,1880361,10960616,8533493,3062596,8710556,7349940,6258241,3772886,3769171,3798172,8675211,12450088,3874808,9961438,366607,15675153,9132554,7151469,3571407,2607881,12013382,4155038,6285869,7677882,13102053,15825725,473591,9065106,15363067,6271263,9264392,5636912,4652155,7056368,13614112,10155062,1944035,9527646,15080200,6658437,6231200,6832269,16767104,5075751,3212806,1398474,7579849,6349435,12618859],o=[1.570796251296997,7.549789415861596e-8,5390302529957765e-30,3282003415807913e-37,1270655753080676e-44,12293330898111133e-52,27337005381646456e-60,21674168387780482e-67],s=16777216,c=5.960464477539063e-8,l=i(20),u=i(20),d=i(20),f=i(20);function p(e,t,i,l,u,m,h,g,_){var v,y,b,x=m,S,C,w,T,E=l[i];for(T=i,S=0;T>0;S++)y=c*E|0,f[S]=E-s*y|0,E=l[T-1]+y,--T;if(E=r(E,u),E-=8*n(E*.125),w=E|0,E-=w,b=0,u>0?(S=f[i-1]>>24-u,w+=S,f[i-1]-=S<<24-u,b=f[i-1]>>23-u):u===0?b=f[i-1]>>23:E>=.5&&(b=2),b>0){for(w+=1,v=0,S=0;S<i;S++)T=f[S],v===0?T!==0&&(v=1,f[S]=16777216-T):f[S]=16777215-T;if(u>0)switch(u){case 1:f[i-1]&=8388607;break;case 2:f[i-1]&=4194303}b===2&&(E=1-E,v!==0&&(E-=r(1,u)))}if(E===0){for(T=0,S=i-1;S>=m;S--)T|=f[S];if(T===0){for(C=1;f[m-C]===0;C++);for(S=i+1;S<=i+C;S++){for(_[g+S]=a[h+S],y=0,T=0;T<=g;T++)y+=e[T]*_[g+(S-T)];l[S]=y}return i+=C,p(e,t,i,l,u,m,h,g,_)}for(--i,u-=24;f[i]===0;)--i,u-=24}else E=r(E,-u),E>=s?(y=c*E|0,f[i]=E-s*y|0,i+=1,u+=24,f[i]=y):f[i]=E|0;for(y=r(1,u),S=i;S>=0;S--)l[S]=y*f[S],y*=c;for(S=i;S>=0;S--){for(y=0,C=0;C<=x&&C<=i-S;C++)y+=o[C]*l[S+C];d[i-S]=y}for(y=0,S=i;S>=0;S--)y+=d[S];for(t[0]=b===0?y:-y,y=d[0]-y,S=1;S<=i;S++)y+=d[S];return t[1]=b===0?y:-y,w&7}function m(e,t,n,r){var i,o=4,s,c=r-1,d,f,m,h,g;for(s=(n-3)/24|0,s<0&&(s=0),f=n-24*(s+1),h=s-c,g=c+o,m=0;m<=g;m++)h<0?l[m]=0:l[m]=a[h],h+=1;for(m=0;m<=o;m++){for(i=0,h=0;h<=c;h++)i+=e[h]*l[c+(m-h)];u[m]=i}return d=o,p(e,t,d,u,f,o,s,c,l)}t.exports=m})),pn=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=Math.round})),mn=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=pn()})),hn=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
*
* ## Notice
*
* The following copyright and license were part of the original implementation available as part of [FreeBSD]{@link https://svnweb.freebsd.org/base/release/9.3.0/lib/msun/src/k_rem_pio2.c}. The implementation follows the original, but has been modified for JavaScript.
*
* ```text
* Copyright (C) 1993 by Sun Microsystems, Inc. All rights reserved.
*
* Developed at SunPro, a Sun Microsystems, Inc. business.
* Permission to use, copy, modify, and distribute this
* software is freely granted, provided that this notice
* is preserved.
* ```
*/
var n=mn(),r=P(),i=.6366197723675814,a=1.5707963267341256,o=6077100506506192e-26,s=6077100506303966e-26,c=20222662487959506e-37,l=20222662487111665e-37,u=84784276603689e-45,d=2047;function f(e,t,f){var p,m=n(e*i),h,g=e-m*a,_=m*o,v,y=t>>20;return f[0]=g-_,p=r(f[0]),v=y-(p>>20&d),v>16&&(h=g,_=m*s,g=h-_,_=m*c-(h-g-_),f[0]=g-_,p=r(f[0]),v=y-(p>>20&d),v>49&&(h=g,_=m*l,g=h-_,_=m*u-(h-g-_),f[0]=g-_)),f[1]=g-f[0]-_,m}t.exports=f})),gn=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
*
* ## Notice
*
* The following copyright and license were part of the original implementation available as part of [FreeBSD]{@link https://svnweb.freebsd.org/base/release/9.3.0/lib/msun/src/e_rem_pio2.c}. The implementation follows the original, but has been modified for JavaScript.
*
* ```text
* Copyright (C) 1993 by Sun Microsystems, Inc. All rights reserved.
*
* Developed at SunPro, a Sun Microsystems, Inc. business.
* Permission to use, copy, modify, and distribute this
* software is freely granted, provided that this notice
* is preserved.
*
* Optimized by Bruce D. Evans.
* ```
*/
var n=M(),r=Ft(),i=rn(),a=P(),o=sn(),s=Et(),c=fn(),l=hn(),u=0,d=16777216,f=1.5707963267341256,p=6077100506506192e-26,m=2*p,h=3*p,g=4*p,_=598523,v=1072243195,y=1073928572,b=1074752122,x=1074977148,S=1075183036,C=1075388923,w=1075594811,T=1094263291,E=[0,0,0],D=[0,0];function O(e,t){var O,ee,te=a(e)|0,k=te&n|0,A,j,M,N;if(k<=v)return t[0]=e,t[1]=0,0;if(k<=b)return(k&i)===_?l(e,k,t):k<=y?te>0?(N=e-f,t[0]=N-p,t[1]=N-t[0]-p,1):(N=e+f,t[0]=N+p,t[1]=N-t[0]+p,-1):te>0?(N=e-2*f,t[0]=N-m,t[1]=N-t[0]-m,2):(N=e+2*f,t[0]=N+m,t[1]=N-t[0]+m,-2);if(k<=w)return k<=S?k===x?l(e,k,t):te>0?(N=e-3*f,t[0]=N-h,t[1]=N-t[0]-h,3):(N=e+3*f,t[0]=N+h,t[1]=N-t[0]+h,-3):k===C?l(e,k,t):te>0?(N=e-4*f,t[0]=N-g,t[1]=N-t[0]-g,4):(N=e+4*f,t[0]=N+g,t[1]=N-t[0]+g,-4);if(k<T)return l(e,k,t);if(k>=r)return t[0]=NaN,t[1]=NaN,0;for(O=o(e),ee=(k>>20)-1046,N=s(k-(ee<<20),O),j=0;j<2;j++)E[j]=N|0,N=(N-E[j])*d;for(E[2]=N,A=3;E[A-1]===u;)--A;return M=c(E,D,ee,A,1),te<0?(t[0]=-D[0],t[1]=-D[1],-M):(t[0]=D[0],t[1]=D[1],M)}t.exports=O})),_n=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=gn()})),vn=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
*
* ## Notice
*
* The following copyright, license, and long comment were part of the original implementation available as part of [FreeBSD]{@link https://svnweb.freebsd.org/base/release/9.3.0/lib/msun/src/s_sin.c}. The implementation follows the original, but has been modified for JavaScript.
*
* ```text
* Copyright (C) 1993 by Sun Microsystems, Inc. All rights reserved.
*
* Developed at SunPro, a Sun Microsystems, Inc. business.
* Permission to use, copy, modify, and distribute this
* software is freely granted, provided that this notice
* is preserved.
* ```
*/
var n=M(),r=Ft(),i=P(),a=en(),o=nn(),s=_n(),c=1072243195,l=1045430272,u=[0,0];function d(e){var t=i(e),d;if(t&=n,t<=c)return t<l?e:o(e,0);if(t>=r)return NaN;switch(d=s(e,u),d&3){case 0:return o(u[0],u[1]);case 1:return a(u[0],u[1]);case 2:return-o(u[0],u[1]);default:return-a(u[0],u[1])}}t.exports=d})),yn=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=vn()})),bn=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
*
* ## Notice
*
* The following copyright, license, and long comment were part of the original implementation available as part of [FreeBSD]{@link https://svnweb.freebsd.org/base/release/9.3.0/lib/msun/src/s_cos.c}. The implementation follows the original, but has been modified for JavaScript.
*
* ```text
* Copyright (C) 1993 by Sun Microsystems, Inc. All rights reserved.
*
* Developed at SunPro, a Sun Microsystems, Inc. business.
* Permission to use, copy, modify, and distribute this
* software is freely granted, provided that this notice
* is preserved.
* ```
*/
var n=P(),r=en(),i=nn(),a=_n(),o=M(),s=Ft(),c=[0,0],l=1072243195,u=1044381696;function d(e){var t=n(e),d;if(t&=o,t<=l)return t<u?1:r(e,0);if(t>=s)return NaN;switch(d=a(e,c),d&3){case 0:return r(c[0],c[1]);case 1:return-i(c[0],c[1]);case 2:return-r(c[0],c[1]);default:return i(c[0],c[1])}}t.exports=d})),xn=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=bn()})),Sn=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=_t()===!0?0:1})),Cn=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=He(),r=Xe(),i=Sn(),a=new r(1),o=new n(a.buffer);function s(e,t){return a[0]=e,o[i]=t>>>0,a[0]}t.exports=s})),wn=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=Cn()})),Tn=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function n(e){return e===0?.13333333333320124:.13333333333320124+e*(.021869488294859542+e*(.0035920791075913124+e*(.0005880412408202641+e*(7817944429395571e-20+e*-18558637485527546e-21))))}t.exports=n})),En=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function n(e){return e===0?.05396825397622605:.05396825397622605+e*(.0088632398235993+e*(.0014562094543252903+e*(.0002464631348184699+e*(7140724913826082e-20+e*2590730518636337e-20))))}t.exports=n})),Dn=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
*
* ## Notice
*
* The following copyright, license, and long comment were part of the original implementation available as part of [FreeBSD]{@link https://svnweb.freebsd.org/base/release/12.2.0/lib/msun/src/k_tan.c}. The implementation follows the original, but has been modified for JavaScript.
*
* ```text
* Copyright (C) 2004 by Sun Microsystems, Inc. All rights reserved.
*
* Developed at SunPro, a Sun Microsystems, Inc. business.
* Permission to use, copy, modify, and distribute this
* software is freely granted, provided that this notice
* is preserved.
* ```
*/
var n=P(),r=wn(),i=Tn(),a=En(),o=.7853981633974483,s=3061616997868383e-32,c=.3333333333333341,l=2147483647;function u(e,t,u){var d=n(e),f=d&l|0,p,m,h,g,_,v,y;return f>=1072010280&&(e<0&&(e=-e,t=-t),y=o-e,v=s-t,e=y+v,t=0),y=e*e,v=y*y,m=i(v),_=y*a(v),h=y*e,m=t+y*(h*(m+_)+t),m+=c*h,v=e+m,f>=1072010280?(_=u,(1-(d>>30&2))*(_-2*(e-(v*v/(v+_)-m)))):u===1?v:(y=r(v,0),_=m-(y-e),p=-1/v,g=r(p,0),h=1+g*y,g+p*(h+g*_))}t.exports=u})),On=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=Dn()})),kn=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
*
* ## Notice
*
* The following copyright, license, and long comment were part of the original implementation available as part of [FreeBSD]{@link https://svnweb.freebsd.org/base/release/9.3.0/lib/msun/src/s_tan.c}. The implementation follows the original, but has been modified for JavaScript.
*
* ```text
* Copyright (C) 1993 by Sun Microsystems, Inc. All rights reserved.
*
* Developed at SunPro, a Sun Microsystems, Inc. business.
* Permission to use, copy, modify, and distribute this
* software is freely granted, provided that this notice
* is preserved.
* ```
*/
var n=P(),r=On(),i=_n(),a=M(),o=Ft(),s=[0,0],c=1072243195,l=1044381696;function u(e){var t=n(e),u;return t&=a,t<=c?t<l?e:r(e,0,1):t>=o?NaN:(u=i(e,s),r(s[0],s[1],1-((u&1)<<1)))}t.exports=u})),An=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=kn()})),jn=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function n(e){var t,n,r;return e===0?-.3333333333333332:(t=e<0?-e:e,t<=1?(n=-1614.6876844170845+e*(-99.28772310019185+e*(-.9643991794250523+e*0)),r=4844.063053251255+e*(2235.4883906010045+e*(112.81167849163293+e*1))):(e=1/e,n=0+e*(-.9643991794250523+e*(-99.28772310019185+e*-1614.6876844170845)),r=1+e*(112.81167849163293+e*(2235.4883906010045+e*4844.063053251255))),n/r)}t.exports=n})),Mn=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
*
* ## Notice
*
* The original C code, long comment, copyright, license, and constants are from [Cephes]{@link http://www.netlib.org/cephes}. The implementation follows the original, but has been modified for JavaScript.
*
* ```text
* Copyright 1984, 1995, 2000 by Stephen L. Moshier
*
* Some software in this archive may be from the book _Methods and Programs for Mathematical Functions_ (Prentice-Hall or Simon & Schuster International, 1989) or from the Cephes Mathematical Library, a commercial product. In either event, it is copyrighted by the author. What you see here may be used freely but it comes with no support or guarantee.
*
* Stephen L. Moshier
* moshier@na-net.ornl.gov
* ```
*/
var n=jt(),r=Ut(),i=jn(),a=88.02969193111305;function o(e){var t,o=n(e);if(o>.5*a)return e<0?-1:1;if(o>=.625)t=r(2*o),o=1-2/(t+1),e<0&&(o=-o);else{if(e===0)return e;t=e*e,o=e+e*t*i(t)}return o}t.exports=o})),Nn=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=Mn()})),Pn=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=1.5707963267948966})),Fn=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=.7853981633974483})),In=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function n(e){return e===0?-64.85021904942025:-64.85021904942025+e*(-122.88666844901361+e*(-75.00855792314705+e*(-16.157537187333652+e*-.8750608600031904)))}t.exports=n})),Ln=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function n(e){return e===0?194.5506571482614:194.5506571482614+e*(485.3903996359137+e*(432.88106049129027+e*(165.02700983169885+e*(24.858464901423062+e*1))))}t.exports=n})),Rn=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
*
* ## Notice
*
* The original C code, long comment, copyright, license, and constants are from [Cephes]{@link http://www.netlib.org/cephes}. The implementation follows the original, but has been modified for JavaScript.
*
* ```text
* Copyright 1984, 1995, 2000 by Stephen L. Moshier
*
* Some software in this archive may be from the book _Methods and Programs for Mathematical Functions_ (Prentice-Hall or Simon & Schuster International, 1989) or from the Cephes Mathematical Library, a commercial product. In either event, it is copyrighted by the author. What you see here may be used freely but it comes with no support or guarantee.
*
* Stephen L. Moshier
* moshier@na-net.ornl.gov
* ```
*/
var n=g(),r=E(),i=Pn(),a=Fn(),o=T(),s=In(),c=Ln(),l=6123233995736766e-32,u=2.414213562373095;function d(e){var t,d,f,p;return n(e)||e===0?e:e===r?i:e===o?-i:(e<0&&(d=!0,e=-e),t=0,e>u?(f=i,t=1,e=-(1/e)):e<=.66?f=0:(f=a,t=2,e=(e-1)/(e+1)),p=e*e,p=p*s(p)/c(p),p=e*p+e,t===2?p+=.5*l:t===1&&(p+=l),f+=p,d?-f:f)}t.exports=d})),zn=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=Rn()})),Bn=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=P();function r(e){return!!(n(e)>>>31)}t.exports=r})),Vn=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=Bn()})),Hn=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=3.141592653589793})),Un=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
*
* ## Notice
*
* The original code, copyright and license are from [Go]{@link https://golang.org/src/math/atan2.go}. The implementation follows the original, but has been modified for JavaScript.
*
* ```text
* Copyright (c) 2009 The Go Authors. All rights reserved.
*
* Redistribution and use in source and binary forms, with or without
* modification, are permitted provided that the following conditions are
* met:
*
*    * Redistributions of source code must retain the above copyright
* notice, this list of conditions and the following disclaimer.
*    * Redistributions in binary form must reproduce the above
* copyright notice, this list of conditions and the following disclaimer
* in the documentation and/or other materials provided with the
* distribution.
*    * Neither the name of Google Inc. nor the names of its
* contributors may be used to endorse or promote products derived from
* this software without specific prior written permission.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
* "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
* LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
* A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
* OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
* SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
* LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
* DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
* THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
* (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
* OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
* ```
*/
var n=A(),r=Ot(),i=Vn(),a=g(),o=zn(),s=E(),c=Hn();function l(e,t){var l;return a(t)||a(e)?NaN:n(t)?t===s?n(e)?r(c/4,e):r(0,e):n(e)?r(3*c/4,e):r(c,e):n(e)?r(c/2,e):e===0?t>=0&&!i(t)?r(0,e):r(c,e):t===0?r(c/2,e):(l=o(e/t),t<0?l<=0?l+c:l-c:l)}t.exports=l})),Wn=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=Un()})),Gn=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function n(e){return e===0?.3999999999940942:.3999999999940942+e*(.22222198432149784+e*.15313837699209373)}t.exports=n})),Kn=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function n(e){return e===0?.6666666666666735:.6666666666666735+e*(.2857142874366239+e*(.1818357216161805+e*.14798198605116586))}t.exports=n})),qn=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
*
* ## Notice
*
* The following copyright and license were part of the original implementation available as part of [FreeBSD]{@link https://svnweb.freebsd.org/base/release/9.3.0/lib/msun/src/e_log.c}. The implementation follows the original, but has been modified for JavaScript.
*
* ```text
* Copyright (C) 1993 by Sun Microsystems, Inc. All rights reserved.
*
* Developed at SunPro, a Sun Microsystems, Inc. business.
* Permission to use, copy, modify, and distribute this
* software is freely granted, provided that this notice
* is preserved.
* ```
*/
var n=P(),r=Kt(),i=g(),a=D(),o=T(),s=Gn(),c=Kn(),l=.6931471803691238,u=19082149292705877e-26,d=0x40000000000000,f=.3333333333333333,p=1048575,m=2146435072,h=1048576,_=1072693248;function v(e){var t,g,v,y,b,x,S,C,w,T,E,D;return e===0?o:i(e)||e<0?NaN:(g=n(e),b=0,g<h&&(b-=54,e*=d,g=n(e)),g>=m?e+e:(b+=(g>>20)-a|0,g&=p,C=g+614244&1048576,e=r(e,g|C^_),b+=C>>20,S=e-1,(p&2+g)<3?S===0?b===0?0:b*l+b*u:(x=S*S*(.5-f*S),b===0?S-x:b*l-(x-b*u-S)):(T=S/(2+S),D=T*T,C=g-398458|0,E=D*D,w=440401-g|0,y=E*s(E),v=D*c(E),C|=w,x=v+y,C>0?(t=.5*S*S,b===0?S-(t-T*(t+x)):b*l-(t-(T*(t+x)+b*u)-S)):b===0?S-T*(S-x):b*l-(T*(S-x)-b*u-S))))}t.exports=v})),Jn=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=qn()})),Yn=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function n(e){return e===0?.6666666666666735:.6666666666666735+e*(.3999999999940942+e*(.2857142874366239+e*(.22222198432149784+e*(.1818357216161805+e*(.15313837699209373+e*.14798198605116586)))))}t.exports=n})),Xn=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
*
* ## Notice
*
* The following copyright, license, and long comment were part of the original implementation available as part of [FDLIBM]{@link http://www.netlib.org/fdlibm/s_log1p.c}. The implementation follows the original, but has been modified for JavaScript.
*
* ```text
* Copyright (C) 1993 by Sun Microsystems, Inc. All rights reserved.
*
* Developed at SunPro, a Sun Microsystems, Inc. business.
* Permission to use, copy, modify, and distribute this
* software is freely granted, provided that this notice
* is preserved.
* ```
*/
var n=g(),r=P(),i=Kt(),a=E(),o=T(),s=D(),c=Yn(),l=.6931471803691238,u=19082149292705877e-26,d=.41421356237309503,f=-.2928932188134525,p=1.862645149230957e-9,m=5551115123125783e-32,h=9007199254740992,_=.6666666666666666;function v(e){var t,g,v,y,b,x,S,C,w,T;if(e<-1||n(e))return NaN;if(e===-1)return o;if(e===a||e===0)return e;if(v=e<0?-e:e,T=1,v<d){if(v<p)return v<m?e:e-e*e*.5;e>f&&(T=0,y=e,g=1)}return T!==0&&(v<h?(w=1+e,g=r(w),T=(g>>20)-s,b=T>0?1-(w-e):e-(w-1),b/=w):(w=e,g=r(w),T=(g>>20)-s,b=0),g&=1048575,g<434334?w=i(w,g|1072693248):(T+=1,w=i(w,g|1071644672),g=1048576-g>>2),y=w-1),t=.5*y*y,g===0?y===0?(b+=T*u,T*l+b):(C=t*(1-_*y),T*l-(C-(T*u+b)-y)):(x=y/(2+y),S=x*x,C=S*c(S),T===0?y-(t-x*(t+C)):T*l-(t-(x*(t+C)+(T*u+b))-y))}t.exports=v})),Zn=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=Xn()})),Qn=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2022 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function n(e){return e===0?1.87595182427177:1.87595182427177+e*(-1.8849797954337717+e*(1.6214297201053545+e*(-.758397934778766+e*.14599619288661245)))}t.exports=n})),$n=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
*
* ## Notice
*
* The following copyright, license, and long comment were part of the original implementation available as part of [FreeBSD]{@link https://svnweb.freebsd.org/base/release/9.3.0/lib/msun/src/s_cbrt.c?view=markup}. The implementation follows the original, but has been modified for JavaScript.
*
* ```text
* Copyright (C) 1993 by Sun Microsystems, Inc. All rights reserved.
*
* Developed at SunPro, a Sun Microsystems, Inc. business.
* Permission to use, copy, modify, and distribute this
* software is freely granted, provided that this notice
* is preserved.
*
* Optimized by Bruce D. Evans.
* ```
*/
var n=kt(),r=j(),i=M(),a=P(),o=Kt(),s=A(),c=Et(),l=xt(),u=g(),d=Qn(),f=4294967295,p=3221225472,m=0x40000000000000,h=2147483648,_=1,v=715094163,y=696219795,b=a(n),x=[0,0];function S(e){var t,n,g,S,C,w,T;return e===0||u(e)||s(e)?e:(n=a(e)>>>0,t=(n&r)>>>0,n&=i,n<b?(w=m*e,g=(a(w)&i)>>>0,g=(g/3>>>0)+y>>>0,w=c(t|g,0)):(w=0,g=(n/3>>>0)+v>>>0,w=o(w,t|g)),S=w*w*(w/e),w*=d(S),l.assign(w,x,1,0),x[1]&h?(x[0]+=_,x[1]&=~h):x[1]|=h,w=c(x[0]&f,x[1]&p),C=w*w,S=e/C,T=w+w,S=(S-w)/(T+S),w+=w*S,w)}t.exports=S})),er=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=$n()})),tr=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=v();function r(e){return n(e)===e}t.exports=r})),nr=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=tr()})),rr=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=nr();function r(e){return n(e/2)}t.exports=r})),ir=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=rr()})),ar=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=ir();function r(e){return n(e>0?e-1:e+1)}t.exports=r})),or=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=ar()})),sr=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=Math.sqrt})),cr=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=sr()})),lr=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function n(e){return e|0}t.exports=n})),ur=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=lr()})),dr=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
*
* ## Notice
*
* The following copyright and license were part of the original implementation available as part of [FreeBSD]{@link https://svnweb.freebsd.org/base/release/9.3.0/lib/msun/src/s_pow.c}. The implementation follows the original, but has been modified for JavaScript.
*
* ```text
* Copyright (C) 2004 by Sun Microsystems, Inc. All rights reserved.
*
* Developed at SunPro, a Sun Microsystems, Inc. business.
* Permission to use, copy, modify, and distribute this
* software is freely granted, provided that this notice
* is preserved.
* ```
*/
var n=or(),r=Ot(),i=T(),a=E();function o(e,t){return t===i?a:t===a?0:t>0?n(t)?e:0:n(t)?r(a,e):a}t.exports=o})),fr=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
*
* ## Notice
*
* The following copyright and license were part of the original implementation available as part of [FreeBSD]{@link https://svnweb.freebsd.org/base/release/9.3.0/lib/msun/src/s_pow.c}. The implementation follows the original, but has been modified for JavaScript.
*
* ```text
* Copyright (C) 2004 by Sun Microsystems, Inc. All rights reserved.
*
* Developed at SunPro, a Sun Microsystems, Inc. business.
* Permission to use, copy, modify, and distribute this
* software is freely granted, provided that this notice
* is preserved.
* ```
*/
var n=M(),r=P(),i=1072693247,a=1e300,o=1e-300;function s(e,t){return(r(e)&n)<=i?t<0?a*a:o*o:t>0?a*a:o*o}t.exports=s})),pr=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=jt(),r=E();function i(e,t){return e===-1?(e-e)/(e-e):e===1?1:n(e)<1==(t===r)?0:r}t.exports=i})),mr=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2024 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=20})),hr=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2024 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function n(e){return e===0?.5999999999999946:.5999999999999946+e*(.4285714285785502+e*(.33333332981837743+e*(.272728123808534+e*(.23066074577556175+e*.20697501780033842))))}t.exports=n})),gr=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
*
* ## Notice
*
* The following copyright and license were part of the original implementation available as part of [FreeBSD]{@link https://svnweb.freebsd.org/base/release/9.3.0/lib/msun/src/s_pow.c}. The implementation follows the original, but has been modified for JavaScript.
*
* ```text
* Copyright (C) 2004 by Sun Microsystems, Inc. All rights reserved.
*
* Developed at SunPro, a Sun Microsystems, Inc. business.
* Permission to use, copy, modify, and distribute this
* software is freely granted, provided that this notice
* is preserved.
* ```
*/
var n=P(),r=wn(),i=Kt(),a=D(),o=mr(),s=hr(),c=1048575,l=1048576,u=1072693248,d=536870912,f=524288,p=9007199254740992,m=.9617966939259756,h=.9617967009544373,g=-7.028461650952758e-9,_=[1,1.5],v=[0,.5849624872207642],y=[0,1.350039202129749e-8];function b(e,t,b){var x,S,C,w,T,E,D,O,ee,te,k,A,j,M,N,ne,re,ie,ae,oe=0,se,ce;return b<l&&(t*=p,oe-=53,b=n(t)),oe+=(b>>o)-a|0,se=b&c|0,b=se|u|0,se<=235662?ce=0:se<767610?ce=1:(ce=0,oe+=1,b-=l),t=i(t,b),O=_[ce],ie=t-O,ae=1/(t+O),S=ie*ae,w=r(S,0),x=(b>>1|d)+f,x+=ce<<18,E=i(0,x),D=t-(E-O),T=ae*(ie-w*E-w*D),C=S*S,re=C*C*s(C),re+=T*(w+S),C=w*w,E=3+C+re,E=r(E,0),D=re-(E-3-C),ie=w*E,ae=T*E+D*S,te=ie+ae,te=r(te,0),k=ae-(te-ie),A=h*te,j=g*te+k*m+y[ce],ee=v[ce],ne=oe,M=A+j+ee+ne,M=r(M,0),N=j-(M-ne-ee-A),e[0]=M,e[1]=N,e}t.exports=b})),_r=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2024 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function n(e){return e===0?.5:.5+e*(-.3333333333333333+e*.25)}t.exports=n})),vr=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
*
* ## Notice
*
* The following copyright and license were part of the original implementation available as part of [FreeBSD]{@link https://svnweb.freebsd.org/base/release/9.3.0/lib/msun/src/s_pow.c}. The implementation follows the original, but has been modified for JavaScript.
*
* ```text
* Copyright (C) 2004 by Sun Microsystems, Inc. All rights reserved.
*
* Developed at SunPro, a Sun Microsystems, Inc. business.
* Permission to use, copy, modify, and distribute this
* software is freely granted, provided that this notice
* is preserved.
* ```
*/
var n=wn(),r=_r(),i=1.4426950408889634,a=1.4426950216293335,o=1.9259629911266175e-8;function s(e,t){var s,c,l=t-1,u=l*l*r(l),d=a*l,f=l*o-u*i;return c=d+f,c=n(c,0),s=f-(c-d),e[0]=c,e[1]=s,e}t.exports=s})),yr=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=.6931471805599453})),br=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2024 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
function n(e){return e===0?.16666666666666602:.16666666666666602+e*(-.0027777777777015593+e*(6613756321437934e-20+e*(-16533902205465252e-22+e*4.1381367970572385e-8)))}t.exports=n})),xr=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
*
* ## Notice
*
* The following copyright and license were part of the original implementation available as part of [FreeBSD]{@link https://svnweb.freebsd.org/base/release/9.3.0/lib/msun/src/s_pow.c}. The implementation follows the original, but has been modified for JavaScript.
*
* ```text
* Copyright (C) 2004 by Sun Microsystems, Inc. All rights reserved.
*
* Developed at SunPro, a Sun Microsystems, Inc. business.
* Permission to use, copy, modify, and distribute this
* software is freely granted, provided that this notice
* is preserved.
* ```
*/
var n=P(),r=Kt(),i=wn(),a=ur(),o=zt(),s=yr(),c=D(),l=M(),u=rn(),d=mr(),f=br(),p=1048576,m=1071644672,h=.6931471824645996,g=-1.904654299957768e-9;function _(e,t,_){var v,y,b,x,S,C,w,T,E,D=e&l|0,O=(D>>d)-c|0;return E=0,D>m&&(E=e+(p>>O+1)>>>0,O=((E&l)>>d)-c|0,v=(E&~(u>>O))>>>0,b=r(0,v),E=(E&u|p)>>d-O>>>0,e<0&&(E=-E),t-=b),b=_+t,b=i(b,0),S=b*h,C=(_-(b-t))*s+b*g,T=S+C,w=C-(T-S),b=T*T,y=T-b*f(b),x=T*y/(y-2)-(w+T*w),T=1-(x-T),e=n(T),e=a(e),e+=E<<d>>>0,T=e>>d<=0?o(T,E):r(T,e),T}t.exports=_})),Sr=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
*
* ## Notice
*
* The following copyright and license were part of the original implementation available as part of [FreeBSD]{@link https://svnweb.freebsd.org/base/release/9.3.0/lib/msun/src/s_pow.c}. The implementation follows the original, but has been modified for JavaScript.
*
* ```text
* Copyright (C) 2004 by Sun Microsystems, Inc. All rights reserved.
*
* Developed at SunPro, a Sun Microsystems, Inc. business.
* Permission to use, copy, modify, and distribute this
* software is freely granted, provided that this notice
* is preserved.
* ```
*/
var n=g(),r=or(),i=A(),a=nr(),o=cr(),s=jt(),c=xt(),l=wn(),u=ur(),d=T(),f=E(),p=M(),m=dr(),h=fr(),_=pr(),v=gr(),y=vr(),b=xr(),x=1072693247,S=1105199104,C=1139802112,w=1083179008,D=1072693248,O=1083231232,ee=3230714880,te=31,k=1e300,j=1e-300,N=8008566259537294e-32,ne=[0,0],re=[0,0];function ie(e,t){var g,T,E,A,M,ae,oe,se,ce,le,ue,de,fe,pe,me,he;if(n(e)||n(t))return NaN;if(c.assign(t,ne,1,0),ae=ne[0],oe=ne[1],oe===0){if(t===0)return 1;if(t===1)return e;if(t===-1)return 1/e;if(t===.5)return o(e);if(t===-.5)return 1/o(e);if(t===2)return e*e;if(t===3)return e*e*e;if(t===4)return e*=e,e*e;if(i(t))return _(e,t)}if(c.assign(e,ne,1,0),A=ne[0],M=ne[1],M===0){if(A===0)return m(e,t);if(e===1)return 1;if(e===-1&&r(t))return-1;if(i(e))return e===d?ie(-0,-t):t<0?0:f}if(e<0&&a(t)===!1)return(e-e)/(e-e);if(E=s(e),g=A&p|0,T=ae&p|0,se=A>>>te|0,ce=ae>>>te|0,se=se&&r(t)?-1:1,T>S){if(T>C)return h(e,t);if(g<x)return ce===1?se*k*k:se*j*j;if(g>D)return ce===0?se*k*k:se*j*j;fe=y(re,E)}else fe=v(re,E,g);if(le=l(t,0),de=(t-le)*fe[0]+t*fe[1],ue=le*fe[0],pe=de+ue,c.assign(pe,ne,1,0),me=u(ne[0]),he=u(ne[1]),me>=w){if((me-w|he)!==0||de+N>pe-ue)return se*k*k}else if((me&p)>=O&&((me-ee|he)!==0||de<=pe-ue))return se*j*j;return pe=b(me,ue,de),se*pe}t.exports=ie})),Cr=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=Sr()})),wr=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
var n=g(),r=A(),i=E(),a=cr();function o(e,t){var o;return r(e)||r(t)?i:n(e)||n(t)?NaN:(e<0&&(e=-e),t<0&&(t=-t),e<t&&(o=t,t=e,e=o),e===0?0:(t/=e,e*a(1+t*t)))}t.exports=o})),Tr=/* @__PURE__ */ o(((e,t)=>{
/**
* @license Apache-2.0
*
* Copyright (c) 2018 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
t.exports=wr()})),Er=/* @__PURE__ */ c(Ut(),1),Dr=/* @__PURE__ */ c(Xt(),1),Or=/* @__PURE__ */ c(yn(),1),kr=/* @__PURE__ */ c(xn(),1),Ar=/* @__PURE__ */ c(An(),1),jr=/* @__PURE__ */ c(Nn(),1),Mr=/* @__PURE__ */ c(zn(),1),Nr=/* @__PURE__ */ c(Wn(),1),Pr=/* @__PURE__ */ c(Jn(),1),Fr=/* @__PURE__ */ c(Zn(),1),Ir=/* @__PURE__ */ c(er(),1),Lr=/* @__PURE__ */ c(Cr(),1),Rr=/* @__PURE__ */ c(Tr(),1);function zr(...e){if(e.some(e=>e===1/0||e===-1/0))return 1/0;let t=0;for(let n of e)t=(0,Rr.default)(t,n);return t}function Br(){m({exp:Er.default,expm1:Dr.default,sin:Or.default,cos:kr.default,tan:Ar.default,tanh:jr.default,atan:Mr.default,atan2:Nr.default,log:Pr.default,log1p:Fr.default,cbrt:Ir.default,pow:Lr.default,hypot:zr})}let F=e=>[e,...e.colonies||[]],Vr=e=>F(e).flatMap(e=>e.ants),Hr=e=>F(e).flatMap(e=>e.brood);function Ur(e){let t=2166136261;for(let n of String(e))t^=n.charCodeAt(0),t=Math.imul(t,16777619);return t>>>0}let Wr=Object.freeze({creditsPerMating:80,usePerFemale:1,decayPerDay:5e-4,maxMates:8});function Gr(e,t,n){let r=e.colony.fertility;if(!r)return{kind:n};let i={version:1,requested:n,tick:e.tick};if(n===`male`)return r.intentionalMales++,{kind:n,record:i};r.femaleAttempts++;let a=r.pools.filter(e=>e.viable>=Wr.usePerFemale),o=a.reduce((e,t)=>e+t.viable,0),s=Ur(e.seed+`:paternity:`+t)/4294967296*o,c=a.find(e=>(s-=e.viable)<0);return c?(c.viable-=Wr.usePerFemale,c.used+=Wr.usePerFemale,r.fertilized++,{kind:n,record:{...i,sireId:c.maleId},sire:{id:c.maleId,genome:c.genome}}):(r.failed++,{kind:`male`,record:i})}let Kr=(e,t)=>!!e.colony?.stores?.bins.some(e=>e.node===t&&e.amount>1e-9);function qr(e,t){let n=e.nest?.nodes[t];if(!n)throw Error(`Câmara de estoque inexistente.`);return{x:n.x,y:n.y-n.r*.9,z:n.z}}function Jr(e,t,n,r,i){if(!(t>0))return;if(!Number.isFinite(t))throw Error(`Entrada alimentar inválida.`);let a=e.colony?.stores;if(a){let o=r??e.ants?.find(e=>e.kind===`queen`&&e.node!==null)?.node??e.nest?.nodes.findIndex(t=>(t.colonyId??1)===(e.colonyId??1)&&t.type!==`entrance`);if(o===void 0||o<0)throw Error(`Entrada sem câmara de estoque.`);let s=a.bins.find(e=>e.node===o);s||(s={node:o,point:i?{...i}:qr(e,o),amount:0},a.bins.push(s)),s.amount+=t,a.incoming+=t,a.flows[n]=(a.flows[n]??0)+t}e.food+=t}function Yr(e,t,n,r,i=!1){let a=e.colony?.stores,o=Math.max(0,Math.min(e.food,t));if(!Number.isFinite(o))throw Error(`Saída alimentar inválida.`);if(a){let e=[...a.bins].sort((e,t)=>Number(t.node===r)-Number(e.node===r)),t=e.filter(e=>!i||e.node===r).reduce((e,t)=>e+t.amount,0);o=Math.min(o,t);let s=o;for(let t of e){if(i&&t.node!==r)continue;let e=Math.min(t.amount,s);if(t.amount-=e,s-=e,s<=0)break}a.bins=a.bins.filter(e=>e.amount>0),a.outgoing+=o,a.flows[n]=(a.flows[n]??0)-o}return e.food-=o,o}function Xr(e){let t=e.colony?.stores;return t?{ledger:t.initial+t.incoming-t.outgoing-e.food,rooms:t.bins.reduce((e,t)=>e+t.amount,0)-e.food}:null}let Zr=[`age`,`disease`,`starvation`,`combat`,`predation`,`reproduction`,`unknown`],Qr=Object.freeze({queenScaleDays:2e3,workerScaleDays:120,maleScaleDays:30,ageShape:2,wasteExposurePerDay:.08,contactExposurePerDay:.3,clearancePerDay:.08,diseaseHazardPerDay:.3,woundHazardMultiplier:1,repairHpPerDay:2,repairFoodPerHp:.005,challengeDose:.5}),$r={queenScaleDays:`Escala de envelhecimento da rainha`,workerScaleDays:`Escala de envelhecimento da operária`,maleScaleDays:`Escala de envelhecimento do macho`,ageShape:`Forma da curva de envelhecimento`,wasteExposurePerDay:`Exposição local por resíduos`,contactExposurePerDay:`Transmissão por contato local`,clearancePerDay:`Remoção da carga com nutrição plena`,diseaseHazardPerDay:`Risco por carga infecciosa`,woundHazardMultiplier:`Modulação do risco por ferimentos`,repairHpPerDay:`Reparo corporal máximo`,repairFoodPerHp:`Custo alimentar do reparo`,challengeDose:`Carga do desafio experimental`},ei=Object.entries(Qr).map(([e,t])=>({id:`survival.`+e,label:$r[e],value:t,unit:e.endsWith(`Days`)?`dias do modelo`:e===`ageShape`||e===`woundHazardMultiplier`?`adimensional`:e===`repairHpPerDay`?`pontos de saúde/dia`:e===`repairFoodPerHp`?`créditos/ponto de saúde`:e===`challengeDose`?`índice 0–1`:`por dia do modelo`,topic:`survival`,version:1,minModelRevision:11,requiresSurvival:!0,evidence:`approximation`,source:`viveiro-demo`,sample:null,uncertainty:`Curva e taxas escolhidas para investigação; sem ajuste de sobrevivência ou doença por espécie.`,context:`Riscos de idade e doença são separados de energia, ferimentos, infertilidade e predação. A escala não é idade máxima nem expectativa natural medida.`,application:`simulation`})),ti={creditsPerMating:`Capacidade por macho encontrado`,usePerFemale:`Crédito usado por ovo fecundado`,decayPerDay:`Perda de viabilidade por dia do modelo`,maxMates:`Limite de machos registrados na ocasião de acasalamento`},ni=Object.entries(Wr).map(([e,t])=>({id:`fertility.`+e,label:ti[e],value:t,unit:e===`decayPerDay`?`por dia do modelo`:e===`maxMates`?`machos`:`créditos abstratos`,topic:`fertility`,version:1,minModelRevision:10,requiresFertility:!0,evidence:`approximation`,source:`viveiro-demo`,sample:null,uncertainty:`Sem capacidade, senescência espermática ou frequência de poliandria calibradas por espécie.`,context:`Saldo recebido = viável + utilizado + perdido. Fêmeas têm cópia paterna de um macho registrado; ovos não fecundados são machos haploides neste perfil demonstrativo.`,application:`simulation`})),I=Object.freeze({clayReference:35,packingReference:50,capillaryClay:.6,capillaryPacking:.8,drainageClay:1.5,drainagePacking:1.2,heatPacking:.25,densityPacking:.4,cohesionClay:.8,cohesionPacking:.6,wetSoftening:.6}),ri={clayReference:`Referência do índice de argila`,packingReference:`Referência de compactação`,capillaryClay:`Peso da argila na redistribuição capilar`,capillaryPacking:`Peso da compactação na redistribuição capilar`,drainageClay:`Peso da argila na drenagem`,drainagePacking:`Peso da compactação na drenagem`,heatPacking:`Peso da compactação na condução térmica`,densityPacking:`Peso da compactação na carga relativa`,cohesionClay:`Peso da argila na coesão relativa`,cohesionPacking:`Peso da compactação na coesão relativa`,wetSoftening:`Amolecimento relativo em saturação alta`},ii=Object.entries(I).map(([e,t])=>({id:`material.`+e,label:ri[e],value:t,unit:e.endsWith(`Reference`)?`índice 0–100`:`coeficiente relativo`,topic:`materials`,version:1,minModelRevision:9,requiresSoilMaterial:!0,evidence:`approximation`,source:`viveiro-demo`,sample:null,uncertainty:`Escolha exploratória normalizada; sem densidade, textura ou resistência experimentalmente ajustadas.`,context:`Argila e compactação alteram transporte e capacidade relativa do teto; porosidade volumétrica fixa e volume de terra conservado. Não é um ensaio geotécnico.`,application:`simulation`})),ai=Object.freeze({preferredWater:.3,spoilWater:.65,spoilRate:.005}),oi=[[`preferredWater`,`Água preferida para guardar alimento`,ai.preferredWater,`fração dos poros`],[`spoilWater`,`Início demonstrativo da deterioração`,ai.spoilWater,`fração dos poros`],[`spoilRate`,`Taxa de deterioração da pilha`,ai.spoilRate,`fração por 100 passos e excesso hídrico`]].map(([e,t,n,r])=>({id:`stores.`+e,label:t,value:n,unit:r,topic:`chambers`,version:1,minModelRevision:8,requiresRoomStores:!0,evidence:`approximation`,source:`viveiro-demo`,sample:null,uncertainty:`Créditos e umidade preferida demonstrativos; sem dieta ou fungo calibrados.`,context:`Alimento por câmara, preferência baseada em visitas e deterioração no ponto da pilha. Água nos poros não é umidade relativa do ar da câmara.`,application:`simulation`})),L=Object.freeze({sensorRadius:.22,probeDepth:.12,exploreTicks:160,returnLimit:240,roamRadius:1.8,extraCost:3e-4,broodWater:.65,queenWater:.55,temperature:25,memoryTicks:400,memoryLimit:8}),si=[[`sensorRadius`,`Raio horizontal de sondagem`,L.sensorRadius,`u.`],[`probeDepth`,`Profundidade rasa de leitura`,L.probeDepth,`u.`],[`exploreTicks`,`Exploração antes de escolher o abrigo`,L.exploreTicks,`passos`],[`returnLimit`,`Prazo de retorno ao ponto visitado`,L.returnLimit,`passos`],[`roamRadius`,`Raio preferido de exploração`,L.roamRadius,`u.`],[`extraCost`,`Custo adicional de sondagem`,L.extraCost,`créditos/passo`],[`queenWater`,`Água preferida na sondagem da rainha`,L.queenWater,`fração dos poros`],[`broodWater`,`Água preferida pelas cuidadoras`,L.broodWater,`fração dos poros`],[`temperature`,`Temperatura preferida no modelo`,L.temperature,`°C`],[`memoryTicks`,`Validade de leitura das câmaras`,L.memoryTicks,`passos`]].map(([e,t,n,r])=>({id:`chambers.`+e,label:t,value:n,unit:r,topic:`chambers`,version:1,minModelRevision:7,requiresLocalChambers:!0,evidence:`approximation`,source:`viveiro-demo`,sample:null,uncertainty:`Preferência demonstrativa, sem espécie ou microclima de câmara calibrados.`,context:`Sondagem local rasa e memória de câmaras visitadas. Água nos poros não é umidade relativa do ar. A geometria não garante condições futuras.`,application:`simulation`})),ci=Object.freeze({capacity:.65,sensorRadius:2.3,contactRadius:.38,pantryTarget:1.4,searchLimit:600,restTicks:80,travelCost:4e-4});function li(){return{version:1,phase:`nursing`,searchTicks:0,heading:0,nextDeparture:0,pantry:0,load:0,collected:0,delivered:0,consumed:0,exported:0,lost:0,trips:0}}let ui=[[`capacity`,`Carga máxima da rainha`,ci.capacity,`créditos`],[`sensorRadius`,`Alcance local de alimento`,ci.sensorRadius,`u.`],[`contactRadius`,`Distância de coleta`,ci.contactRadius,`u.`],[`pantryTarget`,`Alvo de alimento na câmara`,ci.pantryTarget,`créditos`],[`searchLimit`,`Limite de busca antes do retorno`,ci.searchLimit,`passos`],[`restTicks`,`Intervalo entre viagens`,ci.restTicks,`passos`],[`travelCost`,`Custo adicional de busca`,ci.travelCost,`créditos/passo`]].map(([e,t,n,r])=>({id:`semiclaustral.`+e,label:t,value:n,unit:r,topic:`semiclaustral`,version:1,minModelRevision:6,evidence:`approximation`,source:`viveiro-demo`,sample:null,uncertainty:`Escolha demonstrativa, sem espécie ou dieta calibrada.`,context:`Coleta pela rainha por sensores locais, carga limitada e alimento externo finito separado da reserva materna.`,application:`simulation`})),R=Object.freeze({activeDays:40,preparationDays:2,coldCueDays:2,chillDays:5,minimumDormantDays:5,warmCueDays:1,resumeDays:2,coldMinimum:5,coldMaximum:12,warmMinimum:18,shortDayHours:10,dormantActivity:.2,larvalMaintenance:.1}),z=Object.freeze({waterDry:.12,waterComfortDry:.37,waterComfortWet:.8,waterWet:.98,minimum:10,optimum:25,maximum:38,eggDays:.5,larvaDays:.8,pupaDays:.6,stressPerTick:.003,recoveryPerTick:5e-4}),di=.02,fi=(e,t,n,r)=>({id:`seasonal.`+e,label:t,value:n,unit:r,topic:`seasonal`,version:1,minModelRevision:5,...e===`cocoon`?{requiresCocoon:!0}:{},evidence:`approximation`,source:`viveiro-demo`,sample:null,uncertainty:`Coeficiente demonstrativo; não é ajuste a uma espécie.`,context:`Memória reprodutiva sazonal. Dias do modelo acelerado, sem reproduzir o protocolo de laboratório.`,application:`simulation`}),pi=[fi(`activeDays`,`Período ativo após fundação`,R.activeDays,`dias do modelo`),fi(`preparation`,`Preparação para repouso`,R.preparationDays,`dias do modelo`),fi(`coldCue`,`Persistência do sinal frio`,R.coldCueDays,`dias do modelo`),fi(`chill`,`Frio acumulado necessário`,R.chillDays,`dias do modelo`),fi(`minimumDormant`,`Duração mínima do repouso`,R.minimumDormantDays,`dias do modelo`),fi(`warmCue`,`Persistência do sinal quente`,R.warmCueDays,`dias do modelo`),fi(`resume`,`Retomada gradual`,R.resumeDays,`dias do modelo`),fi(`coldMinimum`,`Limite inferior do frio acumulado`,R.coldMinimum,`°C do modelo`),fi(`coldMaximum`,`Limite superior do frio acumulado`,R.coldMaximum,`°C do modelo`),fi(`warmMinimum`,`Sinal de retomada`,R.warmMinimum,`°C do modelo`),fi(`shortDay`,`Sinal de dias curtos`,R.shortDayHours,`h/dia do modelo`),fi(`activity`,`Atividade e demanda em repouso`,R.dormantActivity,`fração da referência`),fi(`maintenance`,`Manutenção larval em repouso`,R.larvalMaintenance,`fração da referência`),fi(`cocoon`,`Custo adicional de um casulo`,di,`crédito por cria`),...[{id:`coldProtocol`,label:`Ar frio do protocolo publicado`,value:8,unit:`°C`},{id:`coldMonths`,label:`Duração fria do protocolo publicado`,value:4,unit:`meses`},{id:`warmProtocol`,label:`Ar de desenvolvimento do protocolo publicado`,value:26,unit:`°C`}].map(e=>({...e,id:`seasonal.`+e.id,topic:`seasonal`,version:1,minModelRevision:5,evidence:`protocol`,source:`willot-2026`,sample:null,uncertainty:`Condição experimental, não ótimo universal; amostras individuais não extraídas.`,context:`Willot et al. estudaram cinco espécies temperadas. Estas condições são apenas consulta; a demonstração não reproduz o experimento.`,application:`none`}))],mi=(e,t,n,r)=>({id:`development.`+e,label:t,value:n,unit:r,topic:`development`,version:1,minModelRevision:4,evidence:`approximation`,source:`viveiro-demo`,sample:null,uncertainty:`Escolha demonstrativa não ajustada a espécie, estágio ou população natural.`,context:`Revisão 4: dias do modelo acelerado. Temperatura local e água nos poros, que não equivale à umidade relativa da câmara. As faixas recebidas de outra IA continuam hipóteses inativas.`,application:`simulation`}),hi=[mi(`egg`,`Duração de referência do ovo`,z.eggDays,`dia do modelo`),mi(`larva`,`Duração de referência da larva`,z.larvaDays,`dia do modelo`),mi(`pupa`,`Duração de referência da pupa`,z.pupaDays,`dia do modelo`),mi(`minimum`,`Limite frio da curva`,z.minimum,`°C do modelo`),mi(`optimum`,`Pico escolhido da curva`,z.optimum,`°C do modelo`),mi(`maximum`,`Limite quente da curva`,z.maximum,`°C do modelo`),mi(`stress`,`Acúmulo máximo de estresse`,z.stressPerTick,`fração/passo`),mi(`recovery`,`Recuperação máxima do estresse`,z.recoveryPerTick,`fração/passo`),mi(`waterDry`,`Água no solo: limite seco`,z.waterDry,`fração dos poros`),mi(`waterComfortDry`,`Água no solo: início do platô`,z.waterComfortDry,`fração dos poros`),mi(`waterComfortWet`,`Água no solo: fim do platô`,z.waterComfortWet,`fração dos poros`),mi(`waterWet`,`Água no solo: limite molhado`,z.waterWet,`fração dos poros`)],gi=Object.freeze({depth:.24,bite:.004,maxLoad:.3,diffusionPorosity:.08,flowPorosity:.002}),_i=(e,t,n,r)=>({id:`sealing.`+e,label:t,topic:`founding`,version:1,minModelRevision:3,requiresEntrancePlug:!0,value:n,unit:r,evidence:`approximation`,source:`viveiro-demo`,sample:null,uncertainty:`Coeficiente exploratório sem ajuste experimental.`,context:`Tampão de terra transportada na revisão 3; difusão porosa e fluxo reduzido, sem isolamento térmico ou de umidade do ar calibrado.`,application:`simulation`}),vi=[_i(`depth`,`Espessura do tampão`,gi.depth,`u.`),_i(`bite`,`Material acomodado ou removido por passo`,gi.bite,`u³/passo`),_i(`load`,`Carga máxima de fechamento da rainha`,gi.maxLoad,`u³`),_i(`diffusion`,`Fração difusiva do tampão fechado`,gi.diffusionPorosity,`fração`),_i(`flow`,`Fração de condutância do tampão fechado`,gi.flowPorosity,`fração`)],yi=Object.freeze({lipidFraction:3/8,proteinFraction:3/8,muscleFraction:2/8,histolysisPerTick:.001,eggCost:.21}),bi=(e,t,n,r)=>({id:e,label:t,value:n,unit:r,topic:`maternal`,version:1,minModelRevision:2,evidence:`approximation`,source:`viveiro-demo`,sample:null,uncertainty:`Coeficiente demonstrativo, sem ajuste experimental`,context:`Só revisões com reservas separadas. Créditos abstratos disponíveis, não massa corporal nem calorimetria.`,application:`simulation`}),xi=[bi(`maternal.lipid`,`Fração inicial de lipídio`,yi.lipidFraction,`fração`),bi(`maternal.protein`,`Fração inicial de proteína`,yi.proteinFraction,`fração`),bi(`maternal.muscle`,`Fração inicial de músculo`,yi.muscleFraction,`fração`),bi(`maternal.histolysis`,`Transferência de músculo para proteína`,yi.histolysisPerTick,`u./passo`),bi(`maternal.eggCost`,`Custo proteico por ovo`,yi.eggCost,`u./ovo`)];function Si(e){return[Object.freeze({...e,id:`generic-microclimate-demo`,version:1,modelRevision:7,maternalModel:`pools`,entranceModel:`plug`,developmentModel:`thermal-demo`,dormancyModel:`obligate-demo`,seasonality:`seasonal`,cocoon:`present`,chamberModel:`local-demo`,label:`Microclima · escolha local`,description:`Rainha visita o solo antes de escavar e cuidadoras comparam apenas câmaras visitadas. Água nos poros como proxy; sem clima de câmara ou espécie calibrados.`}),Object.freeze({...e,id:`generic-microclimate-demo`,version:2,modelRevision:8,maternalModel:`pools`,entranceModel:`plug`,developmentModel:`thermal-demo`,dormancyModel:`obligate-demo`,seasonality:`seasonal`,cocoon:`present`,chamberModel:`local-demo`,stockModel:`rooms-demo`,label:`Microclima · estoques por câmara`,description:`Sondagem local e estoque alimentar por câmara. Entregas procuram locais secos conhecidos; deterioração usa o clima da pilha. Nutrição da prole ainda usa orçamento coletivo. Sem espécie calibrada.`}),Object.freeze({...e,id:`generic-microclimate-demo`,version:3,modelRevision:9,maternalModel:`pools`,entranceModel:`plug`,developmentModel:`thermal-demo`,dormancyModel:`obligate-demo`,seasonality:`seasonal`,cocoon:`present`,chamberModel:`local-demo`,stockModel:`rooms-demo`,materialModel:`relative-demo`,label:`Solo · composição e suporte`,description:`Índices relativos de argila e compactação ajustam transporte de água/calor e suporte do teto. Capacidade de poros fixa; sem densidade ou engenharia calibradas.`})]}function Ci(e){let t=Object.freeze({...Si(e)[2],id:`generic-fertility-demo`,version:1,modelRevision:10,fertilityModel:`finite-demo`,label:`Fertilidade · espermateca finita`,description:`Créditos reprodutivos finitos por macho encontrado, perda de viabilidade e parentesco por ovo. Sem capacidade de armazenamento ou taxa de perda calibradas; esgotamento altera o sexo da prole, não mata a rainha.`});return[t,Object.freeze({...t,id:`generic-survival-demo`,version:1,modelRevision:11,survivalModel:`risk-demo`,label:`Saúde · riscos e longevidade`,description:`Energia, ferimentos, infecção local e risco por idade separados. Curvas e taxas demonstrativas; não prevê longevidade natural de uma espécie. Rainha pode consumir estoque acessível na própria câmara.`})]}let wi=Object.freeze({temperatureC:21,humidity:80}),Ti=(e,t,n,r)=>({id:e,label:t,value:n,unit:r,topic:`study`,version:1,evidence:`protocol`,source:`majidifar-2024`,sample:null,uncertainty:`Condição de criação, não ótimo estimado`,context:`Lasius niger; condição geral de incubadora. Variações e amostras por experimento na Tabela S1.`,application:`preset`}),Ei=[Ti(`study.temperature`,`Ar da incubadora`,wi.temperatureC,`°C`),Ti(`study.humidity`,`Umidade da incubadora`,wi.humidity,`%`),{id:`study.workerProduction`,label:`Rainhas sobreviventes que produziram operárias`,value:17/22,unit:`fração`,topic:`study`,version:1,evidence:`measurement`,source:`majidifar-2024`,sample:22,uncertainty:`Incerteza não extraída; amostra pequena`,context:`17/22 sobreviventes em 93 dias; coorte inicial de 24. Não é prazo universal de fundação.`,application:`none`}],Di=Object.freeze({id:`generic-demo`,version:1,label:`Genérico · demonstração`,modelSpecies:null,referenceSpecies:null,foundation:`claustral`,cocoon:`unspecified`,seasonality:`unmodelled`,maternalModel:`scalar`,climate:Object.freeze({}),description:`Modelo genérico acelerado; castas/ecologia combinadas, sem espécie calibrada.`}),Oi=Object.freeze({...Di,id:`lab-lniger-2024`,label:`Ar de referência · L. niger (2024)`,referenceSpecies:`Lasius niger`,climate:wi,description:`Só inicia o ar em 21 °C e 80% conforme condição de laboratório. Biologia e solo continuam genéricos; não reproduz o experimento.`}),ki=Object.freeze([Di,Oi,Object.freeze({...Di,version:2,label:`Genérico · reservas maternas`,maternalModel:`pools`,description:`Reservas de lipídio, proteína e músculo em unidades abstratas. Modelo genérico exploratório, sem espécie calibrada.`}),Object.freeze({...Oi,version:2,maternalModel:`pools`,description:Oi.description+` Reservas maternas separadas nesta revisão.`}),...[Di,Oi].map(e=>Object.freeze({...e,version:3,maternalModel:`pools`,entranceModel:`plug`,label:e.id===`generic-demo`?`Genérico · fundação selada`:e.label,description:e.description+` Reservas maternas e tampão físico nesta revisão; parâmetros exploratórios.`})),...[Di,Oi].map(e=>Object.freeze({...e,version:4,maternalModel:`pools`,entranceModel:`plug`,developmentModel:`thermal-demo`,label:e.id===`generic-demo`?`Genérico · maturação térmica`:e.label,description:e.description+` Maturação térmica demonstrativa e tampão físico. Durações não calibradas por espécie.`})),...[Di,Oi].map(e=>Object.freeze({...e,version:5,maternalModel:`pools`,entranceModel:`plug`,developmentModel:`thermal-demo`,dormancyModel:`obligate-demo`,seasonality:`seasonal`,cocoon:`present`,label:e.id===`generic-demo`?`Genérico · sazonal com casulos`:e.label,description:e.description+` Diapausa reprodutiva demonstrativa com memória e casulos pagos. Não calibrado para uma espécie.`})),Object.freeze({...Di,id:`generic-naked-demo`,version:1,modelRevision:5,maternalModel:`pools`,entranceModel:`plug`,developmentModel:`thermal-demo`,dormancyModel:`obligate-demo`,seasonality:`seasonal`,cocoon:`absent`,label:`Sazonal · pupa nua (demonstração)`,description:`Variante genérica sem casulo, com diapausa reprodutiva, reservas e tampão. Não corresponde a uma espécie calibrada.`}),Object.freeze({...Di,id:`generic-semiclaustral-demo`,version:1,modelRevision:6,foundation:`semiclaustral`,maternalModel:`pools`,entranceModel:`open`,developmentModel:`thermal-demo`,cocoon:`absent`,label:`Semiclaustral · coleta da rainha`,description:`Variante demonstrativa com entrada aberta e coleta externa local pela rainha. Alimento finito separado das reservas iniciais; sem espécie calibrada.`}),...Si(Di),...Ci(Di)]);var Ai=class extends Error{constructor(){super(`Perfil biológico ou versão não suportados. Preserve o arquivo original para uma versão compatível.`),this.name=`UnsupportedBiologicalProfile`}};let ji={x:9.3,z:5.8},Mi=Object.freeze({larva:.35,pupa:.9}),Ni=(e,t,n,r,i)=>({id:e,label:t,value:n,unit:r,context:i,topic:`model`,version:1,evidence:`approximation`,source:`viveiro-demo`,sample:null,uncertainty:`Não aferida; escolha do modelo`,application:`simulation`}),Pi=[Ni(`clock.ticksPerDay`,`Relógio demonstrativo`,100,`passos/dia do modelo`,`Não estabelece equivalência fisiológica por espécie.`),Ni(`founding.reserves`,`Reserva inicial genérica`,8,`u. de reserva`,`Orçamento claustral abstrato; não representa gramas de gordura/proteína.`),Ni(`brood.larva`,`Transição genérica para larva`,Mi.larva,`fração de desenvolvimento`,`Progresso interno acelerado; não são dias de incubação.`),Ni(`brood.pupa`,`Transição genérica para pupa`,Mi.pupa,`fração de desenvolvimento`,`Não distingue espécies com/sem casulo nesta versão.`)],Fi=(e,t,n,r,i)=>({id:e,label:t,range:n,unit:r,topic:i,value:null,version:1,evidence:`hypothesis`,source:`user-ai-notes`,sample:null,uncertainty:`Espécie, amostra e dispersão não verificadas`,context:`Faixa recebida para investigação; não altera timers.`,application:`none`}),Ii=[Fi(`proposal.burrow`,`Escavação inicial`,[12,24],`h`,`founding`),Fi(`proposal.firstEggs`,`Primeira postura após selamento`,[1,7],`d`,`founding`),Fi(`proposal.clutch`,`Primeira coorte`,[5,30],`ovos`,`founding`),Fi(`proposal.egg`,`Ovo até larva`,[10,14],`d`,`development`),Fi(`proposal.larva`,`Larva até pupa`,[10,15],`d`,`development`),Fi(`proposal.pupa`,`Pupa até adulta`,[10,24],`d`,`development`),Fi(`proposal.temperature`,`Referência térmica proposta`,[24,27],`°C`,`development`)];Object.freeze([...Pi,...Ii,...Ei,...xi,...vi,...hi,...pi,...ui,...si,...oi,...ii,...ni,...ei].map(e=>Object.freeze({...e,range:e.range?Object.freeze([...e.range]):void 0})));function Li(e=`generic-demo`,t=1){let n=ki.find(n=>n.id===e&&n.version===t);if(!n)throw new Ai;return{schema:1,id:n.id,version:n.version}}function B(e){if(e===void 0)return ki[0];if(!e||typeof e!=`object`)throw Error(`Referência biológica inválida.`);let t=e;if(typeof t.schema==`number`&&t.schema!==1)throw new Ai;if(t.schema!==1||typeof t.id!=`string`||!Number.isInteger(t.version))throw Error(`Referência biológica inválida.`);let n=Li(t.id,t.version);return ki.find(e=>e.id===n.id&&e.version===n.version)}function Ri(e,t,n){let r=e.foraging;if(!r||t===`maintenance`&&r.phase!==`nursing`)return 0;let i=Math.min(r.pantry,n);return r.pantry-=i,r.consumed+=i,i}function zi(e){let t=e.founding?.foraging;t&&(Jr(e,t.pantry,`foundress`),t.exported+=t.pantry,t.pantry=0)}function Bi(e,t){let n=e.founding?.foraging;n&&t.kind===`queen`&&(n.lost+=n.load,n.load=0,t.carrying=0)}function Vi(e){return{collection:e.collected-e.load-e.delivered-e.lost,pantry:e.delivered-e.pantry-e.consumed-e.exported}}let Hi=e=>e.lipid+e.protein+e.muscle;function Ui(e){if(!Number.isFinite(e)||e<0)throw Error(`Reserva materna inválida.`);let t={lipid:e*yi.lipidFraction,protein:e*yi.proteinFraction,muscle:e*yi.muscleFraction};return{version:1,initial:{...t},stores:t,converted:0,consumed:{lipid:0,protein:0},unmet:{maintenance:0,eggs:0,larvae:0,excavation:0}}}function Wi(e,t){return e.stores.protein+([`maintenance`,`excavation`].includes(t)?e.stores.lipid:0)}function Gi(e,t,n){if(!(n>0)||!Number.isFinite(n))return 0;let r=n,i=t===`eggs`||t===`larvae`?[`protein`]:[`lipid`,`protein`];for(let t of i){let n=Math.min(e.stores[t],r);e.stores[t]-=n,e.consumed[t]+=n,r-=n}return e.unmet[t]+=r,n-r}function Ki(e,t=1){if(!(t>0)||!Number.isFinite(t))return 0;let n=Math.min(e.stores.muscle,yi.histolysisPerTick*t);return e.stores.muscle-=n,e.stores.protein+=n,e.converted+=n,n}function qi(e){let t=Hi(e.initial),n=Hi(e.stores),r=e.consumed.lipid+e.consumed.protein;return{initial:t,remaining:n,consumed:r,converted:e.converted,error:t-n-r}}let Ji=e=>!!e.founding&&![`established`,`failed`].includes(e.founding.phase);function Yi(e,t,n){let r=e.founding;if(!r||!(n>0))return 0;let i=Ri(r,t,n),a=n-i,o=i+(r.maternal?Gi(r.maternal,t,a):Math.min(r.reserves,a));return r.maternal?r.reserves=Hi(r.maternal.stores):r.reserves-=o-i,r.spent[t]+=o,o}function Xi(e,t,n){let r=e.founding;r.phase=t,r.since=e.tick,e.log(n,t===`failed`?`danger`:`birth`)}function Zi(e){return e.ants.find(e=>e.kind===`queen`)}let Qi=(e,t,n,r)=>(n*e.rows+r)*e.width+t;function $i(e,t){let n=Math.max(0,Math.min(e.width-1,Math.floor((t.x+10)/20*e.width))),r=Math.max(0,Math.min(e.rows-1,Math.floor((t.z+6.5)/13*e.rows))),i=e.surface[r*e.width+n]-t.y,a=Math.max(0,Math.min(e.layers-1,Math.floor(i/e.depth*e.layers)));return Qi(e,n,a,r)}function V(e,t){if(!e)return null;let n=$i(e,t);return{cell:n,water:e.water[n]/e.capacity,temperature:e.temperature[n]}}function ea(e,t){let n=Math.floor(t/(e.width*e.rows)),r=t%(e.width*e.rows);return e.surface[r]-(n+.5)*e.depth/e.layers}let ta=/* @__PURE__ */ new WeakMap;function na(e){let t=ta.get(e);if(t)return t;t=[];for(let n=0;n<e.layers;n++)for(let r=0;r<e.rows;r++)for(let i=0;i<e.width;i++){let a=Qi(e,i,n,r);i+1<e.width&&t.push([a,Qi(e,i+1,n,r),20/e.width]),r+1<e.rows&&t.push([a,Qi(e,i,n,r+1),13/e.rows]),n+1<e.layers&&t.push([a,Qi(e,i,n+1,r),e.depth/e.layers])}return ta.set(e,t),t}function ra(e){for(let t of[...e.colony.stores?.bins??[]]){let n=V(e.microclimate,t.point),r=n?.water??.55,i=Math.max(.25,Math.min(2,1+((n?.temperature??24)-24)/20)),a=Yr(e,t.amount*Math.max(0,r-ai.spoilWater)*ai.spoilRate*i,`spoilage`,t.node,!0);a<=0||(e.colony.spoiled+=a,aa(e,{...t.point,mass:a,kind:`food`,stored:!1}))}}function H(e,t,n=0,r=1){let i=e.nodes.flatMap((e,n)=>e.type===t&&(e.colonyId||1)===r?[n]:[]);if(i.length)return i[Math.abs(n)%i.length];if(t===`waste`)return H(e,`entrance`,n,r);let a=e.nodes.findIndex(e=>e.type===`royal`&&(e.colonyId||1)===r),o=e.nodes.findIndex(e=>e.type===`entrance`&&(e.colonyId||1)===r);return a>=0?a:Math.max(0,o)}let ia=(e,t,n=1)=>t===H(e,`storage`,0,n);function aa(e,t){if(e.colony.waste.length>=128){let n=e.colony.waste.find(e=>e.stored===t.stored&&e.kind===t.kind&&!e.carrier);if(n){n.mass+=t.mass;return}}e.colony.waste.push({...t,id:e.nextId++})}function oa(e,t){Bi(e,t);for(let n of e.colony.waste)n.carrier===t.id&&(delete n.carrier,n.x=t.x,n.y=(t.y||0)+.02,n.z=t.z);for(let n of e.brood)n.carrier===t.id&&(delete n.carrier,n.x=t.x,n.y=(t.y||0)+.02,n.z=t.z,n.node=t.node??H(e.nest,`royal`,0,e.colonyId||1));t.deathCause!==`predation`&&aa(e,{x:t.x,y:(t.y||0)+.03,z:t.z,mass:t.kind===`queen`?.16:.04,kind:`corpse`,stored:!1})}function sa(e){if(e.tick%100||e.food<=0)return;if(e.colony.stores){ra(e);return}let t=e.nest.nodes[H(e.nest,`storage`,0,e.colonyId||1)];if(!t)return;let n=V(e.microclimate,t),r=n?.water??.55,i=Math.max(.25,Math.min(2,1+((n?.temperature??24)-24)/20)),a=Math.min(e.food,e.food*Math.max(0,r-.75)*.005*i);a<=0||(Yr(e,a,`spoilage`),e.colony.spoiled+=a,aa(e,{x:t.x,y:t.y-t.r+.04,z:t.z,mass:a,kind:`food`,stored:!1}))}function ca(e,t){B(e.biologicalProfile).cocoon===`present`&&(t.cocoon={version:1,paid:0,built:!1})}function la(e,t){let n=t.cocoon;if(!n||n.built||t.age<.9)return;let r=Math.max(0,di-n.paid),i=Ji(e)?Yi(e,`larvae`,r):Math.min(e.food,r);Ji(e)||Yr(e,i,`silk`,t.node),n.paid+=i,n.paid>=.02-1e-10?n.built=!0:t.age=.899999}function ua(e,t){t.cocoon?.built&&aa(e,{x:t.x,y:t.y,z:t.z,mass:.005,kind:`cocoon`,stored:!1})}function da(e,t){if(Array.isArray(e))for(let n of e){let e=n.cocoon;if(!e){if(t)throw Error(`Registro do casulo ausente.`)}else if(!t||e.version!==1||typeof e.built!=`boolean`||!Number.isFinite(e.paid)||e.paid<0||e.paid>.02+1e-9||e.built&&(e.paid<.02-1e-9||n.age<.9)||!e.built&&n.age>=.9)throw Error(`Registro do casulo inconsistente.`)}}let fa=e=>Math.max(0,Math.min(1,e));function pa(e,t,n){e.phase=t,e.since=n,e.warmTicks=0}function ma(e,t,n,r,i){e.lastTemperature=n,e.lastPhotoperiod=r,e.phase===`active`?(i&&e.activeTicks++,e.coldCue=n<=R.coldMaximum||r<R.shortDayHours&&n<R.warmMinimum?e.coldCue+1:Math.max(0,e.coldCue-2),(e.activeTicks>=R.activeDays*100||e.coldCue>=R.coldCueDays*100)&&pa(e,`preparing`,t)):e.phase===`preparing`?t-e.since>=R.preparationDays*100&&(e.chillTicks=0,pa(e,`dormant`,t)):e.phase===`dormant`?(n>=R.coldMinimum&&n<=R.coldMaximum&&e.chillTicks++,e.warmTicks=n>=R.warmMinimum?e.warmTicks+1:0,e.chillTicks>=R.chillDays*100&&t-e.since>=R.minimumDormantDays*100&&e.warmTicks>=R.warmCueDays*100&&pa(e,`resuming`,t)):n<=R.coldMaximum?pa(e,`dormant`,t):t-e.since>=R.resumeDays*100&&(e.activeTicks=0,e.coldCue=0,e.chillTicks=0,e.cycles++,pa(e,`active`,t))}function ha(e,t){let n=1;return e?.phase===`dormant`&&(n=0),e?.phase===`preparing`&&(n=1-fa((t-e.since)/(R.preparationDays*100))),e?.phase===`resuming`&&(n=fa((t-e.since)/(R.resumeDays*100))),{growth:n,laying:n,activity:R.dormantActivity+(1-R.dormantActivity)*n,larvalDemand:R.larvalMaintenance+(1-R.larvalMaintenance)*n}}let ga=e=>B(e.biologicalProfile).dormancyModel===`obligate-demo`;function _a(e){let t=e.ants.find(e=>e.kind===`queen`)||e.ants[0];return!t||t.airborne?e.params.temperatureC??24:V(e.microclimate,{x:t.x,y:t.y??0,z:t.z})?.temperature??e.params.temperatureC??24}function va(e){ga(e)&&!e.colony.season&&(e.colony.season={version:1,phase:`active`,since:e.tick,activeTicks:0,coldCue:0,chillTicks:0,warmTicks:0,cycles:0,lastTemperature:_a(e),lastPhotoperiod:e.params.photoperiodHours??12})}function ya(e){if(!ga(e))return;va(e);let t=e.colony.season,n=t.phase;ma(t,e.tick,_a(e),e.params.photoperiodHours??12,!Ji(e)),t.phase!==n&&e.log(`Fase sazonal: `+{active:`atividade retomada`,preparing:`preparação para repouso`,dormant:`diapausa reprodutiva`,resuming:`retomada gradual`}[t.phase]+`. Modelo demonstrativo.`)}let ba=e=>ha(e.colony?.season,e.tick);function xa(e){return Number.isFinite(e)?Math.max(0,Math.min(1,(e-z.minimum)/(z.optimum-z.minimum),(z.maximum-e)/(z.maximum-z.optimum))):0}function Sa(e){return Number.isFinite(e)?Math.max(0,Math.min(1,(e-z.waterDry)/(z.waterComfortDry-z.waterDry),(z.waterWet-e)/(z.waterWet-z.waterComfortWet))):0}function Ca(e){return e<.35?{name:`egg`,span:.35,end:.35,days:z.eggDays}:e<.9?{name:`larva`,span:.55,end:.9,days:z.larvaDays}:{name:`pupa`,span:.4,end:1.3,days:z.pupaDays}}let wa=e=>B(e.biologicalProfile).developmentModel===`thermal-demo`;function Ta(e,t){let n=t.carrier===void 0?t:e.ants.find(e=>e.id===t.carrier)||t,r=V(e.microclimate,{x:n.x,y:n.y??t.y,z:n.z});return{temperature:r?.temperature??e.params.temperatureC??24,water:r?.water??.55}}function Ea(e){if(!wa(e))return 1;let t=e.ants.find(e=>e.kind===`queen`);if(!t)return 0;let n=V(e.microclimate,{x:t.x,y:t.y??0,z:t.z});return xa(n?.temperature??e.params.temperatureC??24)*Sa(n?.water??.55)*ba(e).laying}function Da(e){let t=Ur(e),n=()=>{t=t+1831565813>>>0;let e=Math.imul(t^t>>>15,t|1);return e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296};return{random:n,range:(e,t)=>e+n()*(t-e)}}let Oa=[`locomotion`,`size`,`antennae`,`mandibles`,`efficiency`,`activity`,`courage`,`exploration`,`care`,`cleaning`,`digging`];function ka(e,t,n){let{range:r}=Da(e+`:founder:`+t+`:`+n),i=n===`male`?1:2;return{ploidy:i,haplotypes:Array.from({length:i},()=>Oa.map(()=>r(.2,.8))),generation:0,origin:`founder`,mutations:[]}}function Aa(e,t){let n=Oa.indexOf(t);return e.haplotypes.reduce((e,t)=>e+(Number.isFinite(t[n])?t[n]:.5),0)/e.ploidy}function ja(e,t,n,r,i={}){let{random:a,range:o}=Da(n),s=[],c=Math.floor(a()*e.ploidy),l=Oa.map((t,n)=>(n&&a()<.18&&(c=(c+1)%e.ploidy),e.haplotypes[c][n])),u=t?[l,[...t.haplotypes[0]]]:[l];return u.forEach((e,t)=>e.forEach((n,r)=>{if(a()<(i.mutationRate??.015)){let a=o(-(i.mutationSize??.05),i.mutationSize??.05),c=Math.max(0,Math.min(1,n+a));e[r]=c,c!==n&&s.push({locus:Oa[r],copy:t,before:n,after:c})}})),{ploidy:t?2:1,haplotypes:u,generation:e.generation+1,...r,fatherId:t?r.fatherId:void 0,origin:`inherited`,mutations:s}}function Ma(e,t){if(!wa(e))return;let{temperature:n,water:r}=Ta(e,t),i=Ur(e.seed+`:development:`+t.id)/4294967296,a=t.genome?Aa(t.genome,`efficiency`):.5;t.development={version:1,growthFactor:(.9+.2*i)*(.95+.1*a),stress:0,lastTemperature:n,lastSoilWater:r,lastRate:0}}function Na(e){return{version:1,queen:{id:1,genome:ka(e,1,`queen`)},sire:{id:2,genome:ka(e,2,`male`)},embryos:0,mutationEvents:0}}function Pa(e,t,n=!1,r){let i=e.genetics;return ja(e.ants.find(e=>e.id===i.queen.id)?.genome??i.queen.genome,n?void 0:(r??i.sire).genome,e.seed+`:embryo:`+t,{motherId:i.queen.id,fatherId:(r??i.sire).id})}function Fa(e,t,n,r){return r||(n===`queen`?e.genetics.queen.genome:n===`male`?e.genetics.sire.genome:Pa(e,t))}function Ia(e){if(e.genetics)return;let t=e.ants.find(e=>e.kind===`queen`),n=e.ants.find(e=>e.kind===`male`),r=(t,n)=>({...ka(e.seed+`:legacy`,t,n),origin:`legacy-inferred`});e.genetics={version:1,queen:{id:t?.id,genome:r(t?.id??0,`queen`)},sire:{id:n?.id,genome:r(n?.id??0,`male`)},embryos:0,mutationEvents:0};for(let t of e.ants)t.genome=t.kind===`queen`?e.genetics.queen.genome:t.kind===`male`?e.genetics.sire.genome:r(t.id,t.kind||`worker`);for(let t of e.brood)t.genome={...Pa(e,t.id),origin:`legacy-inferred`,motherId:void 0,fatherId:void 0}}function La(e,t){let n={x:t.x-e.x,y:t.y-e.y,z:t.z-e.z},r=n.x*e.axis.x+n.y*e.axis.y+n.z*e.axis.z,i={x:n.x-r*e.axis.x,y:n.y-r*e.axis.y,z:n.z-r*e.axis.z},a=p.hypot(i.x,i.y,i.z),o=a-e.radius,s=Math.abs(r)-e.depth/2,c=p.hypot(Math.max(0,o),Math.max(0,s)),l=c+Math.min(Math.max(o,s),0),u=a>1e-10?{x:i.x/a,y:i.y/a,z:i.z/a}:{x:0,y:0,z:0},d=Math.sign(r)||1,f;if(c>1e-10){let t=Math.max(0,o)/c,n=Math.max(0,s)*d/c;f={x:u.x*t+e.axis.x*n,y:u.y*t+e.axis.y*n,z:u.z*t+e.axis.z*n}}else f=o>s?u:{x:e.axis.x*d,y:e.axis.y*d,z:e.axis.z*d};return e.innerRadius>1e-9&&e.innerRadius-a>l?{distance:e.innerRadius-a,x:-u.x,y:-u.y,z:-u.z}:{distance:l,...f}}function Ra(e,t,n,r,i){let a=e-n.x,o=t-n.z,s=p.cos(n.angle),c=p.sin(n.angle);return p.pow((a*s+o*c)/r,2)+p.pow((-a*c+o*s)/i,2)}let za=e=>e.volume<.02?0:.35+e.volume*.65;function Ba(e,t,n,r=!1){return e?e.ponds.reduce((e,i)=>{let a=r?1.1:za(i);return a?Math.min(e,Ra(t,n,i,i.rx*a,i.rz*a)):e},1/0):1/0}function Va(e,t,n){return e?e.logs.reduce((e,r)=>{let i=.55+r.integrity*.45;return Math.min(e,Ra(t,n,r,(r.kind===`stump`?r.radius:r.length/2)*i+.14,r.radius*i+.14))},1/0):1/0}function U(e,t,n){let r=0;for(let i of e||[])r+=i.height*p.exp(-(p.pow(t-i.x,2)+p.pow(n-i.z,2))/p.pow(i.radius,2));return r}function Ha(e,t,n){let r=.01,i=(U(e,t+r,n)-U(e,t-r,n))/(2*r),a=(U(e,t,n+r)-U(e,t,n-r))/(2*r),o=p.hypot(i,1,a);return{x:-i/o,y:1/o,z:-a/o}}let Ua=/* @__PURE__ */ new WeakMap;function Wa(e,t){if(!e?.length)return t;let n=Ua.get(e);if(!n){let t=e.reduce((e,t)=>e+Math.min(0,t.height),0),r=e.reduce((e,t)=>e+.858*Math.abs(t.height)/t.radius,0);n={height:t,normalY:1/Math.sqrt(1+r*r)},Ua.set(e,n)}let r=t-n.height;return r<0?r*n.normalY:r}let Ga=e=>Math.max(0,Math.min(1,e));function Ka(e,t,n,r,i){if(!Number.isFinite(e.distance)){Object.assign(e,{distance:t,x:n,y:r,z:i});return}let a=.08,o=Ga(.5+.5*(t-e.distance)/a);e.distance=t+(e.distance-t)*o-a*o*(1-o),e.x=n+(e.x-n)*o,e.y=r+(e.y-r)*o,e.z=i+(e.z-i)*o}function qa(e,t){let n={distance:1/0,x:0,y:0,z:0};for(let r of e.nodes){let e=t.x-r.x,i=t.y-r.y,a=t.z-r.z,o=r.r+.32;if(Math.abs(e)>o||Math.abs(i)>o||Math.abs(a)>o)continue;let s=p.hypot(e,i,a),c=1/(s||1);Ka(n,s-r.r,e*c,i*c,a*c)}for(let r=0;r<e.links.length;r++){let[i,a]=e.links[r],o=e.nodes[i],s=e.nodes[a],c=e.linkWidths?.[r]||.38,l=c+.32;if(t.x<Math.min(o.x,s.x)-l||t.x>Math.max(o.x,s.x)+l||t.y<Math.min(o.y,s.y)-l||t.y>Math.max(o.y,s.y)+l||t.z<Math.min(o.z,s.z)-l||t.z>Math.max(o.z,s.z)+l)continue;let u=s.x-o.x,d=s.y-o.y,f=s.z-o.z,m=Ga(((t.x-o.x)*u+(t.y-o.y)*d+(t.z-o.z)*f)/(u*u+d*d+f*f||1)),h=t.x-o.x-m*u,g=t.y-o.y-m*d,_=t.z-o.z-m*f,v=p.hypot(h,g,_),y=1/(v||1);Ka(n,v-c,h*y,g*y,_*y)}for(let r of e.erosionCuts||[]){let e=t.x-r.x,i=t.y-r.y,a=t.z-r.z,o=p.hypot(e,i,a);o<r.r+.32&&Ka(n,o-r.r,e/(o||1),i/(o||1),a/(o||1))}return Number.isFinite(n.distance)||(n.distance=2),n}function Ja(e,t){let n=qa(e,t),r=Math.abs(t.x)-10,i=Math.abs(t.y+2.1)-2.1,a=Math.abs(t.z)-6.5,o=Math.max(r,0),s=Math.max(i,0),c=Math.max(a,0),l=p.hypot(o,s,c),u=l+Math.min(Math.max(r,i,a),0),d=0,f=0,m=0;l>1e-5?(d=Math.sign(t.x)*o/l,f=Math.sign(t.y+2.1)*s/l,m=Math.sign(t.z)*c/l):r>i&&r>a?d=Math.sign(t.x):i>a?f=Math.sign(t.y+2.1):m=Math.sign(t.z);let h=t.y>-.3||-n.distance<Wa(e.relief,t.y)+.05,g=h?U(e.relief,t.x,t.z):0,_=h?Ha(e.relief,t.x,t.z):{x:0,y:1,z:0},v=(t.y-g)*_.y,y=t.y>-2?Math.max(r,a,v):u;t.y>-2&&v>=Math.max(r,a)&&(d=_.x,f=_.y,m=_.z);let b=-n.distance,x=.045,S=Ga(.5+.5*(y-b)/x),C=d*S-n.x*(1-S),w=f*S-n.y*(1-S),T=m*S-n.z*(1-S),E=p.hypot(C,w,T)||1,D={distance:b+(y-b)*S+x*S*(1-S),x:C/E,y:w/E,z:T/E};for(let n of e.rubble||[]){if(n.mass<=0)continue;let e=p.cbrt(n.mass*3/(4*Math.PI)),r=t.x-n.x,i=t.y-n.y,a=t.z-n.z,o=p.hypot(r,i,a);o-e<D.distance&&Object.assign(D,{distance:o-e,x:r/(o||1),y:i/(o||1),z:a/(o||1)})}for(let n of e.plugs||[]){if(n.mass<=1e-10||Math.abs(t.x-n.x)>n.radius+n.depth||Math.abs(t.y-n.y)>n.radius+n.depth||Math.abs(t.z-n.z)>n.radius+n.depth)continue;let e=La(n,t);e.distance<D.distance&&Object.assign(D,e)}return D}function Ya(e,t){let n=Ja(e,t);if(t.y>4.1)return n;let r=[{distance:10-t.x,x:-1,y:0,z:0},{distance:10+t.x,x:1,y:0,z:0},{distance:6.5-t.z,x:0,y:0,z:-1},{distance:6.5+t.z,x:0,y:0,z:1}];for(let e of r)e.distance<n.distance&&Object.assign(n,e);return n}let W=(e,t)=>({x:e.x+t.x,y:e.y+t.y,z:e.z+t.z}),G=(e,t)=>({x:e.x-t.x,y:e.y-t.y,z:e.z-t.z}),K=(e,t)=>({x:e.x*t,y:e.y*t,z:e.z*t}),q=(e,t)=>e.x*t.x+e.y*t.y+e.z*t.z,J=e=>p.hypot(e.x,e.y,e.z),Y=e=>K(e,1/(J(e)||1)),X=(e,t)=>({x:e.y*t.z-e.z*t.y,y:e.z*t.x-e.x*t.z,z:e.x*t.y-e.y*t.x}),Xa=e=>({x:e.x,y:e.y||0,z:e.z});function Za(e,t){let n=J(e);return n>t?K(e,t/n):e}function Qa(e,t,n){let r=p.cos(n),i=p.sin(n);return W(W(K(e,r),K(X(t,e),i)),K(t,q(t,e)*(1-r)))}let $a=.008;function Z(e,t){let n={...t},r=Ya(e,n);for(let t=0;t<4&&Math.abs(r.distance-$a)>3e-4;t++)n=W(n,K(r,$a-r.distance)),n.x=Math.max(-9.992,Math.min(9.992,n.x)),n.z=Math.max(-6.492,Math.min(6.492,n.z)),n.y=Math.max(-4.192,Math.min(4.092,n.y)),r=Ya(e,n);return{point:n,normal:{x:r.x,y:r.y,z:r.z},gap:r.distance}}function eo(e,t,n,r=1.6){let i=Y(n),a={...t},o=0;for(let t=0;t<35&&o<r;t++){let t=Ya(e,a);if(t.distance<=.009000000000000001){let t=Z(e,a);return{...t.point,normal:t.normal,inside:Math.abs(t.gap-$a)<.015}}let n=Math.min(.12,Math.max(.008,t.distance*.8));a=W(a,K(i,n)),o+=n}return{x:t.x,y:t.y,z:t.z,normal:{x:0,y:1,z:0},inside:!1}}function to(e,t,n,r){let i={x:t,y:r,z:n},a=eo(e,i,{x:0,y:-1,z:0},2),o=eo(e,i,{x:0,y:1,z:0},2);return{floor:a.y-$a,ceiling:o.inside?o.y+$a:1/0,inside:a.inside}}function no(e,t,n,r,i=.35){let a=Y(G(r,n)),o;if(Math.abs(a.y)>.8)o={x:p.cos(i),y:0,z:p.sin(i)*(a.y>0?-1:1)};else{let e=Y(X(a,{x:0,y:1,z:0})),t=Y(G({x:0,y:1,z:0},K(a,a.y)));o=W(K(e,p.sin(i)),K(t,-p.cos(i)))}let s=eo(e,t,o),c=Y(G(a,K(s.normal,q(a,s.normal))));return{...s,heading:p.atan2(c.z,c.x),pitch:p.atan2(c.y,p.hypot(c.x,c.z))}}function ro(e,t,n,r,i){let a=Ya(e,t),o={x:a.x,y:a.y,z:a.z},s=G(n,t),c=G(s,K(o,q(s,o)));if(J(c)<1e-4){let e={x:p.cos(i),y:0,z:p.sin(i)};c=G(e,K(o,q(e,o))),J(c)<1e-4&&(c=X(o,{x:0,y:1,z:0})),J(c)<1e-4&&(c=X(o,{x:1,y:0,z:0}))}c=Y(c);let l=Math.min(r,J(s));for(let n=0;n<5;n++){let n=Z(e,W(t,K(c,l)));if(J(G(n.point,t))<=r+1e-4&&Math.abs(n.gap-$a)<.015)return{position:n.point,normal:n.normal,valid:!0};l*=.5}return{position:t,normal:o,valid:!1}}let io=e=>e<Mi.larva?`egg`:e<Mi.pupa?`larva`:`pupa`;function ao(e,t,n){let r=e.nest.nodes[n],i=Ur(e.seed+`:brood:`+t)/4294967296*Math.PI*2,a=.08+t%5*.025;return Z(e.nest,{x:r.x+p.cos(i)*a,y:r.y-r.r*.92,z:Math.max(-6.3,Math.min(6.3,r.z+p.sin(i)*a))})}function oo(e,t,n=H(e.nest,`royal`,0,e.colonyId||1),r=`worker`){let i=ao(e,t,n),a=Gr(e,t,r);r=a.kind;let o=e.genetics?Pa(e,t,r===`male`,a.sire):void 0;o&&e.genetics&&(e.genetics.embryos++,e.genetics.mutationEvents+=o.mutations.length);let s={id:t,age:0,node:n,...i.point,y:i.point.y+.025,genome:o,kind:r,...a.record?{fertilization:a.record}:{}};return Ma(e,s),ca(e,s),s}function so(e){for(let t of e.brood)if(t.node===void 0||!Number.isFinite(t.y)){let n=t.age,r=t.id;Object.assign(t,oo(e,r,3),{age:n})}}var co={name:`viveiro`,version:`0.45.0`,private:!0,type:`module`,scripts:{start:`vite`,test:`node --test tests/*.test.mjs`,"evaluate:forecast":`node scripts/evaluate-forecasts.mjs`,dev:`vite`,build:`node scripts/check-i18n.ts && tsc --noEmit && vite build`,preview:`vite preview --host 127.0.0.1 --port 4173 --strictPort`,format:`prettier --write src index.html vite.config.ts tsconfig.json`,"build:public":`node scripts/build-public-release.ts`,experiment:`node scripts/run-experiment.ts`,sweep:`node scripts/run-sweep.ts`,sensitivity:`node scripts/run-sensitivity.ts`,"compare:policy":`node scripts/compare-policy.ts`,"i18n:check":`node scripts/check-i18n.ts`,"i18n:inventory":`node scripts/inventory-i18n.ts`},dependencies:{"@stdlib/math-base-special-atan":`0.2.4`,"@stdlib/math-base-special-atan2":`0.3.1`,"@stdlib/math-base-special-cbrt":`0.2.3`,"@stdlib/math-base-special-cos":`0.3.1`,"@stdlib/math-base-special-exp":`0.2.5`,"@stdlib/math-base-special-expm1":`0.2.4`,"@stdlib/math-base-special-hypot":`0.2.4`,"@stdlib/math-base-special-ln":`0.2.5`,"@stdlib/math-base-special-log1p":`0.2.4`,"@stdlib/math-base-special-pow":`0.3.1`,"@stdlib/math-base-special-sin":`0.3.1`,"@stdlib/math-base-special-tan":`0.3.1`,"@stdlib/math-base-special-tanh":`0.2.4`,three:`0.170.0`},devDependencies:{"@babel/parser":`8.1.0`,"@types/node":`^24.0.0`,"@types/three":`^0.170.0`,prettier:`^3.9.10`,typescript:`^7.0.2`,vite:`^8.3.5`},license:`MIT`};let{version:lo}=co,uo=e=>e!==void 0&&Number.isFinite(e)?e:null;function fo(e){let t=[e,...e.colonies||[]],n=t.flatMap(e=>e.brood),r=e.microclimate?.temperature,i=e.gases?.cells??[],a=i.reduce((e,t)=>e+t.volume,0),o=e=>a>0?uo(100*i.reduce((t,n)=>t+n[e],0)/a):null;return{tick:e.tick,modelVersion:lo,population:t.reduce((e,t)=>e+t.ants.length,0),brood:n.length,eggs:n.filter(e=>io(e.age)===`egg`).length,larvae:n.filter(e=>io(e.age)===`larva`).length,pupae:n.filter(e=>io(e.age)===`pupa`).length,colonies:t.length,food:t.reduce((e,t)=>e+t.food+(t.colony.reproductiveFood||0),0),airTemperatureC:uo(e.params.temperatureC),soilTemperatureC:r?.length?uo(r.reduce((e,t)=>e+t,0)/r.length):null,oxygenPercent:o(`oxygen`),carbonDioxidePercent:o(`carbon`)}}function po(e){let t=e.dailyObservations??={version:1,startedTick:e.tick,discarded:0,points:[]};if(e.tick%100!=0)return;let n=fo(e);t.points.at(-1)?.tick===e.tick?t.points[t.points.length-1]=n:t.points.push(n),t.points.length>12e3&&(t.points.shift(),t.discarded++)}function mo(e,t,n){if(t!==`healthChallenge`)return null;if(typeof n!=`number`||!Number.isSafeInteger(n))return!1;for(let t of F(e)){let r=t.ants.find(e=>e.id===n);if(!(!r?.life||!t.colony.survival||(r.health??100)<=0))return r.life.infection=Math.min(1,r.life.infection+Qr.challengeDose),t.colony.survival.challenges++,e.log(`Desafio experimental de infecção aplicado à habitante #`+r.id+`.`,`danger`),!0}return!1}let ho=(e,t,n)=>Math.max(t,Math.min(n,e));function go(e){return B(e.biologicalProfile).materialModel===`relative-demo`?{clay:(e.params.soilClayPercent??I.clayReference)/100,packing:(e.params.soilCompactionPercent??I.packingReference)/100}:null}function _o(e){let t=e.clay-I.clayReference/100,n=e.packing-I.packingReference/100;return{capillary:ho(p.exp(I.capillaryClay*t-I.capillaryPacking*n),.15,3),drainage:ho(p.exp(-I.drainageClay*t-I.drainagePacking*n),.15,3),heat:p.exp(I.heatPacking*n)}}function vo(e,t){let n=e.clay-I.clayReference/100,r=e.packing-I.packingReference/100,i=ho((t-.8)/.2,0,1),a=(1-I.wetSoftening*e.clay*i)/(1-I.wetSoftening*(I.clayReference/100)*i);return{density:1+I.densityPacking*r,cohesion:ho(p.exp(I.cohesionClay*n+I.cohesionPacking*r)*a,.1,3)}}function yo(e,t,n){if(t!==`soilClayPercent`&&t!==`soilCompactionPercent`)return null;if(!go(e)||!Number.isFinite(Number(n)))return!1;let r=Math.max(0,Math.min(100,Number(n)));return e.params[t]=r,e.log(t===`soilClayPercent`?`Teor relativo de argila ajustado para `+r+`% no modelo.`:`Compactação relativa ajustada para `+r+`/100 no modelo.`),!0}function bo(e){let t=Ur(e);return()=>(t=Math.imul(t,1664525)+1013904223>>>0,t/p.pow(2,32))}function xo(e){let t=bo(e+`:brain`);return{version:1,inputs:6,hidden:8,input:Array.from({length:48},()=>(t()-.5)*.4),bias:Array(8).fill(0),output:Array.from({length:8},()=>(t()-.5)*.2),offset:0}}function So(e,t){let n=e.bias.map((n,r)=>p.tanh(t.reduce((t,n,i)=>t+e.input[r*6+i]*n,n)));return{hidden:n,value:n.reduce((t,n,r)=>t+n*e.output[r],e.offset)}}function Co(e,t,n,r=.01){let{hidden:i,value:a}=So(e,t),o=Math.max(-1,Math.min(1,n-a)),s=e=>Math.max(-5,Math.min(5,e));for(let n=0;n<8;n++){let a=o*e.output[n]*(1-p.pow(i[n],2));for(let i=0;i<6;i++)e.input[n*6+i]=s(e.input[n*6+i]+r*a*t[i]);e.bias[n]=s(e.bias[n]+r*a),e.output[n]=s(e.output[n]+r*o*i[n])}return e.offset=s(e.offset+r*o),o}function wo(e){if(!e||typeof e!=`object`)return!1;let t=e;return t.version===1&&t.inputs===6&&t.hidden===8&&[t.input,t.bias,t.output].every((e,t)=>Array.isArray(e)&&e.length===[48,8,8][t]&&e.every(e=>Number.isFinite(e)&&Math.abs(e)<=5))&&Number.isFinite(t.offset)&&Math.abs(t.offset)<=5}function To(e,t=!1){return[Math.max(-1,Math.min(1,e.signal*20)),Math.min(1,(e.visits??+!!e.visited)/3),+!!e.backtrack,+!!e.goalVisible,e.comfort??1,+!!t]}function Eo(e,t,n,r=.05){if(!t.length)return-1;if(n()<r)return Math.min(t.length-1,Math.floor(n()*t.length));let i=t.map(t=>So(e,t).value),a=Math.max(...i),o=i.flatMap((e,t)=>Math.abs(e-a)<1e-9?[t]:[]);return o[Math.min(o.length-1,Math.floor(n()*o.length))]}let Do=(e,t=xo(e))=>({version:1,enabled:!0,brain:structuredClone(t),decisions:0,updates:0,reward:0});function Oo(e,t,n,r){let i=e.learning;if(!i?.enabled)return null;let a=n.map(e=>To(e,!!(t.carrying||t.carryingBrood||t.carryingSoil)));if(!a.length)return null;let o=t.learningBrain??=structuredClone(i.brain),s=Eo(o,a,r,.05),c=t.learningTrace;return c?.finished&&(Co(o,c.features,c.reward+.95*So(o,a[s]).value,.005),t.learningUpdates=(t.learningUpdates??0)+1,i.updates++,i.reward+=c.reward),t.learningTrace={features:a[s],reward:0,tick:e.tick,from:t.node??-1},i.decisions++,n[s].id}function ko(e,t){e.learning?.enabled&&t.learningTrace&&!t.learningTrace.finished&&(t.learningTrace.reward-=5e-4+Math.max(0,35-t.energy)*1e-5+((t.navigation?.contactTicks??0)>5?.001:0))}function Ao(e,t,n,r=!1){let i=e.learning,a=t.learningTrace;i?.enabled&&a&&(a.finished=!0,r&&(a.reward-=.1),n&&(a.reward+=.3,Co(t.learningBrain??=structuredClone(i.brain),a.features,a.reward,.005),t.learningUpdates=(t.learningUpdates??0)+1,i.updates++,i.reward+=a.reward,delete t.learningTrace))}function jo(e,t){let n=e.learning,r=t.learningTrace;if(!n?.enabled||!r)return;let i=t.learningBrain??=structuredClone(n.brain);r.reward-=.5,Co(i,r.features,r.reward,.005),t.learningUpdates=(t.learningUpdates??0)+1,n.updates++,n.reward+=r.reward,delete t.learningTrace}function Mo(e){return e&&typeof e.seed==`string`&&e.seed.length<=128&&Number.isInteger(e.episodes)&&e.episodes>0&&e.episodes<=1e4&&[e.trained,e.baseline,e.untrained].every(e=>e&&Number.isInteger(e.episodes)&&e.episodes>0&&e.episodes<=1e3&&Number.isInteger(e.deliveries)&&e.deliveries>=0&&e.deliveries<=e.episodes&&[e.meanSteps,e.meanReward,e.hazards].every(Number.isFinite))}function No(e,t,n){if(t===`learningPolicy`){let t=n;if(!t||!wo(t.brain)||!Mo(t.report))return e.log(`Política inválida. O treino não foi aplicado.`),!1;for(let n of F(e)){n.learning=Do(n.seed,t.brain),n.learning.training=structuredClone(t.report);for(let e of n.ants)delete e.learningTrace,delete e.learningBrain,delete e.learningUpdates}return e.log(`Política neural experimental aplicada às colônias atuais. Aprendizado usa encontros e objetivos locais.`),!0}if(t===`learningEnabled`){let t=n===1;if(t&&!F(e).some(e=>e.learning))return e.log(`Treine e aplique uma política antes de ativar o aprendizado.`),!1;for(let n of F(e))if(n.learning){n.learning.enabled=t;for(let e of n.ants)delete e.learningTrace}return e.log(t?`Aprendizado local retomado.`:`Navegação ACO retomada.`),!0}return null}var Po={id:`balanced-local`,version:1,sensors:[{id:`cargo`,sample:({agent:e})=>({loaded:+!!e.hasLoad,hunger:Math.max(0,1-e.energy/100)})}],submodels:[{id:`urgency`,compute:({signals:e})=>({value:1+e[`sensor.cargo.loaded`]+e[`sensor.cargo.hunger`]})}],policy:{id:`comfort-first`,weights:({input:e,signals:t})=>e.exits.map(e=>(e.goalVisible?40*t[`model.urgency.value`]:1)*Math.max(.02,e.comfort)*Math.max(.1,1+e.signal*4)/(1+e.visits*3+(e.backtrack?2:0)))}};let Fo=e=>typeof e==`string`&&/^[a-z][a-z0-9-]{0,47}$/.test(e);function Io(e){let t=e;if(!t||t.schema!==1||!Fo(t.id)||!Number.isSafeInteger(t.version)||t.version<1||typeof t.sourceSha256!=`string`||!/^[a-f0-9]{64}$/.test(t.sourceSha256)||Object.keys(t).some(e=>![`schema`,`id`,`version`,`sourceSha256`].includes(e)))throw Error(`Referência de extensão inválida.`);return{schema:1,id:t.id,version:t.version,sourceSha256:t.sourceSha256}}let Lo=/* @__PURE__ */ new Map;function Ro(e,t){let n=Io(t),r=n.id+`@`+n.version;if(!e||e.id!==n.id||e.version!==n.version||!e.policy||!Fo(e.policy.id)||typeof e.policy.weights!=`function`)throw Error(`Contrato de política inválido.`);for(let[t,n]of[[e.sensors??[],`sample`],[e.submodels??[],`compute`]]){let e=/* @__PURE__ */ new Set;if(!Array.isArray(t)||t.length>16)throw Error(`Limite de sistemas locais excedido.`);for(let r of t){if(!r||!Fo(r.id)||e.has(r.id)||typeof r[n]!=`function`)throw Error(`Sistema local inválido ou duplicado.`);e.add(r.id)}}let i=Lo.get(r);if(i&&i.reference.sourceSha256!==n.sourceSha256)throw Error(`Mesma versão de extensão com fonte diferente.`);return i||Lo.set(r,{reference:Object.freeze(n),extension:Object.freeze({...e,sensors:Object.freeze((e.sensors??[]).map(e=>Object.freeze({...e}))),submodels:Object.freeze((e.submodels??[]).map(e=>Object.freeze({...e}))),policy:Object.freeze({...e.policy})})}),{...n}}function zo(e){let t=Io(e),n=Lo.get(t.id+`@`+t.version);if(!n||n.reference.sourceSha256!==t.sourceSha256)throw Error(`Extensão não instalada ou hash diferente: `+t.id+`@`+t.version);return n.extension}Ro(Po,{schema:1,id:Po.id,version:Po.version,sourceSha256:`0c9251693facfcc84844186a8a2f5a9d9942bcf89eb32ae53935407a962ec3fd`});function Bo(e,t){let n=Object.freeze({agent:Object.freeze({energy:e.energy,hasLoad:!!(e.carrying||e.carryingBrood||e.carryingSoil)}),exits:Object.freeze(t.map(e=>Object.freeze({id:e.id,signal:e.signal,comfort:e.comfort??1,visited:e.visited,visits:e.visits??0,backtrack:e.backtrack,goalVisible:e.goalVisible})))});if(n.exits.length>128||new Set(n.exits.map(e=>e.id)).size!==n.exits.length||!Number.isFinite(n.agent.energy)||n.exits.some(e=>!Number.isSafeInteger(e.id)||e.id<0||[e.signal,e.comfort,e.visits].some(e=>!Number.isFinite(e))))throw Error(`Observação local inválida.`);return n}function Vo(e,t,n){let r=zo(e);if(!t.exits.length)return null;let i=Object.freeze({}),a=()=>Object.freeze({input:t,signals:i}),o=(e,t)=>{if(!t||typeof t!=`object`||Array.isArray(t)||Object.keys(t).length>32)throw Error(`Sinais locais inválidos.`);let n={...i};for(let[r,i]of Object.entries(t)){if(!/^[a-z][a-z0-9_]{0,31}$/.test(r)||[`constructor`,`prototype`].includes(r)||!Number.isFinite(i)||Math.abs(i)>1e6)throw Error(`Sinal local fora do contrato.`);let t=e+`.`+r;if(Object.hasOwn(n,t))throw Error(`Sinal local duplicado.`);n[t]=i}i=Object.freeze(n)};for(let e of r.sensors??[])o(`sensor.`+e.id,e.sample(t));for(let e of r.submodels??[])o(`model.`+e.id,e.compute(a()));let s=r.policy.weights(a());if(!Array.isArray(s)||s.length!==t.exits.length||s.some(e=>!Number.isFinite(e)||e<0||e>1e6))throw Error(`Pesos de política fora do contrato.`);let c=s.reduce((e,t)=>e+t,0);if(c<=0)throw Error(`Política sem peso positivo.`);let l=n();if(!Number.isFinite(l)||l<0||l>=1)throw Error(`RNG deve produzir [0,1).`);let u=l*c;for(let e=0;e<s.length;e++)if(u-=s[e],u<0)return t.exits[e].id;return t.exits.at(-1).id}function Ho(e,t,n,r){return!(e.plugs||[]).some(i=>{let a=e.links[i.edge];return a&&(a[0]===t&&a[1]===n||a[1]===t&&a[0]===n)&&i.mass>1e-10&&i.innerRadius<(r.kind===`queen`?.25:.14)*(r.bodyScale||1)+.03})}function Uo(e,t){let n=1,r=1;for(let i of e.plugs||[])if(i.edge===t&&i.mass>1e-10){let e=Math.max(0,Math.min(1,1-i.mass/i.capacity));n*=e+(1-e)*gi.diffusionPorosity,r*=e*e+(1-e*e)*gi.flowPorosity}return{diffusion:n,flow:r}}let Wo={oxygen:.209,carbon:42e-5};function Go(e,t){if(t.node===null||t.node===void 0||t.airborne)return null;let n=e.nest.nodes[t.node],r=t.route?.[0],i=r===void 0?void 0:e.nest.nodes[r];return n?i&&p.hypot(t.x-i.x,(t.y??0)-i.y,t.z-i.z)<p.hypot(t.x-n.x,(t.y??0)-n.y,t.z-n.z)?r:t.node:null}function Ko(e,t,n){let r=new Float64Array(t.cells.length);for(let n of[e,...e.colonies||[]]){let i=ba(n).activity;for(let t of n.ants){let n=Go(e,t);n!=null&&(r[n]+=2e-6*p.pow(t.bodyScale??1,3)*(t.metabolicCost??1)*i)}for(let a of n.brood){let o=a.carrier===void 0?void 0:n.ants.find(e=>e.id===a.carrier),s=o?Go(e,o):a.node;s!=null&&t.cells[s]&&(r[s]+=3e-7*i)}}r.forEach((e,r)=>{let i=t.cells[r],a=Math.min(i.oxygen,e*n);i.oxygen-=a,i.carbon+=a*.8,t.consumed+=a,t.produced+=a*.8})}let qo=(e,t)=>{let n=t==null?void 0:e?.cells[t];return n?{oxygen:n.oxygen/n.volume,carbon:n.carbon/n.volume}:Wo},Jo=e=>Math.min(1,Math.max(0,(.16-e.oxygen)/.12,(e.carbon-.02)/.08));function Yo(e,t,n){let r=t.node==null?void 0:e.nest.nodes[t.node],i=e.nest.nodes[n];return!r||!i||p.hypot(r.x-i.x,r.y-i.y,r.z-i.z)>1.2?1:1-.95*Jo(qo(e.gases,n))}function Xo(e,t){return .05*Jo(qo(e.gases,Go(e,t)))}function Zo(e,t,n,r=null){let i=[{node:t,path:[],cost:0}],a=/* @__PURE__ */ new Map([[t,0]]);for(;i.length;){i.sort((e,t)=>e.cost-t.cost);let t=i.shift();if(t.node===n)return t.path;for(let[n,o,s]of e){if(r&&(n===r[0]&&o===r[1]||o===r[0]&&n===r[1]))continue;let e=n===t.node?o:o===t.node?n:-1;if(e<0)continue;let c=t.cost+s;c>=(a.get(e)??1/0)||(a.set(e,c),i.push({node:e,path:[...t.path,e],cost:c}))}}return[]}function Qo(e,t,n,r){if(n===r||!e.nest.links.some(([e,t])=>e===n&&t===r||e===r&&t===n))return;let i=e.nest.nodes[n],a=e.nest.nodes[r],o=(t.distanceWalked||0)-(t.lastNodeDistance??t.distanceWalked??0),s=Math.max(.05,o||p.hypot(i.x-a.x,i.y-a.y,i.z-a.z));t.knownEdges??=[];let c=t.knownEdges.find(([e,t])=>e===n&&t===r||e===r&&t===n);c?c[2]=c[2]*.7+s*.3:(t.knownEdges.push([n,r,s]),t.knownEdges.length>64&&t.knownEdges.shift()),t.recentNodes=[...t.recentNodes||[],n].slice(-8),t.lastNodeDistance=t.distanceWalked||0}function $o(e,t){if(!e.length)throw RangeError(`A amostragem precisa de pelo menos uma opção.`);let n=e.map(e=>Number.isFinite(e)?Math.max(0,e):0),r=n.reduce((e,t)=>e+t,0);if(r<=0)return Math.min(e.length-1,Math.floor(t()*e.length));let i=Math.max(0,Math.min(1-2**-52,t()))*r;for(let e=0;e<n.length;e++)if(i-=n[e],i<0)return e;return n.length-1}function es(e,t,n,r={}){if(e.length!==t.length)throw RangeError(`Sensores ACO incompatíveis.`);let i=Math.max(0,Math.min(5,r.alpha??1.4)),a=Math.max(0,Math.min(5,r.beta??2)),o=Math.max(0,Math.min(1,r.exploration??.05)),s=e.map((e,n)=>i*p.log(Math.max(1e-6,e))+a*p.log(Math.max(1e-6,t[n]))),c=Math.max(...s),l=s.map(e=>p.exp(e-c)),u=l.reduce((e,t)=>e+t,0);return $o(l.map(e=>(1-o)*e/u+o/l.length),n)}function ts(e,t){return e.length?e.length===1?e[0].id:e[es(e.map(e=>p.exp(Math.max(-6,Math.min(6,e.signal*60)))),e.map(e=>(e.comfort??1)*(e.goalVisible?100:(e.visits||0)>=3?1e-6:e.backtrack?.12:e.visited?.5:1)),t,{alpha:1.4,beta:2,exploration:.025})].id:null}let ns=[`entrance`,`royal`,`nursery`,`storage`,`waste`];function rs(e,t,n){let r=t.routeIntent;if(!r)return!0;let i=e.nest.nodes[n];return r.tag===`node`?n===r.destination:i.type===r.tag&&(i.colonyId||1)===r.owner}function is(e,t,n=null){let r=t.routeIntent;if(!r||t.node==null)return!1;if(rs(e,t,t.node))return delete t.routeIntent,t.route=[],!1;let i=Zo(t.knownEdges||[],t.node,r.destination,n);if(!e.decisionExtension&&!e.learning?.enabled&&i.length&&Ho(e.nest,t.node,i[0],t)&&Yo(e,t,i[0])>.8&&e.range(0,1)>.04)return t.route=i,!0;let a=e.nest.nodes[t.node],o=e.nest.links.flatMap(([e,n])=>e===t.node?[n]:n===t.node?[e]:[]);o=[...new Set(o)].filter(n=>Ho(e.nest,t.node,n,t));let s=n?o.filter(e=>!(t.node===n[0]&&e===n[1]||t.node===n[1]&&e===n[0])):o;s.length&&(o=s);let c=o.map(n=>{let i=e.nest.nodes[n],o=p.hypot(i.x-a.x,i.y-a.y,i.z-a.z);return{id:n,comfort:Yo(e,t,n),signal:(e.routeSignal?.(t.node,n,r.odor,r.owner)||0)*(t.pheromoneGain??1),visited:(t.recentNodes||[]).includes(n),visits:(t.recentNodes||[]).filter(e=>e===n).length,backtrack:t.recentNodes?.at(-1)===n,goalVisible:o<=1.2&&(r.tag===`node`?n===r.destination:i.type===r.tag&&(i.colonyId||1)===r.owner)}}),l=()=>e.range(0,1),u=e.decisionExtension?Vo(e.decisionExtension,Bo(t,c),l):e.learning?.enabled?Oo(e,t,c,l):ts(c,l);return e.decisionExtension&&c.length&&(e.extensionDecisions=(e.extensionDecisions??0)+1),t.route=u===null?[]:[u],u!==null}function Q(e,t,n,r=t.colonyId||1){let i=e.nest.nodes[n];if(!i||t.node==null)return;let a=t.route?.[0],o=t.tunnelCenter,s=e.nest.nodes[t.node],c=a!==void 0&&o&&p.hypot(o.x-s.x,o.y-s.y,o.z-s.z)>.03;t.routeIntent={destination:n,tag:ns.includes(i.type)?i.type:`node`,odor:ns.includes(i.type)?i.type:i.type===`front`||i.type===`chamber`?`front`:`entrance`,owner:r},c?t.route=[a]:(t.lastNodeDistance=t.distanceWalked||0,is(e,t))}let as=e=>!!(e.hasFood||e.carrying>0||e.carryingBrood||e.carryingMimic||e.carryingSoil||e.carryingWaste),os={sensingRadius:1.2,safetyRadius:.52,relaxationTicks:2.8,repulsion:.018,lateralStrength:.028};function ss(e,t,n,r,i={}){let a=i.normal||{x:0,y:1,z:0},o=Y(n),s=Y(X(o,a)),c=e.navigation?.velocity||{x:0,y:0,z:0},l=K(G(K(o,r),c),1/os.relaxationTicks),u={x:0,y:0,z:0},d=0,f=null;for(let n of t){let t=G(Xa(e),Xa(n)),r=J(t);if(r>os.safetyRadius)continue;let i=r>.001?K(t,1/r):K(s,e.id<n.id?1:-1),a=as(n)&&!as(e)?2:1,c=Math.min(.1,os.repulsion*a*Math.max(0,1/(r+.08)-1/(os.safetyRadius+.08)));u=W(u,K(i,c)),q(i,o)<-.25&&(d+=a*(1-r/os.safetyRadius),f=n)}d>0&&(u=W(u,K(s,d*os.lateralStrength)),i.climb&&(u.y+=d*.009));let p=W(l,u),m=Za(W(c,p),r*1.15);return{desired:l,repulsion:u,total:p,velocity:m,pressure:d,frontal:f}}function cs(e){return e.navigation??={velocity:{x:0,y:0,z:0},contactTicks:0,stagnantTicks:0,lastCell:``,turnUntil:0,turnAngle:0,wallAngle:.35,retreats:0},e.navigation}function ls(e,t,n,r,i){let a=cs(t);return a.contactTicks=n.frontal?a.contactTicks+1:Math.max(0,a.contactTicks-1),a.contactTicks>=4&&e.tick>=a.turnUntil&&(a.turnAngle=e.range(Math.PI/6,Math.PI/2),a.turnUntil=e.tick+e.range(6,12)),n.frontal&&as(n.frontal)&&!as(t)&&a.contactTicks>=3&&(a.yieldUntil=e.tick+8+t.id%7),e.tick<(a.yieldUntil||0)?(t.state=`Cedendo passagem à carga`,Y(W(K(r,-.65),K(X(r,i),.75)))):e.tick<a.turnUntil?(t.state=`Contato Antenal`,Qa(r,i,a.turnAngle)):r}function us(e){let t=cs(e),n=[e.x,e.y||0,e.z].map(e=>Math.floor(e/.4)).join(`:`);t.stagnantTicks=n===t.lastCell?t.stagnantTicks+1:0,t.lastCell=n}function ds(e,t,n){let r=cs(t);if(n<0||t.kind!==`worker`||as(t)||(e.nest.linkWidths?.[n]||.38)>=.64||(r.stagnantTicks>65&&!r.excavateUntil&&(r.excavateUntil=e.tick+16,e.log(`Uma operária começou a alargar uma passagem congestionada.`,`dig`)),!r.excavateUntil))return!1;if(e.tick>=r.excavateUntil)return r.excavateUntil=0,r.stagnantTicks=0,!1;if(t.state=`Escavar`,e.tick%4==0){if(e.nest.lastWidenTick??=[],e.nest.lastWidenTick[n]===e.tick)return!0;e.nest.lastWidenTick[n]=e.tick,e.nest.linkWidths??=e.nest.links.map(()=>.38);let r=e.nest.linkWidths[n]||.38,i=Math.min(.64,r+.012);if(i>r){if(e.nest.linkWidths[n]=i,e.nest.revision++,e.recordSoilRemoval){let[a,o]=e.nest.links[n].map(t=>e.nest.nodes[t]),s=Math.PI*(p.pow(i,2)-p.pow(r,2))*p.hypot(a.x-o.x,a.y-o.y,a.z-o.z);e.recordSoilRemoval(t,s)}else t.carryingSoil=(t.carryingSoil||0)+(i-r)}}return!0}let fs=e=>[e.x,e.y,e.z].map(e=>Math.round(e/.075)).join(`:`);function ps(e,t,n){let r={position:t,normal:Z(e,t).normal,cost:0,estimate:J(G(n,t)),parent:null},i=[r],a=/* @__PURE__ */ new Map([[fs(t),0]]),o=r;for(let t=0;i.length&&t<500;t++){let t=0;for(let e=1;e<i.length;e++)i[e].estimate<i[t].estimate&&(t=e);let r=i.splice(t,1)[0],s=J(G(n,r.position));if(s<J(G(n,o.position))&&(o=r),s<.07)break;let c=r.normal,l=G(G(n,r.position),K(c,q(G(n,r.position),c)));J(l)<.001&&(l=X(c,{x:0,y:1,z:0})),J(l)<.001&&(l=X(c,{x:1,y:0,z:0}));let u=Y(l),d=Y(X(c,u));for(let t=0;t<12;t++){let o=t*Math.PI/6,s=W(K(u,p.cos(o)),K(d,p.sin(o))),c=W(r.position,K(s,.14)),l=ro(e,r.position,c,.145,p.atan2(s.z,s.x)),f=J(G(l.position,r.position));if(!l.valid||f<.045||!ms(e,r.position,l.position))continue;let m=r.cost+f,h=fs(l.position);m>=(a.get(h)??1/0)-.001||(a.set(h,m),i.push({...l,cost:m,position:l.position,parent:r,estimate:m+J(G(n,l.position))*1.1}))}}if(!o.parent||J(G(n,o.position))>r.estimate-.02)return[];let s=[];for(let e=o;e?.parent;e=e.parent)s.unshift({position:e.position,normal:e.normal});if(J(G(o.position,n))<.08){let t=Z(e,n);s.push({position:t.point,normal:t.normal})}return s}function ms(e,t,n){let r=G(n,t),i=Math.max(2,Math.ceil(J(r)/.025));for(let n=1;n<=i;n++){let a=Ya(e,W(t,K(r,n/i))).distance;if(a<-.003||a>.035)return!1}return!0}let hs=/* @__PURE__ */ new WeakMap,gs=.8,_s=(e,t,n)=>e+`:`+t+`:`+n;function vs(e,t,n=1.2){let r=hs.get(e);if(!r||r.tick!==e.tick){r={tick:e.tick,cells:/* @__PURE__ */ new Map,queries:/* @__PURE__ */ new Map};for(let t of e.neighborAgents||e.ants){let e=_s(Math.floor(t.x/gs),Math.floor((t.y||0)/gs),Math.floor(t.z/gs));r.cells.has(e)||r.cells.set(e,[]),r.cells.get(e).push(t)}hs.set(e,r)}let i=t.id+`:`+n;if(r.queries.has(i))return r.queries.get(i);let a=[],o=Math.ceil(n/gs),s=Math.floor(t.x/gs),c=Math.floor((t.y||0)/gs),l=Math.floor(t.z/gs);for(let e=c-o;e<=c+o;e++)for(let i=l-o;i<=l+o;i++)for(let c=s-o;c<=s+o;c++)for(let o of r.cells.get(_s(c,e,i))||[])o.id!==t.id&&p.hypot(o.x-t.x,(o.y||0)-(t.y||0),o.z-t.z)<=n&&a.push(o);return r.queries.set(i,a),a}function ys(e){hs.delete(e)}function bs(e,t,n,r,i=0,a={x:0,y:1,z:0}){let o={x:p.cos(r)*p.cos(i),y:p.sin(i),z:p.sin(r)*p.cos(i)},s={x:o.y*a.z-o.z*a.y,y:o.z*a.x-o.x*a.z,z:o.x*a.y-o.y*a.x};for(let r of vs(e,t)){let e=n.x-r.x,i=(n.y||0)-(r.y||0),c=n.z-r.z;if(e*e+i*i+c*c>p.pow(t.x-r.x,2)+p.pow((t.y||0)-(r.y||0),2)+p.pow(t.z-r.z,2)+1e-4)continue;let l=Math.abs(e*a.x+i*a.y+c*a.z),u=e*o.x+i*o.y+c*o.z,d=e*s.x+i*s.y+c*s.z,f=((t.bodyScale||1)+(r.bodyScale||1))/2,m=([`queen`,`gyne`].includes(r.kind||``)?.53:.38)*f,h=([`queen`,`gyne`].includes(r.kind||``)?.25:.14)*f;if(l<.18&&p.pow(u/m,2)+p.pow(d/h,2)<1)return!1}return!0}function xs(e,t,n,r){let i=Xa(t),a=t.normal??{x:0,y:1,z:0},o=G(n,i),s=Y(G(o,K(a,q(o,a))));J(s)<.001&&(s=Y(X(a,{x:0,y:1,z:0}))),J(s)<.001&&(s={x:1,y:0,z:0});let c=Y(X(a,s)),l=t.id%2?1:-1,u=null,d=-1/0;for(let a of[0,.45,-.45,.9,-.9,1.4,-1.4,2.1,-2.1,Math.PI]){let o=W(K(s,p.cos(a)),K(c,p.sin(a)*l)),f=ro(e.nest,i,a===0?n:W(i,K(o,r)),r,t.angle),m=G(f.position,i),h=J(m);if(!f.valid||h<1e-4||!ms(e.nest,i,f.position))continue;let g=p.hypot(m.x,m.z)>.001?p.atan2(m.z,m.x):t.angle,_=p.atan2(m.y,p.hypot(m.x,m.z));if(!bs(e,t,f.position,g,_,f.normal))continue;let v=q(Y(m),s)+h/r*.2-Math.abs(a)*.015;if(v>d&&(u=f,d=v),a===0&&u)return u}return u}function Ss(e,t,n,r,i){t.supportMotion={points:[{position:n,normal:r}],center:i,blockedTicks:0,goal:{position:n,normal:r},bestDistance:J(G(n,Xa(t))),noProgressTicks:0}}function Cs(e,t,n){let r=t.supportMotion;if(!r)return;let i=r.points[0];if(!i){t.tunnelCenter=r.center,t.tunnelY=r.center.y,delete t.supportMotion;return}r.goal??={position:i.position,normal:i.normal};let a=Z(e.nest,i.position);i.position=a.point,i.normal=a.normal;let o=G(i.position,Xa(t)),s=J(o),c=J(G(r.goal.position,Xa(t)));if(c<(r.bestDistance??1/0)-.015?(r.bestDistance=c,r.noProgressTicks=0):r.noProgressTicks=(r.noProgressTicks||0)+1,(r.noProgressTicks||0)>10&&s<n&&q(t.normal||i.normal,i.normal)>.75){r.points.shift(),r.noProgressTicks=0,r.bestDistance=1/0;return}if((r.noProgressTicks||0)>75){delete t.supportMotion,cs(t).retreating=!0,t.state=`Procurando passagem pela parede`;return}if(r.searchCooldown=Math.max(0,(r.searchCooldown||0)-1),(r.noProgressTicks||0)>10&&!r.searchCooldown){let n=ps(e.nest,Xa(t),r.goal.position);if(r.searchCooldown=35+t.id%15,n.length){r.points=[...n,r.goal],r.noProgressTicks=0;return}}if(s<.001){t.normal=i.normal,r.points.shift();return}let l=xs(e,t,i.position,n),u=l?.position??Xa(t),d=G(u,Xa(t)),f=p.hypot(d.x,d.z)>.001?p.atan2(d.z,d.x):t.angle,m=p.atan2(d.y,p.hypot(d.x,d.z));l?(r.blockedTicks=0,t.distanceWalked=(t.distanceWalked||0)+J(d),cs(t).velocity=d,Object.assign(t,u,{normal:l.normal,angle:f,pitch:m}),t.state=Math.abs(l.normal.y)<.8?d.y<-.001?`Descendo pela parede`:d.y>.001?`Subindo pela parede`:`Contornando uma borda`:`Percorrendo o piso`,J(G(u,i.position))<.012&&r.points.shift()):(t.state=`Contato Antenal`,r.blockedTicks++,(r.blockedTicks>45||(r.noProgressTicks||0)>100)&&(delete t.supportMotion,cs(t).retreating=!0))}function ws(e,t,n){if((t.y||0)>=-.04)return!1;let r=Xa(t),i=Ya(e.nest,r);if(Math.abs(i.distance-.008)<=.012)return!1;let a=Z(e.nest,r),o=G(a.point,r);if(Math.abs(a.gap-.008)>.025)return!1;let s=J(o),c=K(o,Math.min(n,s)/(s||1));return Object.assign(t,W(r,c),{normal:a.normal,state:`Ajustando o apoio`}),t.distanceWalked=(t.distanceWalked||0)+J(c),cs(t).velocity=c,!0}function Ts(e,t,n){let r=e.ecology?.mimics.find(e=>e.id===t.carryingMimic&&e.carrier===t.id);if(!r)return!1;if(r.destination??=H(e.nest,`nursery`,0,t.colonyId||1),n!==r.destination)return Q(e,t,r.destination),!0;if(r.placing)return!0;t.route=[],r.placing=!0;let i=ao(e,r.id,n);return Ss(e,t,i.point,i.normal,e.nest.nodes[n]),!0}let Es=()=>({version:1,profiles:{},territory:{},deposited:0,evaporated:0,lastEvent:-1e3,contacts:0,intimidations:0,attacks:0,retreats:0,camouflages:0,stolen:0});function Ds(e){let{random:t}=Da(e.seed+`:odor:`+(e.colonyId||1)),n=e.genetics?.queen.genome,r=[`antennae`,`efficiency`,`care`,`exploration`].map(e=>.15+t()*1.3+(n?Aa(n,e):.5)*.4),i=r.reduce((e,t)=>e+t,0);return r.map(e=>e/i)}function Os(e,t){return Math.sqrt(e.reduce((e,n,r)=>e+p.pow(n-(t[r]||0),2),0))}function ks(e){e.socialChemistry??=Es();let t=e.socialChemistry;for(let n of F(e)){n.socialChemistry=t;let r=String(n.colonyId||1),i=t.profiles[r]??=Ds(n);t.territory[r]??=Array(1040).fill(0);for(let t of n.ants){t.health??=100,t.odorMask&&e.tick>t.odorMask.until&&(t.odorMask.strength=Math.max(0,t.odorMask.strength-.006),t.odorMask.strength||delete t.odorMask);let n=t.odorMask,r=n?.strength||0;t.bodyOdor=i.map((e,t)=>e*(1-r)+(n?.profile[t]||0)*r)}}}function As(e,t,n){let r=e.socialChemistry?.profiles[String(t.colonyId||1)];return!r||!n.bodyOdor?(t.colonyId||1)===(n.colonyId||1):Os(r,n.bodyOdor)<.095/(t.pheromoneGain||1)}function js(e,t,n){ks(e);let r=Vr(e).filter(e=>e.node===null&&!e.airborne&&p.hypot(e.x-t,e.z-n)<1.2).sort((e,r)=>p.hypot(e.x-t,e.z-n)-p.hypot(r.x-t,r.z-n))[0];if(!r)return e.log(`Não há formiga na superfície perto do ponto escolhido.`),!1;let i=e.socialChemistry.profiles[String(r.colonyId||1)],a=Object.values(e.socialChemistry.profiles).find(e=>Os(e,i)>.15),o=i.indexOf(Math.min(...i)),s=a||i.map((e,t)=>+(t===o));return r.odorMask={profile:[...s],strength:1,until:e.tick+200},r.bodyOdor=[...s],e.log(`Um odor estranho foi aplicado à formiga #`+r.id+`. Observe o próximo contato.`,`info`),!0}let Ms=/* @__PURE__ */ new WeakMap,Ns=(e,t)=>Ms.get(e)?.get(t);function Ps(e,t){e.decisionExtension&&(t.decisionExtension={...e.decisionExtension},t.extensionDecisions??=0),t.microclimate=e.microclimate,t.gases=e.gases,t.ecology=e.ecology,t.socialChemistry=e.socialChemistry,t.nest=e.nest,t.landscape=e.landscape,t.soil=e.soil,t.nestOdors=e.nestOdors,t.pheromones=e.pheromones,t.plants=e.plants,t.patches=e.patches,t.predators=e.predators,t.params=e.params,t.tick=e.tick}function Fs(e){let t=Vr(e),n=new Map(F(e).map(e=>[e.colonyId||1,e]));for(let t of F(e))Ms.set(t,n);for(let n of F(e))Object.defineProperty(n,"neighborAgents",{value:t,writable:!0,configurable:!0,enumerable:!1})}function Is(e,t,n){e.colonyId??=1,e.colonies=(e.colonies||[]).map(e=>n(e,t));for(let t of F(e)){for(let e of t.ants)e.colonyId??=t.colonyId||1;t.founding&&t.founding.front===void 0&&t.nest.nodes[0]?.name===`Primeiro buraco`&&(t.founding.entry=0,t.founding.front=1),t!==e&&Ps(e,t)}Fs(e)}function Ls(e,t,n){if(t.node===null)return;if(n.phase===`exit`){Q(e,t,n.entry,n.owner);return}let r=(`nestOdors`in e?e.nestOdors:void 0)?.fields[n.owner+`:storage`]?.[t.node]||0;n.goal??=r>1e-6?`storage`:`royal`,t.routeIntent={destination:n.entry,tag:n.goal,odor:n.goal,owner:n.owner},is(e,t)}function Rs(e,t,n){let r=t.intrusion;if(!r)return!1;if(r.phase===`exit`&&n===r.entry)return t.lastEntrance=r.home,delete t.intrusion,!1;if(r.phase!==`search`)return!0;let i=e.nest.nodes[n],a=Ns(e,r.owner);if((i.colonyId||1)!==r.owner)return!0;if(!(a&&Kr(a,n))&&!ia(e.nest,n,r.owner))return r.goal=`storage`,Ls(e,t,r),!0;if(p.hypot(t.x-i.x,(t.y||0)-i.y,t.z-i.z)>i.r+.25){let n=Z(e.nest,{x:i.x-.1,y:i.y-i.r*.9,z:i.z});return Ss(e,t,n.point,n.normal,i),!0}let o=a?Yr(a,Math.min(.35,Math.max(0,a.food-.2)),`stolen`,n,!!a.colony.stores):0;return a&&(t.carrying+=o,e.socialChemistry&&(e.socialChemistry.stolen+=o)),r.phase=`exit`,t.route=[],Ls(e,t,r),t.state=o?`Levando alimento de outro ninho`:`Saindo sem encontrar estoque`,!0}function zs(e){let t=e.normal||{x:0,y:1,z:0};return{x:e.x+t.x*.12+p.cos(e.angle||0)*.14,y:(e.y||0)+t.y*.12+p.sin(e.pitch||0)*.14,z:e.z+t.z*.12+p.sin(e.angle||0)*.14}}function Bs(e,t,n){let r=zs(t),i=zs(n);for(let t=0;t<=5;t++){let n=t/5;if(Ja(e,{x:r.x+(i.x-r.x)*n,y:r.y+(i.y-r.y)*n,z:r.z+(i.z-r.z)*n}).distance<-.005)return!1}return!0}function Vs(e){if(!F(e).some(e=>e.colony.survival))return null;ys(e);let t=Vr(e),n=new Map(t.map(e=>[e.id,e])),r=F(e).flatMap(e=>e.colony.waste).map(e=>({mass:e.mass,point:e.carrier===void 0?e:n.get(e.carrier)??e})),i=/* @__PURE__ */ new Map,a=(e,t)=>p.hypot(e.x-t.x,(e.y??0)-(t.y??0),e.z-t.z);for(let n of t){if(!n.life)continue;let t=0;for(let i of r){let r=a(n,i.point);r<.45&&Bs(e.nest,n,i.point)&&(t+=i.mass*(1-r/.45)*Qr.wasteExposurePerDay)}for(let r of vs(e,n,.45)){let i=r.life?.infection??0;i>0&&Bs(e.nest,n,r)&&(t+=i*Qr.contactExposurePerDay)}let o=.5+(V(e.microclimate,{x:n.x,y:n.y??0,z:n.z})?.water??.55);i.set(n.id,Math.min(4,Math.max(0,t*o)))}return i}let Hs=e=>e===`queen`||e===`gyne`?Qr.queenScaleDays:e===`male`?Qr.maleScaleDays:Qr.workerScaleDays,Us=(e,t)=>p.pow(Math.max(0,e/Hs(t)),Qr.ageShape);function Ws(e,t,n,r){let i=t+n;if(i===0)return{infection:e,integral:e*r};let a=t/i,o=-p.expm1(-i*r);return{infection:Math.max(0,Math.min(1,a+(e-a)*(1-o))),integral:Math.max(0,a*r+(e-a)*o/i)}}function Gs(e,t,n=0){let r=t.life;if(!r)return null;if((t.health??100)<=0)return`combat`;if((t.kind===`queen`?e.queenHealth:t.energy)<=0)return`starvation`;let i=Math.max(0,(e.tick-r.lastTick)/100),a=r.ageHazard,o=r.diseaseHazard,s=Math.max(0,Math.min(1,t.energy/100)),c=1-(t.health??100)/100,l=Ws(r.infection,n,Qr.clearancePerDay*(.25+.75*s),i);r.infection=l.infection,r.diseaseHazard+=Qr.diseaseHazardPerDay*(1+Qr.woundHazardMultiplier*c)*l.integral,r.ageHazard=Us(t.age,t.kind),r.lastTick=e.tick,r.lastAge=t.age;let u=r.ageHazard>=r.ageBudget,d=r.diseaseHazard>=r.diseaseBudget;if(u||d)return d?u&&(r.ageBudget-a)/(r.ageHazard-a)<=(r.diseaseBudget-o)/(r.diseaseHazard-o)?`age`:`disease`:`age`;let f=Math.min(100-(t.health??100),Qr.repairHpPerDay*i)*Qr.repairFoodPerHp,p=Math.min(t.crop,f);return t.crop-=p,p<f&&t.kind===`queen`&&Ji(e)&&(p+=Yi(e,`maintenance`,f-p)),r.repairFood+=p,t.health=Math.min(100,(t.health??100)+p/Qr.repairFoodPerHp),null}function Ks(e,t){let n=e.colony.survival;if(!n||!t.life||t.life.deathRecorded)return;let r=t.deathCause??(t.kind===`male`?`reproduction`:`unknown`),i=Object.hasOwn(n.causes,r)?r:`unknown`;n.causes[i]++,t.life.deathRecorded=!0,e.deaths=n.initialDeaths+Object.values(n.causes).reduce((e,t)=>e+t,0)}let qs=e=>B(e.biologicalProfile).fertilityModel===`finite-demo`;function Js(e,t,n){let r=e.colony.fertility;return!r||!t.genome||t.genome.ploidy!==1||r.pools.length>=Wr.maxMates||r.pools.some(e=>e.maleId===t.id)?!1:(r.pools.push({maleId:t.id,genome:structuredClone(t.genome),tick:e.tick,origin:n,received:Wr.creditsPerMating,viable:Wr.creditsPerMating,used:0,lost:0}),!0)}function Ys(e){if(qs(e)&&(e.colony.fertility={version:1,lastTick:e.tick,pools:[],femaleAttempts:0,fertilized:0,failed:0,intentionalMales:0},!e.founding)){let t=e.ants.find(e=>e.kind===`male`);t&&Js(e,t,`scenario`)}}function Xs(e,t,n){return!e.colony.fertility||e.founding?.phase!==`flight`||t.kind!==`queen`||n.kind!==`male`||!t.airborne||!n.airborne||!e.ants.includes(t)||!e.ants.includes(n)||(t.health??100)<=0||(n.health??100)<=0||p.hypot(t.x-n.x,(t.y??0)-(n.y??0),t.z-n.z)>=.3?!1:Js(e,n,`contact`)}function Zs(e){let t=e.colony.fertility;if(!t||e.tick<=t.lastTick)return;let n=-p.expm1(-Wr.decayPerDay*(e.tick-t.lastTick)/100);for(let e of t.pools){let t=e.viable*n;e.viable-=t,e.lost+=t}t.lastTick=e.tick}function Qs(e){return!e.colony.fertility||e.colony.fertility.pools.some(e=>e.viable>=Wr.usePerFemale)}function $s(e=[]){return{version:1,removed:e.reduce((e,t)=>e+(t.carryingSoil||0),0),eroded:0,deposited:0,deposits:[],projects:[],integrity:[],lastProject:-500,nextId:1}}function ec(e,t,n){n>0&&(e.soil.removed+=n,t.carryingSoil=(t.carryingSoil||0)+n)}function tc(e,t){let n=t.carryingSoil||0;if(!n)return;let r=e.soil.deposits,i=r.find(e=>p.hypot(e.x-t.x,e.z-t.z)<.45);i||(i={id:e.soil.nextId++,x:t.x,y:t.y||0,z:t.z,mass:0},r.push(i)),i.mass+=n,e.soil.deposited+=n,t.carryingSoil=0}function nc(e,t){let n=t.carryingSoil||0;n&&(e.nest.rubble??=[],e.nest.rubble.push({id:e.soil.nextId++,x:t.x,y:(t.y||0)-.06,z:t.z,mass:n}),t.carryingSoil=0,e.nest.revision++)}let rc=e=>p.cbrt(Math.max(0,e)*3/(4*Math.PI)),$=(e,t)=>p.hypot(e.x-t.x,e.y-t.y,e.z-t.z);function ic(e){let t=e.nest.nodes.map(e=>Math.max(.01,4/3*Math.PI*p.pow(e.r,3))),n=e.nest.links.map(([n,r],i)=>{let a=e.nest.nodes[n],o=e.nest.nodes[r],s=Math.max(.1,p.hypot(a.x-o.x,a.y-o.y,a.z-o.z)),c=e.nest.linkWidths?.[i]??.38,l=Math.PI*c*c;t[n]+=l*s/2,t[r]+=l*s/2;let u=1;for(let t of e.nest.rubble||[]){if(t.mass<=1e-6)continue;let e=o.x-a.x,n=o.y-a.y,r=o.z-a.z,i=e*e+n*n+r*r,s=Math.max(0,Math.min(1,((t.x-a.x)*e+(t.y-a.y)*n+(t.z-a.z)*r)/Math.max(i,1e-4))),l=p.hypot(t.x-a.x-s*e,t.y-a.y-s*n,t.z-a.z-s*r),d=rc(t.mass),f=Math.max(0,Math.min(1,(c+d-l)/(2*c)));u=Math.min(u,Math.max(0,1-p.pow(d/c,2)*f))}let d=((V(e.microclimate,a)?.temperature??24)+(V(e.microclimate,o)?.temperature??24))/2,f=e.params.temperatureC??24,m=Uo(e.nest,i);return{a:n,b:r,diffusion:5e-4*l/s*p.pow(u,2)*m.diffusion,conductance:.02*p.pow(c,4)/s*p.pow(u,4)*m.flow,head:.02*(d-f)/(f+273.15)*(o.y-a.y)}});for(let n of e.nest.plugs||[]){let r=e.nest.links[n.edge];if(r)for(let e of r)t[e]=Math.max(.01,t[e]-n.mass/2)}return{volume:t,ventDiffusion:e.nest.nodes.map(e=>.003*Math.PI*e.r*e.r/Math.max(.1,e.r)),edges:n,vents:e.nest.nodes.flatMap((e,t)=>e.type===`entrance`?[t]:[])}}function ac(e,t){e.gases||={version:1,cells:[],pressure:[],flow:[],steps:0,residual:0,initialOxygen:0,initialCarbon:0,geometryOxygen:0,geometryCarbon:0,boundaryOxygen:0,boundaryCarbon:0,consumed:0,produced:0};let n=e.gases,r=n.cells.length===0;for(let e=0;e<t.volume.length;e++){let i=n.cells[e],a=t.volume[e];if(i){let e=a/i.volume,t=i.oxygen*(e-1),r=i.carbon*(e-1);i.volume=a,i.oxygen+=t,i.carbon+=r,n.geometryOxygen+=t,n.geometryCarbon+=r}else{let i=t.edges.flatMap(t=>t.a===e?[t.b]:t.b===e?[t.a]:[]).map(e=>n.cells[e]).find(Boolean),o=a*(i?i.oxygen/i.volume:Wo.oxygen),s=a*(i?i.carbon/i.volume:Wo.carbon);n.cells[e]={volume:a,oxygen:o,carbon:s},r?(n.initialOxygen+=o,n.initialCarbon+=s):(n.geometryOxygen+=o,n.geometryCarbon+=s)}}for(let e of n.cells.slice(t.volume.length))n.geometryOxygen-=e.oxygen,n.geometryCarbon-=e.carbon;return n.cells.length=t.volume.length,n}function oc(e,t,n){let r=t.volume.length,i=/* @__PURE__ */ new Map;for(let n of t.vents){let t=e.nest.nodes[n];i.set(n,.04*((e.params.windX??0)*t.x+(e.params.windZ??0)*t.z))}let a=Array.from({length:r},()=>[]);for(let e of t.edges)e.conductance>0&&(a[e.a].push(e.b),a[e.b].push(e.a));let o=/* @__PURE__ */ new Set;for(let e=0;e<r;e++)if(!o.has(e)){let t=[e],n=[];for(o.add(e);t.length;){let e=t.pop();n.push(e);for(let n of a[e])o.has(n)||(o.add(n),t.push(n))}n.some(e=>i.has(e))||i.set(e,0)}let s=new Float64Array(r),c=new Float64Array(r);for(let e of t.edges){let t=e.conductance;s[e.a]+=t,s[e.b]+=t,c[e.a]-=t*e.head,c[e.b]+=t*e.head,i.has(e.b)&&(c[e.a]+=t*i.get(e.b)),i.has(e.a)&&(c[e.b]+=t*i.get(e.a))}let l=e=>{let n=Float64Array.from(e,(e,t)=>i.has(t)?0:s[t]*e);for(let r of t.edges)!i.has(r.a)&&!i.has(r.b)&&(n[r.a]-=r.conductance*e[r.b],n[r.b]-=r.conductance*e[r.a]);return n},u=(e,t)=>e.reduce((e,n,r)=>e+n*t[r],0),d=Float64Array.from({length:r},(e,t)=>i.has(t)?0:n.pressure[t]??0),f=l(d),p=Float64Array.from(c,(e,t)=>i.has(t)?0:e-f[t]),m=p.slice(),h=u(p,p);for(let e=0;e<Math.min(2*r+8,1024)&&h>1e-26;e++){let e=l(m),t=u(m,e);if(t<=0)break;let n=h/t;for(let t=0;t<r;t++)d[t]+=n*m[t],p[t]-=n*e[t];let i=u(p,p),a=i/h;for(let e=0;e<r;e++)m[e]=p[e]+a*m[e];h=i}n.pressure=Array.from(d,(e,t)=>i.get(t)??e),n.flow=t.edges.map(e=>e.conductance*(n.pressure[e.a]-n.pressure[e.b]+e.head));let g=new Float64Array(r);return t.edges.forEach((e,t)=>{g[e.a]+=n.flow[t],g[e.b]-=n.flow[t]}),n.residual=g.reduce((e,n,r)=>t.vents.includes(r)?e:Math.max(e,Math.abs(n)),0),Array.from(g,(e,n)=>t.vents.includes(n)?e:0)}function sc(e,t,n,r){let i=new Float64Array(e.cells.length);t.edges.forEach((t,n)=>i[e.flow[n]>=0?t.a:t.b]+=Math.abs(e.flow[n])),n.forEach((e,t)=>{e<0&&(i[t]-=e)});let a=i.reduce((t,n,r)=>Math.max(t,n/e.cells[r].volume),0),o=Math.max(1,Math.ceil(r*Math.max(1,a/.1))),s=r/o;for(let r=0;r<o;r++)for(let r of[`oxygen`,`carbon`]){let i=new Float64Array(e.cells.length);t.edges.forEach((t,n)=>{let a=e.cells[t.a],o=e.cells[t.b],c=e.flow[n],l=c>=0?a:o,u=c*s*l[r]/l.volume;i[t.a]-=u,i[t.b]+=u});let a=0;n.forEach((t,n)=>{let o=e.cells[n],c=t*s*(t>=0?Wo[r]:o[r]/o.volume);i[n]+=c,a+=c}),e.cells.forEach((e,t)=>e[r]+=i[t]);for(let n of t.edges){let t=e.cells[n.a],i=e.cells[n.b],a=n.diffusion*s*(t[r]/t.volume-i[r]/i.volume),o=(t[r]*i.volume-i[r]*t.volume)/(t.volume+i.volume);a=Math.sign(a)*Math.min(Math.abs(a),Math.abs(o)*.45),t[r]-=a,i[r]+=a}for(let n of t.vents){let i=e.cells[n],o=(Wo[r]-i[r]/i.volume)*i.volume*Math.min(.2,t.ventDiffusion[n]/i.volume*s);i[r]+=o,a+=o}r===`oxygen`?e.boundaryOxygen+=a:e.boundaryCarbon+=a}}function cc(e){if(e.tick%10)return;let t=ic(e),n=ac(e,t),r=oc(e,t,n);Ko(e,n,10),sc(n,t,r,10),n.steps++}let lc=()=>({version:1,friction:.72,gravity:.0016,steps:0,moving:0,kinetic:0,contacts:0,terrainRevision:-1}),uc=e=>p.cbrt(Math.max(0,e.mass)*3/(4*Math.PI));function dc(e){let t=Math.max(.12,...e.map(e=>uc(e)*2.1)),n=/* @__PURE__ */ new Map,r=[],i=(e,t,n)=>e+`:`+t+`:`+n;return e.forEach((a,o)=>{let s=Math.floor(a.x/t),c=Math.floor(a.y/t),l=Math.floor(a.z/t);for(let t=-1;t<=1;t++)for(let o=-1;o<=1;o++)for(let u=-1;u<=1;u++)for(let d of n.get(i(s+u,c+o,l+t))||[])r.push([e[d],a]);let u=i(s,c,l);n.has(u)||n.set(u,[]),n.get(u).push(o)}),r}function fc(e,t,n,r){let i=e.x-t.x,a=e.y-t.y,o=e.z-t.z,s=p.hypot(i,a,o),c=uc(e)+uc(t)-s;if(c<=0)return;let l=s>1e-6?{x:i/s,y:a/s,z:o/s}:{x:e.id<t.id?1:-1,y:0,z:0},u=e.velocity,d=t.velocity,f={x:u.x-d.x,y:u.y-d.y,z:u.z-d.z},m=f.x*l.x+f.y*l.y+f.z*l.z,h=e.mass*t.mass/(e.mass+t.mass),g=Math.max(0,.08*c-.3*m)*h*r,_={x:f.x-l.x*m,y:f.y-l.y*m,z:f.z-l.z*m},v=p.hypot(_.x,_.y,_.z),y=Math.min(v*h,n.friction*g);for(let n of[`x`,`y`,`z`]){let r=l[n]*g-(v>0?_[n]/v*y:0);u[n]+=r/e.mass,d[n]-=r/t.mass}e.quiet=t.quiet=0,n.contacts++}function pc(e,t,n){let r=e.x*t.x+e.y*t.y+e.z*t.z;if(r>=0)return;let i=-r,a=r<-.001?.04:0;e.x-=t.x*r*(1+a),e.y-=t.y*r*(1+a),e.z-=t.z*r*(1+a);let o=e.x*t.x+e.y*t.y+e.z*t.z,s={x:e.x-o*t.x,y:e.y-o*t.y,z:e.z-o*t.z},c=p.hypot(s.x,s.y,s.z),l=Math.min(c,n.friction*i);c>0&&(e.x-=s.x/c*l,e.y-=s.y/c*l,e.z-=s.z/c*l)}function mc(e,t,n,r,i=Ya){let a=t.velocity,o=uc(t);a.y-=n.gravity*r;let s=i(e,t);s.distance<=o+3e-5&&pc(a,s,n);let c=p.hypot(a.x,a.y,a.z),l=c>.008?.008/c:1;a.x*=l,a.y*=l,a.z*=l;let u={x:t.x,y:t.y,z:t.z};t.x+=a.x*r,t.y+=a.y*r,t.z+=a.z*r;let d=i(e,t);if(d.distance<o){let e=Math.min(.008*r,o-d.distance);t.x+=d.x*e,t.y+=d.y*e,t.z+=d.z*e,pc(a,d,n)}return p.hypot(t.x-u.x,t.y-u.y,t.z-u.z)}function hc(e){let t=e.soil.granular??=lc(),n=(e.nest.rubble||[]).filter(e=>e.mass>1e-7);if(t.friction=p.tan(Math.max(15,Math.min(55,e.params.reposeAngle??36))*Math.PI/180),t.steps++,t.moving=0,t.kinetic=0,!n.length){t.terrainRevision=e.nest.revision;return}let r={...e.nest,rubble:[]};for(let t of n)t.mobile||(t.mobile=!0,e.nest.revision++),t.velocity??={x:0,y:0,z:0},t.quiet??=0;for(let e=0;e<4;e++){for(let[e,r]of dc(n))fc(e,r,t,.25);for(let e of n)mc(r,e,t,.25)}for(let e of n){let n=e.velocity,r=p.hypot(n.x,n.y,n.z);t.kinetic+=.5*e.mass*r*r,r>5e-5?t.moving++:e.quiet=(e.quiet||0)+1}t.terrainRevision=e.nest.revision}let gc={fern:{humidity:.78,tolerance:.34,light:.42,yield:.8},shrub:{humidity:.58,tolerance:.46,light:.68,yield:1.1},tree:{humidity:.64,tolerance:.44,light:.76,yield:1},grass:{humidity:.52,tolerance:.5,light:.8,yield:.65},cactus:{humidity:.2,tolerance:.44,light:.94,yield:.25},succulent:{humidity:.3,tolerance:.46,light:.82,yield:.45},flower:{humidity:.56,tolerance:.36,light:.75,yield:1.3},moss:{humidity:.85,tolerance:.3,light:.3,yield:.2}},_c=e=>e.species??[`fern`,`shrub`,`tree`,`grass`][e.kind%4];function vc(e){if(e.ecology)return e.ecology;let{random:t}=Da(e.seed+`:trophobiosis`),n=e.plants.filter(e=>[`shrub`,`flower`,`grass`,`tree`].includes(_c(e))),r=[...n].sort((e,t)=>e.id-t.id).filter(()=>t()<.3).slice(0,7);!r.length&&n.length&&r.push(n[Math.floor(t()*n.length)]);let i=Ds(e);return e.ecology={version:1,aphids:r.map((e,n)=>({id:n+1,plant:e.id,count:8+Math.floor(t()*10),honey:0,visits:0})),mimics:r.slice(0,3).map((n,r)=>{let a=n.x+.25*(t()-.5),o=n.z+.25*(t()-.5),s=i.map(e=>Math.max(.01,e+(t()-.5)*.03)),c=s.reduce((e,t)=>e+t,0);return{id:r+1,x:a,z:o,y:U(e.nest.relief,a,o)+.008,profile:s.map(e=>e/c),energy:.8,age:0,status:`searching`}}),sap:0,assimilated:0,honeyProduced:0,honeyCollected:0,honeyLost:0,protected:0,aphidsEaten:0,adoptions:0,rejections:0,parasiteFed:0,parasiteRespired:0,lastEvent:-1e3}}function yc(e){let t=e.ecology;if(!t)return;let n=e.params.humidity/100,r=e.params.light/100;for(let i of t.aphids){let a=e.plants.find(e=>e.id===i.plant),o=a?Math.max(0,1-Math.abs(n-.65)*1.8)*(a.health??1)*(.25+r*.75):0,s=a?Math.max(0,Math.min((a.biomass-.05)*25,i.count*9e-5*o)):0;a&&(a.biomass-=s/25),t.sap+=s,t.assimilated+=s*.4;let c=s*.6;t.honeyProduced+=c;let l=Math.max(0,i.honey+c-1.2),u=Math.min(i.honey,.001*(1+e.landscape.rainPulse)*i.honey);i.honey=Math.max(0,Math.min(1.2,i.honey+c)-u),t.honeyLost+=l+u;let d=Math.min(o,s/Math.max(1e-7,i.count*9e-5));i.count=Math.max(0,Math.min(a?40*a.biomass:0,i.count+i.count*(35e-5*d-4e-4*(1-d))))}}function bc(e){let t=e.ecology;if(!t)return;let n=Vr(e),r=e.socialChemistry?.profiles||{};for(let i of t.mimics){if(i.status===`dead`)continue;i.age+=.01;let a=Math.min(i.energy,25e-5);if(i.energy-=a,t.parasiteRespired+=a,i.energy<=0||i.age>35){i.status=`dead`,delete i.carrier;continue}if(i.carrier!==void 0){let e=n.find(e=>e.id===i.carrier);if(e&&Object.assign(i,{x:e.x,y:e.y||0,normal:e.normal?{...e.normal}:{x:0,y:1,z:0},z:e.z,node:e.node??void 0}),e&&(e.health??100)>0&&e.energy>0)continue;delete i.carrier,delete i.placing,i.status=`searching`}if(i.status!==`adopted`)continue;let o=n.find(t=>t.energy>0&&(t.health??100)>0&&t.crop>.003&&p.hypot(t.x-i.x,(t.y||0)-i.y,t.z-i.z)<.5&&Bs(e.nest,t,i)&&r[String(t.colonyId||1)]&&Os(r[String(t.colonyId||1)],i.profile)<.095/(t.pheromoneGain||1));if(!o)continue;let s=Math.max(0,Math.min(.0012,o.crop,1.2-i.energy));o.crop-=s,i.energy+=s,t.parasiteFed+=s;let c=r[String(o.colonyId||1)];i.profile=i.profile.map((e,t)=>e+(c[t]-e)*.02)}}function xc(e){vc(e),yc(e),bc(e)}let Sc=/* @__PURE__ */ new WeakMap;function Cc(e,t){if(e.length!==t.width*t.height)throw RangeError(`Dimensões do campo incompatíveis.`);if(!Number.isFinite(t.dt)||t.dt<0||!Number.isFinite(t.diffusion)||t.diffusion<0||!Number.isFinite(t.decay)||t.decay<0||!(t.cellSize>0))throw RangeError(`Parâmetros químicos inválidos.`);let n=t.windX||0,r=t.windZ||0;if(!Number.isFinite(n)||!Number.isFinite(r))throw RangeError(`Vento inválido.`);if(!e.some(e=>e!==0))return;let i=4*t.diffusion/p.pow(t.cellSize,2)+(Math.abs(n)+Math.abs(r))/t.cellSize,a=Math.max(1,Math.ceil(i*t.dt/.85)),o=t.dt/a,s=t.diffusion*o/p.pow(t.cellSize,2),c=n*o/t.cellSize,l=r*o/t.cellSize,u=p.exp(-t.decay*o),d=Sc.get(e);d&&d.length===e.length||(d=new Float64Array(e.length),Sc.set(e,d));for(let n=0;n<a;n++){d.set(e);for(let n=0;n<t.height;n++)for(let r=0;r<t.width;r++){let i=n*t.width+r;if(r+1<t.width){let t=i+1,n=s*(e[i]-e[t])+c*(c>=0?e[i]:e[t]);d[i]-=n,d[t]+=n}if(n+1<t.height){let n=i+t.width,r=s*(e[i]-e[n])+l*(l>=0?e[i]:e[n]);d[i]-=r,d[n]+=r}}for(let t=0;t<e.length;t++)e[t]=Math.max(0,d[t]*u)}}function wc(e,t,n,r=5){let i=Math.max(0,Math.min(n,r-e[t]));return e[t]+=i,i}let Tc=(e,t)=>Math.max(0,Math.min(25,Math.floor((t+6.5)/13*26)))*40+Math.max(0,Math.min(39,Math.floor((e+10)/20*40)));function Ec(e){let t=e.socialChemistry;if(t){for(let n of Object.values(t.territory)){let r=n.reduce((e,t)=>e+t,0);Cc(n,{width:40,height:26,cellSize:.5,diffusion:.006,decay:.006+(1-e.params.humidity/100)*.003,dt:1,windX:0,windZ:0}),t.evaporated+=r-n.reduce((e,t)=>e+t,0)}for(let n of Vr(e))if(n.kind===`worker`&&n.node===null&&n.energy>0){let e=t.territory[String(n.colonyId||1)];if(!e)continue;let r=Tc(n.x,n.z),i=Math.max(0,Math.min(.018,10-e[r]));e[r]+=i,t.deposited+=i}}}function Dc(e,t){let n=e.socialChemistry?.territory||{},r=Tc(t.x,t.z);return{own:n[String(t.colonyId||1)]?.[r]||0,foreign:Object.entries(n).reduce((e,[n,i])=>e+(n===String(t.colonyId||1)?0:i[r]),0)}}let Oc=(e,t)=>{let n=e.x-t.x,r=(e.y||0)-(t.y||0),i=e.z-t.z,a=p.hypot(n,r,i)||1;return{x:n/a,y:r/a,z:i/a}};function kc(e){let t=e.socialChemistry;if(!t)return;let n=/* @__PURE__ */ new Set;for(let r of Vr(e))if(!(r.kind!==`worker`||(r.health??100)<=0||r.encounterCooldown>e.tick))for(let i of vs(e,r,.65)){let a=i,o=[r.id,a.id].sort((e,t)=>e-t).join(`:`);if(n.has(o)||a.airborne||(a.health??100)<=0||!Bs(e.nest,r,a)||(n.add(o),As(e,r,a))||r.intrusion?.owner===(a.colonyId||1))continue;t.contacts++;let s=r.colonyId||1,c=vs(e,r,1.1).filter(t=>t.energy>0&&(t.health??100)>0&&Bs(e.nest,r,t)),l=c.filter(t=>As(e,r,t)).length,u=c.length-l,d=r.traits?.courage??.5,f=Dc(e,r),p=r.node!==null&&(e.nest.nodes[r.node]?.colonyId||1)===s,m=(u-l)*.18+(r.energy<35?.5:0)-(p?.25:0)-Math.min(.2,f.own*.15),h=Oc(r,a);if(e.tick-(r.lastAlienContact??-1e3)>60&&(r.encounterTicks=0),r.lastAlienContact=e.tick,r.encounterTicks=(r.encounterTicks||0)+1,d+.2<m+.45)r.encounter={until:e.tick+8,direction:h,state:`Recuando de odor estranho`},r.encounterCooldown=e.tick+20,t.retreats++;else if((r.encounterTicks||0)<3)r.encounter={until:e.tick+3,direction:h,state:`Intimidando após contato químico`},r.encounterCooldown=e.tick+6,t.intimidations++;else{let n=(r.caste===`major`?1.8:.8)*(.5+d);a.health=Math.max(0,(a.health??100)-n),r.energy=Math.max(0,r.energy-.03),a.health<=0&&(a.deathCause=`combat`),r.encounter={until:e.tick+4,direction:h,state:`Disputa química e defesa`},r.encounterCooldown=e.tick+12,t.attacks++}e.tick-t.lastEvent>80&&(e.log(`Formigas de colônias diferentes reagiram ao odor no encontro.`,`danger`),t.lastEvent=e.tick);break}}function Ac(e,t){let n={x:t.x,y:t.y||0,z:t.z},r=Ya(e.nest,n);if(Math.abs(r.distance-.008)<.006)return!1;let i=Z(e.nest,n),a=$(n,i.point);if(Math.abs(i.gap-.008)>.015)return!1;let o=Math.min(1,t.speed*.85/(a||1));return t.x+=(i.point.x-t.x)*o,t.y=(t.y||0)+(i.point.y-n.y)*o,t.z+=(i.point.z-t.z)*o,t.normal=i.normal,t.distanceWalked=(t.distanceWalked||0)+a*o,delete t.supportMotion,!0}function jc(e,t,n){if(Ac(e,t))return!1;let r=Z(e.nest,n),i={x:t.x,y:t.y||0,z:t.z};return $(i,r.point)<.07?(delete t.supportMotion,!0):((!t.supportMotion||$(t.supportMotion.goal.position,r.point)>.08)&&Ss(e,t,r.point,r.normal,n),Cs(e,t,t.speed*.85),!1)}function Mc(e,t){let n=t===`queen`?L.queenWater:L.broodWater;return Math.max(0,1-Math.abs(e.water-n)/.65-Math.abs(e.temperature-L.temperature)/25)}function Nc(e,t){let n=U(e.nest.relief,t.x,t.z),r={x:t.x,y:n-L.probeDepth,z:t.z},i=V(e.microclimate,r)??{water:.5,temperature:e.params.temperatureC??24},a=!e.inPond(t.x,t.z)&&Ja(e.nest,r).distance<0&&Math.abs(t.y-n)<.12;return{point:{...t},water:i.water,temperature:i.temperature,quality:a?Mc(i,`queen`):-1}}function Pc(e){if(B(e.biologicalProfile).chamberModel!==`local-demo`)return!1;let t=Zi(e),n={x:t.x,y:t.y??0,z:t.z},r=Nc(e,n);return e.founding.survey={version:1,mode:`explore`,steps:0,since:e.tick,heading:t.angle,samples:1,origin:{...n},best:r,last:{water:r.water,temperature:r.temperature}},Xi(e,`surveying`,`A rainha percorre o solo, comparando água e calor que sente perto de si.`),!0}function Fc(e){let t=Zi(e),n=e.founding,r=n.survey,i={x:t.x,y:t.y??0,z:t.z},a=Nc(e,i);if(r.steps++,r.samples++,r.last={water:a.water,temperature:a.temperature},a.quality>r.best.quality+1e-6&&(r.best=a),Yi(e,`maintenance`,L.extraCost),r.mode===`explore`&&r.steps>=L.exploreTicks&&(r.mode=`return`),r.mode===`explore`){let n=r.heading;p.hypot(t.x-r.origin.x,t.z-r.origin.z)>L.roamRadius&&(n=p.atan2(r.origin.z-t.z,r.origin.x-t.x));let a=[-.65,0,.65].map(r=>{let a=n+r,o={x:t.x+p.cos(a)*L.sensorRadius,y:0,z:t.z+p.sin(a)*L.sensorRadius};if(o.y=U(e.nest.relief,o.x,o.z)+.008,!(p.hypot(o.x-i.x,o.y-L.probeDepth-i.y,o.z-i.z)<=L.sensorRadius+L.probeDepth+.02))return{heading:a,weight:0};let s=Nc(e,o);return{heading:a,weight:s.quality<0?0:p.exp(3*s.quality+(r===0?.15:0))}}),o=a.reduce((e,t)=>e+t.weight,0),s=e.random()*o;r.heading=a.find(e=>(s-=e.weight)<=0&&e.weight>0)?.heading??n+Math.PI/2,e.moveSurface(t,r.heading,t.speed*.6),t.state=`Sentindo água e calor perto do solo`;return}t.state=`Voltando ao ponto de abrigo que visitou`;let o=jc(e,t,r.best.point);if(!o&&r.steps<L.exploreTicks+L.returnLimit)return;if(!o&&a.quality<0){t.state=`Procurando solo firme para iniciar o abrigo`;return}let s=n.site,c={x:t.x,y:U(e.nest.relief,t.x,t.z),z:t.z};n.chamber={x:Math.max(-9.1,Math.min(9.1,c.x+n.chamber.x-s.x)),y:Math.max(-3.8,c.y+n.chamber.y-s.y),z:Math.max(-5.6,Math.min(5.6,c.z+n.chamber.z-s.z))},n.site=c,r.mode=`done`,Xi(e,`digging`,`A rainha escolheu um ponto visitado e começa a escavar. A leitura superficial não garante o clima futuro da câmara.`)}function Ic(e,t){let n=e.site.x-e.chamber.x,r=e.site.z-e.chamber.z,i=p.hypot(n,r)||1;return{x:e.site.x+(n/i||1)*t,z:e.site.z+r/i*t}}function Lc(e,t,n){let r=t.x-e.x,i=t.y-(e.y||0),a=t.z-e.z,o=p.hypot(r,i,a),s=Math.min(1,n/(o||1));return e.x+=r*s,e.y=(e.y||0)+i*s,e.z+=a*s,e.angle=p.atan2(a,r),e.pitch=p.atan2(i,p.hypot(r,a)),e.normal={x:0,y:1,z:0},o<=n}function Rc(e,t=e.founding){let n=t;return!n||(e.landscape.rainPulse>.15&&(n.lastRain=e.tick),e.tick-n.lastRain>300||e.params.humidity<45||e.params.humidity>88||e.params.light<45)?0:.04+.12*Math.max(0,1-Math.abs(e.params.humidity-65)/25)}function zc(e){let t=e.founding,n=e.ants.find(e=>e.kind===`male`);if(!n||t.matedTick===void 0)return;let r=t.site.x-.65,i=t.site.z;n.airborne=!Lc(n,{x:r,y:U(e.nest.relief,r,i)+.008,z:i},.075),n.state=n.airborne?`Pousando após o acasalamento`:`Fim do ciclo reprodutivo`}function Bc(e){let t=e.founding,n=Zi(e),r=e.ants.find(e=>e.kind===`male`);if(n){if(t.phase===`weather`){let n=Rc(e);r&&e.tick-t.since>=10&&e.random()<n&&Xi(e,`flight`,`O tempo favoreceu o voo nupcial. Os alados decolaram.`)}else if(t.phase===`flight`){if(!r){Xi(e,`failed`,`O voo terminou sem parceiro. Esta fundação não produziu operárias.`);return}let i=e.tick-t.since,a=Math.max(0,1-i/55),o=i*.08;if(Lc(n,{x:t.site.x+p.cos(o)*a*.7,y:t.site.y+1.35,z:t.site.z+p.sin(o)*a*.7},.075),Lc(r,{x:n.x+.16,y:(n.y||0)+.04,z:n.z},.1),n.airborne=r.airborne=!0,n.state=r.state=`Voo nupcial`,i>=60&&p.hypot(n.x-r.x,(n.y||0)-(r.y||0),n.z-r.z)<.3){for(let t of e.ants)t.kind===`male`&&Xs(e,n,t);t.matedTick=e.tick,Xi(e,`landing`,`O acasalamento ocorreu no ar. A rainha procura um ponto de fundação.`)}}else if(t.phase===`landing`){let{x:r,z:i}=Ic(t,.65);n.state=`Pousando para fundar`,Lc(n,{x:r,y:U(e.nest.relief,r,i)+.008,z:i},.07)&&(n.airborne=!1,n.pitch=0,Xi(e,`dealate`,`A rainha pousou e começou a soltar as asas.`))}else if(t.phase===`dealate`&&e.tick-t.since>=12){n.winged=!1;for(let e=0;e<4;e++)t.discardedWings.push({x:n.x+(e%2?1:-1)*.16,y:(n.y||0)+.012,z:n.z+(e<2?.13:-.13)});if(Pc(e))return;Xi(e,`digging`,`Sem asas, a rainha começa a escavar o primeiro abrigo.`)}}}function Vc(e){return B(e.biologicalProfile).survivalModel===`risk-demo`}function Hc(e,t){if(!Vc(e)||t.life)return;let n=n=>-p.log1p(-(Ur(e.seed+`:`+t.id+`:survival:`+n)+.5)/4294967296);t.health??=100,t.life={version:1,lastTick:e.tick??0,lastAge:t.age,ageHazard:Us(t.age,t.kind),ageBudget:n(`age`),infection:0,diseaseHazard:0,diseaseBudget:n(`disease`),repairFood:0}}function Uc(e){if(Vc(e)){e.colony.survival??={version:1,initialDeaths:e.deaths,causes:Object.fromEntries(Zr.map(e=>[e,0])),challenges:0};for(let t of e.ants)Hc(e,t)}}function Wc(e){if(B(e.biologicalProfile).stockModel!==`rooms-demo`||!e.colony||e.colony.stores)return;let t=e.ants?.find(e=>e.kind===`queen`)?.node??-1,n=e.nest?.nodes[t];if(e.food>0&&!n)throw Error(`Reserva inicial sem câmara.`);e.colony.stores={version:1,initial:e.food,incoming:0,outgoing:0,flows:{},bins:e.food>0?[{node:t,amount:e.food,point:{x:n.x,y:n.y-n.r*.9,z:n.z}}]:[]}}function Gc(e){e.founding&&B(e.biologicalProfile).foundation===`semiclaustral`&&(e.founding.foraging??=li())}function Kc(e){let t=e.founding;t&&!t.maternal&&B(e.biologicalProfile).maternalModel===`pools`&&(t.maternal=Ui(t.reserves))}function qc(e){let t=e.founding;if(!t?.maternal)return;let n=e.ants.find(e=>e.kind===`queen`);n&&!n.winged&&[`digging`,`sealing`,`claustral`,`semiclaustral`,`surveying`].includes(t.phase)&&Ki(t.maternal),t.reserves=Hi(t.maternal.stores)}function Jc(e,t){let n=Math.max(0,vs(e,t,.9).length-3),r={x:t.x,y:t.y||0,z:t.z},i=e.ants.find(e=>e.kind===`queen`&&$(r,{x:e.x,y:e.y||0,z:e.z})<.9);i&&(t.taskMemory={queenNeed:Math.max(0,.3-i.crop)*3,until:e.tick+400});let a=t.taskMemory&&t.taskMemory.until>e.tick?t.taskMemory.queenNeed:0,o=e.brood.filter(n=>!n.carrier&&n.node!==H(e.nest,`nursery`,0,t.colonyId||1)&&$(r,n)<.9).length,s=e.colony.waste.filter(e=>!e.stored&&!e.carrier&&$(r,e)<.9).reduce((e,t)=>e+t.mass,0),c=(e.nest.rubble||[]).filter(e=>$(r,e)<1).reduce((e,t)=>e+t.mass,0),l=e.soil.projects.some(t=>!t.completed&&($(r,e.nest.nodes[t.front])<1||$(r,e.nest.nodes[t.from])<1)),u=e.predators.some(e=>p.hypot(e.x-t.x,e.z-t.z)<1.2),d=e.nest.nodes.some(e=>e.type===`entrance`&&$(r,e)<1.2);return{forager:.3+Math.max(0,(85-t.energy)/50)+t.traits.exploration*.2,nurse:a+Math.min(2,o*.4)+(t.age<1.5&&[`royal`,`nursery`].includes(e.nest.nodes[t.node??-1]?.type)?.2:0),cleaner:s/.04,excavator:c/.03+(l?.55:0)+n*.15,defender:(u?1.5:d&&t.caste===`major`?.2:0)*(.2+t.traits.courage*1.8)}}let Yc=[`forager`,`nurse`,`cleaner`,`excavator`,`defender`];function Xc(e,t){let n=Math.max(0,e),r=Math.max(1e-8,t);return n===0?0:1/(1+p.pow(r/n,2))}function Zc(e,t){return Object.fromEntries(Yc.map(n=>[n,.15+Ur(e+`:`+t+`:threshold:`+n)/4294967296*.75]))}function Qc(e,t){if(e.tick<(t.nextTaskChoice||0))return t.role;t.thresholds??=Zc(e.seed,t.id);let n=Jc(e,t),r=Yc.map(e=>{let r=t.thresholds[e];return e===`nurse`&&(r*=t.age<1.5?.55:1.8),e===`forager`&&(r*=t.age>4?.55:1.1),e===`cleaner`&&(r*=1.3-t.traits.activity*.7),e===`defender`&&(r*=t.caste===`major`?.4:2),Xc(n[e],r)});return t.nextTaskChoice=e.tick+20+t.id%15,Yc[$o(r,()=>e.random())]}function $c(e,t,n){let r=n=>Ur(e+`:`+t+`:`+n)/4294967296,i=n===`worker`&&r(`caste`)<.12;return{crop:n===`queen`?.6:0,thresholds:Zc(e,t),caste:i?`major`:`minor`,traits:{activity:.15+r(`activity`)*.85,courage:r(`courage`),exploration:r(`exploration`)},bodyScale:n===`worker`?i?1.22:.88+r(`size`)*.16:1,headScale:i?1.6:1,role:i?`defender`:`forager`}}function el(){return{version:1,shared:0,exchanges:0,waste:[],cemeteryMass:0,spoiled:0}}function tl(e,t){t.traits||Object.assign(t,$c(e,t.id,t.kind||`worker`)),t.crop??=0,t.thresholds??=Zc(e,t.id)}function nl(e,t,n=0,r=8){let i={...e.nodes[0]},a={...e.nodes[2]},o=a.x-i.x,s=a.z-i.z,c=p.hypot(o,s)||1,l=Math.min(c,.8+Math.abs(a.y)*.15);return a.x=i.x+o*l/c,a.z=i.z+s*l/c,a.y=i.y-.85-Math.abs(a.y)*.1,{version:1,phase:`weather`,since:n,lastRain:t>=45?n:n-1e3,site:i,chamber:a,initialReserves:r,reserves:r,spent:{maintenance:0,eggs:0,larvae:0,excavation:0},firstClutch:!1,nanitics:0,discardedWings:[],digMode:`bite`,trips:0}}function rl(e=`SEMENTE-42`,t){let{random:n,range:r}=Da(e+`:nest`),i=Math.floor(n()*4),a=i<2?1:-1,o=i%2==1,s=o?{x:a*9.72,z:r(-2.2,2.2)}:{x:r(-4,4),z:a*6.22},c=(e,t,n,r,i,c)=>({x:Math.max(-9.72,Math.min(9.72,s.x+(o?-a*t:e))),z:Math.max(-6.22,Math.min(6.22,s.z+(o?e:-a*t))),y:n,r,type:i,name:c}),l=c(0,0,r(-1.8,-1.25),r(.64,.74),`royal`,`Câmara da rainha`),u=c(r(-2.3,-1.5),r(.6,1.4),r(-2.9,-2.2),r(.65,.76),`nursery`,`Berçário`),d=c(r(1.6,2.8),r(1.6,3),r(-1.8,-1.2),r(.6,.7),`storage`,`Despensa`),f=c(r(2.4,3.8),r(2.5,4.4),r(-3.3,-2.7),r(.5,.6),`waste`,`Resíduos`),m=c(r(-.5,.5),r(1.3,2.1),r(-2,-1.4),.36,`junction`,`Galeria`),h=(e,n)=>{for(let i=0;i<150;i++){let a=i<60?Math.max(-8.7,Math.min(8.7,e.x+r(-1.6,1.6))):r(-8.5,8.5),o=i<60?Math.max(-5.3,Math.min(5.3,e.z+r(-1.6,1.6))):r(-5.2,5.2);if(!(Ba(t,a,o,!0)<2.2||Va(t,a,o)<3))return{x:a,z:o,y:U(t?.relief,a,o)+.03,r:.36,type:`entrance`,name:`Entrada `+n}}return{x:0,z:0,y:.03,r:.36,type:`entrance`,name:`Entrada `+n}},g=(i+(n()<.5?1:3))%4,_=(e,t)=>{t%2==0?(e.z=(t===0?1:-1)*6.22,e.x=r(-5,5)):(e.x=(t===1?1:-1)*9.72,e.z=r(-3.5,3.5))};_(d,g),n()<.45&&_(f,(g+(n()<.5?1:3))%4);let v=h(m,1),y=h(d,2),b=e=>({...e,y:r(-.95,-.7),r:.32,type:`shaft`,name:`Poço de acesso`}),x=[v,b(v),l,u,d,f,y,b(y),m],S=[[0,1],[1,2],[6,7],[7,4]],C=[2],w=[3,4,5,8];for(;w.length;){let e;for(let t of C)for(let r of w){let i=x[t],a=x[r],o=p.hypot(i.x-a.x,i.y-a.y,i.z-a.z)*(.9+n()*.2);(!e||o<e.cost)&&(e={a:t,b:r,cost:o})}S.push([e.a,e.b]),C.push(e.b),w.splice(w.indexOf(e.b),1)}let T=[];for(let e of[2,3,4,5,8])for(let t of[2,3,4,5,8])e<t&&!S.some(([n,r])=>n===e&&r===t||n===t&&r===e)&&T.push([e,t]);return S.push(T[Math.floor(n()*T.length)]),{nodes:x,links:S,revision:2,relief:t?.relief}}function il(e,t,n,r){if(n.kind!==`gyne`||!n.sexual||r.kind!==`male`||!r.sexual||!t.ants.includes(n)||!t.ants.includes(r)||F(e).length>=4||n.node!==null||r.node!==null||!n.genome||!r.genome||!((n.foundressBudget||0)>=2))return null;let i=e.nextColonyId??2,a=e.seed+`:colony:`+i,o;for(let t=0;t<40;t++){let r=nl(rl(a+`:site:`+t,e.landscape),e.params.humidity,e.tick,n.foundressBudget);if(e.nest.nodes.every(e=>p.hypot(e.x-r.site.x,e.z-r.site.z)>2.5&&p.hypot(e.x-r.chamber.x,e.y-r.chamber.y,e.z-r.chamber.z)>1.2)){o=r;break}}if(!o)return null;o.phase=`flight`,o.since=e.tick,o.lastRain=e.tick;let s=Object.assign(Object.create(Object.getPrototypeOf(e)),{seed:a,rng:Ur(a),colonyId:i,parentColonyId:t.colonyId||1,colonies:[],...t.biologicalProfile?{biologicalProfile:{...t.biologicalProfile}}:{},capacityOffset:0,tick:e.tick,nextId:e.nextId,food:0,queenHealth:Math.min(100,n.energy),ants:[n,r],brood:[],colony:el(),genetics:{version:1,queen:{id:n.id,genome:n.genome},sire:{id:r.id,genome:r.genome},embryos:0,mutationEvents:0},founding:o,events:[],history:[],deaths:0,born:0,lastLaying:e.tick-65,lastRecord:e.tick,lastWarning:-1e3,lastDiscovery:-1e3,physicsVersion:5,localRoutingVersion:1});Kc(s),Gc(s),Ps(e,s),t.ants=t.ants.filter(e=>e.id!==n.id&&e.id!==r.id),n.kind=`queen`,r.kind=`male`;for(let e of[n,r])e.colonyId=i,e.sexual=!1,delete e.departure,e.route=[],delete e.bioTask,delete e.routeIntent,delete e.supportMotion,delete e.navigation,delete e.knownEdges,delete e.recentNodes,delete e.lastEntrance,delete e.avoidEntrance,delete e.avoidEntranceUntil,e.tunnelCenter=null,e.tunnelY=0;return va(s),Wc(s),Ys(s),Uc(s),e.nextColonyId=i+1,(e.colonies??=[]).push(s),Fs(e),e.log(`Colônia `+i+`: uma filha da colônia `+(t.colonyId||1)+` decolou para fundar outro ninho.`,`birth`),s}function al(e){for(let t of F(e)){if(t.landscape.rainPulse>.15&&(t.lastFlightRain=t.tick),F(e).length>=4)return;let n=t.ants.find(e=>e.kind===`gyne`&&e.sexual&&e.age>=1),r=t.ants.find(e=>e.kind===`male`&&e.sexual&&e.age>=1);if(!n||!r)continue;let i={...t.founding,lastRain:t.lastFlightRain??t.founding?.lastRain??-1e3},a=Rc(t,i);t.lastFlightRain=i.lastRain,a<=0||!n.departure&&t.random()>=a*.2||(n.departure=r.departure=!0,n.node===null&&r.node===null&&il(e,t,n,r))}}function ol(e){if(e.microclimate)return e.microclimate;let t=4.2,n=1*t/8*.4,r=[],i=[],a=[],{random:o}=Da(e.seed+`:soil-climate`),s=e.params.soilWaterInitial??{woodland:55,meadow:43,scrub:23}[e.landscape.biome];for(let t=0;t<13;t++)for(let n=0;n<20;n++)r.push(U(e.nest.relief,(n+.5)/20*20-10,(t+.5)/13*13-6.5));for(let t=0;t<8;t++)for(let r=0;r<13;r++)for(let r=0;r<20;r++)i.push(Math.max(0,Math.min(1,s/100+t/8*.08+(o()-.5)*.025))*n),a.push((e.params.temperatureC??24)-t/8*2);return e.microclimate={version:1,width:20,layers:8,rows:13,depth:t,capacity:n,surface:r,water:i,temperature:a,initialWater:i.reduce((e,t)=>e+t,0),rainIn:0,pondIn:0,evaporated:0,plantUptake:0,initialHeat:a.reduce((e,t)=>e+t,0),boundaryHeat:0,evaporativeHeat:0,steps:0}}function sl(e,t,n=!0,r){let i=Math.max(1,Math.ceil(t/2)),a=t/i;for(let t=0;t<i;t++)for(let[t,i,o]of na(e)){let s=e.water[t]/e.capacity,c=e.water[i]/e.capacity,l=(s+c)/2,u=(.0015*(s-c)*(r?.capillary??1)+(n?15e-5*l*l*(ea(e,t)-ea(e,i))*(r?.drainage??1)/o:0))*a*e.capacity,d=u>=0?t:i,f=u>=0?i:t,p=Math.max(0,Math.min(Math.abs(u),e.water[d],e.capacity-e.water[f]));e.water[d]-=p,e.water[f]+=p;let m=(e.temperature[i]-e.temperature[t])*(8e-4+.0012*l)*a*(r?.heat??1)/(o*o);e.temperature[t]+=m,e.temperature[i]-=m}}function cl(e,t,n,r=1){let i=e.params.humidity/100,a=e.params.light/100,o=(e.params.temperatureC??24)+Math.max(0,p.sin(e.tick/100*2*Math.PI))*a*8;for(let s=0;s<t.width*t.rows;s++){let c=Math.max(0,Math.min(t.capacity-t.water[s],e.landscape.rainPulse*3e-4*n*t.capacity*r));t.water[s]+=c,t.rainIn+=c;let l=Math.min(t.water[s],t.water[s]*2e-4*(1-i)*(1+a)*n);t.water[s]-=l,t.evaporated+=l;let u=(o-t.temperature[s])*Math.min(.2,.003*n),d=l*.5;t.temperature[s]+=u-d,t.boundaryHeat+=u,t.evaporativeHeat+=d}for(let r of e.landscape.ponds){let e=$i(t,{x:r.x,y:0,z:r.z}),i=Math.max(0,Math.min(r.volume*10,(t.capacity-t.water[e])*.002*n));t.water[e]+=i,r.volume-=i/10,t.pondIn+=i}for(let r of e.plants){let e=$i(t,{x:r.x,y:-.2,z:r.z}),i=Math.max(0,Math.min(t.water[e],r.biomass*(r.health??1)*2e-6*n));t.water[e]-=i,t.plantUptake+=i}}function ll(e){let t=ol(e);if(e.tick%10)return;t.steps++;let n=go(e),r=n?_o(n):void 0;sl(t,10,!0,r),cl(e,t,10,r?Math.min(1,r.drainage):1)}let ul=(e,t=0,n=1)=>Math.max(t,Math.min(n,e));function dl(e){let t=e.landscape,n=e.params.humidity/100,r=e.params.light/100;t.wetness+=(n-t.wetness)*.003,t.rainPulse*=.98;for(let e of t.ponds){let i=(1-n)*(8e-5+r*2e-4);e.volume=ul(e.volume+t.rainPulse*.002+Math.max(0,n-.78)*8e-4-i)}for(let n of t.logs){n.moisture+=((V(e.microclimate,{x:n.x,y:0,z:n.z})?.water??t.wetness)-n.moisture)*.004;let i=(1e-6+n.moisture*6e-6)*(.65+r*.35);n.decay=ul(n.decay+i),n.integrity=1-n.decay*.75}for(let i of t.rocks)i.wetness+=((V(e.microclimate,{x:i.x,y:0,z:i.z})?.water??t.wetness)-i.wetness)*.012,i.moss=ul(i.moss+(n*.8-r*.45-.15)*6e-5);let i=0,a=/* @__PURE__ */ new Map;for(let n of e.plants){let o=gc[_c(n)],s=Ba(t,n.x,n.z)<3,c=V(e.microclimate,{x:n.x,y:-.2,z:n.z}),l=c?.water??ul(t.wetness+(s?.12:0));n.hydration=(n.hydration??l)+(l-(n.hydration??l))*.006;let u=Math.abs(n.hydration-o.humidity)/o.tolerance,d=Math.abs(r-o.light)/.7,f=c?Math.abs(c.temperature-24)/22:0,p=ul(1-u*.8-d*.45-f*.3);n.stress=ul(u*.65+d*.35),n.health=ul((n.health??1)+(p-.42)*7e-4,0,1);let m=n.biomass;n.biomass=ul(n.biomass+(.0012*p*(n.vigor??1)*n.health-32e-5*(1+n.stress))*(1.15-n.biomass),.025,1.1),i+=Math.max(0,m-n.biomass),a.set(n.id,o.yield*p*n.health*n.biomass)}t.litter=ul(t.litter+i*.02-t.wetness*15e-6);for(let t of e.patches)if(!t.supplemental){let e=t.sourcePlant?a.get(t.sourcePlant)??0:r*ul(1-Math.abs(n-.62)*1.7);t.amount=ul(t.amount+e*.003-(e<.1?15e-5:0),0,t.capacity)}}function fl(e){e.tick++,ll(e);let t=e.params.humidity/100,n=Math.max(.02,1-Math.abs(t-.62)*1.7);return dl(e),Cc(e.pheromones,{width:40,height:26,cellSize:.5,diffusion:(.008+t*.008)*(e.params.surfaceDiffusionScale??1),decay:(.012+(1-t)*.012)*(e.params.surfaceEvaporationScale??1),dt:1,windX:e.params.windX||0,windZ:e.params.windZ||0}),n}let pl=Object.freeze({age:`idade`,disease:`doença`,starvation:`fome`,combat:`conflito`,predation:`predação`,reproduction:`fim do ciclo reprodutivo`,unknown:`causa não classificada`});function ml(e,t){let n=null,r=-1/0;for(let i of t.roomMemory?.rooms??[]){let a=e.nest.nodes[i.node];if(!a||[`entrance`,`front`,`waste`].includes(a.type)||(a.colonyId??1)!==(t.colonyId??1)||e.tick-i.tick>L.memoryTicks)continue;let o=1-Math.abs(i.reading.water-ai.preferredWater)/.65-Math.abs(i.reading.temperature-25)/25;o>r+.02&&(r=o,n=i.node)}return n}function hl(e,t,n){if(!e.colony.stores)return n;let r=ml(e,t);return r!==null&&(t.stockGoal=r),r??n}function gl(e,t,n=t.node){if(!e.colony?.stores)return!0;if(n===null||t.node!==n)return!1;let r=e.nest?.nodes[n];return!!r&&p.hypot(t.x-r.x,(t.y??0)-r.y,t.z-r.z)<=r.r+.15}function _l(e,t){if(t.node!=null)return e.nest.nodes[t.node].type===`entrance`?t.node:t.lastEntrance?.node??e.nest.nodes.findIndex(e=>e.type===`entrance`&&(e.colonyId||1)===(t.colonyId||1));let n=t.lastEntrance;if(n&&!(t.avoidEntranceUntil>e.tick&&t.avoidEntrance===n.node))return n.node;let r=e.nest.nodes.map((e,t)=>({...e,index:t})).filter(n=>n.type===`entrance`&&(n.colonyId||1)===(t.colonyId||1)&&p.hypot(n.x-t.x,n.z-t.z)<2.3&&!(t.avoidEntranceUntil>e.tick&&t.avoidEntrance===n.index));return r.sort((e,n)=>p.hypot(e.x-t.x,e.z-t.z)-p.hypot(n.x-t.x,n.z-t.z)),r[0]?.index??-1}function vl(e,t){let n=t.soilTask;n&&t.node!=null&&(n.phase=`haul`,n.entrance=_l(e,t),n.reversing||(Q(e,t,n.entrance),t.node===n.entrance&&e.onNestArrival?.(t,n.entrance)))}function yl(e,t,n){let r=t.soilTask;if(!r)return!1;if(t.route=[],e.nest.nodes[n].type===`storage`&&t.energy<85&&e.food>=.15){let r=Yr(e,gl(e,t,n)?.15:0,`care`,n,!!e.colony?.stores);t.energy=r>=.15-1e-10?100:Math.min(100,t.energy+(100-t.energy)*(r/.15))}if(e.nest.nodes[n].type===`entrance`&&r.phase===`haul`){t.lastEntrance={node:n,x:e.nest.nodes[n].x,z:e.nest.nodes[n].z},r.phase=`dump`,r.entrance=n;let i=e.nest.nodes[n],a=t.x-i.x,o=t.z-i.z,s=p.hypot(a,o)||1,c={x:i.x+(a/s||1)*.68,y:U(e.nest.relief,i.x+(a/s||1)*.68,i.z+o/s*.68)+.008,z:i.z+o/s*.68};Ss(e,t,c,{x:0,y:1,z:0},c),t.node=null}else if(r.phase===`return`){let t=e.soil.projects.find(e=>e.id===r.projectId);r.rubbleId&&n===r.sourceNode?r.phase=`repair`:t&&n===t.front&&(r.phase=`dig`)}return!0}function bl(e,t,n){let r=_l(e,t);if(r<0){e.moveSurface(t,t.angle+e.range(-.4,.4),t.speed),t.state=`Procurando uma entrada`;return}let i=e.nest.nodes[r];p.hypot(i.x-t.x,i.z-t.z)>.6?(e.moveSurface(t,p.atan2(i.z-t.z,i.x-t.x),t.speed),t.state=`Voltando à escavação`):(t.node=r,t.tunnelCenter={x:i.x,y:i.y,z:i.z},t.tunnelY=i.y,Q(e,t,n))}function xl(e,t){let n=ba(e).activity;if(n>=1||t.carrying||t.carryingBrood||t.carryingWaste||(t.carryingSoil||0)>0)return!1;if((e.tick+t.id)%5>=Math.max(1,Math.ceil(n*5)))return t.state=`Em repouso sazonal`,!0;if(e.colony.season?.phase===`resuming`)return!1;let r=H(e.nest,`royal`,0,e.colonyId||1);return r<0?!1:(t.node===null?bl(e,t,r):(Q(e,t,r),t.route.length&&e.moveInNest(t)),t.state=t.node===r&&!t.route.length?`Em repouso sazonal`:`Voltando ao abrigo para repouso`,!0)}function Sl(e,t,n){let r=e.founding,i=r.entry,a=r.front,o=e.nest.nodes[i];if(t.node===null){if(p.hypot(t.x-o.x,t.z-o.z)>.58&&!jc(e,t,{...Ic(e.founding,.5),y:o.y}))return!1;t.node=i,t.tunnelCenter={x:o.x,y:o.y,z:o.z},t.tunnelY=o.y,delete t.supportMotion,Q(e,t,a)}return t.node===a?jc(e,t,n):(t.route.length||Q(e,t,a),e.moveInNest(t),!1)}function Cl(e,t,n){let r=e.founding.entry;return t.node!==null&&t.node!==r?(t.route.length||Q(e,t,r),e.moveInNest(t),!1):(t.node===r&&(t.node=null,t.tunnelCenter=null,delete t.supportMotion),jc(e,t,n))}function wl(e,t,n){let r=e.soil.deposits.find(e=>e.mass>0&&p.hypot(t.x-e.x,t.z-e.z)<.45);if(!r)return 0;let i=Math.min(r.mass,Math.max(0,n));return r.mass-=i,e.soil.reclaimed=(e.soil.reclaimed||0)+i,t.carryingSoil=(t.carryingSoil||0)+i,i}function Tl(e){if(e.mass>=e.capacity-1e-10){e.innerRadius=0;return}if(e.mass<=1e-10){e.innerRadius=e.radius;return}let t=e.mass;for(let n=e.shells.length-1;n>=0;n--){let r=e.shells[n];if(t>=r){t-=r;continue}let i=e.radius*(n+1)/e.shells.length,a=e.radius*n/e.shells.length;e.innerRadius=Math.sqrt(i*i-(i*i-a*a)*(t/r));return}}function El(e,t,n,r){let i=Math.min(Math.max(0,r),t.carryingSoil||0,n.capacity-n.mass);return i<=0?0:(t.carryingSoil=(t.carryingSoil||0)-i,n.mass+=i,Tl(n),e.nest.revision++,i)}function Dl(e,t,n,r){let i=Math.min(Math.max(0,r),n.mass);return i<=0?0:(n.mass-=i,t.carryingSoil=(t.carryingSoil||0)+i,Tl(n),e.nest.revision++,i)}function Ol(e){let t=e.founding,n=e.nest.nodes[t.entry],r=e.nest.nodes[t.front],i=e.nest.links.findIndex(([e,n])=>e===t.entry&&n===t.front||n===t.entry&&e===t.front);if(!n||!r||i<0)return null;let a=Y(G(r,n)),o=W(n,K(G(r,n),.32)),s=(e.nest.linkWidths?.[i]||.42)+.14,c=Y(X(a,Math.abs(a.y)<.9?{x:0,y:1,z:0}:{x:1,y:0,z:0})),l=X(a,c),u=Array(32).fill(0),d=gi.depth;for(let t=0;t<u.length;t++){let n=s*t/u.length,r=s*(t+1)/u.length,i=Math.sqrt((n*n+r*r)/2),f=Math.PI*(r*r-n*n)*d/192;for(let n=0;n<24;n++)for(let r=0;r<8;r++){let s=2*Math.PI*(n+.5)/24,m=W(W(o,K(a,d*((r+.5)/8-.5))),W(K(c,i*p.cos(s)),K(l,i*p.sin(s))));Ja(e.nest,m).distance>0&&(u[t]+=f)}}let f=u.reduce((e,t)=>e+t,0);return f<=0||f>gi.maxLoad?null:{...o,version:1,id:e.soil.nextId++,owner:e.colonyId||1,edge:i,axis:a,radius:s,depth:d,capacity:f,mass:0,innerRadius:s,shells:u}}function kl(e,t,n){let r=e.nest.links[t.edge],i=e.nest.nodes[r[0]],a=e.nest.nodes[r[1]],o=W(t,K(t.axis,t.depth/2+n)),s=no(e.nest,o,i,a,.35);return s.inside?{x:s.x,y:s.y,z:s.z}:null}function Al(e){if(B(e.biologicalProfile).entranceModel!==`plug`)return!1;let t=Ol(e);if(!t)return Zi(e).state=`Procurando uma seção adequada para o tampão`,!0;let n=kl(e,t,.85),r=kl(e,t,.28);return!n||!r?(Zi(e).state=`Procurando apoio junto à entrada`,!0):(e.founding.seal={version:1,plugId:t.id,phase:`collect`,queenPoint:n,workerPoint:r,trips:0},(e.nest.plugs??=[]).push(t),Xi(e,`sealing`,`O abrigo está pronto. A rainha recolhe terra para fechar a entrada por dentro.`),!0)}function jl(e){let t=Ic(e.founding,.72);return{...t,y:U(e.nest.relief,t.x,t.z)+.008}}function Ml(e){let t=e.founding,n=t.seal,r=Zi(e),i=e.nest.plugs.find(e=>e.id===n.plugId);if(n.phase===`collect`){if(r.state=`Recolhendo terra retirada para o tampão`,!Cl(e,r,jl(e)))return;let t=i.capacity-i.mass-(r.carryingSoil||0);if(t>1e-9&&wl(e,r,t)<t-1e-9)return;n.phase=`return`,delete r.supportMotion}if(n.phase===`return`){if(r.state=`Levando terra para fechar a entrada`,!Sl(e,r,n.queenPoint))return;n.phase=`build`,r.route=[],delete r.routeIntent}if(n.phase!==`build`||(r.state=`Escavando e acomodando o tampão por dentro`,!jc(e,r,n.queenPoint)))return;if((e.neighborAgents||e.ants).some(e=>{let t={x:e.x-i.x,y:(e.y||0)-i.y,z:e.z-i.z},n=t.x*i.axis.x+t.y*i.axis.y+t.z*i.axis.z,r=p.hypot(t.x-n*i.axis.x,t.y-n*i.axis.y,t.z-n*i.axis.z);return Math.abs(n)<i.depth/2+(e.kind===`queen`?.55:.34)*(e.bodyScale||1)&&r<i.radius+.15})){r.state=`Aguardando passagem livre para acomodar terra`;return}let a=Math.min(gi.bite,i.capacity-i.mass,r.carryingSoil||0);t.maternal&&Wi(t.maternal,`excavation`)+1e-10<a*.15||(Yi(e,`excavation`,a*.15),El(e,r,i,a),i.mass<i.capacity-1e-9||(n.phase=`closed`,n.closedTick=e.tick,Xi(e,`claustral`,`A entrada foi fechada com terra transportada. A rainha inicia o claustro; os poros ainda permitem difusão de gases.`)))}function Nl(e){let t=e.founding,n=Zi(e),r=e.nest.plugs.find(e=>e.id===t.seal.plugId),i=e.nest.nodes[t.front];jc(e,n,{x:i.x+r.axis.x*.3,y:i.y-i.r*.8,z:i.z+r.axis.z*.3})}function Pl(e,t){let n=e.founding,r=n?.seal;if(!r||n.phase!==`claustral`||r.phase===`opened`||t.kind!==`worker`)return!1;let i=e.nest.plugs?.find(e=>e.id===r.plugId);if(!i||(r.workerId!==void 0&&e.ants.some(e=>e.id===r.workerId)||(r.workerId=t.id),r.workerId!==t.id))return!1;if(delete t.bioTask,delete t.soilTask,r.phase===`closed`&&(r.phase=`remove`,t.route=[],delete t.routeIntent,delete t.supportMotion),r.phase===`haul`)return t.state=`Levando terra do tampão para fora`,Cl(e,t,jl(e))&&(tc(e,t),r.trips++,i.mass<=1e-9?(r.phase=`opened`,r.openedTick=e.tick,t.route=[],delete t.routeIntent,Xi(e,`established`,`As naníticas removeram o tampão e transportaram a terra para fora. A entrada permite forrageamento.`)):r.phase=`return`),!0;if(r.phase===`return`){if(t.state=`Voltando ao tampão`,!Sl(e,t,r.workerPoint))return!0;r.phase=`remove`,t.route=[],delete t.routeIntent}if(t.state=`Escavando o tampão da entrada`,!jc(e,t,r.workerPoint))return!0;Dl(e,t,i,gi.bite);let a=.14*(t.bodyScale||1)+.03;return(i.mass<=1e-9||(t.carryingSoil||0)>=.04&&i.innerRadius>a+.02)&&(r.phase=`haul`,delete t.supportMotion),!0}function Fl(e,t,n){return e.tick>(n.until??1/0)?(Object.assign(n,{x:t.x,y:t.y||0,normal:t.normal?{...t.normal}:{x:0,y:1,z:0},z:t.z,node:t.node??void 0,status:`searching`}),delete n.carrier,delete n.destination,delete n.owner,delete t.carryingMimic,delete n.placing,delete t.supportMotion,t.route=[],t.mimicRejectedUntil=e.tick+200,!1):n.placing?t.supportMotion?(Cs(e,t,t.speed*.85),!0):(Object.assign(n,{x:t.x,y:t.y||0,normal:t.normal?{...t.normal}:{x:0,y:1,z:0},z:t.z,node:t.node??void 0,owner:t.colonyId||1,status:`adopted`}),delete n.carrier,delete t.carryingMimic,delete n.placing,delete t.routeIntent,e.ecology.adoptions++,e.log(`Uma lagarta com odor compatível foi adotada no berçário.`,`info`),!0):(n.destination??=H(e.nest,`nursery`,0,t.colonyId||1),t.node===null?bl(e,t,n.destination):t.route.length?e.moveInNest(t):t.node===n.destination?Ts(e,t,t.node):Q(e,t,n.destination),t.state=`Levando uma larva de odor compatível`,!0)}function Il(e,t){let n=e.ecology;if(!n)return!1;let r=n.mimics.find(e=>e.id===t.carryingMimic&&e.carrier===t.id);if(r)return Fl(e,t,r);if(t.carryingMimic&&delete t.carryingMimic,t.carrying||t.bioTask||t.soilTask||t.rest>0||t.energy<35||(t.mimicRejectedUntil||0)>e.tick)return!1;let i=n.mimics.find(n=>n.status===`searching`&&n.carrier===void 0&&p.hypot(n.x-t.x,n.y-(t.y||0),n.z-t.z)<.5&&Bs(e.nest,t,n));if(!i)return!1;let a=e.socialChemistry?.profiles[String(t.colonyId||1)];return!a||Os(a,i.profile)>.095/(t.pheromoneGain||1)?(n.rejections++,t.mimicRejectedUntil=e.tick+80,!1):(i.carrier=t.id,i.status=`carried`,i.owner=t.colonyId||1,delete i.destination,i.until=e.tick+900,t.carryingMimic=i.id,t.route=[],t.state=`Recolhendo uma larva de odor compatível`,!0)}function Ll(e,t){let n=e.ecology;if(!n||t.node!==null||t.carrying||t.bioTask||t.soilTask||t.carryingMimic||t.rest>0)return!1;let r=e.plants,i=n.aphids.map(e=>({patch:e,plant:r.find(t=>t.id===e.plant)})).filter(e=>e.plant&&e.patch.count>=1&&p.hypot(e.plant.x-t.x,e.plant.z-t.z)<1.35).sort((e,n)=>p.hypot(e.plant.x-t.x,e.plant.z-t.z)-p.hypot(n.plant.x-t.x,n.plant.z-t.z))[0];if(!i)return!1;let a=i.plant,o=i.patch,s=e.predators.find(e=>p.hypot(e.x-a.x,e.z-a.z)<1.1&&p.hypot(e.x-t.x,e.z-t.z)<1.1);if(s&&t.traits.courage>.35&&t.energy>30)return s.angle=p.atan2(s.z-t.z,s.x-t.x),s.repelledUntil=e.tick+15,s.energy=Math.max(0,s.energy-.15),t.energy=Math.max(0,t.energy-.02),n.protected++,e.moveSurface(t,p.atan2(s.z-t.z,s.x-t.x),t.speed*.4),t.state=`Protegendo pulgões`,!0;if(o.honey<.015)return!1;if(p.hypot(a.x-t.x,a.z-t.z)>.42)return e.moveSurface(t,p.atan2(a.z-t.z,a.x-t.x),t.speed),t.state=`Visitando pulgões pelo odor local`,!0;let c=Math.min(.25,o.honey),l=Math.max(0,Math.min(c,.6-t.crop,.06));return o.honey-=c,o.visits++,n.honeyCollected+=c,t.crop+=l,t.carrying+=c-l,t.state=`Coletando melaço`,!0}function Rl(e,t){if(!e.socialChemistry)return!1;if(!t.intrusion){if(t.kind!==`worker`||t.sexual||t.node!==null||t.carrying||t.bioTask||t.soilTask||t.carryingBrood||t.carryingMimic||t.carryingWaste||t.energy>45||t.crop>.1||t.traits.exploration<.55)return!1;let n=e.nest.nodes.map((e,t)=>({...e,id:t})).find(e=>e.type===`entrance`&&(e.colonyId||1)!==(t.colonyId||1)&&p.hypot(e.x-t.x,e.z-t.z)<1.3);if(!n||!e.socialChemistry.profiles[String(n.colonyId||1)]||e.random()>.06)return!1;t.intrusion={owner:n.colonyId||1,entry:n.id,phase:`mask`,until:e.tick+20,home:t.lastEntrance},e.socialChemistry.camouflages++}let n=t.intrusion,r=e.nest.nodes[n.entry];if(!r)return delete t.intrusion,!1;if(n.phase===`mask`){let i=e.socialChemistry.profiles[String(n.owner)];return i?p.hypot(t.x-r.x,t.z-r.z)>r.r+.4?(e.moveSurface(t,p.atan2(r.z-t.z,r.x-t.x),t.speed*.7),t.state=`Aproximando-se do odor no solo`,!0):(t.odorMask={profile:[...i],strength:Math.min(1,(t.odorMask?.strength||0)+.06),until:e.tick+180},t.energy=Math.max(0,t.energy-.003),t.state=`Adquirindo odor do solo`,e.tick>=n.until&&(n.phase=`search`,n.until=e.tick+650),!0):(delete t.intrusion,!1)}if(((t.health??100)<55||e.tick>n.until)&&(n.phase=`exit`,delete t.supportMotion),t.supportMotion)return Cs(e,t,t.speed*.85),!0;if(t.node===null){if(n.phase===`exit`)return t.lastEntrance=n.home,delete t.intrusion,!1;if(p.hypot(t.x-r.x,t.z-r.z)>.6)return e.moveSurface(t,p.atan2(r.z-t.z,r.x-t.x),t.speed),!0;t.node=n.entry,t.tunnelCenter={x:r.x,y:r.y,z:r.z},t.tunnelY=r.y,Ls(e,t,n)}return t.route.length?e.moveInNest(t):n.phase===`search`&&t.node!==null?Rs(e,t,t.node):Ls(e,t,n),t.state=n.phase===`exit`?`Recuando ao acesso estrangeiro`:`Explorando um ninho com disfarce químico`,!0}function zl(e,t){let n=t.encounter;if(!n)return!1;if(e.tick>n.until)return delete t.encounter,!1;let r={x:t.x,y:t.y||0,z:t.z},i=t.speed*.7,a=xs(e,t,{x:r.x+n.direction.x*.25,y:r.y+n.direction.y*.25,z:r.z+n.direction.z*.25},i);if(a){let e={x:a.position.x-r.x,y:a.position.y-r.y,z:a.position.z-r.z};Object.assign(t,a.position,{normal:a.normal,angle:p.atan2(e.z,e.x),pitch:p.atan2(e.y,p.hypot(e.x,e.z))}),t.distanceWalked=(t.distanceWalked||0)+p.hypot(e.x,e.y,e.z)}return t.state=n.state,!0}function Bl(e,t){let n=G(e,K(t,q(e,t)));return J(n)<.001&&(n=X(t,{x:0,y:1,z:0})),J(n)<.001&&(n=X(t,{x:1,y:0,z:0})),Y(n)}function Vl(e,t){let n=cs(t),r=Xa(t);if(!t.route?.length||t.node==null)return delete n.progressAnchor,!1;if(!n.progressAnchor||J(G(r,n.progressAnchor))>.35)return n.progressAnchor=r,n.progressSince=e.tick,delete n.escapeDirection,!1;if(e.tick-(n.progressSince??e.tick)<70&&!n.escapeDirection)return!1;let i=t.normal??{x:0,y:1,z:0};if(Math.abs(Ya(e.nest,r).distance-.008)>.03)return!1;if(!n.escapeDirection){let r=Bl({x:p.cos(t.angle)*p.cos(t.pitch||0),y:p.sin(t.pitch||0),z:p.sin(t.angle)*p.cos(t.pitch||0)},i),a=X(i,r),o=t.id%2?1:-1;n.escapeDirection=Y(W(K(a,o),K(r,-.35))),n.escapeUntil=e.tick+55,delete t.supportMotion,n.retreating=!1}if(e.tick>=(n.escapeUntil??0))return delete n.escapeDirection,n.progressSince=e.tick,!1;let a=Bl(n.escapeDirection,i),o=t.speed*.85,s=xs(e,t,W(r,K(a,.8)),o);if(!s)return!1;let c=G(s.position,r),l=J(c);Object.assign(t,s.position,{normal:s.normal,angle:p.atan2(c.z,c.x),pitch:p.atan2(c.y,p.hypot(c.x,c.z)),state:`Buscando espaço para liberar o fluxo`,distanceWalked:(t.distanceWalked||0)+l}),n.velocity=c,n.stagnantTicks=0;let u=e.nest.nodes[t.node],d=e.nest.nodes[t.route[0]];if(u&&d){let e=G(d,u),n=Math.max(0,Math.min(1,q(G(Xa(t),u),e)/(q(e,e)||1)));t.tunnelCenter=W(u,K(e,n)),t.tunnelY=t.tunnelCenter.y}return!0}function Hl(e,t,n){return t.sexual?(t.energy-=.012,t.energy<=0||!t.life&&t.age>25?(n.add(t.id),t.deathCause=`starvation`,e.log(`Um alado não sobreviveu até a próxima janela de voo.`,`danger`),!0):t.departure?(Vl(e,t)||(t.node!==null&&(t.route.length||Q(e,t,H(e.nest,`entrance`,t.id%2,t.colonyId||1)),e.moveInNest(t)),t.state=t.node===null?`Alado pronto para decolar`:`Alado saindo para o voo`),!0):(t.state=t.age<1?`Alado em maturação`:`Alado aguardando chuva e calor`,!0)):!1}function Ul(e){let t=e.founding,n=t.foraging,r=Zi(e),i=e.nest.nodes[t.front],a={x:i.x-.12,y:i.y-i.r*.88,z:i.z};if(n.phase===`nursing`){if(r.state=`Cuidando da prole e do alimento coletado`,t.nanitics>0||e.tick<n.nextDeparture||n.pantry>=ci.pantryTarget)return;n.phase=`outbound`,n.searchTicks=0;let i=Ic(t,.72);n.heading=p.atan2(i.z-t.site.z,i.x-t.site.x)}if(n.phase===`outbound`){let i=Ic(t,.72),a={...i,y:U(e.nest.relief,i.x,i.z)+.008};r.state=`Saindo para coletar alimento na fundação semiclaustral`,Cl(e,r,a)&&(n.phase=`searching`)}else if(n.phase===`searching`){if(n.searchTicks++,t.nanitics>0||n.searchTicks>=ci.searchLimit){n.phase=`returning`;return}let i=e.predators.find(e=>p.hypot(e.x-r.x,e.z-r.z)<1.5),a=n.heading;if(i)a=p.atan2(r.z-i.z,r.x-i.x),r.state=`Fugindo de predador durante a coleta`,n.phase=`returning`;else{let t=ci.sensorRadius,i;for(let n of e.patches){let e=p.hypot(n.x-r.x,n.z-r.z);n.amount>1e-9&&e<t&&(t=e,i=n)}if(i){if(a=p.atan2(i.z-r.z,i.x-r.x),r.state=`Rainha coletando alimento`,t<ci.contactRadius&&Math.abs((r.y??0)-U(e.nest.relief,i.x,i.z))<.25){let e=Math.min(ci.capacity,i.amount);i.amount-=e,i.discovered=!0,n.load+=e,n.collected+=e,r.carrying=n.load,n.phase=`returning`;return}}else n.searchTicks%35==0&&(a+=e.range(-.9,.9)),r.state=`Explorando com sensores locais`}n.heading=a,e.moveSurface(r,a,r.speed*.85),Yi(e,`maintenance`,ci.travelCost)}else r.state=n.load>0?`Rainha levando alimento à primeira câmara`:`Voltando ao primeiro abrigo`,Sl(e,r,a)&&(n.pantry+=n.load,n.delivered+=n.load,n.load>0&&n.trips++,n.load=0,r.carrying=0,n.phase=`nursing`,n.nextDeparture=e.tick+ci.restTicks,t.nanitics>0||e.log(`A rainha voltou ao abrigo: `+n.pantry.toFixed(2)+` crédito(s) de alimento coletado disponíveis.`,`food`))}let Wl=.42,Gl=e=>4*Math.PI*p.pow(e,3)/3;function Kl(e){let t=e.founding,n=Zi(e);if(!n)return;if(t.front===void 0){if(t.maternal){let r=Gl(.02)*.5,i=r*.15;if(Wi(t.maternal,`excavation`)+1e-10<i){n.state=`Sem reservas disponíveis para iniciar o abrigo`,t.maternal.unmet.excavation+=i;return}Yi(e,`excavation`,i),ec(e,n,r)}t.entry=e.nest.nodes.length,t.front=t.entry+1,e.nest.nodes.push({...t.site,r:.02,type:`entrance`,name:`Primeiro buraco`,colonyId:e.colonyId||1},{...t.site,r:.02,type:`front`,name:`Abrigo em escavação`,colonyId:e.colonyId||1}),e.nest.linkWidths??=e.nest.links.map(()=>.38),e.nest.links.push([t.entry,t.front]),e.nest.linkWidths.push(.02),e.nest.revision++}let r=e.nest.nodes[t.front],i=e.nest.nodes[t.entry],a=Ic(t,.72),o={...a,y:U(e.nest.relief,a.x,a.z)+.008},s={x:r.x-.12,y:r.y-r.r*.88,z:r.z};if(t.digMode===`haul`){let r=Cl(e,n,o);n.state=`Levando terra do primeiro abrigo`,r&&(tc(e,n),t.trips++,t.digMode=`return`);return}if(Ac(e,n))return;if(!(r.r<Wl?jc(e,n,s):Sl(e,n,s))){n.state=`Caminhando até a frente do abrigo`;return}n.node=t.front,n.tunnelCenter={x:r.x,y:r.y,z:r.z},n.tunnelY=r.y,t.digMode=`bite`,n.state=`Escavando o primeiro abrigo`;let c=$(r,t.chamber);if(c<.001&&r.r>=.6799000000000001){if((n.carryingSoil||0)>1e-5){t.digMode=`haul`;return}if(r.type=`royal`,r.name=`Primeira câmara da rainha`,e.nest.revision++,delete n.supportMotion,t.foraging){Xi(e,`semiclaustral`,`O abrigo está pronto. A rainha precisa buscar alimento fora para criar a primeira prole.`);return}if(Al(e))return;Xi(e,`claustral`,`O abrigo ficou pronto. A rainha cria a primeira prole com suas reservas maternas.`);return}if(e.tick%2)return;let l=0,u=()=>{};if(r.r<.4199){let n=Math.min(Wl,r.r+.008);l=(Gl(n)-Gl(r.r))*.5,u=()=>{r.r=i.r=n,e.nest.linkWidths[e.nest.links.findIndex(([e,n])=>e===t.entry&&n===t.front)]=n}}else if(c>.001){let e=Math.min(.012,c);u=()=>{r.x+=(t.chamber.x-r.x)*e/c,r.y+=(t.chamber.y-r.y)*e/c,r.z+=(t.chamber.z-r.z)*e/c},l=Math.PI*p.pow(Wl,2)*e}else{let e=Math.min(.68,r.r+.004);l=Gl(e)-Gl(r.r),u=()=>{r.r=e}}if(t.maternal){if(Wi(t.maternal,`excavation`)+1e-10<l*.15){n.state=`Sem reservas disponíveis para escavar`,t.maternal.unmet.excavation+=l*.15;return}Yi(e,`excavation`,l*.15)}u(),ec(e,n,l),t.maternal||Yi(e,`excavation`,l*.15),e.nest.revision++,(n.carryingSoil||0)>=.12&&(t.digMode=`haul`,delete n.supportMotion)}function ql(e){let t=e.founding;if(!t||[`established`,`failed`].includes(t.phase))return;zc(e);let n=Zi(e);if(!n||(n.health??100)<=0){Xi(e,`failed`,`A fundação terminou com a perda da rainha.`);return}qc(e);let r=.001*ba(e).activity;Yi(e,`maintenance`,r)<r&&(e.queenHealth=Math.max(0,e.queenHealth-.15)),n.energy=e.queenHealth,e.queenHealth<=0?Xi(e,`failed`,`As reservas maternas se esgotaram antes de sustentar a colônia.`):[`weather`,`flight`,`landing`,`dealate`].includes(t.phase)?Bc(e):t.phase===`surveying`?Fc(e):t.phase===`digging`?Kl(e):t.phase===`sealing`?Ml(e):t.phase===`semiclaustral`?Ul(e):t.phase===`claustral`&&(t.seal&&Nl(e),n.state=`Cuidando da prole com reservas maternas`)}function Jl(e,t,n){let r=[n-.7,n,n+.7];return r[es(r.map(n=>e.pheromones[e.pheromoneIndex(t.x+p.cos(n)*.7,t.z+p.sin(n)*.7)]),r.map((n,r)=>(e.inPond(t.x+p.cos(n)*.7,t.z+p.sin(n)*.7)?.1:1)*(r===1?1:.85)),()=>e.random(),{alpha:t.pheromoneGain??1,exploration:.03+e.params.randomness/100*t.traits.exploration*.35})]+e.range(-.12,.12)*(.2+e.params.randomness/100)}let Yl=e=>B(e.biologicalProfile).chamberModel===`local-demo`;function Xl(e,t){if(!Yl(e)||t.kind!==`worker`||t.node===null)return;let n=e.nest.nodes[t.node];if(!n||(n.colonyId??1)!==(t.colonyId??1)||[`entrance`,`front`,`waste`].includes(n.type)||p.hypot(t.x-n.x,(t.y??0)-n.y,t.z-n.z)>n.r+.15)return;let r=V(e.microclimate,{x:t.x,y:t.y??0,z:t.z});if(!r)return;let i=t.roomMemory??={version:1,rooms:[]};i.rooms=i.rooms.filter(n=>n.node!==t.node&&e.tick-n.tick<=L.memoryTicks),i.rooms.push({node:t.node,tick:e.tick,reading:{water:r.water,temperature:r.temperature}}),i.rooms=i.rooms.slice(-L.memoryLimit)}function Zl(e,t){let n=null,r=-1/0;for(let i of t.roomMemory?.rooms??[]){let a=e.nest.nodes[i.node];if(!a||[`entrance`,`front`,`waste`].includes(a.type)||e.tick-i.tick>L.memoryTicks||(a.colonyId??1)!==(t.colonyId??1))continue;let o=Mc(i.reading,`brood`);o>r+.02&&(r=o,n=i.node)}return n}function Ql(e,t){let n=Math.min(Math.max(0,(e.crop-t.crop)/2),.6-t.crop,e.crop);return n<=0?0:(e.crop-=n,t.crop+=n,n)}function $l(e,t){tl(e.seed,t);let n=Yr(e,gl(e,t)?Math.max(0,Math.min(.3,.6-t.crop,e.food)):0,`care`,t.node??void 0,!!e.colony.stores);t.stockEmptyUntil=n>0?0:e.tick+150,t.crop+=n}function eu(e){for(let t of e.ants){tl(e.seed,t);let n=t.kind===`queen`;if(n&&Ji(e))continue;if(n&&t.life&&t.crop<.04&&$l(e,t),n){let n=ba(e).activity,r=6e-4*n,i=.001*n,a=t.crop<r&&e.founding?Yi(e,`maintenance`,i):0,o=t.crop>=r||a>=i,s=Math.min(t.crop,r);t.crop-=s,e.queenHealth=Math.max(0,Math.min(100,e.queenHealth+(o?.018:-.09))),t.energy=e.queenHealth}else if(t.energy<100&&t.crop>0){let e=Math.min(t.crop,3e-4,(100-t.energy)/500);t.crop-=e,t.energy=Math.min(100,t.energy+e*500)}if(t.crop<.04||(t.socialUntil||0)>e.tick)continue;let r=vs(e,t,.5).find(n=>As(e,t,n)&&(n.crop??0)<t.crop-.04&&(n.socialUntil||0)<=e.tick&&Bs(e.nest,t,n));if(!r)continue;tl(e.seed,r);let i=Ql(t,r);i<=0||(t.socialUntil=r.socialUntil=e.tick+12,t.socialPartner=r.id,r.socialPartner=t.id,e.colony.shared+=i,e.colony.exchanges++)}}function tu(e,t,n){let r=t.bioTask;if(!r)return!1;if(!(r.kind===`brood`&&Yl(e))&&n!==r.destination&&e.nest.nodes[n].type===e.nest.nodes[r.destination].type&&[`entrance`,`royal`,`nursery`,`storage`,`waste`].includes(e.nest.nodes[n].type)&&(r.destination=n),n!==r.destination)return Q(e,t,r.destination),!0;if(t.route=[],(Kr(e,n)||ia(e.nest,n,t.colonyId||1))&&$l(e,t),r.kind===`brood`||r.kind===`waste`){let i=ao(e,r.item,n);r.placing=!0,Ss(e,t,i.point,i.normal,e.nest.nodes[n])}else r.kind===`care`?r.until=e.tick+15:(t.node=null,t.tunnelCenter=null,t.tunnelY=0,delete t.bioTask,t.state=`Vigiando a entrada`);return!0}function nu(e,t){let n=t.bioTask;if(!n)return!1;if(n.placing){if(t.supportMotion)return Cs(e,t,t.speed*.85),!0;if(n.kind===`brood`){let r=e.brood.find(e=>e.id===n.item);r&&(delete r.carrier,Object.assign(r,{x:t.x,y:(t.y||0)+.025,z:t.z,node:n.destination})),t.carryingBrood=0}else{let r=e.colony.waste.find(e=>e.id===n.item);r&&(delete r.carrier,Object.assign(r,{x:t.x,y:(t.y||0)+.025,z:t.z,stored:!0}),e.colony.cemeteryMass+=r.mass),t.carryingWaste=0}return delete t.bioTask,!0}return n.until?(t.state=t.crop>.02?`Cuidando da rainha`:`Buscando alimento social`,e.tick>=n.until&&(delete t.bioTask,Q(e,t,H(e.nest,`storage`,0,t.colonyId||1))),!0):t.node==null?(bl(e,t,n.destination),t.state=n.kind===`waste`?`Levando resíduos ao cemitério`:`Voltando ao berçário`,!0):t.route?.length?(e.moveInNest(t),!0):(t.node===n.destination?tu(e,t,t.node):Q(e,t,n.destination),!0)}function ru(e,t){if(tl(e.seed,t),Xl(e,t),nu(e,t))return!0;if(t.carrying||t.soilTask||(t.carryingSoil||0)>0)return!1;if(t.role=Qc(e,t),e.tick%50==t.id%50&&e.random()>.3+t.traits.activity*.7&&t.energy>50&&!t.route?.length&&(t.rest=5+Math.round((1-t.traits.activity)*15)),t.rest>0)return t.rest--,t.state=`Descansando`,!0;let n={x:t.x,y:t.y||0,z:t.z},r=e.colony.waste.find(e=>!e.stored&&!e.carrier&&$(n,e)<.8);if(r&&[`cleaner`,`nurse`].includes(t.role))return r.carrier=t.id,t.carryingWaste=r.id,t.bioTask={kind:`waste`,item:r.id,destination:H(e.nest,`waste`,0,t.colonyId||1)},t.node!=null&&Q(e,t,H(e.nest,`waste`,0,t.colonyId||1)),t.state=`Recolhendo resíduos`,!0;if(t.role===`nurse`&&t.node!=null){let r=Yl(e)?Zl(e,t):H(e.nest,`nursery`,0,t.colonyId||1),i=e.brood.find(e=>r!==null&&e.node!==r&&!e.carrier&&$(n,e)<.85);if(i)return i.carrier=t.id,t.carryingBrood=i.id,t.bioTask={kind:`brood`,item:i.id,destination:r},Q(e,t,r),t.state=`Transportando uma cria`,!0;if(!t.route?.length){let n=H(e.nest,t.crop<.15?`storage`:`royal`);return t.bioTask={kind:`care`,destination:n},Q(e,t,n),!0}}if(t.role===`defender`&&t.energy>35){if(t.node!=null)return t.route?.length||(t.bioTask={kind:`guard`,destination:H(e.nest,`entrance`,t.id%2,t.colonyId||1)},Q(e,t,t.bioTask.destination)),!1;let n=e.predators.find(e=>p.hypot(e.x-t.x,e.z-t.z)<1.2);if(n&&t.traits.courage>.3)return n.energy=Math.max(0,n.energy-.7),t.energy-=.04,e.moveSurface(t,p.atan2(n.z-t.z,n.x-t.x),t.speed),t.state=`Defendendo a entrada`,!0;let r=e.nest.nodes[H(e.nest,`entrance`,t.id%2,t.colonyId||1)],i=e.tick*.012+t.id,a={x:r.x+p.cos(i)*.8,z:r.z+p.sin(i)*.8};return e.moveSurface(t,p.atan2(a.z-t.z,a.x-t.x),t.speed*.7),t.state=`Vigiando a entrada`,!0}return!1}function iu(e,t,n){let r=e.nest.nodes[n.front],i=Y(G(n.goal,r)),a=Z(e.nest,W(r,K(i,r.r*.8)));return Math.abs(a.gap-.008)>.02?!1:(t.route=[n.front],Ss(e,t,a.point,a.normal,{x:r.x,y:r.y,z:r.z}),Cs(e,t,t.speed*.85),!0)}function au(e,t,n){let r=e.nest.nodes[t];for(let t=0;t<36;t++){let i=n&&t<12?p.atan2(n.z,n.x)+e.range(-.9,.9):e.range(0,Math.PI*2),a=n&&t<12?n.y+e.range(-.35,.35):e.range(-.65,.75),o=Y({x:p.cos(i),y:a,z:p.sin(i)}),s=e.range(.65,.95),c={x:r.x+o.x*s,y:r.y+o.y*s,z:r.z+o.z*s},l=U(e.nest.relief,c.x,c.z);if(Math.abs(c.x)>9.83||Math.abs(c.z)>6.33||c.y<-3.45||c.y>l+.03||c.y>l-.65&&(Ba(e.landscape,c.x,c.z,!0)<2||Va(e.landscape,c.x,c.z)<2))continue;let u=c.y>l-.15;u&&(c.y=l+.03);let d={x:c.x,y:u?l-.3:c.y,z:c.z};if(!(Ja(e.nest,d).distance>-.13))return c}return null}function ou(e,t){let n=e.nest.nodes[t];if(!n||e.soil.projects.filter(e=>!e.completed).length>=2||e.nest.nodes.length>=46||e.soil.projects.some(e=>!e.completed&&e.from===t))return null;let r=au(e,t);if(!r)return null;e.nest.linkWidths??=e.nest.links.map(()=>.38);let i=e.nest.nodes.push({...n,r:.28,type:`front`,name:`Frente de escavação`})-1;e.nest.links.push([t,i]),e.nest.linkWidths.push(.28);let a={id:e.soil.nextId++,from:t,front:i,goal:r,completed:!1,excavated:0,remainingSegments:Math.floor(e.range(2,5)),heading:Y(G(r,n))};return e.soil.projects.push(a),e.soil.lastProject=e.tick,e.nest.revision++,e.log(`Uma operária iniciou uma nova frente de escavação.`,`dig`),a}function su(e,t){let n=e.nest.nodes[t.front],r=U(e.nest.relief,n.x,n.z),i=n.y>=r-.15,a=!i&&(t.remainingSegments||0)>0&&e.nest.nodes.length<48?au(e,t.front,t.heading):null;if(a)n.type=`junction`,n.name=`Curva escavada`,t.from=t.front,t.front=e.nest.nodes.push({...n,type:`front`,name:`Frente de escavação`})-1,e.nest.links.push([t.from,t.front]),e.nest.linkWidths.push(.28),t.remainingSegments--,t.goal=a,t.heading=Y(G(a,n));else{t.completed=!0;let r=[`nursery`,`storage`,`waste`].find(t=>!e.nest.nodes.some(e=>e.type===t&&(e.colonyId||1)===(n.colonyId||1)));n.type=i?`entrance`:r||`chamber`,n.name=i?`Novo acesso escavado`:{nursery:`Berçário escavado`,storage:`Despensa escavada`,waste:`Câmara de resíduos escavada`}[n.type]||`Câmara escavada`,e.log(i?`A escavação alcançou a superfície e abriu outro acesso.`:`As operárias abriram uma nova câmara.`,`dig`)}e.nest.revision++}function cu(e,t,n){let r=e.nest.nodes[n.front],i=e.nest.nodes[n.from],a=G(n.goal,r),o=p.hypot(a.x,a.y,a.z);if(o<.001){su(e,n);return}let s=Math.min(.02*(t.digPower??1),o),c=Y(a),l=Math.max(0,$(r,i)-Math.max(0,i.r-r.r));r.x+=c.x*s,r.y+=c.y*s,r.z+=c.z*s;let u=Math.max(0,$(r,i)-Math.max(0,i.r-r.r)),d=Math.PI*p.pow(r.r,2)*(u-l);n.excavated+=d,ec(e,t,d),e.nest.revision++}let lu=.022;function uu(e,t){if(!t.soilTask&&(t.carryingBrood||t.carryingWaste||`bioTask`in t&&t.bioTask))return!1;if(!t.soilTask&&`role`in t&&t.role===`excavator`&&t.node!=null&&e.tick-e.soil.lastProject>=450&&[`royal`,`nursery`,`storage`,`chamber`].includes(e.nest.nodes[t.node].type)&&(!t.tunnelCenter||$(t.tunnelCenter,e.nest.nodes[t.node])<.03)&&ou(e,t.node),!t.soilTask){let n=(e.nest.rubble||[]).find(n=>n.mass>1e-4&&$({x:t.x,y:t.y||0,z:t.z},n)<.8&&e.ants.filter(e=>e.soilTask?.rubbleId===n.id).length<2);if(n&&t.node!=null&&!t.carrying)t.soilTask={phase:`repair`,rubbleId:n.id,digTicks:0,sourceNode:t.node};else if((t.carryingSoil||0)>0&&t.node!=null)t.soilTask={phase:`haul`,digTicks:0},vl(e,t);else{let n=e.soil.projects.find(n=>!n.completed&&t.node===n.from&&e.ants.filter(e=>e.soilTask?.projectId===n.id).length<2);if(!n||(`role`in t?t.role!==`excavator`:t.id%4!=0)||t.carrying||t.energy<50)return!1;t.soilTask={projectId:n.id,phase:`return`,digTicks:0},Q(e,t,n.front)}}let n=t.soilTask;if((n.phase===`dig`||n.phase===`repair`)&&ws(e,t,t.speed*.85))return!0;if((t.y||0)>=-.04&&t.node!=null&&p.hypot(t.x-e.nest.nodes[t.node].x,t.z-e.nest.nodes[t.node].z)>1.2&&(t.node=null,t.route=[],t.tunnelCenter=null,delete t.supportMotion,t.navigation&&(t.navigation.retreating=!1)),t.node==null&&n.phase!==`dump`&&(t.route=[],n.phase=(t.carryingSoil||0)>0?`dump`:`return`),n.phase===`return`&&n.rubbleId&&t.node!=null){let r=e.nest.rubble?.find(e=>e.id===n.rubbleId);r&&$({x:t.x,y:t.y||0,z:t.z},r)<.8&&(n.phase=`repair`)}if(n.phase===`haul`&&n.reversing){if(t.navigation?.retreating)return e.moveInNest(t),!0;n.reversing=!1,vl(e,t)}if(n.phase===`repair`){let r=e.nest.rubble?.find(e=>e.id===n.rubbleId);if(!r||r.mass<1e-4)return(t.carryingSoil||0)>0?vl(e,t):delete t.soilTask,!0;if($({x:t.x,y:t.y||0,z:t.z},r)>.8){let n=r.edge===void 0?null:e.nest.links[r.edge];return n&&!t.route?.length&&(t.route=[n[0]===t.node?n[1]:n[0]]),t.route?.length&&e.moveInNest(t),!0}if(t.state=`Removendo terra de um bloqueio`,++n.digTicks%5)return!0;let i=Math.min(.007,r.mass,lu-(t.carryingSoil||0));return r.mass-=i,t.carryingSoil=(t.carryingSoil||0)+i,e.nest.revision++,(t.carryingSoil>=.0219||r.mass<1e-4)&&(t.route?.length&&t.navigation&&(t.navigation.retreating=!0,n.reversing=!0,delete t.supportMotion),vl(e,t)),!0}if(n.phase===`dump`)return t.state=`Levando terra para fora`,ws(e,t,t.speed*.85)?!0:t.supportMotion?(Cs(e,t,t.speed*.85),!0):(tc(e,t),t.tunnelCenter=null,t.tunnelY=0,n.phase=`return`,n.digTicks=0,!n.projectId&&!n.rubbleId&&delete t.soilTask,!0);let r=e.soil.projects.find(e=>e.id===n.projectId);if(n.phase===`return`&&t.node==null){let i=e.nest.rubble?.find(e=>e.id===n.rubbleId&&e.mass>1e-4);return(!r||r.completed)&&!i?(delete t.soilTask,!1):(bl(e,t,r?.front??n.sourceNode),!0)}if(t.route?.length)return e.moveInNest(t),n.phase===`haul`&&(t.state=`Levando terra para fora`),!0;if(n.phase===`haul`)return vl(e,t),!0;if(!r||r.completed)return(t.carryingSoil||0)>0?vl(e,t):(delete t.soilTask,Q(e,t,0)),!0;if(t.node!==r.front)return n.phase=`return`,Q(e,t,r.front),!0;n.phase=`dig`;let i=e.nest.nodes[r.front];return $({x:t.x,y:t.y||0,z:t.z},i)>Math.max(.46,e.nest.nodes[r.from].r+.18)?(iu(e,t,r),!0):(t.state=`Escavando a frente do túnel`,++n.digTicks%4==0&&r.lastWorkedTick!==e.tick&&(r.lastWorkedTick=e.tick,cu(e,t,r),ws(e,t,t.speed*.85)),(t.carryingSoil||0)>=lu&&vl(e,t),!0)}let du=(e,t)=>p.hypot(e.x-t.x,e.z-t.z);function fu(e,t,n){let r=/* @__PURE__ */ new Set;for(let t of e.ants)t.previousAngle=t.angle,t.previousX=t.x,t.previousY=t.y||0,t.previousZ=t.z,t.previousDistance=t.distanceWalked||0;ql(e);for(let i of e.ants){i.age+=.01;let a=Gs(e,i,n?.get(i.id)??0);if(a){r.add(i.id),e.deaths++,i.deathCause=a,i.kind===`queen`&&e.log(`A rainha morreu por `+pl[a]+`.`,`danger`);continue}if((i.health??100)<=0){r.add(i.id),e.deaths++,i.deathCause=`combat`,i.kind===`queen`&&e.log(`Uma rainha morreu durante um conflito.`,`danger`);continue}if(Hl(e,i,r))continue;if(i.kind===`queen`){e.queenHealth<=0&&(r.add(i.id),e.log(`A rainha morreu por falta de alimento.`,`danger`));continue}if(i.kind===`male`){e.founding||(i.state=`Acasalamento`),(e.founding?e.founding.matedTick!==void 0&&e.tick>e.founding.matedTick+25&&!i.airborne:e.tick>65)&&(r.add(i.id),e.log(`Após o acasalamento, o ciclo do macho terminou.`,`info`));continue}if(ko(e,i),i.energy-=(.025+(1-t)*.015)*(i.metabolicCost??1)*ba(e).activity+Xo(e,i),i.energy<=0||!i.life&&i.age>e.lifeLimit(i)){r.add(i.id),e.deaths++,i.deathCause=i.energy<=0?`starvation`:`age`;continue}if(zl(e,i)||Rl(e,i)||xl(e,i)||Pl(e,i)||Vl(e,i)||Il(e,i)||Ll(e,i)||i.soilTask&&uu(e,i)||ru(e,i)||uu(e,i))continue;if(i.node!=null&&!i.route?.length){let t=e.nest.nodes[i.node];(i.y||0)>=-.04&&p.hypot(i.x-t.x,i.z-t.z)>1.2?(i.node=null,i.tunnelCenter=null,i.tunnelY=0):(Q(e,i,(i.carrying||i.energy<35&&e.tick>=(i.stockEmptyUntil||0))&&i.node!==H(e.nest,`storage`,0,i.colonyId||1)?hl(e,i,H(e.nest,`storage`,0,i.colonyId||1)):_l(e,i)),!i.route.length&&t.type===`entrance`&&(i.route=[i.node]))}if(i.route?.length){e.moveInNest(i);continue}if(i.pitch=0,i.normal={x:0,y:1,z:0},i.rest>0){i.rest--;continue}let o=e.predators.find(e=>du(i,e)<1.5),s=i.angle;if(o)s=p.atan2(i.z-o.z,i.x-o.x),i.state=`Fugindo`;else if(i.carrying||i.energy<35&&e.tick>=(i.stockEmptyUntil||0)){let t=_l(e,i);if(t<0){s=Jl(e,i,s),e.moveSurface(i,s,i.speed),i.state=`Procurando a entrada pelo cheiro`;continue}let n={...e.nest.nodes[t],index:t};if(s=p.atan2(n.z-i.z,n.x-i.x),i.state=i.carrying?`Levando alimento`:`Voltando ao ninho`,du(i,n)<.6){i.tunnelCenter={x:n.x,y:n.y,z:n.z},i.tunnelY=n.y,i.node=n.index,Q(e,i,hl(e,i,H(e.nest,`storage`,0,i.colonyId||1)));continue}}else{let t=null,n=2.3;for(let r of e.patches){let e=du(i,r);r.amount>.12&&e<n&&(n=e,t=r)}t?(s=p.atan2(t.z-i.z,t.x-i.x),i.state=`Coletando`,n<.38&&(i.carrying=Math.min(.65,t.amount),t.amount-=i.carrying,i.angle+=Math.PI,!t.discovered&&e.tick-e.lastDiscovery>30&&(t.discovered=!0,e.lastDiscovery=e.tick,e.log(`Uma exploradora encontrou uma fonte de alimento.`,`food`)))):(i.state=`Explorando`,s=Jl(e,i,s))}if(e.moveSurface(i,s,i.speed),i.carrying){let t=e.pheromoneIndex(i.x,i.z);wc(e.pheromones,t,.25)}}return r}function pu(e){let t=_c(e),n=t===`tree`?.065:t===`shrub`?.045:t===`cactus`?.16:t===`succulent`?.12:0;return n?n*(.35+Math.max(0,e.biomass)*.85)+.14:0}function mu(e,t,n){let r=0;for(let i of e){let e=pu(i);if(e){let a=p.hypot(t-i.x,n-i.z);a<e&&(r+=p.pow(1-a/e,2))}}return r}function hu(e,t,n,r){if(!e)return!1;let i=mu(e,n,r),a=mu(e,t.x,t.z);return i>0&&(a===0||i>=a-1e-8)}function gu(e,t){return e.predatorMemory??={version:1,anchor:{x:e.x,z:e.z,tick:t}}}function _u(e,t,n){let r=gu(e,t);return r.visit&&(r.avoid={plant:r.visit.plant,until:t+200}),delete r.visit,r.escape={angle:n,until:t+35},r.anchor={x:e.x,z:e.z,tick:t},e.avoidTicks=0,e.state=`Contornando obstáculo`,n}function vu(e,t){let n=gu(e,t);if(p.hypot(e.x-n.anchor.x,e.z-n.anchor.z)>.18&&(n.anchor={x:e.x,z:e.z,tick:t}),n.escape&&n.escape.until>t)return n.escape.angle;if(delete n.escape,t-n.anchor.tick>=50)return _u(e,t,e.angle+(e.id%2?1:-1)*Math.PI*.65)}function yu(e,t,n){let r=gu(e,n);r.visit?.plant!==t.id&&(r.visit={plant:t.id,since:n});let i=p.hypot(e.x-t.x,e.z-t.z),a=n-r.visit.since;return i<=Math.max(.3,pu(t)+.035)||a>=100?e.cooldown>0||a>=40?{waiting:!1,heading:_u(e,n,p.atan2(e.z-t.z,e.x-t.x)+(e.id%2?1:-1)*.3)}:(e.state=`Procurando presas na planta`,{waiting:!0,heading:e.angle}):(e.state=`Aproximando da planta`,{waiting:!1,heading:p.atan2(t.z-e.z,t.x-e.x)})}function bu(e,t){if(t.kind!==`queen`||t.node!==null)return!1;let n=((t.colonyId??1)===(e.colonyId??1)?e:e.colonies?.find(e=>e.colonyId===t.colonyId))?.founding?.foraging;return!!n&&n.phase!==`nursing`}function xu(e,t){let n=e.ecology;if(!n||(t.repelledUntil||0)>e.tick)return null;let r=n.aphids.map(t=>({a:t,plant:e.plants.find(e=>e.id===t.plant)})).filter(n=>n.plant&&!(t.predatorMemory?.avoid?.plant===n.a.plant&&t.predatorMemory.avoid.until>e.tick)&&n.a.count>=1&&p.hypot(n.plant.x-t.x,n.plant.z-t.z)<1.8);r.sort((e,n)=>p.hypot(e.plant.x-t.x,e.plant.z-t.z)-p.hypot(n.plant.x-t.x,n.plant.z-t.z));let i=r[0];return i?(p.hypot(i.plant.x-t.x,i.plant.z-t.z)<.4&&t.cooldown<=0&&e.random()<.15&&(--i.a.count,n.aphidsEaten++,t.energy=Math.min(100,t.energy+2),t.cooldown=65),i.plant):null}let Su=(e,t)=>p.hypot(e.x-t.x,e.z-t.z);function Cu(e,t){for(let n of e.predators){if(n.previousX=n.x,n.previousY=n.y??0,n.previousAngle=n.angle,n.previousZ=n.z,n.previousDistance=n.distanceWalked||0,n.energy-=.012,n.cooldown>0&&n.cooldown--,n.repelledUntil>e.tick){e.moveSurface(n,n.angle,.055,!0);continue}let r=vu(n,e.tick);if(r!==void 0){n.angle=r,e.moveSurface(n,n.angle,.04,!0);continue}let i=null,a=2.6;for(let r of e.ants)if((r.kind===`worker`||bu(e,r))&&r.y>=-.1&&!t.has(r.id)&&!e.nest.nodes.some(e=>e.type===`entrance`&&Su(r,e)<1.3)){let e=Su(r,n);e<a&&(a=e,i=r)}if(i)n.angle=p.atan2(i.z-n.z,i.x-n.x),a<.4&&n.cooldown===0&&e.random()<.24&&(i.deathCause=`predation`,t.add(i.id),e.deaths++,n.prey++,n.energy=Math.min(100,n.energy+20),n.cooldown=65,e.log(i.kind===`queen`?`Uma aranha capturou uma rainha durante a coleta.`:`Uma aranha capturou uma operária.`,`danger`));else{let t=xu(e,n);if(t){let r=yu(n,t,e.tick);if(n.angle=r.heading,r.waiting)continue}else e.random()<.07&&(n.angle+=e.range(-1,1))}let o=i?.kind?.062:.024;e.moveSurface(n,n.angle,o,!0)}e.predators=e.predators.filter(e=>e.energy>0)}function wu(e,t,n){let r=t.development,i=ba(e),a=Ta(e,t),o=Ca(t.age),s=xa(a.temperature),c=Sa(a.water),l=o.name===`larva`?Math.max(0,Math.min(1,n)):1,u=Math.max(0,1-c,o.name===`larva`?1-l:0,+(a.temperature<(e.colony.season?.phase===`dormant`&&o.name===`larva`?R.coldMinimum:z.minimum)||a.temperature>z.maximum));return r.stress=Math.max(0,Math.min(1,r.stress+z.stressPerTick*u-z.recoveryPerTick*(1-u))),r.lastTemperature=a.temperature,r.lastSoilWater=a.water,r.lastRate=s*c*l*r.growthFactor*(1-.5*r.stress)*(o.name===`larva`?i.growth:1),r.stress>=1?!1:(t.age=Math.min(o.end,t.age+o.span/(o.days*100)*r.lastRate),!0)}function Tu(e,t){let n=e.ants.find(e=>e.id===t.carrier);n&&(delete n.carryingBrood,n.bioTask?.item===t.id&&delete n.bioTask),e.colony.broodLosses=(e.colony.broodLosses||0)+1,aa(e,{x:n?.x??t.x,y:n?.y??t.y,z:n?.z??t.z,mass:.01,kind:`corpse`,stored:!1})}function Eu(e){let t=e.ants.find(e=>e.kind===`queen`&&(e.health??100)>0);if(e.colony.reproductiveFood??=0,e.remainingFoundations===0||!Qs(e))return Jr(e,e.colony.reproductiveFood,`refund`),e.colony.reproductiveFood=0,!1;if(e.food<.2||!t||e.queenHealth<40){let t=Math.min(e.colony.reproductiveFood,Math.max(0,1.2-e.food));Jr(e,t,`refund`),e.colony.reproductiveFood-=t}if(!t||Ea(e)<=0||t.age<25||e.queenHealth<60||Ji(e)||e.ants.filter(e=>e.kind===`worker`).length<12||e.remainingFoundations===0||e.tick-(e.lastSexualLaying??-3e3)<3e3||e.ants.some(e=>e.sexual)||e.brood.some(e=>e.kind===`gyne`||e.kind===`male`)||e.population+e.brood.length+(e.capacityOffset||0)+2>450)return!1;let n=10.2,r=Math.min(Math.max(0,n-e.colony.reproductiveFood),Math.max(0,e.food-1.2));if(Yr(e,r,`sexual`),e.colony.reproductiveFood+=r,e.colony.reproductiveFood<10.199999999)return!1;let i=H(e.nest,`nursery`,0,e.colonyId||1);for(let t of[`gyne`,`male`])e.brood.push(oo(e,e.nextId++,i,t));return e.colony.reproductiveFood=Math.max(0,e.colony.reproductiveFood-n),e.lastSexualLaying=e.tick,e.log(`A colônia investiu em uma princesa e um zangão para o próximo voo.`,`birth`),!0}function Du(e,t){let n=e.makeAnt(t.kind||`worker`,t.x,t.z,t.genome),r=e.nest.nodes[t.node],i=Z(e.nest,{x:t.x,y:t.y-.025,z:t.z});if(Object.assign(n,i.point,{normal:i.normal,node:t.node,tunnelY:r.y,tunnelCenter:{x:r.x,y:r.y,z:r.z}}),t.kind===`gyne`||t.kind===`male`)return n.sexual=!0,n.winged=!0,n.role=`nurse`,n.state=`Alado em maturação`,t.kind===`gyne`&&(n.foundressBudget=8),e.ants.push(n),e.born++,n;t.nanitic&&(n.nanitic=!0,n.bodyScale*=.72,n.headScale=1,n.caste=`minor`,e.founding&&e.founding.nanitics++);let a=e.ants.filter(e=>e.kind===`worker`&&p.hypot(e.x-n.x,(e.y||0)-(n.y||0),e.z-n.z)<1.2).length>=4&&n.traits.exploration<.5;return Q(e,n,H(e.nest,a?`royal`:`entrance`,n.id%2,e.colonyId||1)),e.ants.push(n),e.born++,n}function Ou(e,t){let n=e.founding,r=e.ants.find(e=>e.kind===`queen`&&(e.health??100)>0),i=Ji(e),a=wa(e),o=Ea(e),s=e.brood.filter(e=>io(e.age)===`larva`).length*.0012*ba(e).larvalDemand,c=i?Yi(e,`larvae`,s):Math.min(e.food,s);i||Yr(e,c,`brood`);let l=c>=s-1e-10;if(Eu(e),r){i||(r.state=`Cuidando da colônia`);let t=!!n&&[`claustral`,`semiclaustral`].includes(n.phase)&&!n.firstClutch,s=t&&n?.foraging?Math.floor((n.foraging.pantry+1e-10)/yi.eggCost):t&&n?.maternal?Math.floor((Wi(n.maternal,`eggs`)+1e-10)/yi.eggCost):1/0,c=t?n.foraging?n.foraging.phase===`nursing`&&s>=4:n.reserves>2&&s>0:!i&&e.food>2;if((!n||n.phase===`established`||t)&&e.tick>=25&&e.tick-e.lastLaying>=(a?Math.ceil(65/Math.max(.05,o)):65)&&o>0&&c&&e.queenHealth>20&&e.population+e.brood.length+(e.capacityOffset||0)<450){let r=Math.min(t?Math.min(4,s):4+Math.floor(e.random()*3),450-e.population-e.brood.length-(e.capacityOffset||0));for(let n=0;n<r;n++){let n=oo(e,e.nextId++);t&&n.kind!==`male`&&(n.nanitic=!0),e.brood.push(n)}t?(Yi(e,`eggs`,r*yi.eggCost),n.firstClutch=!0):Yr(e,r*yi.eggCost,`brood`),e.lastLaying=e.tick,e.log(`A rainha colocou `+r+` ovos`+(t?n?.foraging?` com alimento trazido pela rainha.`:` usando reservas maternas.`:`.`),`birth`)}}let u=[],d=0,f=0,p=0;for(let n of e.brood){if(a){if(!wu(e,n,s>0?c/s:1)){Tu(e,n),d++;continue}}else(l||io(n.age)!==`larva`)&&(n.age+=.006+t*.004);if(la(e,n),n.age>=1.3&&n.carrier===void 0&&e.population+(e.capacityOffset||0)<450){let t=Du(e,n);ua(e,n),t.sexual?p++:f++}else u.push(n)}e.brood=u,d&&e.log(d+` cria(s) perdidas por estresse local.`,`danger`),p&&e.log(p+` alado(s) nasceram para uma futura fundação.`,`birth`),f&&e.log(f+` operária(s) nasceram.`,`birth`),n&&[`claustral`,`semiclaustral`].includes(n.phase)&&n.nanitics>0&&!n.seal&&(!n.foraging||n.foraging.phase===`nursing`)&&(zi(e),n.phase=`established`,n.since=e.tick,e.log(`As primeiras naníticas assumem o forrageamento. A colônia passa a depender do alimento externo.`,`birth`))}let ku=(e,t)=>Ja(e,t).distance<-.002;function Au(e,t){let n=t.y,r=n,i=!1,a=U(e.relief,t.x,t.z);for(let o=0;o<40&&r<a;o++){if(r+=.04,ku(e,{...t,y:r})){i=!0;break}n=r}if(!i)return null;for(let i=0;i<7;i++){let i=(n+r)/2;ku(e,{...t,y:i})?r=i:n=i}return{...t,y:(n+r)/2}}function ju(e,t,n,r){for(let i=1;i<=40;i++){let a=i*.05,o={x:t.x+n*a,y:t.y,z:t.z+r*a};if(Math.abs(o.x)>=9.99||Math.abs(o.z)>=6.49||ku(e,o))return a}return 2}function Mu(e){e={...e,rubble:[],plugs:[]};let t=[];return e.links.forEach(([n,r],i)=>{let a=e.nodes[n],o=e.nodes[r],s=p.hypot(o.x-a.x,o.z-a.z),c=s>.05?-(o.z-a.z)/s:1,l=s>.05?(o.x-a.x)/s:0;for(let n of[.25,.5,.75]){let r={x:a.x+(o.x-a.x)*n,y:a.y+(o.y-a.y)*n,z:a.z+(o.z-a.z)*n};if(r.y>U(e.relief,r.x,r.z)-.25)continue;let s=Au(e,r);if(!s)continue;let u=.04;for(let t=1;t<=30;t++){let n={...s,y:s.y+t*.05};if(!ku(e,n))break;u=t*.05}let d=ju(e,r,c,l),f=ju(e,r,-c,-l),p=0;for(let[t,n]of[[1,d],[-1,f]])for(let i of[.12,.3,.5]){let a={x:r.x+c*t*(n+.1),y:s.y-i,z:r.z+l*t*(n+.1)};(ku(e,a)||Math.abs(a.x)>=9.99||Math.abs(a.z)>=6.49)&&p++}t.push({key:i+`:`+n,edge:i,center:r,roof:s,span:d+f,thickness:u,depth:Math.max(.02,U(e.relief,s.x,s.z)-s.y),abutment:p/6})}}),t}function Nu(e,t,n,r=1,i){let a=Math.max(0,Math.min(1,t)),o=(1+.7*a)*(i?.density??1),s=.0016,c=o*s*e.depth,l=.9*s*e.depth*Math.max(0,(a-.85)/.15),u=Math.max(0,c-l),d=p.tan(Math.max(15,Math.min(55,n))*Math.PI/180),f=(3e-4+.006*a*(1-a))*Math.max(.02,r)*(i?.cohesion??1),m=Math.min(e.thickness,e.span*.65+.08),h=Math.max(.1,e.span),g=2*(f+u*d)*m*e.abutment/h,_=6*f*p.pow(m,2)/p.pow(h,2),v=c*(1-.45*e.abutment),y=g+_;return{load:v,capacity:y,safety:Math.min(100,y/Math.max(1e-8,v))}}function Pu(e,t,n){let r={...e.nest,rubble:[],plugs:[]},i=0;for(let e=0;e<8;e++)for(let a=0;a<8;a++)for(let o=0;o<8;o++){let s=((e+.5)/8*2-1)*n,c=((a+.5)/8*2-1)*n,l=((o+.5)/8*2-1)*n;s*s+c*c+l*l>n*n||Ja(r,{x:t.x+s,y:t.y+c,z:t.z+l}).distance<0&&i++}return i/p.pow(8,3)*p.pow(2*n,3)}function Fu(e,t){if((e.nest.rubble||[]).some(e=>e.edge===t.edge&&e.mass>.002))return null;let n=Math.min(.18,t.span*.18,Math.max(.06,t.thickness*.65)),r={...t.roof,y:t.roof.y+n*.25,r:n};if((e.nest.erosionCuts||[]).some(e=>$(e,r)<(e.r+r.r)*.75))return null;let i=Pu(e,r,n);if(i<2e-5)return null;let a=rc(i),o={...t.roof,y:t.roof.y-a-.015};if(Ja(e.nest,o).distance<a-.005||(e.neighborAgents||e.ants).some(e=>$({x:e.x,y:e.y??0,z:e.z},o)<a+.18))return null;let s={...o,id:e.soil.nextId++,edge:t.edge,mass:i};return(e.nest.erosionCuts??=[]).push(r),(e.nest.rubble??=[]).push(s),e.soil.eroded+=i,e.nest.revision++,s}function Iu(e){let t=e.soil.structure??={version:1,revision:-1,steps:0,patches:[],failures:0,lastFailure:[],released:0},n=go(e),r=new Map(t.patches.map(e=>[e.key,e]));t.patches=(t.revision===e.nest.revision?t.patches:Mu(e.nest)).map(t=>{let i=r.get(t.key),a=V(e.microclimate,t.roof)?.water??.55,o=Nu(t,a,e.params.reposeAngle??36,e.soil.integrity[t.edge]??1,n?vo(n,a):void 0),s=i&&p.hypot(i.roof.x-t.roof.x,i.roof.y-t.roof.y,i.roof.z-t.roof.z)<.12,c=Math.min(1,(s?i.damage:0)+Math.max(0,1-o.safety)*.08);return{...t,...o,water:a,damage:c}}),t.steps++,t.revision=e.nest.revision;for(let n of t.patches){if(n.damage<1||e.tick-(t.lastFailure[n.edge]??-1e3)<500)continue;let r=Fu(e,n);if(r){t.failures++,t.released+=r.mass,t.lastFailure[n.edge]=e.tick,n.damage=0,e.log(`Uma placa do teto perdeu suporte e se desprendeu. As operárias podem retirar a terra.`,`danger`);break}}}function Lu(e,t,n=!1){let r=e.nest.links[t];if(!r||(e.nest.rubble||[]).some(e=>e.edge===t&&e.mass>.005))return null;let i=e.nest.nodes[r[0]],a=e.nest.nodes[r[1]],o={x:(i.x+a.x)/2,y:(i.y+a.y)/2,z:(i.z+a.z)/2};if(o.y>-.45||(e.neighborAgents||e.ants).some(e=>$({x:e.x,y:e.y||0,z:e.z},o)<1))return null;let s=e.nest.linkWidths?.[t]||.38,c=4/3*Math.PI*p.pow(Math.min(s*.8,n?.3:.2),3),l=rc(c),u={...o,y:o.y+s-l*1.05,id:e.soil.nextId++,edge:t,mass:c};return e.nest.rubble??=[],e.nest.erosionCuts??=[],e.nest.rubble.push(u),e.nest.erosionCuts.push({...o,y:o.y+s-l*.35,r:l}),e.soil.eroded+=c,e.soil.integrity[t]=.75,e.nest.revision++,e.log(`Solo cedeu em uma galeria. As operárias podem remover o material solto.`,`danger`),u}function Ru(e){if(!(e.tick%50)){for(let t=0;t<e.nest.links.length;t++){let n=e.nest.linkWidths?.[t]||.38,[r,i]=e.nest.links[t],a=e.nest.nodes[r],o=e.nest.nodes[i],s=V(e.microclimate,{x:(a.x+o.x)/2,y:(a.y+o.y)/2,z:(a.z+o.z)/2})?.water??.55,c=Math.max(0,s-.77),l=Math.max(0,.18-s),u=c*(.008+n*.035)+l*.006;e.soil.integrity[t]=Math.max(0,(e.soil.integrity[t]??1)-u)}Iu(e)}}let zu=/* @__PURE__ */ new WeakMap,Bu=[`entrance`,`storage`,`nursery`,`waste`,`royal`,`front`];function Vu(e){let t=zu.get(e);if(t?.revision===e.revision)return t;let n=e.nodes.map(e=>Math.max(.03,4/3*Math.PI*p.pow(e.r,3))),r=e.links.map(([t,n],r)=>({a:t,b:n,g:.03*Math.PI*p.pow(e.linkWidths?.[r]||.38,2)/Math.max(.3,p.hypot(e.nodes[t].x-e.nodes[n].x,e.nodes[t].y-e.nodes[n].y,e.nodes[t].z-e.nodes[n].z))})),i={};e.nodes.forEach((e,t)=>{if(Bu.includes(e.type)){let n=(e.colonyId||1)+`:`+e.type;(i[n]??=[]).push(t)}});let a={revision:e.revision,volumes:n,edges:r,sources:i};return zu.set(e,a),a}function Hu(e){let t=Vu(e),n={};for(let[r,i]of Object.entries(t.sources)){let a=new Set(i),o=e.nodes.map((e,t)=>+!!a.has(t));for(let e=0;e<200;e++)for(let e=0;e<o.length;e++)if(!a.has(e)){let n=0,r=0;for(let i of t.edges){let t=i.a===e?i.b:i.b===e?i.a:-1;t>=0&&(n+=i.g*o[t],r+=i.g)}o[e]=n/(r+.002*t.volumes[e]||1)}n[r]=o.map((e,n)=>e*t.volumes[n])}return{fields:n,initial:Object.values(n).flat().reduce((e,t)=>e+t,0),emitted:0,evaporated:0}}function Uu(e,t,n=1){let r=Vu(e),i=e.nodes.map(()=>0);for(let e of r.edges)i[e.a]+=e.g/r.volumes[e.a],i[e.b]+=e.g/r.volumes[e.b];let a=Math.max(1,Math.ceil(Math.max(...i,0)*n/.8)),o=n/a,s=p.exp(-.002*o);for(let n of Object.keys(r.sources))t.fields[n]??=e.nodes.map(()=>0);for(let[n,i]of Object.entries(t.fields)){for(;i.length<e.nodes.length;)i.push(0);for(let e=0;e<a;e++){let e=i.slice();for(let t of r.edges){let n=t.g*o*(i[t.a]/r.volumes[t.a]-i[t.b]/r.volumes[t.b]);e[t.a]-=n,e[t.b]+=n}for(let n=0;n<i.length;n++){let r=Math.max(0,e[n]);i[n]=r*s,t.evaporated+=r-i[n]}}for(let e of r.sources[n]||[]){let n=Math.max(0,r.volumes[e]-i[e]);i[e]+=n,t.emitted+=n}}}function Wu(e,t,n,r,i,a=.6){let o=t.fields[i];if(!o)return 0;let s=Vu(e),c=e.nodes[n],l=e.nodes[r],u=p.hypot(c.x-l.x,c.y-l.y,c.z-l.z);return((o[r]||0)/s.volumes[r]-(o[n]||0)/s.volumes[n])*Math.min(1,a/Math.max(.1,u))}function Gu(e){let t=fl(e),n=F(e);for(let t of n)t!==e&&Ps(e,t);Fs(e),ks(e),xc(e);for(let t of n)t!==e&&(t.ecology=e.ecology);Ec(e),kc(e),Uu(e.nest,e.nestOdors),Ru(e),hc(e),cc(e);for(let t of n)t.gases=e.gases;let r=Vs(e),i=/* @__PURE__ */ new Set;for(let a of n){a.nextId=e.nextId,a.remainingFoundations=4-F(e).length,a.capacityOffset=Vr(e).length+Hr(e).length-a.ants.length-a.brood.length,Zs(a),ya(a),Ou(a,t),ys(a),Fs(e);for(let e of fu(a,t,r))i.add(e);e.nextId=a.nextId}let a=Object.create(e);a.ants=Vr(e);let o=new Set(i);Cu(a,i),e.predators=a.predators;for(let e of n)for(let t of e.ants)i.has(t.id)&&!o.has(t.id)&&t.deathCause===`predation`&&e.deaths++;for(let t of n){for(let e of t.ants)i.has(e.id)&&(Ks(t,e),jo(t,e),nc(t,e),oa(t,e));t.ants=t.ants.filter(e=>!i.has(e.id)),t.predators=e.predators,ys(t)}Fs(e);for(let t of n)eu(t),sa(t),!Ji(t)&&t.food<1&&t.tick-t.lastWarning>200&&(t.lastWarning=t.tick,e.log(`Colônia `+(t.colonyId||1)+`: reserva baixa. As operárias precisam coletar alimento.`,`danger`));al(e),po(e),e.tick-e.lastRecord>=25&&e.record()}function Ku(e,t){e.speed*=.94+Aa(t,`locomotion`)*.12,e.bodyScale*=.96+Aa(t,`size`)*.08,e.headScale*=.94+Aa(t,`mandibles`)*.12;for(let n of[`activity`,`courage`,`exploration`])e.traits[n]=e.traits[n]*.8+Aa(t,n)*.2;for(let[n,r]of[[`nurse`,`care`],[`cleaner`,`cleaning`],[`excavator`,`digging`]])e.thresholds[n]*=1.1-Aa(t,r)*.2;e.pheromoneGain=.8+Aa(t,`antennae`)*.4,e.metabolicCost=1.1-Aa(t,`efficiency`)*.2,e.digPower=.9+Aa(t,`mandibles`)*.2}function qu(e,t,n,r,i){let a=e.nextId++,o={id:a,kind:t,colonyId:e.colonyId||1,x:n,y:U(e.nest?.relief,n,r)+.008,z:r,distanceWalked:0,angle:e.range(0,Math.PI*2),energy:100,age:0,carrying:0,speed:e.range(.07,.105),state:t===`queen`?`Fundando o ninho`:`Explorando`,rest:0,route:[],node:null,...$c(e.seed,a,t)};return e.genetics&&(o.genome=Fa(e,a,t,i),Ku(o,o.genome)),Hc(e,o),o}function Ju(e,t){let n=Io(t);zo(n),e.decisionExtension=n,e.extensionDecisions=0}function Yu(e){if((e.decisionExtension!==void 0||e.extensionDecisions!==void 0)&&(zo(e.decisionExtension),!Number.isSafeInteger(e.extensionDecisions)||e.extensionDecisions<0))throw Error(`Contagem de decisões de extensão inválida.`)}let Xu={humidity:[0,100,58],light:[0,100,72],randomness:[0,100,28],reposeAngle:[15,55,36],temperatureC:[5,45,24],windX:[-4,4,0],windZ:[-4,4,0]},Zu={photoperiodHours:[0,24,12],initialFood:[0,36,18],initialRainPulse:[0,1,0],surfaceDiffusionScale:[.5,1.5,1],surfaceEvaporationScale:[.5,1.5,1]},Qu={...Xu,...Zu};function $u(e){for(let[t,[n,r]]of Object.entries(Zu)){let i=e[t];if(i!==void 0&&(typeof i!=`number`||!Number.isFinite(i)||i<n||i>r))throw Error(`Entrada ${t} fora de ${n}–${r}.`)}}function ed(e={}){if(!e||typeof e!=`object`||Array.isArray(e))throw Error(`Configuração deve ser um objeto JSON.`);let t=e;for(let e of Object.keys(t))if(!Object.hasOwn(Qu,e))throw Error(`Campo desconhecido: `+e);let n={};for(let e of Object.keys(Qu)){if(!Object.hasOwn(Xu,e)&&t[e]===void 0)continue;let[r,i,a]=Qu[e],o=t[e]===void 0?a:t[e];if(typeof o!=`number`||!Number.isFinite(o)||o<r||o>i)throw Error(`${e}: use um número entre ${r} e ${i}.`);n[e]=Object.is(o,-0)?0:o}return n}function td(e){$u(e.params),e.params.initialFood!==void 0&&(e.food=e.params.initialFood),e.params.initialRainPulse!==void 0&&(e.landscape.rainPulse=e.params.initialRainPulse)}function nd(e,t,n){if(!t)return;let r=e.params??n;if(!r||![r.soilClayPercent,r.soilCompactionPercent].every(e=>typeof e==`number`&&Number.isFinite(e)&&e>=0&&e<=100))throw Error(`Parâmetros do material do solo inválidos.`)}function rd(e){go(e)&&(e.params.soilClayPercent??=I.clayReference,e.params.soilCompactionPercent??=I.packingReference,nd(e,!0))}function id(e){e.founding=nl(e.nest,e.params.humidity),Kc(e),Gc(e);let t=e.founding.site;e.food=0,e.nest={nodes:[],links:[],linkWidths:[],revision:2,relief:e.nest.relief};for(let n of e.ants)n.x=t.x+(n.kind===`queen`?.65:-.65),n.z=t.z,n.y=U(e.nest.relief,n.x,n.z)+.008,n.node=null,n.route=[],n.tunnelY=0,delete n.tunnelCenter,n.normal={x:0,y:1,z:0},n.winged=!0,n.crop=0,n.state=`Aguardando condições de voo`;e.log(`Dois alados e solo intacto. A fundação começa após condições úmidas e quentes.`,`birth`)}function ad(e){let{random:t,range:n}=Da(e+`:landscape`),r={version:1,biome:[`woodland`,`scrub`,`meadow`][Math.floor(t()*3)],relief:[],ponds:[],logs:[],rocks:[],wetness:.55,litter:.1,rainPulse:0};for(let e=0;e<4;e++)r.relief.push({x:n(-8,8),z:n(-5,5),radius:n(1.5,3.2),height:n(.025,.075)});let i=1+Math.floor(t()*3);for(let e=0;e<i;e++)for(let t=0;t<60;t++){let t={id:e,x:n(-7.3,7.3),z:n(-4.2,4.2),rx:n(.65,1.55),rz:n(.4,.95),angle:n(0,Math.PI),volume:n(.45,.85)};if(!r.ponds.some(e=>p.hypot(t.x-e.x,t.z-e.z)<t.rx+e.rx+.4)){r.ponds.push(t);break}}for(let e=0;e<2+Math.floor(t()*4);e++)for(let t=0;t<60;t++){let t={id:e,x:n(-7.4,7.4),z:n(-4.3,4.3),length:n(1,2.7),radius:n(.16,.36),angle:n(0,Math.PI*2),kind:[`fallen`,`forked`,`stump`][e%3],moisture:.5,integrity:1,decay:0};if(!(Ba(r,t.x,t.z,!0)<2.5||Va(r,t.x,t.z)<3)){r.logs.push(t);break}}for(let e=0;e<45+Math.floor(t()*35);e++){let t={id:e,x:n(-9.1,9.1),z:n(-5.6,5.6),radius:n(.04,.16),aspect:n(.6,1.5),angle:n(0,6.28),wetness:.5,moss:0};Ba(r,t.x,t.z,!0)>1.1&&r.rocks.push(t)}return r}function od(e,t,n,r){let{range:i,random:a}=Da(e+`:flora`),o={woodland:[`fern`,`tree`,`shrub`,`moss`,`flower`,`grass`,`succulent`,`cactus`],scrub:[`cactus`,`succulent`,`grass`,`shrub`,`flower`,`tree`,`fern`,`moss`],meadow:[`grass`,`flower`,`shrub`,`tree`,`succulent`,`fern`,`cactus`,`moss`]}[t.biome],s=[],c=Math.floor(i(42,66));for(let e=0;e<c;e++)for(let c=0;c<80;c++){let c=i(-8.9,8.9),l=i(-5.4,5.4);if(Ba(t,c,l,!0)<1.3||Va(t,c,l)<1.4||n.nodes.some(e=>e.type===`entrance`&&p.hypot(e.x-c,e.z-l)<1))continue;let u=e<8?e:Math.floor(p.pow(a(),1.5)*8),d=o[u];s.push({id:r(),x:c,z:l,kind:u%4,species:d,biomass:i(.35,.95),health:i(.75,1),hydration:gc[d].humidity,stress:0,vigor:i(.8,1.2)});break}return s}function sd(){return{version:0,biome:`woodland`,relief:[],wetness:.55,litter:.1,rainPulse:0,ponds:[{id:0,x:4.3,z:-2.5,rx:1.9,rz:1.35,angle:0,volume:1}],logs:[{id:0,x:4.3,z:3.6,length:3.4,radius:.41,angle:.5,kind:`fallen`,moisture:.5,integrity:1,decay:0}],rocks:[]}}function cd(e,t,n,r={}){if(r.biologicalProfile!==void 0){let t=B(r.biologicalProfile);e.biologicalProfile=Li(t.id,t.version)}r.decisionExtension!==void 0&&Ju(e,r.decisionExtension),e.seed=String(t),e.rng=Ur(t),e.params={humidity:58,light:72,randomness:28,reposeAngle:36,temperatureC:24,...n},rd(e),Object.assign(e,{colonyId:1,colonies:[],nextColonyId:2,capacityOffset:0,tick:0,nextId:1,food:18,queenHealth:100,ants:[],brood:[],predators:[],plants:[],patches:[],events:[],history:[],deaths:0,born:0,lastLaying:-50,lastRecord:-25,lastWarning:-1e3,lastDiscovery:-1e3}),e.landscape=ad(e.seed),e.landscape.wetness=e.params.humidity/100,e.nest=rl(e.seed,e.landscape),e.nestOdors=Hu(e.nest),e.soil=$s(),e.colony=el(),e.socialChemistry=Es(),e.genetics=Na(e.seed),e.physicsVersion=5,e.localRoutingVersion=1,e.pheromones=Array(1040).fill(0);let i=e.nest.nodes[2],a=e.nest.nodes[0],o=Z(e.nest,{x:i.x+(Math.abs(i.x)>9?-Math.sign(i.x)*.34:-.33),y:i.y-i.r*.85,z:i.z+(Math.abs(i.z)>6?-Math.sign(i.z)*.34:-.33)});e.ants.push(Object.assign(e.makeAnt(`queen`,i.x,i.z),o.point,{normal:o.normal,node:2,tunnelY:i.y})),e.ants.push(e.makeAnt(`male`,a.x+.7,a.z)),r.founding!==!1&&(id(e),e.nestOdors=Hu(e.nest)),e.plants=od(e.seed,e.landscape,e.nest,()=>e.nextId++);for(let t=0;t<14;t++){let n=e.plants[(t*3+1)%e.plants.length];e.patches.push({id:e.nextId++,x:n.x,z:n.z,amount:e.range(1,3.5),capacity:4,discovered:!1,sourcePlant:n.id})}for(let t=0;t<2;t++)for(let t=0;t<80;t++){let t=e.range(-8,8),n=e.range(-5,5);if(!(e.inPond(t,n)||Va(e.landscape,t,n)<1||e.nest.nodes.some(e=>e.type===`entrance`&&p.hypot(e.x-t,e.z-n)<2))){e.addPredator(t,n,!1);break}}e.founding||e.log(`Uma rainha e um macho. O começo de uma colônia.`,`birth`),va(e),td(e),Wc(e),Ys(e),Uc(e),e.record()}let ld=[`population`,`brood`,`eggs`,`larvae`,`pupae`,`colonies`],ud=[`airTemperatureC`,`soilTemperatureC`,`oxygenPercent`,`carbonDioxidePercent`];function dd(e,t){if(e===void 0)return;let n=e,r=()=>{throw Error(`Série diária inválida no experimento.`)};(!n||n.version!==1||!Number.isSafeInteger(n.startedTick)||n.startedTick<0||n.startedTick>t||!Number.isSafeInteger(n.discarded)||n.discarded<0||!Array.isArray(n.points)||n.points.length>12e3)&&r();let i=-1;for(let e of n.points)(!e||!Number.isSafeInteger(e.tick)||e.tick%100!=0||e.tick<n.startedTick||e.tick<=i||e.tick>t||typeof e.modelVersion!=`string`||!/^\d+\.\d+\.\d+$/.test(e.modelVersion)||ld.some(t=>!Number.isSafeInteger(e[t])||Number(e[t])<0)||!Number.isFinite(e.food)||e.food<0||ud.some(t=>e[t]!==null&&(typeof e[t]!=`number`||!Number.isFinite(e[t])))||e.eggs+e.larvae+e.pupae!==e.brood||e.colonies<1||e.colonies>4)&&r(),i=e.tick}function fd(e,t){if(!t)return;let n=e,r=n.colony?.survival,i=e=>typeof e==`number`&&Number.isFinite(e)&&e>=0,a=e=>i(e)&&Number.isSafeInteger(e),o=()=>{throw Error(`Estado de saúde ou mortalidade inválido.`)};if(!r||r.version!==1||!a(r.initialDeaths)||!a(r.challenges)||!r.causes||Object.keys(r.causes).length!==Zr.length||!Zr.every(e=>a(r.causes[e]))||n.deaths!==r.initialDeaths+Object.values(r.causes).reduce((e,t)=>e+t,0)||!Array.isArray(n.ants))return o();for(let e of n.ants){let t=e.life;if(!t||t.version!==1||![t.lastAge,t.ageHazard,t.ageBudget,t.infection,t.diseaseHazard,t.diseaseBudget,t.repairFood,e.health].every(i)||t.ageBudget===0||t.diseaseBudget===0||t.infection>1||e.health>100||!a(t.lastTick)||t.lastTick>n.tick||t.lastAge>e.age||t.deathRecorded!==void 0)return o()}}function pd(e,t){if(!t)return;let n=e,r=n.colony?.fertility,i=e=>typeof e==`number`&&Number.isFinite(e)&&e>=0,a=e=>i(e)&&Number.isSafeInteger(e),o=()=>{throw Error(`Balanço ou parentesco da espermateca inválido.`)};if(!r||r.version!==1||!a(r.lastTick)||r.lastTick>n.tick||!Array.isArray(r.pools)||r.pools.length>Wr.maxMates||![r.femaleAttempts,r.fertilized,r.failed,r.intentionalMales].every(a)||r.femaleAttempts!==r.fertilized+r.failed)return o();let s=/* @__PURE__ */ new Set,c=0;for(let e of r.pools){if(!e||!a(e.maleId)||s.has(e.maleId)||!a(e.tick)||e.tick>n.tick||![`contact`,`scenario`].includes(e.origin)||e.received!==Wr.creditsPerMating||![e.viable,e.used,e.lost].every(i)||!a(e.used)||Math.abs(e.received-e.viable-e.used-e.lost)>1e-7||e.genome?.ploidy!==1||e.genome.haplotypes?.length!==1||e.genome.haplotypes[0]?.length!==Oa.length||!e.genome.haplotypes[0].every(e=>Number.isFinite(e)&&e>=0&&e<=1))return o();s.add(e.maleId),c+=e.used}if(c!==r.fertilized*Wr.usePerFemale)return o();for(let e of n.brood??[]){if(!Number.isSafeInteger(e.node)||e.node<0||![e.x,e.y,e.z].every(Number.isFinite))return o();let t=e.fertilization;if(!t||t.version!==1||![`worker`,`gyne`,`male`].includes(t.requested)||!a(t.tick)||t.tick>n.tick)return o();let r=e.kind!==`male`;if(!e.genome||e.genome.ploidy!==(r?2:1)||(r?!s.has(t.sireId)||t.sireId!==e.genome.fatherId||t.requested===`male`||t.requested!==e.kind:t.sireId!==void 0||e.genome.fatherId!==void 0))return o()}}function md(e){if(Array.isArray(e))for(let t of e){let e=t?.predatorMemory;if(e===void 0)continue;let n=e=>typeof e==`number`&&Number.isSafeInteger(e)&&e>=0,r=e=>typeof e==`number`&&Number.isFinite(e);if(!e||e.version!==1||!e.anchor||![e.anchor.x,e.anchor.z].every(r)||!n(e.anchor.tick)||e.visit&&(!n(e.visit.plant)||!n(e.visit.since))||e.avoid&&(!n(e.avoid.plant)||!n(e.avoid.until))||e.escape&&(!r(e.escape.angle)||!n(e.escape.until)))throw Error(`Memória de navegação do predador inválida.`)}}let hd=e=>typeof e==`number`&&Number.isFinite(e)&&e>=0,gd=/* @__PURE__ */ new Set([`foraged`,`refund`,`foundress`,`brood`,`silk`,`care`,`sexual`,`spoilage`,`stolen`]);function _d(e,t,n){let r=e,i=r.colony?.stores,a=r.nest??n;for(let e of r.ants??[])if(e.stockGoal!==void 0&&(!t||!Number.isSafeInteger(e.stockGoal)||e.stockGoal<0||a&&!a.nodes[e.stockGoal]))throw Error(`Destino alimentar inválido.`);if(!i){if(t)throw Error(`Estoque espacial ausente.`);return}if(!t||i.version!==1||![r.food,i.initial,i.incoming,i.outgoing].every(hd)||!Array.isArray(i.bins)||i.bins.length>1024||!i.flows)throw Error(`Estoque espacial inválido.`);let o=/* @__PURE__ */ new Set;for(let e of i.bins){if(!Number.isSafeInteger(e.node)||e.node<0||o.has(e.node)||!hd(e.amount)||!e.point||![e.point.x,e.point.y,e.point.z].every(Number.isFinite))throw Error(`Câmara alimentar inválida.`);if(o.add(e.node),a&&a.nodes[e.node]&&((a.nodes[e.node].colonyId??1)!==(r.colonyId??1)||p.hypot(e.point.x-a.nodes[e.node].x,e.point.y-a.nodes[e.node].y,e.point.z-a.nodes[e.node].z)>a.nodes[e.node].r+.5))throw Error(`Localização alimentar inválida.`);if(a&&!a.nodes[e.node])throw Error(`Câmara alimentar inexistente.`)}for(let[e,t]of Object.entries(i.flows))if(!gd.has(e)||!Number.isFinite(t))throw Error(`Fluxo alimentar inválido.`);let s=Xr(r),c=Object.values(i.flows).reduce((e,t)=>e+(t??0),0);if(Math.abs(s.ledger)>1e-7||Math.abs(s.rooms)>1e-7||Math.abs(c-i.incoming+i.outgoing)>1e-7)throw Error(`Balanço alimentar inconsistente.`)}let vd=e=>typeof e==`number`&&Number.isFinite(e),yd=e=>!!e&&[`x`,`y`,`z`].every(t=>vd(e[t])),bd=e=>!!e&&vd(e.water)&&e.water>=0&&e.water<=1&&vd(e.temperature);function xd(e,t){let n=e,r=n.founding,i=r?.survey;if(i){if(!t||i.version!==1||![`explore`,`return`,`done`].includes(i.mode)||![i.steps,i.samples,i.since].every(e=>Number.isSafeInteger(e)&&e>=0)||i.since>n.tick||!vd(i.heading)||!yd(i.origin)||!yd(i.best?.point)||!bd(i.best)||!vd(i.best.quality)||i.best.quality<-1||i.best.quality>1||!bd(i.last))throw Error(`Sondagem local inválida.`)}else if(t&&r&&![`weather`,`flight`,`landing`,`dealate`,`failed`].includes(r.phase))throw Error(`Sondagem local ausente.`);for(let e of n.ants??[]){let r=e.roomMemory;if(r&&(!t||r.version!==1||!Array.isArray(r.rooms)||r.rooms.length>8||new Set(r.rooms.map(e=>e.node)).size!==r.rooms.length||r.rooms.some(e=>!Number.isSafeInteger(e.node)||e.node<0||!Number.isSafeInteger(e.tick)||e.tick<0||e.tick>n.tick||!bd(e.reading))))throw Error(`Memória de câmaras inválida.`)}}function Sd(e,t){if(e===void 0)return;let n=e,r=n.foraging;if(!r){if(t)throw Error(`Coleta semiclaustral ausente.`);return}if(!t||r.version!==1||![`nursing`,`outbound`,`searching`,`returning`].includes(r.phase))throw Error(`Coleta incompatível com o perfil.`);for(let e of[`searchTicks`,`nextDeparture`,`pantry`,`load`,`collected`,`delivered`,`consumed`,`exported`,`lost`,`trips`])if(!Number.isFinite(r[e])||r[e]<0)throw Error(`Orçamento de coleta inválido.`);if(!Number.isFinite(r.heading)||![r.searchTicks,r.nextDeparture,r.trips].every(Number.isSafeInteger)||r.load>ci.capacity+1e-7||r.phase===`nursing`&&r.load>1e-7)throw Error(`Estado de coleta inválido.`);if(n.phase===`established`&&(r.phase!==`nursing`||r.pantry>1e-7||r.load>1e-7))throw Error(`Transferência da fundação incompleta.`);let i=Vi(r);if(Math.abs(i.collection)>1e-7||Math.abs(i.pantry)>1e-7)throw Error(`Balanço de coleta inconsistente.`);if(n.seal||[`claustral`,`sealing`].includes(n.phase))throw Error(`Fundação semiclaustral incompatível com selamento.`)}function Cd(e,t){let n=e,r=n.colony?.season;if(!r){if(t)throw Error(`Memória sazonal ausente.`)}else if(!t||r.version!==1||![`active`,`preparing`,`dormant`,`resuming`].includes(r.phase)||![r.since,r.activeTicks,r.coldCue,r.chillTicks,r.warmTicks,r.cycles].every(e=>Number.isSafeInteger(e)&&e>=0)||r.since>n.tick||!Number.isFinite(r.lastTemperature)||!Number.isFinite(r.lastPhotoperiod)||r.lastPhotoperiod<0||r.lastPhotoperiod>24)throw Error(`Memória sazonal inconsistente.`)}function wd(e,t){if(Array.isArray(e))for(let n of e){if(!n||typeof n!=`object`)throw Error(`Registro de maturação inconsistente.`);let e=n.development;if(!e){if(t)throw Error(`Registro de maturação ausente.`)}else if(!t||e.version!==1||![e.growthFactor,e.stress,e.lastTemperature,e.lastSoilWater,e.lastRate].every(Number.isFinite)||e.growthFactor<.8||e.growthFactor>1.2||e.stress<0||e.stress>1||e.lastSoilWater<0||e.lastSoilWater>1.01||e.lastRate<0||e.lastRate>1.2||!Number.isFinite(n.age)||n.age<0||n.age>1.3+1e-9)throw Error(`Registro de maturação inconsistente.`)}else if(t)throw Error(`Registro de maturação ausente.`)}function Td(e){let t=e,n=t.soil;if(!t.nest?.plugs?.length&&n?.reclaimed===void 0)return;let r=()=>{throw Error(`Balanço de terra do tampão inconsistente.`)};n&&[n.removed,n.eroded,n.deposited,n.reclaimed??0].every(e=>Number.isFinite(e)&&e>=0)&&Array.isArray(n.deposits)||r(),[...t.nest?.rubble||[],...n.deposits||[]].some(e=>!e||!Number.isFinite(e.mass)||e.mass<0)&&r();let i=new Map([t,...t.colonies||[]].flatMap(e=>e.ants).map(e=>[e.id,e]));[...i.values()].some(e=>!Number.isFinite(e.carryingSoil??0)||(e.carryingSoil??0)<0)&&r();let a=[...i.values()].reduce((e,t)=>e+(t.carryingSoil||0),0),o=(t.nest?.rubble||[]).reduce((e,t)=>e+t.mass,0),s=(t.nest?.plugs||[]).reduce((e,t)=>e+t.mass,0),c=n.deposited-(n.reclaimed||0);(Math.abs(n.removed+n.eroded-a-o-s-c)>1e-7||Math.abs(n.deposits.reduce((e,t)=>e+t.mass,0)-c)>1e-7)&&r()}let Ed=()=>{throw Error(`Estado do tampão ou da terra recuperada inconsistente.`)},Dd=e=>typeof e==`number`&&Number.isFinite(e),Od=e=>!!e&&typeof e==`object`&&[`x`,`y`,`z`].every(t=>Dd(e[t]));function kd(e,t){let n=e,r=t;if(r?.reclaimed!==void 0&&(!Dd(r.reclaimed)||r.reclaimed<0||!Dd(r.deposited)||r.reclaimed>r.deposited+1e-7)&&Ed(),n?.plugs===void 0)return;(!Array.isArray(n.plugs)||n.plugs.length>16)&&Ed();let i=/* @__PURE__ */ new Set;for(let e of n.plugs){(!e||e.version!==1||!Od(e)||!Od(e.axis)||!Number.isSafeInteger(e.id)||i.has(e.id)||!Number.isSafeInteger(e.owner)||e.owner<1||!Number.isInteger(e.edge)||!n.links[e.edge])&&Ed(),i.add(e.id),(Math.abs(p.hypot(e.axis.x,e.axis.y,e.axis.z)-1)>1e-7||!Dd(e.radius)||e.radius<=0||e.radius>1.5||!Dd(e.depth)||e.depth<=0||e.depth>1||!Dd(e.capacity)||e.capacity<=0||!Dd(e.mass)||e.mass<0||e.mass>e.capacity+1e-9||!Dd(e.innerRadius))&&Ed(),(!Array.isArray(e.shells)||e.shells.length!==32||e.shells.some(e=>!Dd(e)||e<0)||Math.abs(e.shells.reduce((e,t)=>e+t,0)-e.capacity)>1e-8||e.capacity>Math.PI*e.radius*e.radius*e.depth+1e-8)&&Ed();let t={...e};Tl(t),Math.abs(t.innerRadius-e.innerRadius)>1e-7&&Ed()}}function Ad(e,t,n){if(!e)return;if(!e.seal){t&&[`sealing`,`claustral`,`established`].includes(e.phase)&&Ed();return}let r=e.seal,i=n,a=i?.plugs?.find(e=>e.id===r.plugId),o=a&&i.links[a.edge];(!t||r.version!==1||!a||!o||!o.includes(e.entry)||!o.includes(e.front)||!Od(r.queenPoint)||!Od(r.workerPoint)||![`collect`,`return`,`build`,`closed`,`remove`,`haul`,`opened`].includes(r.phase)||!Number.isSafeInteger(r.trips)||r.trips<0)&&Ed(),r.workerId!==void 0&&!Number.isSafeInteger(r.workerId)&&Ed();for(let e of[r.closedTick,r.openedTick])e!==void 0&&(!Number.isSafeInteger(e)||e<0)&&Ed();r.phase===`closed`&&Math.abs(a.mass-a.capacity)>1e-7&&Ed(),r.phase===`opened`&&a.mass>1e-7&&Ed()}function jd(e){let t=e=>typeof e==`number`&&Number.isFinite(e)&&e>=0;if(!e||e.version!==1||!e.initial||!e.stores||!e.consumed||!e.unmet||!t(e.converted))throw Error(`Reservas maternas inválidas.`);for(let n of[`lipid`,`protein`,`muscle`])if(!t(e.initial[n])||!t(e.stores[n]))throw Error(`Nutrientes maternos inválidos.`);if(!t(e.consumed.lipid)||!t(e.consumed.protein)||Object.values(e.unmet).length!==4||![`maintenance`,`eggs`,`larvae`,`excavation`].every(n=>t(e.unmet[n])))throw Error(`Custos maternos inválidos.`);if([qi(e).error,e.initial.lipid-e.consumed.lipid-e.stores.lipid,e.initial.protein+e.converted-e.consumed.protein-e.stores.protein,e.initial.muscle-e.converted-e.stores.muscle].some(e=>Math.abs(e)>1e-7))throw Error(`Balanço materno inconsistente.`)}function Md(e,t){if(e===void 0)return;let n=e;if(!n.maternal){if(t)throw Error(`Reservas da revisão biológica ausentes.`);return}if(!t)throw Error(`Reservas incompatíveis com a revisão biológica escalar.`);jd(n.maternal);let r=Object.values(n.spent).reduce((e,t)=>e+t,0),i=qi(n.maternal);if(Math.abs(Hi(n.maternal.stores)-n.reserves)>1e-7||Math.abs(i.initial-n.initialReserves)>1e-7||Math.abs(i.consumed+(n.foraging?.consumed??0)-r)>1e-7)throw Error(`Resumo das reservas maternas inconsistente.`)}function Nd(e,t,n=!0){let r=Object.create(t);Object.assign(r,JSON.parse(JSON.stringify(e))),Yu(r),md(r.predators),dd(r.dailyObservations,r.tick);let i=B(r.biologicalProfile);if(_d(r,i.stockModel===`rooms-demo`),fd(r,i.survivalModel===`risk-demo`),pd(r,i.fertilityModel===`finite-demo`),xd(r,i.chamberModel===`local-demo`),Sd(r.founding,i.foundation===`semiclaustral`),Md(r.founding,i.maternalModel===`pools`),kd(r.nest,r.soil),Ad(r.founding,i.entranceModel===`plug`,r.nest),wd(r.brood,i.developmentModel===`thermal-demo`),Cd(r,i.dormancyModel===`obligate-demo`),da(r.brood,i.cocoon===`present`),r.landscape??=sd(),!r.nest||r.nest.revision<2){r.nest=rl(r.seed,r.landscape);let e=r.ants.find(e=>e.kind===`queen`);e&&Object.assign(e,r.nest.nodes[2],{node:2})}r.nestOdors??=Hu(r.nest),r.soil??=$s(r.ants),r.colony??=el();for(let e of r.ants)tl(r.seed,e);so(r),Ia(r);for(let e of r.ants)e.y===void 0&&(e.y=0,e.kind===`queen`&&Object.assign(e,r.nest.nodes[2],{node:2}));if(r.physicsVersion!==5){let e=r.ants.find(e=>e.kind===`queen`);e&&(e.x=r.nest.nodes[2].x-.34,e.z=r.nest.nodes[2].z-.33,e.tunnelY=r.nest.nodes[2].y);for(let e of r.ants)e.y<-.1&&(e.tunnelY=r.nest.nodes[e.node]?.y??e.y,e.tunnelCenter=null,e.y=to(r.nest,e.x,e.z,e.tunnelY).floor+.008,e.normal={x:0,y:1,z:0});for(let e of r.ants)if((e.y||0)<-.1){let t=Z(r.nest,{x:e.x,y:e.y,z:e.z});if(Math.abs(t.gap-.008)>.025){let n=e.tunnelCenter||{x:e.x,y:e.tunnelY||e.y,z:e.z},i=r.nest.nodes[e.node]||n,a=r.nest.nodes[e.route?.[0]]||n,o=no(r.nest,n,i,a,e.navigation?.wallAngle||.35);o.inside&&(t={point:o,normal:o.normal,gap:.008})}Object.assign(e,t.point,{normal:t.normal}),e.previousX=e.x,e.previousY=e.y,e.previousZ=e.z,delete e.supportMotion}r.physicsVersion=5}if(r.localRoutingVersion!==1){for(let e of r.ants){let t=e.route?.at(-1);e.node!=null&&t!==void 0&&Q(r,e,t)}r.localRoutingVersion=1}if(Is(r,t,(e,t)=>Nd(e,t,!1)),n){Td(r);for(let e of[r,...r.colonies||[]])nd(e,B(e.biologicalProfile).materialModel===`relative-demo`);for(let e of[r,...r.colonies||[]])_d(e,B(e.biologicalProfile).stockModel===`rooms-demo`)}return r}function Pd(e,t,n){if(!e.colony?.stores||gl(e,t,n))return!1;let r=e.nest.nodes[n],i=Z(e.nest,{x:r.x-.12,y:r.y-r.r*.9,z:r.z});return t.route=[n],Ss(e,t,i.point,i.normal,r),t.state=`Chegando ao local de estoque`,!0}function Fd(e,t,n,r,i){let a=cs(t);if(r){if(Ao(e,t,!1,!0),a.retreating=!1,a.stagnantTicks=0,a.contactTicks=0,e.routeSignal&&t.routeIntent){rs(e,t,n)?t.route=[n]:is(e,t,i);return}if(e.nest.nodes[n].type===`entrance`){t.avoidEntrance=n,t.avoidEntranceUntil=e.tick+250,t.route=[],t.y=U(e.nest.relief,t.x,t.z)+.008,t.node=null,t.tunnelCenter=null,t.tunnelY=0,t.normal={x:0,y:1,z:0},t.pitch=0,t.lastEntrance={node:n,x:e.nest.nodes[n].x,z:e.nest.nodes[n].z},t.state=`Buscando outro acesso`,a.retreats++;return}a.retreats++,t.route=[],t.state=`Reavaliando o caminho`;return}Ao(e,t,rs(e,t,n));let o=t.node;if(t.node=t.route.shift()??n,o!==null&&Qo(e,t,o,t.node),t.route.length)return;if(t.routeIntent&&!rs(e,t,n)){is(e,t);return}delete t.routeIntent;let s=e.nest.nodes[n];if(s.type===`entrance`&&(t.lastEntrance={node:n,x:s.x,z:s.z}),!e.onNestArrival?.(t,n)){if(e.colony?.stores&&t.stockGoal===n||Kr(e,n)||ia(e.nest,n,t.colonyId||1)){if(Pd(e,t,n))return;delete t.stockGoal,Jr(e,t.carrying,`foraged`,n,{x:t.x,y:t.y??0,z:t.z}),t.carrying=0,e.onStorageVisit?e.onStorageVisit(t):e.food>.15&&Yr(e,gl(e,t,n)?.15:0,`care`,n,!!e.colony?.stores)>=.15-1e-10&&(t.energy=100),Q(e,t,H(e.nest,`entrance`,t.id%2,t.colonyId||1))}else s.type===`entrance`?(t.y=U(e.nest.relief,t.x,t.z)+.008,t.node=null,t.tunnelCenter=null,t.tunnelY=0,t.normal={x:0,y:1,z:0},t.pitch=0,t.state=`Explorando`,t.angle=e.range(0,Math.PI*2),a.velocity={x:0,y:0,z:0}):Q(e,t,H(e.nest,`entrance`,t.id%2,t.colonyId||1))}}function Id(e,t,n,r,i){if(n.type!==`entrance`||r.y>=n.y-.08)return!1;let a=U(e.nest.relief,n.x,n.z);if(i.y<a-.16)return!1;let o=Math.min(.75,(n.y-a+.24)/(n.y-r.y)),s={x:n.x+(r.x-n.x)*o,y:n.y+(r.y-n.y)*o,z:n.z+(r.z-n.z)*o};if(i.y<=s.y+.001)return!1;let c=p.atan2(t.z-n.z,t.x-n.x),l,u=1/0;for(let i of[0,.25,-.25,.55,-.55,.9,-.9,1.5,-1.5,Math.PI]){let a=no(e.nest,s,n,r,c+i);if(!a.inside||!bs(e,t,a,a.heading,a.pitch,a.normal))continue;let o=p.hypot(a.x-t.x,a.y-(t.y||0),a.z-t.z);o<u&&(l=a,u=o)}return l?(Ss(e,t,l,l.normal,s),Cs(e,t,t.speed*.85),!0):!1}let Ld=(e,t,n)=>Va(n,e,t),Rd=(e,t,n)=>Ld(e,t,n)<1,zd=(e,t,n)=>Ba(n,e,t);function Bd(e,t){return e<1&&(t>=1||e<=t+1e-5)}function Vd(e,t,n,r,i){if(n.type!==`entrance`||r.y<-.18)return!1;let a=t.x-n.x,o=t.z-n.z,s=p.hypot(a,o)>.01?p.atan2(o,a):t.angle,c=Math.max(n.r,e.nest.linkWidths?.[i]||.38)+.17;for(let r of[0,.3,-.3,.6,-.6,1,-1,1.6,-1.6,Math.PI]){let i=Z(e.nest,{x:n.x+p.cos(s+r)*c,y:U(e.nest.relief,n.x+p.cos(s+r)*c,n.z+p.sin(s+r)*c)+.008,z:n.z+p.sin(s+r)*c});if(!(Rd(i.point.x,i.point.z,e.landscape)||e.inPond(i.point.x,i.point.z))&&!(i.normal.y<.75||Math.abs(i.gap-.008)>.015))return Ss(e,t,i.point,i.normal,{x:n.x,y:n.y,z:n.z}),Cs(e,t,t.speed*.85),!0}return!1}function Hd(e,t){if(t.node!==null&&t.route[0]!==void 0&&!Ho(e.nest,t.node,t.route[0],t)){delete t.supportMotion,t.route=[],t.state=`Investigando o tampão com as antenas`;return}let n=cs(t);if(us(t),ws(e,t,t.speed*.85))return;if(t.supportMotion){Cs(e,t,t.speed*.85);return}if(t.node===null)return;let r=[t.node,t.route[0]],i=e.nest.links.findIndex(([e,t])=>e===r[0]&&t===r[1]||t===r[0]&&e===r[1]);if(ds(e,t,i))return;let a=!!n.retreating,o=a?t.node:t.route[0],s=e.nest.nodes[o];if(!s){t.route=[];return}let c=U(e.nest.relief,t.x,t.z),l=p.hypot(t.x-s.x,t.z-s.z);if(!a&&s.type===`entrance`&&l>s.r+.08&&l<s.r+.75&&(t.y||0)>=c-.012&&(t.normal?.y??1)>.75){delete t.supportMotion,Fd(e,t,o,!1,r);return}let u=t.tunnelCenter||{x:t.x,y:t.tunnelY??e.nest.nodes[t.node]?.y??t.y??0,z:t.z},d=e.nest.nodes[a?t.route[0]:t.node]||u,f=G(s,u),m=p.hypot(f.x,f.y,f.z);if(m<.001){let n=U(e.nest.relief,s.x,s.z);if(s.type===`entrance`&&((t.y||0)<n-.015||(t.normal?.y??1)<.75)&&Vd(e,t,s,u,i))return;Fd(e,t,o,a,r);return}if(!a&&Id(e,t,d,s,u)||Vd(e,t,s,u,i))return;let h=Y(f),g=t.normal||{x:0,y:1,z:0},_=vs(e,t),v=t.speed*.85,y=ss(t,_,h,v,{normal:g,climb:!0}),b=ls(e,t,y,h,g),x=ss(t,_,b,v,{normal:g,climb:!0});if(n.velocity=x.velocity,!a&&(n.stagnantTicks>18+t.id%17&&(y.frontal||x.pressure>.1)||q(b,h)<0&&n.contactTicks>3)){n.retreating=!0,t.state=`Recuando para liberar passagem`;return}let S=p.atan2(p.sin(.35-n.wallAngle),p.cos(.35-n.wallAngle));n.wallAngle+=x.pressure>.1?.035:Math.max(-.015,Math.min(.015,S));let C=Math.min(m,Math.max(v*.2,q(x.velocity,h))),w=W(u,K(h,C)),T=null,E=1/0,D=Math.abs(s.y-d.y)>p.hypot(s.x-d.x,s.z-d.z)*1.5;for(let r of[n.wallAngle,n.wallAngle+.08,n.wallAngle-.08,D?n.wallAngle+Math.PI:-n.wallAngle,...Array.from({length:16},(e,t)=>t*Math.PI/8)]){let i=no(e.nest,w,d,s,r),a=i.heading??p.atan2(s.z-d.z,s.x-d.x);if(i.inside&&bs(e,t,i,a,i.pitch,i.normal)){let e=p.pow(i.x-t.x,2)+p.pow(i.y-(t.y||0),2)+p.pow(i.z-t.z,2);if(e<E&&(T=i,E=e,n.wallAngle=r,e<v*v*.8&&q(g,i.normal)>.85))break}}T?p.hypot(T.x-t.x,T.y-(t.y||0),T.z-t.z)>v||q(g,T.normal)<.75?(Ss(e,t,T,T.normal,w),Cs(e,t,v)):(n.velocity=G(T,Xa(t)),t.distanceWalked=(t.distanceWalked||0)+p.hypot(T.x-t.x,T.y-(t.y||0),T.z-t.z),Object.assign(t,{x:T.x,y:T.y,z:T.z,tunnelY:w.y,tunnelCenter:w,normal:T.normal,pitch:T.pitch,angle:T.heading??p.atan2(s.z-d.z,s.x-d.x)}),a?t.state=`Recuando para liberar passagem`:n.contactTicks<4&&(t.state=t.carrying?`Indo para a despensa`:`Percorrendo uma galeria`),m<=C+.001&&Fd(e,t,o,a,r)):t.state=`Contato Antenal`}function Ud(e,t,n,r,i=!1){if(!i){let i=cs(t),a=vs(e,t),o={x:p.cos(n),y:0,z:p.sin(n)},s=ss(t,a,ls(e,t,ss(t,a,o,r),o,{x:0,y:1,z:0}),r);i.velocity={x:s.velocity.x,y:0,z:s.velocity.z},n=p.atan2(i.velocity.z,i.velocity.x),r=Math.max(r*.22,Math.min(r*1.15,p.hypot(i.velocity.x,i.velocity.z)))}let a=(n,r,a)=>Math.abs(n)>ji.x&&Math.abs(n)>=Math.abs(t.x)-1e-5||Math.abs(r)>ji.z&&Math.abs(r)>=Math.abs(t.z)-1e-5||Bd(zd(n,r,e.landscape),zd(t.x,t.z,e.landscape))||Ja(e.nest,{x:n,y:U(e.nest.relief,n,r)-.025,z:r}).distance>0||Bd(Ld(n,r,e.landscape),Ld(t.x,t.z,e.landscape))||i&&hu(e.plants,t,n,r)||(i?e.nest.nodes.some(e=>e.type===`entrance`&&Bd(p.pow(p.hypot(n-e.x,r-e.z)/1.3,2),p.pow(p.hypot(t.x-e.x,t.z-e.z)/1.3,2))):!bs(e,t,{x:n,y:0,z:r},a));(t.avoidTicks||0)>0&&(n=t.avoidAngle??n,t.avoidTicks=(t.avoidTicks||0)-1);let o=null;for(let e of[0,.45,-.45,.9,-.9,1.4,-1.4,2.1,-2.1,Math.PI]){let i=n+e,s=t.x+p.cos(i)*r,c=t.z+p.sin(i)*r;if(!a(s,c,i)){o={x:s,z:c,angle:i},e&&(t.avoidTicks=5,t.avoidAngle=i);break}}return o?(t.distanceWalked=(t.distanceWalked||0)+p.hypot(o.x-t.x,o.z-t.z),i||(cs(t).velocity={x:o.x-t.x,y:0,z:o.z-t.z},us(t)),t.x=o.x,t.z=o.z,t.y=U(e.nest.relief,t.x,t.z)+.008,t.normal=Ha(e.nest.relief,t.x,t.z),t.pitch=p.atan(-(t.normal.x*p.cos(o.angle)+t.normal.z*p.sin(o.angle))/t.normal.y),t.angle=o.angle,!0):(i||(us(t),t.state=`Contato Antenal`),!1)}let Wd=(e,t,n)=>Math.max(t,Math.min(n,e)),Gd=(e,t)=>p.hypot(e.x-t.x,e.z-t.z);var Kd=class e{constructor(e=`SEMENTE-42`,t={},n={}){cd(this,e,t,n)}random(){this.rng=this.rng+1831565813>>>0;let e=this.rng;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}range(e,t){return e+(t-e)*this.random()}get day(){return this.tick/100}get workers(){return this.ants.filter(e=>e.kind===`worker`)}get population(){return this.ants.length}inPond(e,t){return Ba(this.landscape,e,t)<1}makeAnt(e,t,n,r){return qu(this,e,t,n,r)}routeSignal(e,t,n,r){return Wu(this.nest,this.nestOdors,e,t,r+`:`+n)}onNestArrival(e,t){return e.kind===`queen`&&this.founding?.phase===`semiclaustral`||this.founding?.seal&&(this.founding.seal.workerId===e.id||e.kind===`queen`&&this.founding.phase===`sealing`)||e.kind===`queen`&&this.founding?.phase===`digging`&&t===this.founding.front?(e.route=[],!0):Ts(this,e,t)||Rs(this,e,t)||yl(this,e,t)||tu(this,e,t)}onStorageVisit(e){$l(this,e)}recordSoilRemoval(e,t){ec(this,e,t)}moveInNest(e){return Hd(this,e)}moveSurface(e,t,n,r=!1){return Ud(this,e,t,n,r)}positionClear(e,t,n,r,i){return bs(this,e,t,n,r,i)}log(e,t=`info`){this.events.unshift({tick:this.tick,day:this.day,text:e,type:t}),this.events.length=Math.min(this.events.length,35)}record(){po(this),this.history.push({tick:this.tick,day:this.day,population:Vr(this).length,brood:Hr(this).length,food:F(this).reduce((e,t)=>e+t.food+(t.colony.reproductiveFood||0),0),plants:this.plants.reduce((e,t)=>e+t.biomass,0)}),this.history.length>500&&this.history.shift(),this.lastRecord=this.tick}addPredator(e,t,n=!0){return this.predators.length>=10?!1:(this.predators.push({id:this.nextId++,x:e,y:U(this.nest.relief,e,t)+.008,z:t,angle:this.range(0,6.283),energy:100,cooldown:0,prey:0}),n&&this.log(`Um predador entrou no terrário.`,`danger`),!0)}intervene(e,t=0,n=0,r){let i=mo(this,e,r);if(i!==null)return i;let a=yo(this,e,r);if(a!==null)return a;let o=No(this,e,r);if(o!==null)return o;if(t=Wd(Number(t)||0,-ji.x,ji.x),n=Wd(Number(n)||0,-ji.z,ji.z),e===`scent`)return js(this,t,n);if(e===`food`)this.patches.push({id:this.nextId++,x:t,z:n,amount:5,capacity:5,discovered:!1,supplemental:!0}),this.patches.length>55&&this.patches.splice(this.patches.findIndex(e=>e.supplemental),1),this.log(`Alimento adicionado. Quem vai encontrá-lo?`,`food`);else if(e===`plant`&&this.plants.length<100&&!this.inPond(t,n))this.plants.push({id:this.nextId++,x:t,z:n,biomass:.35,kind:this.nextId%4,species:[`fern`,`shrub`,`tree`,`grass`,`cactus`,`succulent`,`flower`,`moss`][this.nextId%8],health:1,hydration:this.params.humidity/100}),this.patches.push({id:this.nextId++,x:t,z:n,sourcePlant:this.plants.at(-1).id,amount:.25,capacity:3,discovered:!1}),this.log(`Uma nova planta começa a crescer.`,`plant`);else if(e===`predator`)return this.nest.nodes.some(e=>e.type===`entrance`&&Gd({x:t,z:n},e)<2)?(this.log(`O ninho oferece abrigo. Coloque o predador mais longe.`,`info`),!1):this.addPredator(t,n);else if(e===`collapse`){for(let e=0;e<this.nest.links.length;e++)if(Lu(this,e,!0))return!0;return this.log(`As galerias estão ocupadas. O solo não foi perturbado.`),!1}else if(e===`rain`){this.landscape.rainPulse=1;for(let e of this.landscape.ponds)e.volume=Math.min(1,e.volume+.18);this.params.humidity=Wd(this.params.humidity+12,0,100),this.log(`Chuva: a umidade do terrário aumentou.`,`rain`)}else e===`photoperiodHours`?(this.params.photoperiodHours=Wd(Number.isFinite(Number(r))?Number(r):12,0,24),this.log(`Fotoperíodo ajustado para `+this.params.photoperiodHours+` horas de luz por dia do modelo.`)):e===`windX`?(this.params.windX=Wd(Number(r)||0,-4,4),this.log(`Vento horizontal ajustado para `+this.params.windX+` unidades do modelo.`)):e===`temperatureC`?(this.params.temperatureC=Wd(Number.isFinite(Number(r))?Number(r):24,5,45),this.log(`Temperatura de referência do ar ajustada para `+this.params.temperatureC+` °C.`)):e===`reposeAngle`?(this.params.reposeAngle=Wd(Number(r)||36,15,55),this.log(`Ângulo de repouso experimental ajustado para `+this.params.reposeAngle+`°.`)):[`humidity`,`light`,`randomness`].includes(e)&&(this.params[e]=Wd(Number(r)||0,0,100),this.log({humidity:`Umidade`,light:`Luz`,randomness:`Aleatoriedade`}[e]+` ajustada para `+this.params[e]+`%.`));return!0}pheromoneIndex(e,t){return Wd(Math.floor((t+6.5)/13*26),0,25)*40+Wd(Math.floor((e+10)/20*40),0,39)}step(e=1){for(let t=0;t<e;t++)this.advance()}advance(){return Gu(this)}lifeLimit(e){return 70+e.id%37}snapshot(){return JSON.parse(JSON.stringify(this))}static restore(t){return Nd(t,e.prototype)}};let{version:qd}=co,Jd=[`schema`,`versao_exportacao`,`versao_medicao`,`semente`,`cenario`,`aula`,`tipo_amostra`,`inicio_coleta_tick`,`dias_descartados`,`tick`,`dia_modelo`,`populacao_adulta_ind`,`prole_ind`,`ovos_ind`,`larvas_ind`,`pupas_ind`,`colonias`,`reserva_alimento_u`,`temperatura_ar_referencia_C`,`temperatura_media_grade_solo_C`,`O2_medio_galerias_pct_volume`,`CO2_medio_galerias_pct_volume`];function Yd(e){if(e===null)return``;if(typeof e==`number`){if(!Number.isFinite(e))throw Error(`Leitura não finita no CSV.`);return String(e)}return`"`+(/^[\s\u0000-\u001f]*[=+@-]/u.test(e)?`'`+e:e).replaceAll(`"`,`""`)+`"`}function Xd(e,t){let n=(e.dailyObservations?.points??[]).slice(t?-t:0),r=fo(e),i=n.map(e=>({point:e,kind:e.tick===0?`estado_inicial`:`fechamento_diario`}));return JSON.stringify(n.at(-1))!==JSON.stringify(r)&&i.push({point:r,kind:`instantaneo_atual`}),i}function Zd(e,t=``){let n=[[...Jd]];for(let{id:r,world:i}of e){let e=i.dailyObservations;for(let{point:a,kind:o}of Xd(i))n.push([`viveiro-diario-v1`,qd,a.modelVersion,i.seed,r.toUpperCase(),t,o,e?.startedTick??i.tick,e?.discarded??0,a.tick,a.tick/100,a.population,a.brood,a.eggs,a.larvae,a.pupae,a.colonies,a.food,a.airTemperatureC,a.soilTemperatureC,a.oxygenPercent,a.carbonDioxidePercent])}return`﻿`+n.map(e=>e.map(Yd).join(`,`)).join(`\r
`)+`\r
`}function Qd(e){let t=e;if(!t||t.schema!==`viveiro-parameter-profile-v1`||t.catalogVersion!==1||typeof t.id!=`string`||!/^[a-z][a-z0-9-]{0,47}$/.test(t.id)||!Number.isSafeInteger(t.version)||t.version<1||t.version>1e6||typeof t.label!=`string`||!t.label.trim()||t.label.length>80||/[\u0000-\u001f]/.test(t.label)||!t.parameters)throw Error(`Perfil de parâmetros inválido (catálogo 1, id e versão positiva).`);for(let e of Object.keys(t))if(![`schema`,`catalogVersion`,`id`,`version`,`label`,`biologicalProfile`,`parameters`].includes(e))throw Error(`Campo desconhecido no perfil: `+e);let n=t.biologicalProfile;if(!n||n.schema!==1||typeof n.id!=`string`||typeof n.version!=`number`||Object.keys(n).some(e=>![`schema`,`id`,`version`].includes(e)))throw Error(`Referência biológica do perfil inválida.`);return{schema:`viveiro-parameter-profile-v1`,catalogVersion:1,id:t.id,version:t.version,label:t.label.trim(),biologicalProfile:Li(n.id,n.version),parameters:ed(t.parameters)}}let $d=e=>{if(!e||typeof e!=`object`||Array.isArray(e))throw Error(`Configuração deve ser um objeto JSON.`);return e};function ef(e,t){for(let n of Object.keys(e))if(!t.includes(n))throw Error(`Campo desconhecido: `+n)}function tf(e){let t=$d(e);if(ef(t,[`schema`,`seed`,`days`,`startMode`,`biologicalProfile`,`parameters`,`extension`,`parameterProfile`]),t.schema!==`viveiro-experiment-v1`)throw Error(`Schema de experimento não suportado.`);let n=t.seed===void 0?`SEMENTE-42`:t.seed,r=t.days===void 0?1:t.days,i=t.startMode===void 0?`founding`:t.startMode;if(typeof n!=`string`||!n.length||n.length>128||/[\u0000-\u001f]/u.test(n))throw Error(`Seed deve ter de 1 a 128 caracteres, sem controles.`);if(typeof r!=`number`||!Number.isInteger(r)||r<0||r>365)throw Error(`Escolha de 0 a 365 dias inteiros.`);if(i!==`founding`&&i!==`established`)throw Error(`Modo inicial inválido.`);let a=$d(t.biologicalProfile===void 0?{schema:1,id:`generic-demo`,version:5}:t.biologicalProfile);if(ef(a,[`schema`,`id`,`version`]),a.schema!==1||typeof a.id!=`string`||typeof a.version!=`number`)throw Error(`Perfil deve informar schema1, id e versão.`);return{schema:`viveiro-experiment-v1`,seed:n,days:r,startMode:i,biologicalProfile:Li(a.id,a.version),parameters:ed(t.parameters),...t.parameterProfile===void 0?{}:{parameterProfile:Qd(t.parameterProfile)},...t.extension===void 0?{}:{extension:Io(t.extension)}}}async function nf(e,t,n,r){let i=new TextEncoder().encode(t),a=await crypto.subtle.digest(`SHA-256`,i),o=[...new Uint8Array(a)].map(e=>e.toString(16).padStart(2,`0`)).join(``),s={schema:`viveiro-run-v1`,modelVersion:co.version,calibrated:!1,arithmetic:f(),plan:e,clock:{ticksPerDay:100,startTick:0,endTick:e.days*100},collection:{kind:`observed endpoints`,intervalTicks:100,includesInitialState:!0,scenario:`A`,discardedDays:0},csv:{file:`dados.csv`,encoding:`UTF-8 with BOM`,delimiter:`,`,lineEnding:`CRLF`,bytes:i.length,sha256:o},finalRootRng:n,...r?{extensionDiagnostics:r}:{},limitations:[`Model units; not calibrated for a species.`,`No renderer, saved terrarium, real weather or wall-clock input.`,`Reproduce with the same model version and arithmetic policy; native and portable runs are distinct numerical contracts.`]};return{csv:t,manifest:JSON.stringify(s,null,2)+`
`}}async function rf(e,t={}){let n=tf(e),r=n.days*100,i=new Kd(n.seed,{...n.parameters},{founding:n.startMode===`founding`,biologicalProfile:{...n.biologicalProfile},decisionExtension:n.extension}),a=()=>{if(t.cancelled?.())throw Error(`Experimento cancelado.`)};for(a();i.tick<r;)a(),i.step(),i.tick%25==0&&(t.progress?.(i.tick,r),await t.pause?.());return a(),nf(n,Zd([{id:`a`,world:i}]),i.rng,n.extension?{decisions:F(i).reduce((e,t)=>e+(t.extensionDecisions??0),0)}:void 0)}function af(e,t={}){return Br(),rf(e,t)}self.onmessage=async e=>{try{let t=await af(e.data,{progress(e,t){self.postMessage({type:`progress`,tick:e,total:t})}});self.postMessage({type:`result`,result:t})}catch(e){self.postMessage({type:`error`,message:e instanceof Error?e.message:String(e)})}}})();