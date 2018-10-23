
const _ = require('lodash');
const Aigle = require('aigle');
const FCM = require('fcm-node');

const fcm = new FCM(global.config.FCM_SERVER_KEY);

exports.perform = async (args) => {
  Aigle.mixin(_);

  await Aigle.forEach(args.ids, async (id) => {
    const message = {
      to: '',
      notification: {
        title: '',
        body: '',
        icon: '',
        deeplink_url: '',
      },
      data: {
        custom_notification: {
          type: 'type',
          title: '',
          body: '',
          priority: 'high',
          large_icon: '',
          icon: 'ic_stat_item_44_x_44',
          deeplink_url: '',
          show_in_foreground: true,
        },
      },
    };

    message.notification.title = args.title;
    message.data.title = args.title;

    message.notification.deeplink_url = args.deeplink;
    message.data.deeplink_url = args.deeplink;

    message.to = id;
    fcm.send(message, (err, response) => {
      if (err) {
        console.log('Something has gone wrong!', err);
      } else {
        console.log('Succesfully sent with response:', response);
      }
    });
  });
};
