import { getAllNews } from '@/utils/apis';
import { useEffect, useState } from 'react';

const useData = () => {
  
  interface News {
    id: number;
    title: string;
    url: string;
    score: number;
    by: string;
    time: number;
    descendants: number;
    kids: number[];
  }

  const [isLoading, setIsLoading] = useState(false);
  const [allNews, setAllNews] = useState<News[]>([]);

  useEffect(() => {
    
    setIsLoading(true);
    
    getAllNews()
      .then((allNews: News[] | null) => {
        if (allNews) {
          setAllNews(allNews);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  return { isLoading, allNews };
};

export default useData;