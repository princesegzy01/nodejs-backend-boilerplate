import User from '../models/User'

export const show = (ctx: any) => new User({ id: ctx.state.user.id }).fetch()

export default {
  show
}
