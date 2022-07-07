export default async function (context) {
  let user = context.store.state.user.current;
  if(user) return true;

  let logged = process.server ? String(context.req.headers.cookie).indexOf('rt=') > -1 : true;
  if (!logged) {
    return context.redirect('/')
  }

  user = await context.store.dispatch('user/refreshToken')
  if (!user) context.redirect('/')
}
