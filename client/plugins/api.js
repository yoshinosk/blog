import apis from "~/apis/index";

export default (ctx, inject) => {

  let apiObject = {};
  for (let key in apis) {
    apiObject[key] = apis[key](ctx.$axios);
  }

  inject("api", apiObject);

};
