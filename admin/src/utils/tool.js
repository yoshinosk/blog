import moment from 'moment'

export const dateFormat = s => moment(s * 1000).format('YYYY-MM-DD HH:mm')
