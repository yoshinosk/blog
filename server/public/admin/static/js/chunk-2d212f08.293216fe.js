(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d212f08"],{ab0a:function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{staticClass:"crumbs"},[a("el-breadcrumb",{attrs:{separator:"/"}},[a("el-breadcrumb-item",[a("i",{staticClass:"el-icon-lx-cascades"}),t._v(" 等级管理 ")])],1)],1),a("div",{staticClass:"container"},[a("div",{staticClass:"handle-box"},[a("el-button",{staticClass:"handle-del mr10",attrs:{type:"primary",icon:"el-icon-refresh"},on:{click:t.getData}}),a("el-button",{staticClass:"handle-del mr10",attrs:{type:"primary",icon:"el-icon-plus"},on:{click:function(e){t.editVisible=!0}}},[t._v("添加")]),a("el-button",{staticClass:"handle-del mr10",attrs:{type:"primary",icon:"el-icon-delete"},on:{click:t.delAllSelection}},[t._v("批量删除")])],1),a("el-table",{ref:"multipleTable",staticClass:"table",attrs:{data:t.tableData,border:"","header-cell-class-name":"table-header","row-key":"_id"},on:{"selection-change":t.handleSelectionChange}},[a("el-table-column",{attrs:{type:"selection",width:"55",align:"center"}}),a("el-table-column",{attrs:{prop:"nickname",label:"昵称"},scopedSlots:t._u([{key:"default",fn:function(e){var n=e.row;return[n.from?a("span",[t._v("\n                        "+t._s(n.from.nickname)+"\n                    ")]):a("span",[t._v(t._s(n.nickname))])]}}])}),a("el-table-column",{attrs:{prop:"email",label:"邮箱"},scopedSlots:t._u([{key:"default",fn:function(e){var n=e.row;return[n.from?a("span",[t._v("\n                        "+t._s(n.from.email)+"\n                    ")]):a("span",[t._v(t._s(n.email))])]}}])}),a("el-table-column",{attrs:{prop:"content",label:"内容"}}),a("el-table-column",{attrs:{prop:"createTime",label:"发布时间",formatter:t.dateFormat}}),a("el-table-column",{attrs:{label:"操作",width:"180",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-button",{staticClass:"red",attrs:{type:"text",icon:"el-icon-delete"},on:{click:function(a){return t.handleDel(e.row)}}},[t._v("删除")])]}}])})],1),a("div",{staticClass:"pagination"},[a("el-pagination",{attrs:{background:"",layout:"total, prev, pager, next","current-page":t.query.page,"page-size":t.query.pageSize,total:t.total},on:{"current-change":t.handlePageChange}})],1)],1)])},l=[],i=a("b775"),o=function(t){return Object(i["a"])({url:"/admin/board/list",method:"get",params:t||{},showMsg:!1})},r=function(t){return Object(i["a"])({url:"/admin/board/del",method:"delete",data:{id:t}})},c=a("3de1"),s={name:"board",data:function(){return{query:{page:1,pageSize:10},tableData:[],form:{},total:0,multipleSelection:[]}},created:function(){this.getData()},methods:{handlePageChange:function(){this.$set(this.query,"page",val),this.getData()},dateFormat:function(t){return Object(c["a"])(t.createTime)},getData:function(){var t=this;o(this.query).then((function(e){t.tableData=e.data.list,t.total=e.data.total}))},handleDel:function(t){var e=this;this.$confirm("请确认是否删除该留言").then((function(){r(t._id).then((function(t){e.getData()}))}))},handleSelectionChange:function(t){this.multipleSelection=t},delAllSelection:function(){var t=this;this.multipleSelection.length&&this.$confirm("请确认是否删除".concat(this.multipleSelection.length,"条留言")).then((function(){r(t.multipleSelection.map((function(t){return t._id}))).then((function(e){t.getData(),t.multipleSelection=[]}))}))}}},u=s,d=a("2877"),m=Object(d["a"])(u,n,l,!1,null,"1fc7f483",null);e["default"]=m.exports}}]);