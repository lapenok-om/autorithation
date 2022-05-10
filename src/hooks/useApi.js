import React from 'react'
import Api from '../utils/Api'

export const useApi = () => {

    const config = {
        url: "https://api.react-learning.ru",
        token: localStorage.getItem('token')

    };
  return new Api(config)
}
