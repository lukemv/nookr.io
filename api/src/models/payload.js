'use strict';

module.exports = (messageType, json) => {
  return {
    messageType: messageType,
    payload: json,
    timestamp: new Date()
  };
};
