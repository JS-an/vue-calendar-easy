<template>
  <div :class="component_class" :style="component_style">
    <template v-for="(mode, i) in calendars">
      <!-- 日历模式 -->
      <CalendarDate
        v-show="mode === 'date'"
        :ref="`date${i}`"
        :key="`date${i}`"
        :class="wrap_class"
        :style="wrap_style"
        :default_date="months[i]"
        :daterange="daterange"
        :date="date"
        :date_range="date_range"
        :hover_range.sync="hover_range"
        :height="calendar_height"
        :header_height="header_height"
        :days="days"
        :filter="(date, type) => filter(date, type, i)"
        :custom_style="custom_style"
        @get_day="getDate"
        @click_month="(obj) => setMonth(obj, i)"
        @click_year="(obj) => setYear(obj, i)"
        @change="setLinkageRange"
      >
        <template v-slot="obj">
          <slot
            :date="obj.date"
            :day="obj.day"
            :month="obj.month"
            :year="obj.year"
            :prev_month="obj.prev_month"
            :next_month="obj.next_month"
            :in_range="obj.in_range"
            :disabled="obj.disabled"
            :active="obj.active"
            :today="obj.today"
          >
            <span class="calendar-date-default-slot">
              {{ obj.day }}
            </span>
          </slot>
        </template>
      </CalendarDate>

      <!-- 月历模式 -->
      <CalendarMonth
        v-show="mode === 'month'"
        :ref="`month${i}`"
        :key="`month${i}`"
        :class="wrap_class"
        :style="wrap_style"
        :daterange="daterange"
        :date="date"
        :date_range="date_range"
        :height="calendar_height"
        :header_height="header_height"
        :filter="(date, type) => filter(date, type, i)"
        :custom_style="custom_style"
        @get_month="(obj) => getMonth(obj, i)"
        @click_year="(obj) => setYear(obj, i)"
      >
        <template v-slot="obj">
          <slot
            :date="obj.date"
            :month="obj.month"
            :year="obj.year"
            :disabled="obj.disabled"
            :active="obj.active"
            :today="obj.today"
            name="month">
            <span class="calendar-date-default-slot">{{ obj.month + 1 }}月</span>
          </slot>
        </template>
      </CalendarMonth>

      <!-- 年历模式 -->
      <CalendarYear
        v-show="mode === 'year'"
        :ref="`year${i}`"
        :key="`year${i}`"
        :class="wrap_class"
        :style="wrap_style"
        :daterange="daterange"
        :date="date"
        :years="years"
        :year_start="year_start"
        :date_range="date_range"
        :height="calendar_height"
        :header_height="header_height"
        :filter="(date, type) => filter(date, type, i)"
        :custom_style="custom_style"
        @get_year="(obj) => getYear(obj, i)"
      >
        <template v-slot="obj">
          <slot
            :date="obj.date"
            :year="obj.year"
            :disabled="obj.disabled"
            :active="obj.active"
            :today="obj.today"
            name="year"
          >
            <span class="calendar-date-default-slot">{{ obj.year }}</span>
          </slot>
        </template>
      </CalendarYear>
    </template>
  </div>
</template>

<script>
  import CalendarYear from './calendarYear.vue'
  import CalendarMonth from './calendarMonth.vue'
  import CalendarDate from './calendarDate.vue'
  import { formatDate, isValid, isSameDate } from './tools.js'
  import Rules from './rules.js'

  const prefixCls = 'calendar'

  export default {
    name: 'Calendar',
    components: {
      CalendarYear,
      CalendarMonth,
      CalendarDate
    },
    props: {
      date: [Object, Date],
      begin_date: [Object, Date],
      end_date: [Object, Date],
      custom_filter: Function,
      days: {
        type: Array,
        default() {
          return ['日', '一', '二', '三', '四', '五', '六']
        }
      },
      years: {
        type: Number,
        default: 20
      },
      year_start: {
        type: Number,
        default: 2000
      },
      picker: {
        type: String,
        default: 'date'
      },
      lazy: {
        type: Boolean,
        default: true
      },
      daterange: { // 日期范围
        type: Boolean,
        default: false
      },
      defaultNextMonth: {
        type: Boolean,
        default: true
      },
      separator: {
        type: String,
        default: ' ~ '
      },
      one_calendar: {
        type: Boolean,
        default: false
      },
      format: {
        type: String,
        default: 'yyyy-MM-dd'
      },
      mark_today: {
        type: Boolean,
        default: true
      },
      rules: {
        type: Array,
        validator (arr) {
          return arr.some((val) => isValid(Object.keys(Rules.date), val))
        }
      },
      calendar_width: {
        type: String,
        default: '300px'
      },
      calendar_height: {
        type: String,
        default: '250px'
      },
      header_height: {
        type: String,
        default: '60px'
      },
      custom_style: Boolean
    },
    model: { // model选项
      prop: 'date', // v-model传入的值
      event: 'change' // v-model触发的事件
    },
    data () {
      return {
        today: new Date(),
        year_range: 50,
        date_range: [],
        linkage_range: [],
        hover_range: [],
        calendars: []
      }
    },
    computed: {
      component_class () {
        return [
          prefixCls
        ]
      },
      component_style () {
        return {
          }
      },
      wrap_class () {
        return [
          `${prefixCls}-wrap`
        ]
      },
      wrap_style () {
        return {
          width: this.calendar_width
        }
      },
      header_class () {
        return [
          `${prefixCls}-header`
        ]
      },
      months () {
        if (this.defaultNextMonth) {
          return [this.today, new Date(this.today.getFullYear(), this.today.getMonth() + 1)]
        } else {
          return [new Date(this.today.getFullYear(), this.today.getMonth() - 1), this.today]
        }
      },
      display () {
        return this.daterange ? (`${formatDate(this.begin_date, this.format)}${this.separator}${formatDate(this.end_date, this.format)}`) : formatDate(this.date, this.format)
      }
    },
    methods: {
      filter (date, type, i) {
        let result = {
          disabled: false,
          isToday: false,
          callback: null
        }

        // 判断是否高亮今天
        if (this.mark_today && isSameDate(date, this.today, type)) {
          result.isToday = true
        }

        // 用户自定义过滤方法
        if (this.custom_filter) {
          result.disabled = !!this.custom_filter(date, type, i)
        }

        // 内置过滤方法
        if (this.rules && this.rules.length) {
          Array.from(this.rules, (filter_name) => {
            if (Rules[type][filter_name] && Rules[type][filter_name](date, type)) {
              result.disabled = true
            }
          })
        }

        // daterange 联动过滤
        if (this.daterange && !this.one_calendar && type !== 'date') {
          if (i === 0) {
            if (this.linkage_range[1]) {
              result.disabled = Rules.untilSomeDate(date, this.linkage_range[1], type)
            }
          } else {
            if (this.linkage_range[0]) {
              result.disabled = Rules.fromSomeDate(date, this.linkage_range[0], type)
            }
          }
        }

        return result
      },
      setDate (date) {
        if (this.daterange) {
          if (this.date_range.length === 1) {
            this.date_range = this.date_range[0] > date ? [date].concat(this.date_range) : this.date_range.concat([date])

            this.update(true)
          } else {
            this.date_range = [date]
            !this.lazy && this.update(false)
          }
        } else {
          this.$emit('change', date)
          this.$nextTick(() => {
            this.$emit('complete', date, this.display)
            this.$emit('update:format_date', this.display)
          })
        }
      },
      getDate ({ date }) {
        this.setDate(date)
      },
      getMonth ({ date, month, year }, i) {
        if (this.picker === 'month') {
          this.setDate(date)
          return false
        }

        this.calendars.splice(i, 1, 'date')
        this.setLinkageRange()

        this.$nextTick(() => {
          if (this.$refs[`date${i}`][0]) {
            this.$refs[`date${i}`][0].month = month
            this.$refs[`date${i}`][0].year = year
          }
        })
      },
      getYear ({ date, year }, i) {
        if (this.picker === 'year') {
          this.setDate(date)
          return false
        }

        this.calendars.splice(i, 1, 'month')
        this.setLinkageRange()

        this.$nextTick(() => {
          if (this.$refs[`month${i}`][0]) {
            this.$refs[`month${i}`][0].year = year
          }
        })
      },
      setMonth ({ year }, i) {
        this.calendars.splice(i, 1, 'month')
        this.setLinkageRange()

        this.$nextTick(() => {
          if (this.$refs[`month${i}`][0]) {
            this.$refs[`month${i}`][0].year = year
          }
        })
      },
      setYear ({ year }, i) {
        this.calendars.splice(i, 1, 'year')
        this.setLinkageRange()

        this.$nextTick(() => {
          if (this.$refs[`year${i}`][0]) {
            this.$refs[`year${i}`][0].year = year
          }
        })
      },
      setLinkageRange () {
        this.linkage_range = Array.from(this.calendars, (name, i) => {
          if (name !== 'date') {
            return null
          } else {
            let vm = this.$refs[`${name}${i}`][0]
            return new Date(vm.year, vm.month + (i === 1 ? -1 : 1))
          }
        })
      },
      update (isComplete) {
        this.$nextTick()
        .then(() => {
          this.$emit('update:begin_date', this.date_range[0])
          this.$emit('update:end_date', this.date_range[1])
        })
        .then(() => {
          isComplete && this.$emit('complete', this.date_range, this.display)
          this.$emit('update:format_date', this.display)
        })
      },
      initCalendar () {
        this.calendars = !this.daterange ? [this.picker] : this.one_calendar ? [this.picker] : [this.picker, this.picker]
      },
      initDateRange () {
        if (this.daterange && this.begin_date) {
          this.date_range = this.end_date ? [this.begin_date, this.end_date] : [this.begin_date]
        }
      }
    },
    mounted () {
      this.initCalendar() //初始化日历
      this.initDateRange()
      this.date && this.$emit('update:format_date', this.display)
      this.calendars.length === 2 && this.$nextTick(() => this.setLinkageRange())
    }
  }
</script>

<style lang="scss" scope>
  
$month_col: 4;
$month_row: 3;
$year_col: 4;
$year_row: 5;

* {
  box-sizing: border-box;
}

.calendar {
  z-index: 9;
  display: inline-block;
  padding: 10px;
  border: 1px solid #ccc;
  line-height: normal;
  white-space: nowrap;

  .calendar-wrap {
    display: inline-block;
    vertical-align: top;
    white-space: nowrap;
    padding: 5px;
  }

  .calendar-header {
    position: relative;
    font-size: 16px;
    text-align: center;

    span {
      margin: 0 5px;
      font-size: 18px;
      cursor: pointer;
      transition: all .3s;

      &.year-range {
        cursor: default;
      }

      &:not(.year-range):hover {
        color: #60acfc;
      }
    }

    .icon {
      width: 18px;
      height: 18px;
      position: absolute;
      top: 50%;
      opacity: .6;
      transform: translateY(-50%) rotate(45deg);
      cursor: pointer;
      transition: opacity .3s;

      &:hover {
        opacity: 1;
      }
    }

    .icon-left {
      left: 10px;
      border: 2px solid gray;
      border-right: transparent;
      border-top: transparent;
    }

    .icon-right {
      right: 10px;
      border: 2px solid gray;
      border-left: transparent;
      border-bottom: transparent;
    }
  }
}

// 日历
.calendar-date {
  overflow: hidden;
  display: table;
  width: 100%;
  border-collapse: collapse;
  margin: 0;

  .calendar-date-body {
    position: relative;
    display: table;
    width: 100%;
    height: 100%;

    tr {
      border: none;
      outline: none;
      box-shadow: none;
    }

    th, td {
      width: floor(100% / 7%);
      text-align: center;
      user-select: none;
      border: none;
      cursor: pointer;
      font-size: 14px;
      padding: 0;
    }

    th {
      color: #333;
    }

    td {
      position: relative;
      transition: all .2s;

      &:not(.custom_style) {
        border: 1px solid #fff;
        background-color: #efefef;

        &.cur_month {
          color: #333;
          font-weight: 600;
        }

        &.prev_month, &.next_month {
          color: #777;
          background-color: #f7f7f7;

          &.active, &.inRange {
            opacity: .66;
          }
        }

        &.today {
          box-shadow: inset 0 0 0 1px #60acfc;
        }

        &.inRange {
          background-color: lighten(#60acfc, 80%);
        }

        &.active {
          color: #f7f7f7;
          background-color: #60acfc;
          cursor: default;
        }

        &.disabled {
          color: #ccc;
          cursor: not-allowed;
          font-weight: normal;
        }

        &:not(.disabled):not(.active):hover, &:not(.active).isHover {
          color: #f7f7f7;
          background-color: #60acfc;
        }
      }
    }
  }
}

// 月历 / 年历
.calendar-month, .calendar-year {
  overflow-x: hidden;
  white-space: pre-wrap;
  font-size: 0px;

  .calendar-month-item, .calendar-year-item {
    position: relative;
    display: inline-block;
    font-size: 18px;
    cursor: pointer;
    transition: all .3s;


    &:not(.custom_style) {
      border: 1px solid #f7f7f7;
      background-color: #efefef;

      &.custom_style {
        border: none;
      }

      &.today {
        box-shadow: inset 0 0 0 1px #60acfc;
      }

      &.active {
        color: #f7f7f7;
        background-color: #60acfc;
      }

      &.disabled {
        color: #ccc;
        cursor: not-allowed;
        font-weight: normal;
      }

      &:not(.disabled):not(.active):hover {
        color: #f7f7f7;
        background-color: #60acfc;
      }
    }
  }
}


.calendar-month .calendar-month-item {
  width: (100% / $month_col);
  height: (100% / $month_row);
}

.calendar-year .calendar-year-item {
  width: (100% / $year_col);
  height: (100% / $year_row);}

// slot
.calendar-date-slot {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  text-align: left;
  white-space: normal;

  .calendar-date-default-slot {
    display: inline-block;
    position: absolute;
    left: 50%;
    top: 50%;
    white-space: nowrap;
    transform: translate(-50%, -50%);
  }
}
</style>
