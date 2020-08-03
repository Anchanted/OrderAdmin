                    <table width="100%" border="2" cellspacing="1" cellpadding="4" bgcolor="#cccccc" class="tabtop13" align="center">
                        <tr>
                            <td width="5%" class="btbg font-center titfont" >序号</td>
                            <td width="7%" class="btbg font-center titfont" >姓名</td>
                            <td width="10%" class="btbg font-center titfont" >手机号</td>
                            <td width="10%" class="btbg font-center titfont" >密码</td>
                            <td width="10%" class="btbg font-center titfont" >公司级单位</td>
                            <td width="13%" class="btbg font-center titfont" >二级单位</td>
                            <td width="13%" class="btbg font-center titfont" >三级单位</td>
                            <td width="10%" class="btbg font-center titfont" >用户级别</td>
                            <td width="10%" class="btbg font-center titfont" >是否查看部门历史订单</td>
                            <td width="5%" class="btbg font-center titfont" >是否修改</td>
                        </tr>
                        <tr>
                            <td width="5%" class="btbg2">{{user.id}}</td>
                            <td width="7%" class="btbg2">{{user.username}}</td>
                            <td width="10%" class="btbg2">{{user.telephone}}</td>
                            <td width="10%" class="btbg2">{{user.password}}</td>
                            <td width="10%" class="btbg2">{{user.areaName}}</td>
                            <td width="13%" class="btbg2">{{user.stationName}}</td>
                            <td width="13%" class="btbg2">{{user.wellName}}</td>
                            <td width="10%" class="btbg2">{{user.roleName}}</td>
                            <td width="10%" class="btbg2"><input type="radio" name="judge" value="Y">Yes<input type="radio" name="judge" value="N">No</td>
                            <td width="5%" class="btbg2">
                                <button type="primary" v-on:click="changeUser">修改</button>
                            </td>
                        </tr>
                    </table>

                    <!-- <table width="100%" border="2" cellspacing="1" cellpadding="4" bgcolor="#cccccc" class="tabtop13" align="center">
                        <tr>
                            <td width="10%" class="btbg font-center titfont" >序号</td>
                            <td width="10%" class="btbg font-center titfont" >姓名</td>
                            <td width="10%" class="btbg font-center titfont" >手机号</td>
                            <td width="10%" class="btbg font-center titfont" >密码</td>
                            <td width="10%" class="btbg font-center titfont" >公司级单位</td>
                            <td width="10%" class="btbg font-center titfont" >二级单位</td>
                            <td width="10%" class="btbg font-center titfont" >三级单位</td>
                            <td width="10%" class="btbg font-center titfont" >用户级别</td>
                            <td width="10%" class="btbg font-center titfont" >是否查看部门历史订单</td>
                        </tr>
                        <tr>
                            <td width="10%" class="btbg2">{{user.id}}</td>
                            <td width="10%" class="btbg2">{{user.username}}</td>
                            <td width="10%" class="btbg2">{{user.telephone}}</td>
                            <td width="10%" class="btbg2">{{user.password}}</td>
                            <td width="10%" class="btbg2">{{user.areaName}}</td>
                            <td width="10%" class="btbg2">{{user.stationName}}</td>
                            <td width="10%" class="btbg2">{{user.wellName}}</td>
                            <td width="10%" class="btbg2">{{user.roleName}}</td>
                            <td width="10%" class="btbg2"><input type="radio" name="judge" value="Y">Yes<input type="radio" name="judge" value="N">No</td>
                        </tr>
                    </table> -->
                    <div>
                        <button type="primary" v-on:click="cancel">取消</button>
                        <button type="primary" v-on:click="save">保存</button>
                    </div>