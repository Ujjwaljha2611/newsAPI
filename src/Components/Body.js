import React, { useEffect, useState } from 'react';
import Spinner from './Spinner';


const Body = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                'https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=b7529568545b4fa0afe0474ea730d8eb'
            );
            const result = await response.json();

            // Filter out articles with missing image or article data
            const filteredNews = result.articles.filter(article =>
                article.urlToImage && article.author && article.description
            );

            // Parse and format the date for each article
            const newsWithFormattedDate = filteredNews.map(article => ({
                ...article,
                formattedPublishedDate: formatDate(article.publishedAt)
            }));

            setNews(newsWithFormattedDate);
        } catch (error) {
            console.error("Error fetching Data: ", error);
        }
        setLoading(false);
    };

    // Function to format the date (extracting only the date portion)
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { timeZone: 'UTC' });
    };

    //checking If data has bas fetched then show the data otherwise show loading icon 
    return loading ? (<Spinner />) :
        (
            <div className="flex flex-row w-screen flex-wrap gap-6 justify-evenly bg-gray-800 pt-2 ">
                {news.map((meriHeadlines, index) => {
                    return (
                        <div className='flex flex-col w-1/4 bg-sky-50 rounded-md ' key={index}>
                            <img
                                className='w-full'
                                src={meriHeadlines.urlToImage}
                                alt={meriHeadlines.author}
                                onError={(e) => {
                                    console.error('Error loading image:', e.target.src);
                                }}
                            />
                            <h4>{meriHeadlines.author}</h4>
                            <p className='my-3'>{meriHeadlines.description}</p>
                            <p >Published Date: {meriHeadlines.formattedPublishedDate}</p>
                        </div>
                    );
                })}
                 
            </div>
        );
};

export default Body;
