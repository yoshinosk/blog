(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0d678f"],{7363:function(t,e,l){"use strict";l.r(e);var a=function(){var t=this,e=t.$createElement,l=t._self._c||e;return l("div",[l("div",{staticClass:"crumbs"},[l("el-breadcrumb",{attrs:{separator:"/"}},[l("el-breadcrumb-item",[l("i",{staticClass:"el-icon-lx-cascades"}),t._v(" 等级管理\n            ")])],1)],1),l("div",{staticClass:"container"},[l("div",{staticClass:"handle-box"},[l("el-button",{staticClass:"handle-del mr10",attrs:{type:"primary",icon:"el-icon-refresh"},on:{click:t.getData}}),l("el-button",{staticClass:"handle-del mr10",attrs:{type:"primary",icon:"el-icon-plus"},on:{click:function(e){t.editVisible=!0}}},[t._v("添加")])],1),l("el-table",{ref:"multipleTable",staticClass:"table",attrs:{data:t.tableData,border:"","header-cell-class-name":"table-header","row-key":"_id"}},[l("el-table-column",{attrs:{prop:"level",label:"等级"}}),l("el-table-column",{attrs:{prop:"title",label:"等级称号"}}),l("el-table-column",{attrs:{prop:"startExp",label:"开始经验"}}),l("el-table-column",{attrs:{prop:"endExp",label:"结束经验"}}),l("el-table-column",{attrs:{label:"操作",width:"180",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[l("el-button",{attrs:{type:"text",icon:"el-icon-edit"},on:{click:function(l){return t.handleEdit(e.$index,e.row)}}},[t._v("编辑")])]}}])})],1)],1),l("el-dialog",{attrs:{title:t.editMode?"编辑":"添加",visible:t.editVisible,width:"30%"},on:{"update:visible":function(e){t.editVisible=e}}},[l("el-form",{ref:"form",attrs:{model:t.form,"label-width":"100px"}},[l("el-form-item",{attrs:{label:"等级",required:""}},[l("el-input",{attrs:{placeholder:""},model:{value:t.form.level,callback:function(e){t.$set(t.form,"level",t._n(e))},expression:"form.level"}})],1),l("el-form-item",{attrs:{label:"等级称号"}},[l("el-input",{attrs:{placeholder:""},model:{value:t.form.title,callback:function(e){t.$set(t.form,"title",e)},expression:"form.title"}})],1),l("el-form-item",{attrs:{label:"开始经验",required:""}},[l("el-input",{attrs:{placeholder:""},model:{value:t.form.startExp,callback:function(e){t.$set(t.form,"startExp",t._n(e))},expression:"form.startExp"}})],1),l("el-form-item",{attrs:{label:"结束经验",required:""}},[l("el-input",{attrs:{placeholder:""},model:{value:t.form.endExp,callback:function(e){t.$set(t.form,"endExp",t._n(e))},expression:"form.endExp"}})],1)],1),l("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[l("el-button",{on:{click:function(e){t.editVisible=!1}}},[t._v("取 消")]),l("el-button",{attrs:{type:"primary"},on:{click:t.saveEdit}},[t._v("确 定")])],1)],1)],1)},i=[],r=l("b775"),o=function(t){return Object(r["a"])({url:"/admin/level/list",method:"get",params:t||{},showMsg:!1})},n=function(t){return Object(r["a"])({url:"/admin/level/add",method:"post",data:t||{}})},s=function(t){return Object(r["a"])({url:"/admin/level/edit",method:"post",data:t||{}})},d={name:"level",data:function(){return{query:{},tableData:[],editMode:!1,editVisible:!1,form:{}}},created:function(){this.getData()},watch:{editVisible:function(t){t||(this.form={},this.editMode=!1)}},methods:{getData:function(){var t=this;o(this.query).then((function(e){t.tableData=e.data}))},handleEdit:function(t,e){this.form=e,this.editMode=!0,this.editVisible=!0},saveEdit:function(){var t=this,e=this.editMode?s:n;this.form.rights||(this.form.rights=[]),e(this.form).then((function(e){t.getData(),t.editVisible=!1}))}}},c=d,u=l("2877"),m=Object(u["a"])(c,a,i,!1,null,"4a6d8280",null);e["default"]=m.exports}}]);