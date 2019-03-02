const WEEK = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat']
const today = new Date()

const getYMD = (date) => ({
  DATE_TIME: new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(),
  MONTH_TIME: new Date(date.getFullYear(), date.getMonth(), 1).getTime(),
  YEAR_TIME: new Date(date.getFullYear(), 0, 1).getTime()
})

const fromSomeDate = (date, endDate, mode, includeEndDate) => {
  let { DATE_TIME, MONTH_TIME, YEAR_TIME } = getYMD(endDate)

  if (mode === 'date') {
    return includeEndDate ? +date <= DATE_TIME : +date < DATE_TIME
  } else if (mode === 'month') {
    return +date < MONTH_TIME
  } else if (mode === 'year') {
    return +date < YEAR_TIME
  }
}

const untilSomeDate = (date, startDate, mode, includeStartDate) => {
  let { DATE_TIME, MONTH_TIME, YEAR_TIME } = getYMD(startDate)

  if (mode === 'date') {
    return includeStartDate ? +date > DATE_TIME : +date >= DATE_TIME
  } else if (mode === 'month') {
    return +date > MONTH_TIME
  } else if (mode === 'year') {
    return +date > YEAR_TIME
  }
}

const fromToday = (date, mode) => {
  return fromSomeDate(date, today, mode, false)
}

const fromTomorrow = (date, mode) => {
  return fromSomeDate(date, today, mode, true)
}

const untilToday = (date, mode) => {
  return untilSomeDate(date, today, mode, false)
}

const untilTomorrow = (date, mode) => {
  return untilSomeDate(date, today, mode, true)
}

const getUnableWeek = () => {
  let obj = {}
  WEEK.map((name, i) => {
    obj[`unable${name}`] = (date) => date.getDay() === i
  })
  return obj
}

export default {
  fromSomeDate,
  untilSomeDate,
  date: {
    fromToday,
    fromTomorrow,
    untilToday,
    untilTomorrow,
    ...getUnableWeek()
  },
  month: {
    fromToday,
    fromTomorrow,
    untilToday,
    untilTomorrow
  },
  year: {
    fromToday,
    fromTomorrow,
    untilToday,
    untilTomorrow
  }
}