<template>
  <transition
    name="fade"
    enter-active-class="animate__animated animate__fadeIn"
    leave-active-class="animate__animated animate__fadeOut"
  >
    <div class="loginModal" v-if="value" @click="$emit('input', false)">
      <div id="login" class="formBox glassMask" @click.stop>
        <div class="top">
          <button
            type="button"
            class="close"
            aria-label="Close"
            @click="handleClose"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <b-form
          class="form"
          @submit.stop.prevent
          @keydown.enter="handleSubmit('login')"
        >
          <b-input-group>
            <b-input-group-prepend is-text>
              <b-icon-envelope-fill></b-icon-envelope-fill>
            </b-input-group-prepend>
            <b-form-input
              trim
              v-model.lazy="form_login.account"
              placeholder="请输入您的邮箱"
              :state="state_login.account"
            ></b-form-input>
            <b-form-invalid-feedback :state="state_login.account">
              {{ state_msg.email }}
            </b-form-invalid-feedback>
          </b-input-group>
          <b-input-group>
            <b-input-group-prepend is-text>
              <b-icon-shield-lock-fill></b-icon-shield-lock-fill>
            </b-input-group-prepend>
            <b-form-input
              trim
              v-model="form_login.password"
              placeholder="请输入您的密码"
              :state="state_login.password"
              type="password"
              :max="20"
            ></b-form-input>
            <b-form-invalid-feedback :state="state_login.password">
              {{ state_msg.password }}
            </b-form-invalid-feedback>
          </b-input-group>

          <div class="btn-transparent" @click="handleSubmit('login')">登录</div>
          <div class="bottom">
            <span @click="showRegister = true">注册账号</span>
            <span @click="showRetrieve = true" style="margin-left: auto"
              >找回密码</span
            >
          </div>
        </b-form>
      </div>
      <transition
        name="fade"
        enter-active-class="animate__animated animate__fadeIn"
        leave-active-class="animate__animated animate__fadeOut"
      >
        <div
          id="register"
          v-if="showRegister"
          class="formBox glassMask animate__animated animate__fadeIn"
          @click.stop
        >
          <div class="top">
            <button
              type="button"
              class="close"
              aria-label="Close"
              @click="showRegister = false"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <b-form
            class="form"
            @submit.stop.prevent
            @keydown.enter="handleSubmit('register')"
          >
            <b-input-group>
              <b-input-group-prepend is-text>
                <b-icon-person-fill></b-icon-person-fill>
              </b-input-group-prepend>
              <b-form-input
                trim
                v-model="form_register.nickname"
                :state="state_register.nickname"
                placeholder="请输入您的昵称"
              ></b-form-input>
              <b-form-invalid-feedback :state="state_register.nickname">
                {{ state_msg.nickname }}
              </b-form-invalid-feedback>
            </b-input-group>
            <b-input-group>
              <b-input-group-prepend is-text>
                <b-icon-shield-lock-fill></b-icon-shield-lock-fill>
              </b-input-group-prepend>
              <b-form-input
                trim
                v-model="form_register.password"
                :state="state_register.password"
                placeholder="请输入您的密码"
                type="password"
              ></b-form-input>
              <b-form-invalid-feedback :state="state_register.password">
                {{ state_msg.password }}
              </b-form-invalid-feedback>
            </b-input-group>
            <b-input-group>
              <b-input-group-prepend is-text>
                <b-icon-envelope-fill></b-icon-envelope-fill>
              </b-input-group-prepend>
              <b-form-input
                trim
                v-model="form_register.email"
                :state="state_register.email"
                placeholder="请输入您的邮箱"
              ></b-form-input>
              <b-form-invalid-feedback :state="state_register.email">
                {{ state_msg.email }}
              </b-form-invalid-feedback>
            </b-input-group>

            <b-input-group>
              <b-input-group-prepend is-text>
                <b-icon-cursor-fill></b-icon-cursor-fill>
              </b-input-group-prepend>
              <b-form-input
                trim
                v-model="form_register.mailCode"
                :state="state_register.mailCode"
                placeholder="邮箱验证码"
              ></b-form-input>
              <b-input-group-append>
                <button class="btn-transparent" @click="handleSend('register')">
                  发送
                </button>
              </b-input-group-append>
              <b-form-invalid-feedback :state="state_register.mailCode">
                {{ state_msg.mailCode }}
              </b-form-invalid-feedback>
            </b-input-group>
            <div class="btn-transparent" @click="handleSubmit('register')">
              注册
            </div>
          </b-form>
        </div>
      </transition>
      <transition
        name="fade"
        enter-active-class="animate__animated animate__fadeIn"
        leave-active-class="animate__animated animate__fadeOut"
      >
        <div
          id="retrieve"
          v-if="showRetrieve"
          class="formBox glassMask animate__animated animate__fadeIn"
          @click.stop
        >
          <div class="top">
            <button
              type="button"
              class="close"
              aria-label="Close"
              @click="showRetrieve = false"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <b-form
            class="form"
            @submit.stop.prevent
            @keydown.enter="handleSubmit('retrieve')"
          >
            <b-input-group>
              <b-input-group-prepend is-text>
                <b-icon-envelope-fill></b-icon-envelope-fill>
              </b-input-group-prepend>
              <b-form-input
                trim
                v-model="form_retrieve.email"
                :state="state_retrieve.email"
                placeholder="请输入您的邮箱"
              ></b-form-input>
              <b-form-invalid-feedback :state="state_retrieve.email">
                {{ state_msg.email }}
              </b-form-invalid-feedback>
            </b-input-group>
            <b-input-group>
              <b-input-group-prepend is-text>
                <b-icon-shield-lock-fill></b-icon-shield-lock-fill>
              </b-input-group-prepend>
              <b-form-input
                trim
                v-model="form_retrieve.password"
                :state="state_retrieve.password"
                type="password"
                placeholder="请输入您的新密码"
              ></b-form-input>
              <b-form-invalid-feedback :state="state_retrieve.password">
                {{ state_msg.password }}
              </b-form-invalid-feedback>
            </b-input-group>
            <b-input-group>
              <b-input-group-prepend is-text>
                <b-icon-cursor-fill></b-icon-cursor-fill>
              </b-input-group-prepend>
              <b-form-input
                trim
                v-model="form_retrieve.mailCode"
                :state="state_retrieve.mailCode"
                placeholder="邮箱验证码"
              ></b-form-input>
              <b-input-group-append>
                <button class="btn-transparent" @click="handleSend('retrieve')">
                  发送
                </button>
              </b-input-group-append>
              <b-form-invalid-feedback :state="state_retrieve.mailCode">
                {{ state_msg.mailCode }}
              </b-form-invalid-feedback>
            </b-input-group>
            <div class="btn-transparent" @click="handleSubmit('retrieve')">
              确定
            </div>
          </b-form>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import "animate.css";
import md5 from "md5";

const checkEmail = (val) =>
  /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(val);
const checkPwd = (val) => Boolean(val) && val.length >= 6 && val.length <= 32;
const checkName = (val) => Boolean(val) && val.length <= 20 && /^[\u4E00-\u9FA5A-Za-z0-9_-]+$/.test(val);
const checkCode = (val) => Boolean(val) && val.length >= 4;

export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form_login: {
        account: "",
        password: "",
      },
      form_register: {},
      form_retrieve: {},
      showRegister: false,
      showRetrieve: false,
      state_login: {
        account: null,
        password: null,
      },
      state_register: {
        nickname: null,
        password: null,
        email: null,
        mailCode: null,
      },
      state_retrieve: {
        email: null,
        password: null,
        mailCode: null,
      },
      state_msg: {
        email: "请输入正确的邮箱",
        mailCode: "验证码格式错误",
        password: "密码长度限制6-32个字符",
        nickname: "昵称长度限制1-20，不能包含_-以外的特殊符号",
      },
    };
  },
  methods: {
    handleClose() {
      this.$emit("input", false);
    },
    /**
     * @description 发送邮箱验证码
     * @param {String} type 表单类型 register/retrieve
     */
    handleSend(type = "register") {
      let email = this.$data[`form_${type}`].email;
      this.$set(this.$data[`state_${type}`], "email", checkEmail(email));
      if (!this.$data[`state_${type}`].email) return;
      this.$api.user.sendEmailCode(email).then((res) => {});
    },
    async handleSubmit(type = "login") {
      if (!this.validator(type)) return;
      let formKey = `form_${type}`;
      let form = { ...this.$data[formKey] };
      form.password = md5(form.password);
      if (type != "login") {
        let confirm = await this.$bvModal.msgBoxConfirm(
          `请确认您的密码为：${this.$data[formKey].password}`,
          {
            title: "提示",
            size: "sm",
            buttonSize: "sm",
            okVariant: "danger",
            okTitle: "确定",
            cancelTitle: "取消",
            footerClass: "p-2",
            hideHeaderClose: false,
            centered: true,
          }
        );
        if (!confirm) return;
      }
      try {
        let { data } = await this.$api.user[type](form);
        switch (type) {
          case "login":
            this.$store.commit("user/setCurrent", data);
            this.$emit("input", false);
            break;
          case "register":
            this.showRegister = false;
            break;
          case "retrieve":
            this.showRetrieve = false;
            break;
        }
      } catch (error) {}
    },
    validator(type = "login") {
      let form = this.$data[`form_${type}`];
      let stateKey = `state_${type}`;
      switch (type) {
        case "login":
          this.$set(this.$data[stateKey], "account", checkEmail(form.account));
          this.$set(this.$data[stateKey], "password", true);
          break;
        case "register":
          this.$set(this.$data[stateKey], "email", checkEmail(form.email));
          this.$set(this.$data[stateKey], "mailCode", checkCode(form.mailCode));
          this.$set(this.$data[stateKey], "password", checkPwd(form.password));
          this.$set(this.$data[stateKey], "nickname", checkName(form.nickname));
          break;
        case "retrieve":
          this.$set(this.$data[stateKey], "email", checkEmail(form.email));
          this.$set(this.$data[stateKey], "mailCode", checkCode(form.mailCode));
          this.$set(this.$data[stateKey], "password", checkPwd(form.password));
          break;
      }
      for (let key in this.$data[stateKey]) {
        if (
          typeof this.$data[stateKey][key] === "boolean" &&
          !this.$data[stateKey][key]
        )
          return false;
      }
      return true;
    },
  },
  components: {},
};
</script>

<style lang="scss" scoped>
.loginModal {
  height: 100vh;
  width: 100vw;
  left: 0;
  top: 0;
  position: fixed;
  background-color: rgba($color: #000000, $alpha: 0.2);
}
#login {
  top: calc(50% - 150px);
  left: calc(50% - 250px);
}
#register {
  height: 500px;
  top: calc(50% - 250px);
  left: calc(50% - 250px);
}
#retrieve {
  height: 350px;
  top: calc(50% - 170px);
  left: calc(50% - 250px);
}

.form {
  width: 50%;
  margin: 0 auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding-top: 10px;
}
.input-group {
  margin-bottom: 15px;
}
.input-group-text,
.form-control {
  background-color: rgba($color: #fff, $alpha: 0.5);
  border-radius: 0;
}

.invalid-feedback {
  margin-left: 2.7rem;
}

.formBox {
  z-index: 10;
  height: 300px;
  width: 500px;
  position: fixed;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
  .top {
    position: relative;
  }
  .bottom {
    display: flex;
    margin-top: 10px;
    span {
      color: white;
      font-size: 12px;
      cursor: pointer;
    }
  }
  .close {
    position: absolute;
    top: 15px;
    right: 15px;
    transition: 0.3s;
    font-size: 200%;
    font-weight: bold;
  }
  .close:hover {
    transform: rotate(360deg);
  }
}

@media all and (max-width: 768px) {
  .formBox {
    height: 100% !important;
    width: 100% !important;
    top: 0 !important;
    left: 0 !important;
    transform: none;
    .close {
      position: absolute;
      top: 80px;
      right: 10%;
      transition: 0.3s;
    }
  }

  .form {
    width: 70%;
  }
}
</style>
