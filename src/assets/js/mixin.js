const mixin = {
    data() {
        return {
            labels: {
                weekdayHeaderFormat: 'narrow',
                labelPrevDecade: '过去十年',
                labelPrevYear: '上一年',
                labelPrevMonth: '上个月',
                labelCurrentMonth: '当前月份',
                labelNextMonth: '下个月',
                labelNextYear: '明年',
                labelNextDecade: '下一个十年',
                labelToday: '今天',
                labelSelected: '选定日期',
                labelNoDateSelected: '未选择日期',
                labelCalendar: '日历',
                labelNav: '日历导航',
                labelHelp: '使用光标键浏览日期'
            }
        }
    },
    methods: {
        refreshStationList() {
            if (this.options.length <= 1) {
                this.apiStationList.forEach(station => {
                    this.options.push({
                        value: JSON.parse(JSON.stringify(station)),
                        text: station.stationName
                    })
                })
            }
        }
    }
}

export default mixin