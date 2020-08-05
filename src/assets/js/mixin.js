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
        },
        sheet2blob(sheet, sheetName) {
            sheetName = sheetName || 'sheet1';
            var workbook = {
                SheetNames: [sheetName],
                Sheets: {}
            };
            workbook.Sheets[sheetName] = sheet;
            // 生成excel的配置项
            var wopts = {
                bookType: 'xlsx', // 要生成的文件类型
                bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
                type: 'binary'
            };
            var wbout = XLSX.write(workbook, wopts);
            var blob = new Blob([s2ab(wbout)], {type:"application/octet-stream"});
            // 字符串转ArrayBuffer
            function s2ab(s) {
                var buf = new ArrayBuffer(s.length);
                var view = new Uint8Array(buf);
                for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                return buf;
            }
            return blob;
        }
    }
}

export default mixin