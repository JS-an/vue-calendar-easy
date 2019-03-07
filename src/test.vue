<template>
  <div>
    <Calendar
      v-model="default_date">
    </Calendar>
    <Calendar
      :daterange="true"
      :begin_date.sync="daterange_begin_date"
      :end_date.sync="daterange_end_date">
    </Calendar>
    <Calendar
      v-model="datepick_date"
      :picker="'date'">
    </Calendar>
    <Calendar
      v-model="monthpick_date"
      :picker="'month'">
    </Calendar>
    <Calendar
      v-model="yearpick_date"
      :picker="'year'">
    </Calendar>
    <Calendar
      v-model="weekend_date"
      :rules="['unableSat', 'unableSun']">
    </Calendar>
    <Calendar
      v-model="fromtoday_date"
      :rules="['fromToday']">
    </Calendar>
    <Calendar
      v-model="custom_date"
      :custom_filter="unableFirstWeek">
    </Calendar>
    <Calendar
      :daterange="true"
      :begin_date.sync="format_begin_date"
      :end_date.sync="format_end_date"
      :separator="' - '">
    </Calendar>
    <Calendar
      calendar_width="500px"
      calendar_height="400px"
      v-model="slot_date"
      :rules="['fromToday']">
      <template scope="scope">
        <div :style="{ padding: '4px', fontSize: '12px' }">
          <div v-if="scope.today" @click="$toast('自定义绑定事件')">
            {{ scope.day }}<br /><br />
            余 2
          </div>
          <template v-else>
            {{ scope.day }}<br /><br />
            {{ scope.disabled ? '已过期' : '' }}
          </template>
        </div>
      </template>
      <template scope="scope" slot="month">
        <div :style="{ padding: '4px', fontSize: '16px' }">
          {{ scope.month + 1 }}月
        </div>
      </template>
      <template scope="scope" slot="year">
        <div :style="{ padding: '4px', fontSize: '14px' }">
          {{ scope.year }}年
        </div>
      </template>
    </Calendar>
    <!-- <Popover :placement="'bottom-left'" :ref="'popover'">
      <Calendar
        :daterange="true"
        :begin_date.sync="begin_date"
        :end_date.sync="end_date"
        @complete="() => this.$refs.popover.close()">
      </Calendar>
      <Input slot="reference" v-model="format_date" :readonly="true" placeholder="no lazy" />
    </Popover>

    <Popover :placement="'bottom-left'" :ref="'lazy_popover'">
      <Calendar
        :daterange="true"
        :begin_date.sync="lazy_begin_date"
        :end_date.sync="lazy_end_date"
        :lazy="false"
        @complete="() => this.$refs.lazy_popover.close()">
      </Calendar>
      <Input slot="reference" v-model="lazy_format_date" :readonly="true" placeholder="lazy" />
    </Popover> -->
  </div>
</template>

<script>
import Calendar from '../lib/index.js'

export default {
  name: 'test',
  components: {
    Calendar
  },
  data () {
    return {
      // 默认单日期
      default_date: null, // 选中日期
      // 默认多日期
      daterange_begin_date: null, // 选中开始日期
      daterange_end_date: null, // 选中结束日期
      // 日历类型数据
      datepick_date: null,
      monthpick_date: null,
      yearpick_date: null,
      // 禁用规则
      weekend_date: null,
      fromtoday_date: null,
      custom_date: null,
      // 格式化
      format_begin_date: null,
      format_end_date: null,
      // popover
      begin_date: null,
      end_date: null,
      // lazy
      lazy_begin_date: null,
      lazy_end_date: null,
      // slot
      slot_date: new Date(),
      // style
      style_begin_date: null,
      style_end_date: null,
//       code: `
// <div class="calendar_result">
//   Date: {{ default_date }}<br />
//   Format: {{ default_format_date }}<br />
//   <Calendar
//     v-model="default_date"
//     :format_date.sync="default_format_date"
//   >
//   </Calendar>
// </div>
//       `,
//       daterange_code: `
//  <div class="calendar_result">
//   Begin Date: {{ daterange_begin_date }}<br />
//   End Date: {{ daterange_end_date }}<br />
//   Format: {{ daterange_format_date }}<br />
//   <Calendar
//     :daterange="true"
//     :begin_date.sync="daterange_begin_date"
//     :end_date.sync="daterange_end_date"
//     :format_date.sync="daterange_format_date"
//   >
//   </Calendar>
// </div>
//       `,
//       picker_code: `
// <div class="calendar_result">
//   Datepick: {{ datepick_format_date }}<br />
//   <Calendar
//     v-model="datepick_date"
//     :format_date.sync="datepick_format_date"
//   >
//   </Calendar>
// </div>
// <div class="calendar_result">
//   MonthPick: {{ monthpick_format_date }}<br />
//   <Calendar
//     v-model="monthpick_date"
//     :format_date.sync="monthpick_format_date"
//     :picker="'month'"
//     :format="'yyyy-MM'"
//   >
//   </Calendar>
// </div>
// <div class="calendar_result">
//   YearPick: {{ yearpick_format_date }}<br />
//   <Calendar
//     v-model="yearpick_date"
//     :format_date.sync="yearpick_format_date"
//     :picker="'year'"
//     :format="'yyyy'"
//   >
//   </Calendar>
// </div>
//       `,
//       rule_code: `
// <div class="calendar_result">
//   禁用周末<br />
//   <Calendar
//     v-model="datepick_date"
//     :rules="['unableSat', 'unableSun']"
//     :format_date.sync="datepick_format_date"
//   >
//   </Calendar>
// </div>
// <div class="calendar_result">
//   从今天起<br />
//   <Calendar
//     v-model="datepick_date"
//     :rules="['fromToday']"
//     :format_date.sync="datepick_format_date"
//   >
//   </Calendar>
// </div>
// <div class="calendar_result">
//   自定义禁用规则<br />
//   <!--
//     unableFirstWeek (date, type) {
//       if (type === 'date' && date.getDate() <= 7) return true
//     }
//   -->
//   <Calendar
//     v-model="datepick_date"
//     :custom_filter="unableFirstWeek"
//     :format_date.sync="datepick_format_date"
//   >
//   </Calendar>
// </div>
//       `,
//       format_code: `
// <div class="calendar_result">
//   Format: {{ format_format_date }}<br />
//   <Calendar
//     :daterange="true"
//     :begin_date.sync="format_begin_date"
//     :end_date.sync="format_end_date"
//     :format="'yyyy/MM/dd'"
//     :separator="' - '"
//     :format_date.sync="format_format_date"
//   >
//   </Calendar>
// </div>
//       `,
//       popover_code: `
// <Popover :placement="'bottom-left'" :ref="'popover'">
//   <Calendar
//     :daterange="true"
//     :begin_date.sync="begin_date"
//     :end_date.sync="end_date"
//     :format_date.sync="format_date"
//     @complete="() => this.$refs.popover.close()"
//   >
//   </Calendar>
//   <Input slot="reference" v-model="format_date" :readonly="true" placeholder="no lazy"></Input>
// </Popover>
// <Popover :placement="'bottom-left'" :ref="'lazy_popover'">
//   <Calendar
//     :daterange="true"
//     :begin_date.sync="lazy_begin_date"
//     :end_date.sync="lazy_end_date"
//     :format_date.sync="lazy_format_date"
//     :lazy="false"
//     @complete="() => this.$refs.lazy_popover.close()"
//   >
//   </Calendar>
//   <Input slot="reference" v-model="lazy_format_date" :readonly="true" placeholder="lazy"></Input>
// </Popover>
//       `,
//       slot_code: `
// <div class="calendar_result">
//   Date: {{ slot_date }}<br />
//   Format: {{ slot_format_date }}<br />
//   <Calendar
//     calendar_width="500px"
//     calendar_height="400px"
//     v-model="slot_date"
//     :format_date.sync="slot_format_date"
//   >
//   <template scope="scope">
//     <div :style="{ padding: '4px', fontSize: '12px' }">
//       <div v-if="scope.today" @click="$toast('自定义绑定事件')">
//         {{ scope.day }}<br /><br />
//         余 2
//       </div>
//       <template v-else>
//         {{ scope.day }}
//       </template>
//     </div>
//   </template>
//   <template scope="scope" slot="month">
//     <div :style="{ padding: '4px', fontSize: '16px' }">
//       {{ scope.month + 1 }}月
//     </div>
//   </template>
//   <template scope="scope" slot="year">
//     <div :style="{ padding: '4px', fontSize: '14px' }">
//       {{ scope.year }}年
//     </div>
//   </template>
//   </Calendar>
// </div>
//       `
    }
  },
  methods: {
    unableFirstWeek (date, type) {
      if (type === 'date' && date.getDate() <= 7) return true
    },
    $toast (txt) {
      alert(txt)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
