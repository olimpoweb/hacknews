import { getAllNews } from '@/utils/apis';
import { NEWS_PER_PAGE } from '@/utils/consts';
import { useEffect, useState } from 'react';

import { TiArrowSortedDown, TiArrowSortedUp } from 'react-icons/ti';
import { useInView } from 'react-intersection-observer';
import { News } from '../types/News';

const ListInfiniteRIO = () => {
  const [offset, setOffset] = useState(NEWS_PER_PAGE);
  const [listNews, setListNews] = useState<News[]>([]);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [scrollTrigger, isInView] = useInView();

  useEffect(() => {
    if (isInView && hasMoreData) {
      loadMore();
    }
  }, [isInView, hasMoreData]);

  const loadMore = async () => {
    if (hasMoreData) {
      const apiNews = await getAllNews(offset);

      if (!apiNews.length) {
        setHasMoreData(false);
      }

      setListNews((prevNews) => [...prevNews, ...apiNews]);
      setOffset((prevOffset) => prevOffset + NEWS_PER_PAGE);
    }
  };

  const UrlTo = ({ url, title }: { url: string; title: string }) => (
    <a href={url} target="_blank" rel="noreferrer">
      {title}
    </a>
  );

  const Item = (
    { item: { id, by, title, kids, time, url, descendants }, ind } : 
    { item: { id: number; by: string; title: string; kids?: number[]; time: number; url: string, descendants: number }, ind: number}) => {
    return (
      <div className="item flex flex-row">
        <div className="item-position flex flex-col">{ind}.</div>
        <div className="item-direction flex flex-col">
        {descendants === 0 ? 
          <TiArrowSortedUp/>
        : 
          <TiArrowSortedDown />
        }
        </div>
        <div className="item-content flex flex-col">
          <div className="item-title">
            <UrlTo url={url} title={title} />
          </div>
          <div className="item-info">
            <span>by{' '}
              <UrlTo url={`https://news.ycombinator.com/user?id=${by}`} title={by} />
            </span>
            |
            <span>
              {new Date(time * 1000).toLocaleDateString('en-US', {
                hour: 'numeric',
                minute: 'numeric'
              })}
            </span>
            |
            <span>
              <UrlTo
                url={`https://news.ycombinator.com/item?id=${id}`}
                title={`${kids && kids.length > 0 ? kids.length : 0} comments`}
              />
            </span>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <>
      <div className="list-header">
        <div className='title'>HackNews list of Top News</div>
      </div>
      {listNews.map(
        (item, index) => item && <Item key={item.id} ind={index+1} item={item} />
      )}
      <div className="list-footer">
        {(hasMoreData && <div className="message" ref={scrollTrigger}>Loading...</div>) || (
          <p className="message">No more news to load</p>
        )}
      </div>
    </>
    
  );
};

export default ListInfiniteRIO;