import { ElMessage, ElMessageBox } from 'element-plus';

export function useMessage() {
  /**
   * 成功提示
   * @param message 提示内容
   * @param duration 显示时间，默认 2000ms
   */
  const successMessage = (message: string, duration = 2000) => {
    ElMessage({
      message,
      type: 'success',
      duration,
    });
  };

  /**
   * 错误提示
   * @param message 提示内容
   * @param duration 显示时间，默认 2000ms
   */
  const errorMessage = (message: string, duration = 2000) => {
    ElMessage({
      message,
      type: 'error',
      duration,
    });
  };

  /**
   * 警告提示
   * @param message 提示内容
   * @param duration 显示时间，默认 2000ms
   */
  const warningMessage = (message: string, duration = 2000) => {
    ElMessage({
      message,
      type: 'warning',
      duration,
    });
  };

  /**
   * 确认提示框
   * @param message 提示内容
   * @param title 标题，默认为"提示"
   * @param onConfirm 确认回调函数
   * @returns Promise
   */
  const confirmMessage = async (
    message: string,
    title = '提示',
    onConfirm?: () => Promise<void> | void,
  ): Promise<void> => {
    try {
      await ElMessageBox.confirm(message, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      });
      // 用户点击确认后执行回调
      if (onConfirm) {
        await onConfirm();
      }
    } catch {
      // 用户点击取消或关闭弹窗，不做处理
    }
  };

  return {
    successMessage,
    errorMessage,
    warningMessage,
    confirmMessage,
  };
}
