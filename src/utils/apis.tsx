import { URL_API } from './consts';

import axios from 'axios';

/**
 * getById
 * @description Get news by id from Hacker News API
 * @param id 
 * @returns 
 */
export const getById = async (id: Number) => {
  
  try {

    const response = await axios.get(`${URL_API}/item/${id}.json`);

    return response.data;
  
  } catch (error) {

    console.log("Get by Id => ", error);
    
    throw new Error("Problem while getting news by id.<br />Please try again later");
    
  }
};

/**
 * getAllNews
 * @description Get all news from Hacker News API
 * @returns {Promise<News[]>}
 */
export const getAllNews = async () => {
  
  try {

    const { data: ids } = await axios.get(
      `${URL_API}/newstories.json?print=pretty`
    );

    const response = await Promise.all(ids.slice(0, 30).map(getById));
    
    return response;
  
  } catch (error) {
  
    console.log("Get All News => ", error);

    throw new Error('Problem while getting all news.<br />Please try again later');


  }
};