                <table width="100%" border="2" cellspacing="1" cellpadding="4" bgcolor="#cccccc" class="tabtop13" align="center">
                    <tr>
                        <td width="4%" class="btbg font-center titfont" >日期</td>
                        <td width="5%" class="btbg font-center titfont" >二级单位</td>
                        <td width="2%" class="btbg font-center titfont" >早餐A</td>
                        <td width="2%" class="btbg font-center titfont" >金额</td>
                        <td width="2%" class="btbg font-center titfont" >早餐B</td>
                        <td width="2%" class="btbg font-center titfont" >金额</td>
                        <td width="2%" class="btbg font-center titfont">晚餐A大份</td>
                        <td width="2%" class="btbg font-center titfont" >金额</td>
                        <td width="2%" class="btbg font-center titfont">晚餐A小份</td>
                        <td width="2%" class="btbg font-center titfont" >金额</td>
                        <td width="2%" class="btbg font-center titfont">晚餐B大份</td>
                        <td width="2%" class="btbg font-center titfont" >金额</td>
                        <td width="2%" class="btbg font-center titfont">晚餐B小份</td>
                        <td width="2%" class="btbg font-center titfont" >金额</td>
                    </tr>
                    <tr v-for="(order, index) in orderList" :key="index">
                        <td>{{order.date}}</td>
                        <td>{{order.station}}</td>
                        <td>{{order.num}}</td>
                        <td>{{order.num}}</td>
                        <td>{{order.num}}</td>
                        <td>{{order.num}}</td>
                        <td>{{order.num}}</td>
                        <td>{{order.num}}</td>
                        <td>{{order.num}}</td>
                        <td>{{order.num}}</td>
                        <td>{{order.num}}</td>
                        <td>{{order.num}}</td>
                        <td>{{order.num}}</td>
                        <td>{{order.num}}</td>
                    </tr>
                    <!-- <tr>
                        <td width="4%" class="btbg2">1</td>
                        <td width="5%" class="btbg2">1</td>
                        <td width="2%" class="btbg2">1</td>
                        <td width="2%" class="btbg2">1</td>
                        <td width="2%" class="btbg2">1</td>
                        <td width="2%" class="btbg2">1</td>
                        <td width="2%" class="btbg2">1</td>
                        <td width="2%" class="btbg2">1</td>
                        <td width="2%" class="btbg2">1</td>
                        <td width="2%" class="btbg2">1</td>
                        <td width="2%" class="btbg2">1</td>
                        <td width="2%" class="btbg2">1</td>
                        <td width="2%" class="btbg2">1</td>
                        <td width="2%" class="btbg2">1</td>
                    </tr> -->
                    <tr>
                        <td width="4%" class="btbg2">汇总</td>
                        <td width="5%" class="btbg2">1</td>
                        <td width="2%" class="btbg2">1</td>
                        <td width="2%" class="btbg2">1</td>
                        <td width="2%" class="btbg2">1</td>
                        <td width="2%" class="btbg2">1</td>
                        <td width="2%" class="btbg2">1</td>
                        <td width="2%" class="btbg2">1</td>
                        <td width="2%" class="btbg2">1</td>
                        <td width="2%" class="btbg2">1</td>
                        <td width="2%" class="btbg2">1</td>
                        <td width="2%" class="btbg2">1</td>
                        <td width="2%" class="btbg2">1</td>
                        <td width="2%" class="btbg2">1</td>
                    </tr>
                </table>