import { computed } from 'vue';
import { REGEXP_EMAIL } from '@/config';
import { fetchEmailCode } from '@/service';
import { useLoading } from '../common';
import useCountDown from './use-count-down';

export default function useEmailCode() {
  const { loading, startLoading, endLoading } = useLoading();
  const { counts, start, isCounting } = useCountDown(60);

  const initLabel = '获取验证码';
  const countingLabel = (second: number) => `${second}秒后重新获取`;
  const label = computed(() => {
    let text = initLabel;
    if (loading.value) {
      text = '';
    }
    if (isCounting.value) {
      text = countingLabel(counts.value);
    }
    return text;
  });

  /** 判断手机号码格式是否正确 */
  function isEmailValid(email: string) {
    let valid = true;
    if (email.trim() === '') {
      window.$message?.error('邮箱不能为空！');
      valid = false;
    } else if (!REGEXP_EMAIL.test(email)) {
      window.$message?.error('邮箱格式错误！');
      valid = false;
    }
    return valid;
  }

  /**
   * 获取短信验证码
   * @param email - 手机号
   */
  async function getEmailCode(email: string): Promise<string | null> {
    const valid = isEmailValid(email);
    if (!valid || loading.value) return null;

    startLoading();
    const { data } = (await fetchEmailCode(email)) || {};
    if (data) {
      window.$message?.success('验证码发送成功！');
      start();
    }
    endLoading();
    return (data as any)?.verifyCode;
  }

  return {
    label,
    start,
    isCounting,
    getEmailCode,
    loading
  };
}
