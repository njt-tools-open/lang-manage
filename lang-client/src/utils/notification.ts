// import icon from '../assets/favicon.ico';

function createNotification(title: string, options: NotificationOptions) {
  const instance = new Notification(title, {
    tag: String(Date.now()),
    // icon,
    ...options,
  });

  instance.onclick = () => {
    // 关闭通知
    instance.close();
  };
  instance.onerror = () => {
    console.log('onerror');
  };
  instance.onshow = () => {
    // console.log('onshow');
  };
  instance.onclose = () => {
    // console.log('onclose');
  };
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function notification(title: string, options: NotificationOptions = {}) {
  // 先检查浏览器是否支持
  if (!('Notification' in window)) {
    // eslint-disable-next-line no-alert
    window.alert('This browser does not support desktop notification');
  } else if (Notification.permission === 'granted') {
    // 检查用户是否同意接受通知
    // If it's okay let's create a notification
    createNotification(title, options);
  } else if (Notification.permission !== 'denied') {
    // 否则我们需要向用户获取权限
    Notification.requestPermission().then(permission => {
      // 如果用户接受权限，我们就可以发起一条消息
      if (permission === 'granted') {
        createNotification(title, options);
      }
    });
  }

  // 最后，如果执行到这里，说明用户已经拒绝对相关通知进行授权
  // 出于尊重，我们不应该再打扰他们了
}

export default notification;
