<template>
  <n-modal v-model:show="modalVisible" preset="card" :title="title" class="w-700px">
    <n-form ref="formRef" label-placement="left" :label-width="80" :model="formModel" :rules="rules">
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item v-if="!editable" :span="12" label="ID" path="appName">
          <n-input v-model:value="formModel.appName" readonly />
        </n-form-item-grid-item>
        <n-form-item-grid-item v-if="!editable" :span="12" label="Token" path="appToken">
          <n-input :value="formModel.appToken" readonly>
            <template #suffix>
              <n-button size="small" round @click="handleCopy">copy</n-button>
            </template>
          </n-input>
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="24" label="应用名称" path="displayName">
          <n-input
            v-model:value="formModel.displayName"
            :readonly="!editable"
            placeholder="十个字以内（特殊字符无效）"
          />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="24" label="应用介绍" path="description">
          <n-input v-model:value="formModel.description" :readonly="!editable" placeholder="一句话介绍" />
        </n-form-item-grid-item>
      </n-grid>
      <n-space class="w-full pt-16px" :size="24" justify="end">
        <n-button class="w-72px" @click="closeModal">取消</n-button>
        <n-button class="w-72px" type="primary" @click="handleSubmit">确定</n-button>
      </n-space>
    </n-form>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue';
import type { FormInst, FormItemRule } from 'naive-ui';
import { useClipboard } from '@vueuse/core';
import { useDashStore } from '@/store';
import { createRequiredFormRule } from '@/utils';

export interface Props {
  /** 弹窗可见性 */
  visible: boolean;
  /**
   * 弹窗类型
   * add: 新增
   * edit: 编辑
   */
  type?: 'add' | 'edit';
  /** 编辑的表格行数据 */
  editData?: any;
  onDone: any;
}

export type ModalType = NonNullable<Props['type']>;

defineOptions({ name: 'TableActionModal' });
const store = useDashStore();
const { copy, isSupported } = useClipboard();

const props = withDefaults(defineProps<Props>(), {
  type: 'add',
  editData: null
});

interface Emits {
  (e: 'update:visible', visible: boolean): void;
}

const emit = defineEmits<Emits>();

const modalVisible = computed({
  get() {
    return props.visible;
  },
  set(visible) {
    emit('update:visible', visible);
  }
});
const closeModal = () => {
  modalVisible.value = false;
};

const title = computed(() => {
  const titles: Record<ModalType, string> = {
    add: '新建应用',
    edit: '编辑应用'
  };
  return titles[props.type];
});

const editable = computed(() => {
  return props.type === 'add';
});

const formRef = ref<HTMLElement & FormInst>();

type FormModel = {
  appName: string;
  appToken: string;
  displayName: string;
  description: string;
};

const formModel = reactive<FormModel>(createDefaultFormModel());

const rules: Record<'displayName' | 'description', FormItemRule | FormItemRule[]> = {
  displayName: createRequiredFormRule('请输入应用名称'),
  description: createRequiredFormRule('请输入应用简介')
};

function handleCopy() {
  if (!isSupported) {
    window.$message?.error('您的浏览器不支持Clipboard API');
    return;
  }
  if (!formModel.appToken) {
    window.$message?.error('Token为空');
    return;
  }
  copy(formModel.appToken);
  window.$message?.success(`复制成功：${formModel.appToken}`);
}

function createDefaultFormModel(): FormModel {
  return {
    appName: '',
    appToken: '',
    displayName: '',
    description: ''
  };
}

function handleUpdateFormModel(model: Partial<FormModel>) {
  Object.assign(formModel, model);
}

function handleUpdateFormModelByModalType() {
  const handlers: Record<ModalType, () => void> = {
    add: () => {
      const defaultFormModel = createDefaultFormModel();
      handleUpdateFormModel(defaultFormModel);
    },
    edit: () => {
      if (props.editData) {
        handleUpdateFormModel(props.editData);
      }
    }
  };

  handlers[props.type]();
}

async function handleSubmit() {
  await formRef.value?.validate();
  // api/admin/apps/create
  const appResp = await store.createApp({
    displayName: formModel.displayName,
    description: formModel.description
  });
  console.log('create resp: ', appResp);
  window.$message?.success('新增成功!');
  closeModal();
  props.onDone();
}

watch(
  () => props.visible,
  newValue => {
    if (newValue) {
      handleUpdateFormModelByModalType();
    }
  }
);
</script>

<style scoped></style>
