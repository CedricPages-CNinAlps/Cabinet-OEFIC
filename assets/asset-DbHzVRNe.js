function e(r){return r?/^https?:\/\//.test(r)?r:`/Cabinet-OEFIC/${r.replace(/^\//,"")}`:""}function t(r){return r?r.startsWith("/uploads/")?r:e(r):""}export{t as a,e as r};
