import useData from '../../hooks/data';
import Loader from './Loader';

const List = () => {
  const { isLoading, allNews } = useData();

  const UrlTo = ({ url, title }: { url: string; title: string }) => (
    <a href={url} target="_blank" rel="noreferrer">
      {title}
    </a>
  );

  const Item = (
    { item: { id, by, title, kids, time, url } } : 
    { item: { id: number; by: string; title: string; kids?: number[]; time: number; url: string } }) => {
    return (
      <div className="item">
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
    );

  };
  
  return (
    <>
      <Loader show={isLoading}>Loading...</Loader>
      <>
        {allNews.map(
          (item) => item && <Item key={item.id} item={item} />
        )}
      </>
    </>
  );
};

export default List;