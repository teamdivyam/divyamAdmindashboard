import{p as n,r,R as e,q as o,_ as t}from"./index-CqUjVgox.js";import{B as c}from"./badge-B0N44wJb.js";import{P as p}from"./phone-B3oAJvn6.js";import{M as d}from"./map-pin-DxJRDjmM.js";/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=n("LockKeyhole",[["circle",{cx:"12",cy:"16",r:"1",key:"1au0dj"}],["rect",{x:"3",y:"10",width:"18",height:"12",rx:"2",key:"6s8ecr"}],["path",{d:"M7 10V7a5 5 0 0 1 10 0v3",key:"1pqi11"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=n("Mail",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=n("ShieldCheck",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]),k=()=>{const[a,m]=r.useState(null);return r.useEffect(()=>{const s=localStorage.getItem("AppID");(async()=>{try{const l=await fetch(`${t&&t.BACKEND_URL}/api/admin/profile`,{method:"GET",headers:{Authorization:`Bearer ${s}`,"Content-Type":"application/json",Accept:"application/json, application/xml","Accept-Language":"en_US"}}),i=await l.json();l.ok&&m(i)}catch{}})()},[]),e.createElement("div",{className:"bg-neutral-100 dark:bg-gray-700 rounded-lg border p-6 mx-auto w-2/3",id:"oderPreview"},e.createElement("div",{className:"cardHeader flex justify-between"},e.createElement(c,{variant:"destructive",className:"bg-orange-400 py-1 cursor-pointer hover:bg-orange-400"},e.createElement(o,null)),e.createElement(c,{variant:"destructive",className:"bg-white  hover:bg-white"},e.createElement("span",{className:"text-green-700 animate-pulse	"},"Online"),e.createElement("span",{className:`inline-block uppercase pl-1 rounded-full  text-neutral-500
        font-medium 
        `}))),e.createElement("div",{className:"cardBody bg-white dark:bg-slate-800 rounded-md border p-6 mt-6"},e.createElement("div",{className:"userProfile flex flex-row "},e.createElement("img",{src:`${t&&t.IMAGE_CDN}/Uploads/admins/${a&&a.avatar}`,className:" rounded-full shadow-lg size-24"}),e.createElement("div",{className:"profileText pt-1 pl-10"},e.createElement("h2",{className:"capitalize font-medium text-neutral-600 text-3xl flex mt-4 gap-2 items-center"},a&&a.fullName,e.createElement(h,{className:"text-green-400"})),e.createElement("p",{className:"mobileNum flex items-center pt-2 text-neutral-400 gap-2"},e.createElement(g,null)," admin@divyam.in"),e.createElement("p",{className:"age  mt-2  flex items-center  text-neutral-400 gap-2"},e.createElement(p,null),e.createElement("span",null,"9898986765")),e.createElement("p",{className:"age  mt-2  flex items-center  text-neutral-400 gap-2"},e.createElement(d,null),e.createElement("span",null,"Railway Junction Prayagraj near Pappu paan wale 12/72"," ")),e.createElement("p",{className:"age  mt-2  flex items-center  text-neutral-400 gap-2"},e.createElement(u,null)," ",e.createElement("span",null,"***********"))))))};export{k as default};
