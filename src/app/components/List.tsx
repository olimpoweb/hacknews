import { getAllNews } from '@/utils/apis';
import { NEWS_PER_PAGE } from '@/utils/consts';
import { useEffect, useState } from 'react';

import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { TiArrowSortedDown, TiArrowSortedUp } from 'react-icons/ti';
import { useInView } from 'react-intersection-observer';
import { News } from '../types/News';

const List = () => {
  const [offset, setOffset] = useState(NEWS_PER_PAGE);
  const [listNews, setListNews] = useState<News[]>([]);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [scrollTrigger, isInView] = useInView();

  useEffect(() => {
    if (isInView && hasMoreData) {
      loadMore();
    }
  }, [isInView, hasMoreData]);

  /**
   * Load more news when the user scrolls to the bottom of the page
   */
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
    { item: { id, by, title, kids, time, url, descendants, score }, ind } : 
    { item: { id: number; by: string; title: string; kids?: number[]; time: number; url: string, descendants: number, score: number }, ind: number}) => {
    
    const domain = url ? new URL(url) : null;
    TimeAgo.setDefaultLocale(en.locale)
    TimeAgo.addLocale(en)
    const timeAgo = new TimeAgo('en-US')

    return (
      <div className="flex flex-row w-[90%] mx-auto my-0 bg-[var(--box)] p-1 text-sm ">
        <div className="flex flex-col">{ind}.</div>
        <div className="flex flex-col">
        {descendants === 0 ? 
          <TiArrowSortedUp/>
        : 
          <TiArrowSortedDown />
        }
        </div>
        <div className="text-sm flex flex-col">
          <div className="text-sm">
            <UrlTo url={url} title={title} /> {domain ? <span className=" text-xs text-gray-700">({domain.hostname})</span> : null}
          </div>
          <div className="text-xs flex flex-row space-x-1 text-gray-700">
            <span>{score} {score === 1 ? "point": "points"} by <UrlTo url={`https://news.ycombinator.com/user?id=${by}`} title={by} />
            </span>
            <span>|</span>
            <span>
              {timeAgo.format(time*1000)}
            </span>
            <span>|</span>
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
      <div className="w-[90%] mx-auto my-0 bg-[var(--headerbg)] p-1">
        <div className="text-black font-bold text-sm">HackNews list of Top News</div>
      </div>
      {listNews.map(
        (item, index) => item && <Item key={index+1} ind={index+1} item={item} />
      )}
      <div className="w-[90%] text-center mx-auto my-2 p-1">
        {(hasMoreData && <div className="text-center text-lg mb-3 text-black" ref={scrollTrigger}>Loading...</div>) || (
          <p className="text-lg mb-3 text-center text-black">No more news to load</p>
        )}
      </div>
    </>
    
  );
};

export default List;