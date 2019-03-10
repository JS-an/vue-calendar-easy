# vue-calendar-easy

## install

```diff
npm install vue-calendar-easy --save
```

## Usage

```js
<template>
  <vue-calendar v-model="value" />
</template>

<script>
import VueCalendar from 'vue-calendar-easy'

export default {
  components: {
    VueCalendar
  },
  data () {
    return {
      value: null // Default selected date
    }
  }
}
</script>
```

## Options

### Props

| Props | Type | Default | Description |
| ------ | ------ | ------ | ------ |
| value | Date | null | Default selected date |
| daterange | Boolean | null | Optional date range |
| begin_date.sync | Date | null | When `:daterange="true"` is true, default start date |
| end_date.sync | Date | null | When `:daterange="true"` is true, default end date |
| lazy | Boolean | true | When `:daterange="true"` is true, allow lazy loading |
| one_calendar | Boolean | false | When `:daterange="true"` is true,
display a single calendar |
| separator | String | ~ | Separator symbol |
| defaultNextMonth | Boolean | true | When `:daterange="true"` is true,
In multi-calendar mode,
`true` shows the current month and next month,
`false` shows last month and current month |
| picker | String | date | Calendar type, `"date" / "month" / "year"` |
| years | Number | 20 | Year range |
| year_start | Number | 2000 | Start year |
| rules | Array< String > | [] | Built-in filtering method,
optional value please see below. |
| custom_filter | Function | - | Please see below. |
| mark_today | Boolean | true | Mark today |
| calendar_width | String | '300px' | Calendar width |
| calendar_height | String | '250px' | Calenfar height |
| header_height | String | '40px' | Header height |
| no_border | Boolean | false | Display border |
| format | String | yyyy-MM-dd | Get formatted value |

### event

| event | Description | Callback Arguments |
| ------ | ------ | ------ |
| complete | Callback when the date changes |
First: checked date(type: object) / checked date range(type: object)
Second: format date(type: string) |

### slot

| slot | Description | Slot variables |
| ------ | ------ | ------ |
| default | Custom Calendar | in_range< Boolean >, year < Number >, month < Number >, day < Number > |
| month | Custom Month Calendar | year < Number >, month < Number > |
| year | Custom Year Calendar | year < Number > |

```js
/*
 * @param date  日期
 * @param type  日历类型 [date, month, year]
 * @param index 索引 (默认为0，当 daterange 时为 0 或 1)
 */
function custom_filter (date, type, index) {
  // 返回 true 则禁用
  return Boolean
}

const rules = [
  'fromToday', // 从今天起（包含今天）
  'fromTomorrow', // 从明天起（不包含今天）
  'untilToday', // 直至今天（包含今天）
  'untilTomorrow', // 直至明天（不包含今天）
  'unableSun', // 禁用周日
  'unableMon', // 禁用周一
  'unableTues', // 禁用周二
  'unableWed', // 禁用周三
  'unableThur', // 禁用周四
  'unableFri', // 禁用周五
  'unableSat' // 禁用周六
]
```