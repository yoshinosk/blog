<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover" class="mgb20">
                    <div class="user-info">
                        <img :src="avatar" class="user-avator" alt />
                        <div class="user-info-cont">
                            <div class="user-info-name">{{ nickname }}</div>
                            <div>{{ roles }}</div>
                        </div>
                    </div>
                    <div class="user-info-list">
                        上次登录时间：
                        <span>{{ user.lastLoginTime | dateFormat }}</span>
                    </div>
                    <div class="user-info-list">
                        注册时间：
                        <span>{{ user.registerTime | dateFormat }}</span>
                    </div>
                    <div class="user-info-list">
                        金币：
                        <span>{{ user.coin }}</span>
                    </div>
                    <div class="user-info-list">
                        累计签到：
                        <span>{{ user.signInTol }}</span>
                    </div>
                </el-card>
                <el-card shadow="hover">
                    <div slot="header" class="clearfix">
                        <span>我的文章</span>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{ padding: '0px' }">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-people grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{ userCount }}</div>
                                    <div>用户数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{ padding: '0px' }">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-lx-notice grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{ articleCount }}</div>
                                    <div>文章数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{ padding: '0px' }">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-lx-goods grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{ waitForApproveArticle }}</div>
                                    <div>待审核文章</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-card shadow="hover" style="height: 403px">
                    <div slot="header" class="clearfix"></div>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12"> </el-col>
            <el-col :span="12"> </el-col>
        </el-row>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { dateFormat } from '@/utils/tool';
import { getBaseInfo } from '@/api';

export default {
    name: 'dashboard',
    data() {
        return {
            articleCount: 0,
            userCount: 0,
            waitForApproveArticle: 0
        };
    },
    created() {
        getBaseInfo().then(({data})=>{
            console.log(data)
            for(let key in data){
                this.$set(this.$data,key,data[key])
            }
        })
    },
    methods: {},
    computed: {
        user() {
            return this.$store.state.user;
        },
        ...mapGetters(['roles', 'avatar', 'nickname'])
    },
    filters: {
        dateFormat(val) {
            return dateFormat(val);
        }
    }
};
</script>


<style scoped>
.el-row {
    margin-bottom: 20px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}

.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}

3 .mgb20 {
    margin-bottom: 20px;
}

.todo-item {
    font-size: 14px;
}

.todo-item-del {
    text-decoration: line-through;
    color: #999;
}

.schart {
    width: 100%;
    height: 300px;
}
</style>
