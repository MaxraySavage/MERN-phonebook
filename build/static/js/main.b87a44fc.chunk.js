(this.webpackJsonpphonebook=this.webpackJsonpphonebook||[]).push([[0],{21:function(e,n,t){},41:function(e,n,t){"use strict";t.r(n);var c=t(16),r=t.n(c),u=t(3),a=(t(21),t(2)),o=t(4),i=t.n(o),s="/api/persons",l={getAll:function(){return i.a.get(s).then((function(e){return e.data}))},create:function(e){return i.a.post(s,e).then((function(e){return e.data}))},deleteEntry:function(e){return i.a.delete("".concat(s,"/").concat(e)).then((function(e){return e.data}))},update:function(e,n){return i.a.put("".concat(s,"/").concat(e),n).then((function(e){return e.data}))}},d=t(0),f=function(e){var n=e.field;return Object(d.jsxs)("div",{children:["".concat(n.title,": "),Object(d.jsx)("input",{value:n.value,onChange:n.changeHandler})]})},b=function(e){var n=e.submitHandler,t=e.fields;return Object(d.jsxs)("form",{onSubmit:n,children:[t.map((function(e){return Object(d.jsx)(f,{field:e},e.id)})),Object(d.jsx)("div",{children:Object(d.jsx)("button",{type:"submit",children:"add"})})]})},j=function(e){var n=e.persons,t=e.deleteEntryOf;return Object(d.jsx)("ul",{children:n.map((function(e){return Object(d.jsxs)("li",{children:[e.name," ",e.number,Object(d.jsx)("button",{onClick:function(){return t(e.id)},children:"Delete"})]},e.id)}))})},h=function(e){var n=e.message,t=e.messageType;return null===n?null:Object(d.jsx)("div",{className:t,children:n})},m=function(){var e=Object(a.useState)([]),n=Object(u.a)(e,2),t=n[0],c=n[1],r=Object(a.useState)(""),o=Object(u.a)(r,2),i=o[0],s=o[1],m=Object(a.useState)(""),O=Object(u.a)(m,2),p=O[0],v=O[1],x=Object(a.useState)(""),g=Object(u.a)(x,2),y=g[0],w=g[1],k=Object(a.useState)(""),S=Object(u.a)(k,2),E=S[0],H=S[1],T=Object(a.useState)(""),C=Object(u.a)(T,2),D=C[0],P=C[1];Object(a.useEffect)((function(){l.getAll().then((function(e){return c(e)}))}),[]);var A=t.filter((function(e){return-1!==e.name.toLowerCase().indexOf(y.toLowerCase())})),J=[{id:1,title:"name",value:i,changeHandler:function(e){s(e.target.value)}},{id:2,title:"number",value:p,changeHandler:function(e){v(e.target.value)}}],L={title:"Search",value:y,changeHandler:function(e){w(e.target.value)}};return Object(d.jsxs)("div",{children:[Object(d.jsx)("h2",{children:"Phonebook"}),Object(d.jsx)(h,{message:E,messageType:D}),Object(d.jsx)(b,{submitHandler:function(e){if(e.preventDefault(),t.some((function(e){return e.name===i}))){var n=t.find((function(e){return e.name===i}));if(n.number===p)return void alert("".concat(i," has already been added to the phonebook"));if(!window.confirm("".concat(i," is already in the phonebook, would you like to replace their old one with the new one?")))return;var r={name:i,number:p};l.update(n.id,r).then((function(e){c(t.map((function(n){return n.id===e.id?e:n}))),H("".concat(e.name,"'s number updated")),P("success"),setTimeout((function(){H(null)}),3e3),s(""),v("")})).catch((function(){H("Unable to update ".concat(i,". Person not found in database.")),P("error"),setTimeout((function(){H(null)}),3e3)}))}else{var u={name:i,number:p};l.create(u).then((function(e){c(t.concat(e)),H("".concat(e.name," successfully added")),P("success"),setTimeout((function(){H(null)}),3e3),s(""),v("")}))}},fields:J}),Object(d.jsx)("h2",{children:"Contacts"}),Object(d.jsx)(f,{field:L}),Object(d.jsx)(j,{persons:A,deleteEntryOf:function(e){window.confirm("Delete ".concat(t.find((function(n){return n.id===e})).name,"?"))&&l.deleteEntry(e).then((function(){c(t.filter((function(n){return n.id!==e})))})).catch((function(){H("Unable to delete ".concat(t.find((function(n){return n.id===e})).name,". Person not found.")),P("error"),setTimeout((function(){H(null)}),3e3)}))}})]})};r.a.render(Object(d.jsx)(m,{}),document.getElementById("root"))}},[[41,1,2]]]);
//# sourceMappingURL=main.b87a44fc.chunk.js.map