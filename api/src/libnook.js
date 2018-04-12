const axios = require('axios')

module.exports = {
  googleVolumeSearch: (query) => {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}`;

    return new Promise((resolve, reject) => {
      axios.get(url).then((res) => {
        resolve(res.data);
      });

    });
  },
  googleDetailedVolumeSearch: (query) => {
    const url = `https://www.googleapis.com/books/v1/volumes/${query}`;

    return new Promise((resolve, reject) => {
      axios.get(url).then((res) => {
        resolve(res.data);
      });

    });
  }
}