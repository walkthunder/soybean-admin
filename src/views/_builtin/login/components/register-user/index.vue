<template>
  <n-form ref="formRef" :model="model" :rules="rules" size="large" :show-label="false">
    <n-form-item path="text">
      <n-input v-model:value="model.email" placeholder="邮箱" />
    </n-form-item>
    <n-form-item path="code">
      <div class="flex-y-center w-full">
        <n-input v-model:value="model.code" placeholder="验证码" />
        <div class="w-18px"></div>
        <n-button size="large" :disabled="isCounting" :loading="smsLoading" @click="handleSmsCode">
          {{ label }}
        </n-button>
      </div>
    </n-form-item>
    <n-form-item path="pwd">
      <n-input v-model:value="model.pwd" type="password" show-password-on="click" placeholder="密码" />
    </n-form-item>
    <n-form-item path="confirmPwd">
      <n-input v-model:value="model.confirmPwd" type="password" show-password-on="click" placeholder="确认密码" />
    </n-form-item>
    <n-space :vertical="true" :size="18">
      <login-agreement v-model:value="agreement" />
      <n-button type="primary" size="large" :block="true" :round="true" @click="handleSubmit">确定</n-button>
      <n-button size="large" :block="true" :round="true" @click="toLoginModule('pwd-login')">返回</n-button>
    </n-space>
  </n-form>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs } from 'vue';
import type { FormInst, FormRules } from 'naive-ui';
import { useAuthStore } from '@/store';
import { useRouterPush } from '@/composables';
import { useEmailCode } from '@/hooks';
import { formRules, getConfirmPwdRule } from '@/utils';

const { toLoginModule } = useRouterPush();
const { label, isCounting, loading: smsLoading, start, getEmailCode } = useEmailCode();
const { signup } = useAuthStore();
const formRef = ref<HTMLElement & FormInst>();

const model = reactive({
  email: '',
  code: '',
  pwd: '',
  confirmPwd: ''
});

const rules: FormRules = {
  email: formRules.email,
  code: formRules.code,
  pwd: formRules.pwd,
  confirmPwd: getConfirmPwdRule(toRefs(model).pwd)
};

const agreement = ref(false);

async function handleSmsCode() {
  start();
  const code = await getEmailCode(model.email);
  console.log('got code: ', code);
  toRefs(model).code.value = code || '';
}

async function handleSubmit() {
  await formRef.value?.validate();
  const resp = await signup(model.code, model.email, model.pwd);
  if (resp) {
    console.log('sign up resp: ', resp);
    window.$message?.success('验证成功!');
    setTimeout(() => {
      toLoginModule('pwd-login');
    }, 500);
  }
}
</script>

<style scoped></style>
