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
      <n-divider>产品列表</n-divider>
      <n-grid-item v-if="formModel.products?.length === 0" span="0:24 640:24 1024:24" style="margin-bottom: 12px">
        <n-empty description="You can't find anything">
          <template #extra>
            <n-button size="small">未创建产品列表</n-button>
          </template>
        </n-empty>
      </n-grid-item>
      <template v-for="product in formModel.products" v-else :key="product.id">
        <n-grid :cols="24" :x-gap="18" style="padding: 12px; margin-top: 12px; box-shadow: 0 0 2px 0px #00000061">
          <n-form-item-grid-item :span="12" label="产品名称" path="name">
            <n-input v-model:value="product.name" :readonly="!editable" />
          </n-form-item-grid-item>
          <n-form-item-grid-item :span="12" label="产品类型" path="type">
            <!-- <n-input v-model:value="product.productType" :readonly="!editable" /> -->
            <n-select v-model:value="product.productType" :options="ProductTypeOptions" />
          </n-form-item-grid-item>
          <n-form-item-grid-item v-if="product.productType === 'AMOUNT'" :span="12" label="额度包" path="amount">
            <n-input-number v-model:value="product.amount" :readonly="!editable">
              <template #suffix>数量（条）</template>
            </n-input-number>
          </n-form-item-grid-item>
          <n-form-item-grid-item v-if="product.productType === 'PLAN'" :span="12" label="会员等级" path="amount">
            <n-input-number v-model:value="product.plan" :readonly="!editable" />
          </n-form-item-grid-item>
          <n-form-item-grid-item :span="12" label="价格" path="price">
            <n-input-number v-model:value="product.price" :readonly="!editable">
              <template #suffix>（元）</template>
            </n-input-number>
          </n-form-item-grid-item>
          <n-form-item-grid-item :span="12" label="有效期" path="validityPeriod">
            <n-input-number v-model:value="product.validityPeriod" :readonly="!editable">
              <template #suffix>（天）</template>
            </n-input-number>
          </n-form-item-grid-item>
        </n-grid>
      </template>
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

type TProductData = {
  name: string;
  price: number;
  productType: string;
  amount?: number | null;
  plan?: number | null;
  validityPeriod?: number | null;
  extendedDescriptionData?: any;
};

const defaultProducts: TProductData[] = [
  {
    name: 'VIP版',
    price: 6.0,
    productType: 'AMOUNT',
    plan: null,
    amount: 1000,
    validityPeriod: 90,
    extendedDescriptionData: undefined
  },
  {
    name: '免费版',
    price: 0,
    productType: 'AMOUNT',
    plan: null,
    amount: 0,
    validityPeriod: null,
    extendedDescriptionData: undefined
  }
];

const ProductTypeOptions = [
  {
    label: '额度类型',
    value: 'AMOUNT',
    disabled: false
  },
  {
    label: '会员类型',
    value: 'PLAN',
    disabled: true
  }
];

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
  products?: TProductData[];
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
    description: '',
    products: []
  };
}

function handleUpdateFormModel(model: Partial<FormModel>) {
  Object.assign(formModel, model);
}

function handleUpdateFormModelByModalType() {
  const handlers: Record<ModalType, () => void> = {
    add: () => {
      const defaultFormModel = createDefaultFormModel();
      defaultFormModel.products = defaultProducts;
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
  // window.$message?.success('新增成功!');
  // closeModal();
  // props.onDone();
  // Create products auto
  const appId = (appResp as any).id;
  if (!appId) {
    window.$message?.error('创建应用失败');
    return;
  }

  const productsResp = await autoCreateProducts(appId);
  console.log('products resp: ', productsResp);
}

async function autoCreateProducts(appId: string) {
  await formRef.value?.validate();
  // api/admin/apps/create
  const products = defaultProducts;

  try {
    const resp = await store.createProducts({
      appId,
      products
    });
    console.log('create products resp: ', resp);
    window.$message?.success('新增成功!');
    closeModal();
    props.onDone();
  } catch (error) {
    window.$message?.error('创建产品失败，请检查数据类型');
    closeModal();
  }
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
