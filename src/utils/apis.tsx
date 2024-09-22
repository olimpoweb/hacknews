import axios from 'axios';
import { NEWS_PER_PAGE, URL_API } from './consts';

/**
 * getById
 * @description Get news by id from Hacker News API
 * @param id 
 * @returns 
 */
export const getById = async (id: Number) => {
  
  try {

    const response = await axios.get(`${URL_API}/item/${id}.json`);
    const data = response.data;

    if (response.status !== 200) {
      const statusCode = response.status;
      throw new Error(`An error occurred with status code ${statusCode}`);
    }

    return data;
  
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
export const getAllNews = async (
  offset: number
) => {
  try {

    const { data: ids } = await axios.get(
      `${URL_API}/newstories.json?print=pretty`
    );

    const response = await Promise.all(ids.slice(offset, offset + NEWS_PER_PAGE).map(getById));
    
    if (response.length === 0) {
        throw new Error('No news found');
    }

    return response;
  
  } catch (error) {
  
    console.log("Get All News => ", error);

    throw new Error('Problem while getting all news.<br />Please try again later');


  }
};