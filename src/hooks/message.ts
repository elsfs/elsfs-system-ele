import { ElMessage, ElMessageBox } from 'element-plus';

interface MessageImplements {
  info(title: string): void;
  wraning(title: string): void;
  success(title: string): void;
  error(title: string): void;
}

export function useMessage() {
  class MessageClass implements MessageImplements {
    // 错误提示
    error(title: string): void {
      ElMessage.error(title);
    }

    // 普通提示
    info(title: string): void {
      ElMessage.info(title);
    }

    // 成功提示
    success(title: string): void {
      ElMessage.success(title);
    }

    // 警告提示
    wraning(title: string): void {
      ElMessage.warning(title);
    }
  }

  return new MessageClass();
}

export function useMessageBox() {
  class MessageBoxClass implements MessageImplements {
    // 确认窗体
    confirm(msg: string) {
      return ElMessageBox.confirm(msg, '系统提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      });
    }

    // 错误提示
    error(msg: string): void {
      ElMessageBox.alert(msg, t('message.box.title'), { type: 'error' });
    }

    // 普通提示
    info(msg: string): void {
      ElMessageBox.alert(msg, t('message.box.title'));
    }

    // 提交内容
    prompt(msg: string) {
      return ElMessageBox.prompt(msg, t('message.box.title'), {
        confirmButtonText: t('common.confirmButtonText'),
        cancelButtonText: t('common.cancelButtonText'),
        type: 'warning',
      });
    }

    // 成功提示
    success(msg: string): void {
      ElMessageBox.alert(msg, t('message.box.title'), { type: 'success' });
    }
    // 警告提示
    wraning(msg: string): void {
      ElMessageBox.alert(msg, t('message.box.title'), { type: 'warning' });
    }
  }

  return new MessageBoxClass();
}
