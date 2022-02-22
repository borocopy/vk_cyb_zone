require('dotenv').config();

const axios = require('axios');
const fs = require('fs/promises');
const express = require('express');

let latestPost = {
  id: null,
  contents: null,
};

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

async function getLastPosts(n = 1) {
  try {
    const res = await axios.get('https://api.vk.com/method/wall.get', {
      params: {
        domain: 'ssca_cybersport',
        count: n.toString(),
        access_token: ACCESS_TOKEN,
        v: '5.131',
      },
    });

    const posts = res.data.response.items.map((post) => {
      return {
        text: post.text,
        date: post.date,
        attachments: post.attachments,
      };
    });

    return posts;
  } catch (e) {
    console.error(e);
  }
}

async function main() {
  try {
    const posts = await getLastPosts(2);
    latestPost = posts.sort((a, b) => a.date > b.date)[0];

    console.log(latestPost);

    const res = await axios.post(
      // Discord bot server api call
      `http://192.168.0.18:5001/api/vk_latest_post`,
      latestPost
    );
    console.log(`Post sent`);
  } catch (e) {
    console.error(e);
  }
}

main();
