(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-3ae38928"],{"6c35":function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{staticClass:"crumbs"},[a("el-breadcrumb",{attrs:{separator:"/"}},[a("el-breadcrumb-item",[a("i",{staticClass:"el-icon-lx-cascades"}),t._v(" 角色管理\n            ")])],1)],1),a("div",{staticClass:"container"},[a("div",{staticClass:"handle-box"},[a("el-button",{staticClass:"handle-del mr10",attrs:{type:"primary",icon:"el-icon-refresh"},on:{click:t.getData}}),a("el-button",{staticClass:"handle-del mr10",attrs:{type:"primary",icon:"el-icon-plus"},on:{click:function(e){t.editVisible=!0}}},[t._v("添加")])],1),a("el-table",{ref:"multipleTable",staticClass:"table",attrs:{data:t.tableData,border:"","header-cell-class-name":"table-header","row-key":"_id"}},[a("el-table-column",{attrs:{prop:"_id",label:"ID",width:"120"}}),a("el-table-column",{attrs:{prop:"name",label:"角色名称"}}),a("el-table-column",{attrs:{prop:"title",label:"角色称号"}}),a("el-table-column",{attrs:{prop:"rights",label:"角色权限"},scopedSlots:t._u([{key:"default",fn:function(e){var i=e.row;return[i.rights.length?a("el-cascader",{attrs:{options:t.rightsList,props:t.cascaderProps,disabled:"",placeholder:"无",clearable:""},model:{value:i.rights,callback:function(e){t.$set(i,"rights",e)},expression:"row.rights"}}):a("span",[t._v("无")])]}}])}),a("el-table-column",{attrs:{label:"操作",width:"180",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-button",{attrs:{type:"text",icon:"el-icon-edit"},on:{click:function(a){return t.handleEdit(e.$index,e.row)}}},[t._v("编辑")])]}}])})],1)],1),a("el-dialog",{attrs:{title:t.editMode?"编辑":"添加",visible:t.editVisible,width:"30%"},on:{"update:visible":function(e){t.editVisible=e}}},[a("el-form",{ref:"form",attrs:{model:t.form,"label-width":"100px"}},[a("el-form-item",{attrs:{label:"角色名称",required:""}},[a("el-input",{attrs:{placeholder:""},model:{value:t.form.name,callback:function(e){t.$set(t.form,"name",e)},expression:"form.name"}})],1),a("el-form-item",{attrs:{label:"角色称号"}},[a("el-input",{attrs:{placeholder:""},model:{value:t.form.title,callback:function(e){t.$set(t.form,"title",e)},expression:"form.title"}})],1),a("el-form-item",{attrs:{label:"角色权限"}},[a("el-cascader",{attrs:{options:t.rightsList,props:t.cascaderProps,clearable:""},model:{value:t.form.rights,callback:function(e){t.$set(t.form,"rights",e)},expression:"form.rights"}})],1)],1),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(e){t.editVisible=!1}}},[t._v("取 消")]),a("el-button",{attrs:{type:"primary"},on:{click:t.saveEdit}},[t._v("确 定")])],1)],1)],1)},r=[],l=a("cc5e"),n=a("9bdd"),s={name:"role",data:function(){return{query:{},tableData:[],rightsList:[],editMode:!1,editVisible:!1,form:{},cascaderProps:{value:"_id",label:"name",multiple:!0,checkStrictly:!1,emitPath:!1}}},created:function(){var t=this;this.getData(),Object(n["d"])().then((function(e){t.rightsList=e.data}))},watch:{editVisible:function(t){t||(this.form={},this.editMode=!1)}},methods:{getData:function(){var t=this;Object(l["c"])(this.query).then((function(e){t.tableData=e.data}))},handleEdit:function(t,e){this.form=e,this.editMode=!0,this.editVisible=!0},saveEdit:function(){var t=this,e=this.editMode?l["b"]:l["a"];this.form.rights||(this.form.rights=[]),e(this.form).then((function(e){t.getData(),t.editVisible=!1}))}}},o=s,c=a("2877"),d=Object(c["a"])(o,i,r,!1,null,"1502a274",null);e["default"]=d.exports},"9bdd":function(t,e,a){"use strict";a.d(e,"d",(function(){return r})),a.d(e,"a",(function(){return l})),a.d(e,"c",(function(){return n})),a.d(e,"b",(function(){return s}));var i=a("b775"),r=function(t){return Object(i["a"])({url:"/admin/rights/list",method:"get",params:t||{},showMsg:!1})},l=function(t){return Object(i["a"])({url:"/admin/rights/add",method:"post",data:t||{}})},n=function(t){return Object(i["a"])({url:"/admin/rights/edit",method:"post",data:t||{}})},s=function(t){return Object(i["a"])({url:"/admin/rights/del",method:"delete",data:{id:t}})}},cc5e:function(t,e,a){"use strict";a.d(e,"c",(function(){return r})),a.d(e,"a",(function(){return l})),a.d(e,"b",(function(){return n}));var i=a("b775"),r=function(t){return Object(i["a"])({url:"/admin/role/list",method:"get",params:t||{},showMsg:!1})},l=function(t){return Object(i["a"])({url:"/admin/role/add",method:"post",data:t||{}})},n=function(t){return Object(i["a"])({url:"/admin/role/edit",method:"post",data:t||{}})}}}]);